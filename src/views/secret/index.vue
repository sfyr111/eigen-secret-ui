<template>
    <div class="container">
        <button @click="connectMetamask" class="btn">connectMetamask</button>
        <label for="alias">Alias:</label>
        <input v-model="alias" id="alias" class="input-field"/>

        <label for="value">Value:</label>
        <input v-model="value" id="value" class="input-field"/>

        <label for="value">Receiver:</label>
        <input v-model="receiver" id="receiver" class="input-field"/>

        <button @click="createAccount" class="btn">Create Account</button>
        <button @click="initSDK" class="btn">InitSDK</button>
        <button @click="deposit" class="btn">Deposit</button>
        <button @click="send" class="btn">Send</button>
        <button @click="withdraw" class="btn">Withdraw</button>
        <button @click="getBalance" class="btn">Get Balance</button>
        <button @click="getTransactions" class="btn">Get Transactions</button>
        <button @click="proverInit" class="btn">Prover Init</button>
    </div>
</template>

<script>
import secretManager from '@/SecretManager/SecretManager';
import { Prover } from '@eigen-secret/core/dist-browser/prover';
import { ethers } from 'ethers';
import { __DEFAULT_ALIAS__ } from "@eigen-secret/core/dist-browser/utils";

export default {
  data() {
    return {
      secretManager: secretManager,
      alias: '',
      password: '<your password>',
      user: null,
      assetId: 2,
      value: '',
      receiver: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
      page: 1,
      pageSize: 10,
    }
  },
  methods: {
    async proverInit() {
        Prover.serverAddr = 'http://localhost:3000'
        Prover.init()
    },
    async connectMetamask() {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({ method: 'eth_requestAccounts' }); // Request account access
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        console.log(address)
        this.user = signer;
      } else {
        console.error('MetaMask not found');
      }
    },
    async createAccount() {
      if (!this.user) {
        await this.connectMetamask();
      }
      await this.secretManager.createAccount({ alias: this.alias, password: this.password, user: this.user });
    },
    async initSDK() {
      if (!this.user) {
        await this.connectMetamask();
      }
      await this.secretManager.initSDK({ alias: this.alias ? this.alias : __DEFAULT_ALIAS__, password: this.password, user: this.user });
    },
    async deposit() {
      await this.secretManager.deposit({ alias: this.alias, assetId: this.assetId, password: this.password, value: this.value, user: this.user });
    },
    async send() {
      await this.secretManager.send({
        alias: this.alias,
        assetId: this.assetId,
        password: this.password,
        value: this.value,
        user: this.user,
        receiver: this.receiver,
      });
    },
    async withdraw() {
      await this.secretManager.withdraw({ alias: this.alias, assetId: this.assetId, password: this.password, value: this.value, user: this.user });
    },
    async getBalance() {
      await this.secretManager.getBalance({ alias: this.alias, assetId: this.assetId, password: this.password, user: this.user });
    },
    async getTransactions() {
      await this.secretManager.getTransactions({ alias: this.alias, password: this.password, user: this.user, page: this.page, pageSize: this.pageSize });
    },
  },
}
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin: 50px;
}

.input-field {
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
}

.btn {
    padding: 10px 20px;
    border-radius: 5px;
    border: none;
    background-color: #008CBA;
    color: white;
    cursor: pointer;
}
</style>
