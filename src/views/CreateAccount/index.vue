<template>
  <div class="page-create-account page-container">
    <div class="create-title">Create a new EigenMoney account</div>
    <div class="create-des">Please set an account nicknameYour friends can easily transfer crypto to you by nickname.</div>
    <div class="create-nick-box">
      <input type="text" name="nickname" class="input-nick-name">
      <img src="~@/assets/success.png" class="input-success">
    </div>
    <div class="error-tip">Already registered，please change your nickname</div>
    <div class="create-des">Please deposit at least 0.01ETH</div>
    <div class="create-value-box">
      <div class="input-wraper">
        <div class="input-top">
          <p>Amount</p>
          <p>-4 hours</p>
        </div>
        <div class="input-bottom">
          <div class="input-bot-left">
            <img src="~@/assets/eth.png" class="eth-icon">
            <label class="eth-label">ETH</label>
          </div>
          <div class="input-bot-right"></div>
        </div>
      </div>
    </div>
    <div class="create-submit"><button class="submit-btn page-submit">Register</button></div>
  </div>
</template>

<script>

export default {
  name: 'create-accout-page',
  
  data() {
    return {
      
    }
  },
  
  
  methods: {
    
  },
  
  created() {
    console.log('token')
  },
  
};
</script>
<style lang="scss" scoped>
  @import 'index.scss';
</style>

