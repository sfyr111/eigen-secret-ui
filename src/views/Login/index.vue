<template>
  <div class="page-login page-container">
    <div class="login-des">Welcome to Eigen zkPay! Connect a wallet to manage your data and transactions.</div>
    <div class="login-btn-box">
      <div class="login-btn" @click="metamaskLogin">
        <img src="~@/assets/metamask.png" class="metamask-icon">
        <p class="metamask-text">MetaMask</p>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'login-page',

  data() {
    return {}
  },


  methods: {
    metamaskLogin() {
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

