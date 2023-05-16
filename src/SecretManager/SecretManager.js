import { SecretSDK } from "@eigen-secret/core/dist-browser/sdk";
import { ethers } from 'ethers';
import { __DEFAULT_ALIAS__, rawMessage, signEOASignature } from '@eigen-secret/core/dist-browser/utils';
import { Context } from '@eigen-secret/core/dist-browser/context';
import {
  defaultCircuitPath,
  defaultContractABI,
  defaultContractFile as contractJson,
  defaultServerEndpoint,
} from './configure';

class SecretManager {
  constructor() {
    this.sdk = null;
    this.signature = null;
    this.signatureTimestamp = null;
  }

  async getSignature(user, address, timestamp, forceUpdate = false, storage = true) {
    const currentTime = Math.floor(Date.now() / 1000);

    if (!forceUpdate && this.signature && (currentTime - this.signatureTimestamp <= 180)) {
      return this.signature;
    }

    const signature = await signEOASignature(user, rawMessage, address, timestamp);
    if (storage) {
      this.signature = signature;
      this.signatureTimestamp = currentTime;
    }
    return signature;
  }

  async getSignature2(user, address, timestamp, forceUpdate = false, storage = true) {
    const currentTime = Math.floor(Date.now() / 1000);

    if (!forceUpdate && this.signature && (currentTime - this.signatureTimestamp <= 180)) {
      return {signature: this.signature, signatureTimestamp: this.signatureTimestamp};
    }

    const signature = await signEOASignature(user, rawMessage, address, timestamp);
    const signatureTimestamp = currentTime;
    if (storage) {
      this.signature = signature;
      this.signatureTimestamp = currentTime;
    }
    return {signature: signature, signatureTimestamp: signatureTimestamp};
  }

  async initSignature({ alias, user }) {
    console.log('createAccount start...')
    let timestamp = Math.floor(Date.now() / 1000).toString();
    const address = await user.getAddress();
    console.log("ETH address", address);
    return await this.getSignature(user, address, timestamp, true, true);
  }

  async createAccount({ alias, password = '<your password>', user }) {
    console.log('createAccount start...')
    let timestamp = Math.floor(Date.now() / 1000).toString();
    const address = await user.getAddress();
    console.log("ETH address", address);

    const signature = await this.getSignature(user, address, timestamp, true);
    const ctx = new Context(alias, address, rawMessage, timestamp, signature);
    const sdkRespond = await SecretSDK.initSDKFromAccount(
      ctx, defaultServerEndpoint, password, user, contractJson, defaultCircuitPath, defaultContractABI, true,
    );
    if (sdkRespond.errno !== 0) {
      console.log('create account initSDK fail: ', sdkRespond)
      return sdkRespond
    }
    this.sdk = sdkRespond.data;
    console.log('create account params:', ctx, defaultServerEndpoint, password, user, contractJson, defaultCircuitPath, password, user, contractJson, defaultCircuitPath, defaultContractABI);

    let respond = await this.sdk.createAccount(ctx, password);
    console.log("create account", respond);
    if (respond.errno !== 0) {
      console.error('create account fail: ', respond)
    }
    console.log("create account", respond);
    console.log('createAccount done.')
    return {
      message: respond.message,
      errno: respond.errno,
      data: this.sdk,
    };
  }

  async initSDK({ alias, password = '<your password>', user }) {
    console.log('initSDK start...')
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const address = await user.getAddress();
    const signature = await this.getSignature(user, address, timestamp, true);
    const ctx = new Context(
      alias,
      address,
      rawMessage,
      timestamp,
      signature,
    );
    let respond = await SecretSDK.initSDKFromAccount(
      ctx, defaultServerEndpoint, password, user, contractJson, defaultCircuitPath, defaultContractABI,
    );

    if (respond.errno === 0) {
      this.sdk = respond.data
    } else {
      console.error('initSDK fail: ', respond)
    }
    console.log('initSDK done.')
    return respond;
  }

  getPubKey() {
    return this.sdk.account.accountKey.pubKey.pubKey
  }

  async deposit({ alias, assetId, password = '<your password>', value, user, receiver }) {
    console.log('deposit start...')
    if (!this.sdk) await this.initSDK(alias, password, user);
    const provider = user.provider;
    const address = await user.getAddress();
    const nonce = await provider.getTransactionCount(address);

    let tokenAddress = await this.sdk.getRegisteredToken(BigInt(assetId))
    console.log("token", tokenAddress.toString());
    let approveTx = await this.sdk.approve(tokenAddress.toString(), value);
    await approveTx.wait();

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = await this.getSignature(user, address, timestamp, true);

    const ctx = new Context(
      alias,
      address,
      rawMessage,
      timestamp,
      signature,
    );

    console.log('deposit params: ', ctx)
    let respond = await this.sdk.deposit(ctx, receiver, BigInt(value), Number(assetId), nonce);
    if (respond.errno !== 0) {
      console.log("deposit failed: ", respond);
    }
    console.log('deposit done...', respond)
    // const proofRespond = await this.sdk.submitProofs(ctx, respond.data);
    // console.log('proofRespond: ', proofRespond)
    return respond;
  }

  async send({
    alias,
    assetId,
    password = '<your password>',
    value,
    user,
    receiver,
    receiverAlias = __DEFAULT_ALIAS__,
  }) {
    console.log('send start...')
    if (!this.sdk) await this.initSDK(alias, password, user);
    const address = await user.getAddress();
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = await this.getSignature(user, address, timestamp, true);

    const ctx = new Context(
      alias,
      address,
      rawMessage,
      timestamp,
      signature,
    );
    let respond = await this.sdk.send(ctx, receiver, receiverAlias, BigInt(value), Number(assetId));
    if (respond.errno !== 0) {
      console.log("send failed: ", respond);
    }
    console.log('send down.', respond)
    // const proofRespond = await this.sdk.submitProofs(this.sdk.ctx, respond.data);
    // console.log('proofRespond: ', proofRespond)
    return respond;
  }

  async withdraw({ alias, assetId, password = '<your password>', value, user,  receiver}) {
    console.log('withdraw start...')
    if (!this.sdk) await this.initSDK(alias, password, user);
    const address = await user.getAddress();
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = await this.getSignature(user, address, timestamp, true);

    const ctx = new Context(
      alias,
      address,
      rawMessage,
      timestamp,
      signature,
    );
    let respond = await this.sdk.withdraw(ctx, receiver, BigInt(value), Number(assetId));
    if (respond.errno !== 0) {
      console.log("withdraw failed: ", respond);
    }
    console.log('withdraw down.', respond)
    // const proofRespond = await this.sdk.submitProofs(this.sdk.ctx, respond.data);
    // console.log('proofRespond: ', proofRespond)
    return respond;
  }

  async getAllBalance({ alias, assetId, password = '<your password>', user }) {
    if (!this.sdk) await this.initSDK(alias, password, user);
    const address = await user.getAddress();
    let timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = await this.getSignature2(user, address, timestamp);

    const ctx = new Context(
        alias,
        address,
        rawMessage,
        signature.signatureTimestamp,
        signature.signature,
    )
    return await this.sdk.getAllBalance(ctx);
  }

  async getAssetInfo({ alias, password = '<your password>', user }) {
    if (!this.sdk) await this.initSDK(alias, password, user);
    const address = await user.getAddress();
    let timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = await this.getSignature2(user, address, timestamp);

    const ctx = new Context(
        alias,
        address,
        rawMessage,
        signature.signatureTimestamp,
        signature.signature,
    )
    const respond = await this.sdk.getAssetInfo(ctx);
    console.log('getAssetInfo: ', respond)
    return respond;
  }

  async getBalance({ alias, assetId, password = '<your password>', user }) {
    if (!this.sdk) await this.initSDK(alias, password, user);
    const address = await user.getAddress();
    let timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = await this.getSignature(user, address, timestamp);


    const ctx = new Context(
      alias,
      address,
      rawMessage,
      timestamp,
      signature,
    )

    let balanceL2 = await this.sdk.getAllBalance(ctx);
    // let _balance = Object.fromEntries(
    //   [...balance.data].map(([k, v]) => [k, v.toString() + "n"]),
    // );
    console.log("L2 balance", balanceL2);

    let tokenAddress = await this.sdk.getRegisteredToken(BigInt(assetId));
    let tokenIns = new ethers.Contract(
      tokenAddress,
      defaultContractABI.testTokenContractABI,
      user,
    );
    console.log('tokenAddress: ', tokenAddress)

    const balanceL1 = await tokenIns.balanceOf(address);
    console.log("L1 balance", balanceL1);

    return {
      balanceL1,
      balanceL2,
    };
  }

  async getTransactions({ alias, password = '<your password>', user, page, pageSize }) {
    if (!this.sdk) await this.initSDK(alias, password, user);
    const address = await user.getAddress();
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = await this.getSignature2(user, address, timestamp);

    const ctx = new Context(
        alias,
        address,
        rawMessage,
        signature.signatureTimestamp,
        signature.signature,
    )
    const transactions = await this.sdk.getTransactions(ctx, { page, pageSize });
    console.log("transactions", transactions);
    return transactions;
  }

  async getWeb3ETH() {
    await window.ethereum.request({method: 'eth_requestAccounts'}); // Request account access
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    // 使用Web3Provider获取钱包余额
    const balance = await provider.getBalance(address)
    return ethers.utils.formatEther(balance);
  }

  getPassword() {
    return '123456'
  }

}

export default new SecretManager();
