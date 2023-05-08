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

  async createAccount({ alias, password, user }) {
    const eddsa = await buildEddsa();
    let timestamp = Math.floor(Date.now() / 1000).toString();
    const address = await user.getAddress();
    console.log("ETH address", address);

    const signature = await signEOASignature(user, rawMessage, address, alias, timestamp);
    let signingKey = new SigningKey(eddsa);
    let accountKey = new SigningKey(eddsa);
    let newSigningKey1 = new SigningKey(eddsa);
    let newSigningKey2 = new SigningKey(eddsa);
    let sa = new SecretAccount(
      alias, accountKey, signingKey, accountKey, newSigningKey1, newSigningKey2
    );
    const ctx = new Context(alias, address, rawMessage, timestamp, signature);
    let appRes = await SecretSDK.initSDKFromAccount(
      ctx, defaultServerEndpoint, password, user, contractJson, defaultCircuitPath, defaultContractABI, sa
    );
    if (appRes.errno == 0) {
      this.sdk = appRes.data
    } else {
      throw new Error(appRes)
    }
    console.log('this.sdk ', this.sdk)
    let proofAndPublicSignals = await this.sdk.createAccount(ctx, password);
    console.log("create account", proofAndPublicSignals);
    return proofAndPublicSignals
  }

  async initSDK({ alias, password, user }) {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const address = await user.getAddress();
    const signature = await signEOASignature(user, rawMessage, address, alias, timestamp);
    const ctx = new Context(
      alias,
      address,
      rawMessage,
      timestamp,
      signature
    );
    this.sdk = await SecretSDK.initSDKFromAccount(
      ctx, defaultServerEndpoint, password, user, contractJson, defaultCircuitPath, defaultContractABI
    );
  }

  async deposit({ alias, assetId, password, value, user }) {
    if (!this.sdk) await this.initSDK(alias, password, user);
    let nonce = 0; // TODO: get nonce from Metamask
    let receiver = this.sdk.account.accountKey.pubKey.pubKey;

    let tokenAddress = await this.sdk.getRegisteredToken(BigInt(assetId))
    console.log("token", tokenAddress.toString());
    let approveTx = await this.sdk.approve(tokenAddress.toString(), value);
    await approveTx.wait();

    let proofAndPublicSignals = await this.sdk.deposit(this.sdk.ctx, receiver, BigInt(value), Number(assetId), nonce);
    console.log(proofAndPublicSignals);
    return await this.sdk.submitProofs(this.sdk.ctx, proofAndPublicSignals);
  }

  async send({ alias, assetId, password, value, user, receiver, receiverAlias }) {
    if (!this.sdk) await this.initSDK(alias, password, user);
    let proofAndPublicSignals = await this.sdk.send(this.sdk.ctx, receiver, receiverAlias, BigInt(value), Number(assetId));
    console.log(proofAndPublicSignals);
    return await this.sdk.submitProofs(this.sdk.ctx, proofAndPublicSignals);
  }

  async withdraw({ alias, assetId, password, value, user }) {
    if (!this.sdk) await this.initSDK(alias, password, user);
    let receiver = this.sdk.account.accountKey.pubKey.pubKey;
    let proofAndPublicSignals = await this.sdk.withdraw(this.sdk.ctx, receiver, BigInt(value), Number(assetId));
    console.log(proofAndPublicSignals);
    return await this.sdk.submitProofs(this.sdk.ctx, proofAndPublicSignals);
  }

  async getBalance({ alias, assetId, password, user }) {
    if (!this.sdk) await this.initSDK(alias, password, user);
    const address = await user.getAddress();
    let balance = await this.sdk.getAllBalance(this.sdk.ctx);
    let _balance = Object.fromEntries(
      [...balance].map(([k, v]) => [k, v.toString()+"n"])
    );
    console.log("L2 balance", JSON.stringify(_balance));

    let tokenAddress = await this.sdk.getRegisteredToken(BigInt(assetId));
    let tokenIns = new ethers.Contract(
      tokenAddress,
      defaultContractABI.testTokenContractABI,
      user
    );

    balance = await tokenIns.balanceOf(address);
    console.log("L1 balance", balance.toString());
    return balance;
  }

  async getTransactions({ alias, password, user, page, pageSize }) {
    if (!this.sdk) await this.initSDK(alias, password, user);
    const transactions = await this.sdk.getTransactions(this.sdk.ctx, { page, pageSize });
    console.log("transactions", transactions);
    return transactions;
  }
}

export default SecretManager;
