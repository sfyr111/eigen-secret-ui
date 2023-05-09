import { SecretSDK } from "@eigen-secret/core/dist-browser/sdk";
import { ethers } from 'ethers';
import { buildEddsa } from "circomlibjs";
import { rawMessage, signEOASignature } from '@eigen-secret/core/dist-browser/utils';
import { Context } from '@eigen-secret/core/dist-browser/context';
import { SigningKey, SecretAccount } from '@eigen-secret/core/dist-browser/account';
import { defaultServerEndpoint, defaultCircuitPath, defaultContractABI, defaultContractFile as contractJson } from './configure';

class SecretManager {
  constructor() {
    this.sdk = null;
  }

  async createAccount({ alias, password = '<your password>', user }) {
    console.log('createAccount start...')
    let timestamp = Math.floor(Date.now() / 1000).toString();
    const address = await user.getAddress();
    console.log("ETH address", address);

    const signature = await signEOASignature(user, rawMessage, address, timestamp);
    const ctx = new Context(alias, address, rawMessage, timestamp, signature);
    this.sdk = await SecretSDK.initSDKFromAccount(
      ctx, defaultServerEndpoint, password, user, contractJson, defaultCircuitPath, defaultContractABI, true
    );
    console.log('create-accout', ctx, defaultServerEndpoint, password, user, contractJson, defaultCircuitPath, password, user, contractJson,defaultCircuitPath,defaultContractABI)

    let proofAndPublicSignals = await this.sdk.data.createAccount(ctx, password);
    console.log("create account", proofAndPublicSignals);
    if (proofAndPublicSignals.errno !== 0) {
      console.error(proofAndPublicSignals)
      throw new Error("createAccount failed: " + proofAndPublicSignals)
    }
    console.log("create account", proofAndPublicSignals);
    console.log('createAccount done.')

  }

  async initSDK({ alias, password = '<your password>', user }) {
    console.log('initSDK start...')
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const address = await user.getAddress();
    const signature = await signEOASignature(user, rawMessage, address, timestamp);
    const ctx = new Context(
      alias,
      address,
      rawMessage,
      timestamp,
      signature
    );
    let sdkResponse = await SecretSDK.initSDKFromAccount(
      ctx, defaultServerEndpoint, password, user, contractJson, defaultCircuitPath, defaultContractABI
    );

    if (sdkResponse.errno == 0) {
      this.sdk = sdkResponse.data
    } else {
      console.log(sdkResponse.message)
    }
    console.log('initSDK done.')
    return sdkResponse
  }

  async deposit({ alias, assetId, password = '<your password>', value, user }) {
    if (!this.sdk) await this.initSDK(alias, password, user);
    const provider = user.provider;
    const address = await user.getAddress();
    const nonce = await provider.getTransactionCount(address);
    let receiver = this.sdk.data.account.accountKey.pubKey.pubKey;

    let tokenAddress = await this.sdk.data.getRegisteredToken(BigInt(assetId))
    console.log("token", tokenAddress.toString());
    let approveTx = await this.sdk.data.approve(tokenAddress.toString(), value);
    await approveTx.wait();

    let timestamp = Math.floor(Date.now()/1000).toString();
    const signature = await signEOASignature(user, rawMessage, address, timestamp);

    const ctx = new Context(
      alias,
      address,
      rawMessage,
      timestamp,
      signature
    );

    let proofAndPublicSignals = await this.sdk.data.deposit(ctx, receiver, BigInt(value), Number(assetId), nonce);
    console.log(proofAndPublicSignals);
    return await this.sdk.data.submitProofs(ctx, proofAndPublicSignals.data);
  }

  async send({ alias, assetId, password = '<your password>', value, user, receiver, receiverAlias }) {
    if (!this.sdk) await this.initSDK(alias, password, user);
    let proofAndPublicSignals = await this.sdk.send(this.sdk.ctx, receiver, receiverAlias, BigInt(value), Number(assetId));
    console.log(proofAndPublicSignals);
    return await this.sdk.submitProofs(this.sdk.ctx, proofAndPublicSignals);
  }

  async withdraw({ alias, assetId, password = '<your password>', value, user }) {
    if (!this.sdk) await this.initSDK(alias, password, user);
    let receiver = this.sdk.account.accountKey.pubKey.pubKey;
    let proofAndPublicSignals = await this.sdk.withdraw(this.sdk.ctx, receiver, BigInt(value), Number(assetId));
    console.log(proofAndPublicSignals);
    return await this.sdk.submitProofs(this.sdk.ctx, proofAndPublicSignals);
  }

  async getBalance({ alias, assetId, password = '<your password>', user }) {
    if (!this.sdk) await this.initSDK(alias, password, user);
    const address = await user.getAddress();
    let timestamp = Math.floor(Date.now()/1000).toString();
    const signature = await signEOASignature(user, rawMessage, address, timestamp);


    const ctx = new Context(
      alias,
      address,
      rawMessage,
      timestamp,
      signature
    )

    let balance = await this.sdk.data.getAllBalance(ctx);
    let _balance = Object.fromEntries(
      [...balance.data].map(([k, v]) => [k, v.toString()+"n"])
    );
    console.log("L2 balance", JSON.stringify(_balance));

    let tokenAddress = await this.sdk.data.getRegisteredToken(BigInt(assetId));
    let tokenIns = new ethers.Contract(
      tokenAddress,
      defaultContractABI.testTokenContractABI,
      user
    );

    balance = await tokenIns.balanceOf(address);
    console.log("L1 balance", balance.toString());
    return balance;
  }

  async getTransactions({ alias, password = '<your password>', user, page, pageSize }) {
    if (!this.sdk) await this.initSDK(alias, password, user);
    const transactions = await this.sdk.getTransactions(this.sdk.ctx, { page, pageSize });
    console.log("transactions", transactions);
    return transactions;
  }
}

export default new SecretManager();
