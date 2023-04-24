<template>
  <div class="page-login page-container">
    <div class="login-des">Welcome to Eigen zkPay! Connect a wallet to manage your data and transactions.</div>
    <div class="login-btn-box">
      <div class="login-btn" @click="createAccount">
        <img src="~@/assets/metamask.png" class="metamask-icon">
        <p class="metamask-text">MetaMask</p>
      </div>
    </div>
  </div>
</template>

<script>

import { SecretSDK } from "@eigen-secret/sdk/dist/index";
import { Prover } from "@eigen-secret/core/dist/prover";
import { createSecretAccount } from "@/contractUtils/account";

export default {
  name: 'login-page',

  data() {
    return {}
  },


  methods: {
    async createAccount() {
      const batchproof = await createSecretAccount('abu')
      console.log(batchproof)
    },
    metamaskLogin() {
      console.log(Prover)
      let secretSDK = new SecretSDK('')
      console.log(secretSDK)
      secretSDK.createAccount();
      this.$emit('login-end', 1)
      // this.$router.push('/dashboard')
    },
  },

  created() {
    console.log('token')
  },

};
</script>
<style lang="scss" scoped>
@import 'index.scss';
</style>

