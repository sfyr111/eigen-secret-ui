import axios from 'axios';
import { buildEddsa } from 'circomlibjs';
import createBlakeHash from 'blake-hash';
import { Buffer } from 'buffer';
import { ethers } from 'ethers';
import SecretSDK from '@eigen-secret/core/dist-browser/sdk';
import { rawMessage, signEOASignature } from '@eigen-secret/core/dist-browser/utils';
import { SigningKey, SecretAccount } from "@eigen-secret/core/dist-browser/account";
import { defaultServerEndpoint, defaultCircuitPath, defaultContractABI, defaultContractFile as contractJson } from './configure';

class SecretManager {
  constructor() {
    this.sdkInstance = null;
    this.alias = null;
    this.signer = null;
    this.address = null;
  }

  createTimestamp() {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    return timestamp;
  }

  async getSecretAccount(alias) {
    const timestamp = this.createTimestamp();
    const signature = await signEOASignature(this.signer, rawMessage, this.address, alias, timestamp);

    const response = await axios.post('/account/get', {
      alias,
      signer: this.signer,
      ethAddress: this.address,
      message: rawMessage,
      timestamp,
      hexSignature: signature
    });

    return response.data.secretAccount;
  }

  async createSecretAccount(alias, eddsa) {
    const signingKey = new SigningKey(eddsa);
    const accountKey = new SigningKey(eddsa);
    const newSigningKey1 = new SigningKey(eddsa);
    const newSigningKey2 = new SigningKey(eddsa);

    const secretAccount= new SecretAccount(alias, accountKey, signingKey, accountKey, newSigningKey1, newSigningKey2);
    return { secretAccount, eddsa };
  }

  async initializeAccount(alias, signer) {
    const eddsa = await buildEddsa();

    this.alias = alias;
    this.signer = signer;
    this.address = await signer.getAddress();
    let secretAccount = await this.getSecretAccount(alias);

    if (!secretAccount) {
      secretAccount = await this.createSecretAccount(alias, eddsa);
    }

    await this.initializeSecretSDK(secretAccount, eddsa);
  }

  async initializeSecretSDK(secretAccount, eddsa) {

    const secretSDK = new SecretSDK(
      secretAccount,
      defaultServerEndpoint,
      defaultCircuitPath,
      eddsa,
      this.signer,
      contractJson.spongePoseidon,
      contractJson.tokenRegistry,
      contractJson.poseidon2,
      contractJson.poseidon3,
      contractJson.poseidon6,
      contractJson.rollup,
      contractJson.smtVerifier
    );

    await secretSDK.initialize(defaultContractABI);
    this.sdkInstance = secretSDK;
  }

  async createCtx() {
    const timestamp = this.createTimestamp();
    const signature = await signEOASignature(this.signer, rawMessage, this.address, this.alias, timestamp);

    const ctx = {
      alias: this.alias,
      ethAddress: this.address,
      rawMessage,
      timestamp,
      signature,
    };

    return ctx;
  }

  async createAccount(options) {
    try {
      const result = await this.sdkInstance.createAccount(options);
      return result;
    } catch (error) {
      console.error('Error in createAccount:', error);
      throw error;
    }
  }

  async deposit(alias, assetId, password, value, index) {
    const ctx = await this.createCtx();
    const sa = await this.loadAccount();

    const nonce = 0; // TODO: get nonce from Metamask
    const receiver = sa.accountKey.pubKey.pubKey;

    // get tokenAddress by asset id
    const tokenAddress = await this.sdkInstance.getRegisteredToken(BigInt(assetId));
    console.log("token", tokenAddress.toString());
    // approve
    const approveTx = await this.sdkInstance.approve(tokenAddress.toString(), value);
    await approveTx.wait();

    const proofAndPublicSignals = await this.sdkInstance.deposit(ctx, receiver, BigInt(value), Number(assetId), nonce);
    console.log(proofAndPublicSignals);
    await this.sdkInstance.submitProofs(ctx, proofAndPublicSignals);
  }

  async send(alias, assetId, password, value, index, receiver, receiverAlias) {
    const ctx = await this.createCtx();
    const sa = await this.loadAccount();

    const proofAndPublicSignals = await this.sdkInstance.send(ctx, receiver, receiverAlias, BigInt(value), Number(assetId));
    console.log(proofAndPublicSignals);
    await this.sdkInstance.submitProofs(ctx, proofAndPublicSignals);
  }

  async withdraw(alias, assetId, password, value, index) {
    const ctx = await this.createCtx();
    const sa = await this.loadAccount();

    const receiver = sa.accountKey.pubKey.pubKey;
    const proofAndPublicSignals = await this.sdkInstance.withdraw(ctx, receiver, BigInt(value), Number(assetId));
    console.log(proofAndPublicSignals);
    await this.sdkInstance.submitProofs(ctx, proofAndPublicSignals);
  }

  async getAllBalance(index, assetId, password) {
    try {
      const ctx = await this.createCtx();
      const balance = await this.sdkInstance.getAllBalance(ctx);
      console.log("L2 balance", balance.toString());

      const address = await this.sdkInstance.getRegisteredToken(BigInt(assetId));
      const tokenIns = new ethers.Contract(
        address,
        defaultContractABI.testTokenContractABI,
        this.signer
      );

      const l1Balance = await tokenIns.balanceOf(this.address);
      console.log("L1 balance", l1Balance.toString());

      return { l2Balance: balance, l1Balance };
    } catch (error) {
      console.error('Error in getAllBalance:', error);
      throw error;
    }
  }

  async getTransactions(page, pageSize) {
    try {
      const ctx = await this.createCtx();
      const transactions = await this.sdkInstance.getTransactions(ctx, { page, pageSize });
      console.log("transactions", transactions);

      return transactions;
    } catch (error) {
      console.error('Error in getTransactions:', error);
      throw error;
    }
  }

  async loadAccount() {
    try {
      const accountData = await this.loadAccountFromAPI(this.alias);
      const key = createBlakeHash("blake256").update(Buffer.from('<your password>')).digest();
      const sa = SecretAccount.deserialize(await this.buildEddsa(), key, accountData.toString());
      return sa;
    } catch (error) {
      console.error('Error in loadAccount:', error);
      throw error;
    }
  }

  async loadAccountFromAPI(alias) {
    const timestamp = this.createTimestamp();
    const signature = await signEOASignature(this.signer, rawMessage, this.address, alias, timestamp);

    const response = await axios.post('/account/get', {
      alias,
      signer: this.signer,
      ethAddress: this.address,
      message: rawMessage,
      timestamp,
      hexSignature: signature
    });

    return response.data.secretAccount;
  }
}

const secretManagerInstance = new SecretManager();

export default secretManagerInstance;
