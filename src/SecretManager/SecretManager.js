import { SecretSDK } from "@eigen-secret/core/dist-browser/sdk";
import { ethers } from 'ethers';
import { buildEddsa } from "circomlibjs";
import { rawMessage, signEOASignature, __DEFAULT_ALIAS__ } from '@eigen-secret/core/dist-browser/utils';
import { Context } from '@eigen-secret/core/dist-browser/context';
import { SigningKey, SecretAccount } from '@eigen-secret/core/dist-browser/account';
import { defaultServerEndpoint, defaultCircuitPath, defaultContractABI, defaultContractFile as contractJson } from './configure';
import { buildError } from '@/utils/common';
import { ErrCode } from "../../../eigen-secret-b/core/dist-node/error";

class SecretManager {
  constructor() {
    this.sdk = null;
  }

  async createAccount({ alias, password = '<your password>', user }) {
     try{
       console.log('createAccount start...')
       let timestamp = Math.floor(Date.now() / 1000).toString();
       const address = await user.getAddress();
       console.log("ETH address", address);

       const signature = await signEOASignature(user, rawMessage, address, timestamp);
       const ctx = new Context(alias, address, rawMessage, timestamp, signature);
       this.sdk = await SecretSDK.initSDKFromAccount(
           ctx, defaultServerEndpoint, password, user, contractJson, defaultCircuitPath, defaultContractABI, true
       ).then(res => res.data);
       console.log('create-accout', ctx, defaultServerEndpoint, password, user, contractJson, defaultCircuitPath, password, user, contractJson,defaultCircuitPath,defaultContractABI)

       let proofAndPublicSignals = await this.sdk.createAccount(ctx, password);
       console.log("create account", proofAndPublicSignals);
       if (proofAndPublicSignals.errno !== 0) {
         console.error(proofAndPublicSignals)
         return {
           errno:  -1,
           message:"createAccount failed: " + proofAndPublicSignals
         }
       }
       console.log("create account", proofAndPublicSignals);
       console.log('createAccount done.')
       return {
         errno: 0,
         data: proofAndPublicSignals
       }
     } catch (e) {
       return buildError(e)
     }
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
    console.log('deposit start...')
    if (!this.sdk) await this.initSDK(alias, password, user);
    const provider = user.provider;
    const address = await user.getAddress();
    const nonce = await provider.getTransactionCount(address);
    let receiver = this.sdk.account.accountKey.pubKey.pubKey;

    let tokenAddress = await this.sdk.getRegisteredToken(BigInt(assetId))
    console.log("token", tokenAddress.toString());
    let approveTx = await this.sdk.approve(tokenAddress.toString(), value);
    await approveTx.wait();

    const timestamp = Math.floor(Date.now()/1000).toString();
    const signature = await signEOASignature(user, rawMessage, address, timestamp);

    const ctx = new Context(
      alias,
      address,
      rawMessage,
      timestamp,
      signature
    );

    console.log(ctx)
    let proofAndPublicSignals = await this.sdk.deposit(ctx, receiver, BigInt(value), Number(assetId), nonce);
    if (proofAndPublicSignals.errno !== 0) {
      return console.log("deposit failed: ", proofAndPublicSignals);
    }
    console.log('deposit done...', proofAndPublicSignals)
    return await this.sdk.submitProofs(ctx, proofAndPublicSignals.data);
  }

  async send({ alias, assetId, password = '<your password>', value, user, receiver, receiverAlias = __DEFAULT_ALIAS__ }) {
    console.log('send start...')
    if (!this.sdk) await this.initSDK(alias, password, user);
    const address = await user.getAddress();
    const timestamp = Math.floor(Date.now()/1000).toString();
    const signature = await signEOASignature(user, rawMessage, address, timestamp);

    const ctx = new Context(
      alias,
      address,
      rawMessage,
      timestamp,
      signature
    );
    let proofAndPublicSignals = await this.sdk.send(ctx, receiver, receiverAlias, BigInt(value), Number(assetId));
    if (proofAndPublicSignals.errno !== 0) {
      return console.log("send failed: ", proofAndPublicSignals);
    }
    console.log('send down.', proofAndPublicSignals)
    return await this.sdk.submitProofs(this.sdk.ctx, proofAndPublicSignals);
  }

  async withdraw({ alias, assetId, password = '<your password>', value, user }) {
    console.log('withdraw start...')
    if (!this.sdk) await this.initSDK(alias, password, user);
    const address = await user.getAddress();
    const timestamp = Math.floor(Date.now()/1000).toString();
    const signature = await signEOASignature(user, rawMessage, address, timestamp);

    const ctx = new Context(
      alias,
      address,
      rawMessage,
      timestamp,
      signature
    );
    let receiver = this.sdk.account.accountKey.pubKey.pubKey;
    let proofAndPublicSignals = await this.sdk.withdraw(ctx, receiver, BigInt(value), Number(assetId));
    if (proofAndPublicSignals.errno !== 0) {
      return console.log("withdraw failed: ", proofAndPublicSignals);
    }
    console.log('withdraw down.', proofAndPublicSignals)
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

    let balance = await this.sdk.getAllBalance(ctx);
    let _balance = Object.fromEntries(
      [...balance.data].map(([k, v]) => [k, v.toString()+"n"])
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

  async getTransactions({ alias, password = '<your password>', user, page, pageSize }) {
    if (!this.sdk) await this.initSDK(alias, password, user);
    const address = await user.getAddress();
    const timestamp = Math.floor(Date.now()/1000).toString();
    const signature = await signEOASignature(user, rawMessage, address, timestamp);

    const ctx = new Context(
      alias,
      address,
      rawMessage,
      timestamp,
      signature
    );
    const transactions = await this.sdk.getTransactions(ctx, { page, pageSize });
    console.log("transactions", transactions);
    return transactions;
  }
}

export default new SecretManager();
