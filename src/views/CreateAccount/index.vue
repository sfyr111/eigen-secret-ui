<template>
  <div class="page-create-account page-container">

    <div class="nickname-box">
      <div class="title">Set an account nickname</div>
      <div class="content">

        <div class="left input-box">
          <div>
            <FormInput placeholder="Enter nickname、ethereum address or ENS"/>
          </div>
        </div>

        <div class="create-des">
          <div>
            <span>Please set an account nicknameYour friends can easily transfer crypto to you by
          nickname.</span>
          </div>
        </div>
      </div>

      <div>
        <div class="error-tip">Already registered，please change your nickname</div>
      </div>
    </div>


    <div class="nickname-box">

      <div class="title">Amount</div>

      <div class="content">
        <div class="left create-value-box">
          <ExchangeItem
              key="fromToken"
              isMax=true
              placeholder="Enter amount"
              :sourceData="assetsTokenList"
              :showLoading="tokenLoading"
              @selectChagne="val=> val"
              @inputChange="val=> val"
              ref="tokenFromSelect"/>
        </div>
        <div class="create-des">Please deposit at least 0.01ETH</div>
      </div>

    </div>

    <div class="create-submit">
      <button class="submit-btn page-submit" @click="register">Register</button>
    </div>
  </div>
</template>

<script>

import ExchangeItem from '@/components/ExchangeItem/index';
import FormInput from '@/components/Input/index';

export default {
  name: 'create-accout-page',
  components: {
    ExchangeItem,
    FormInput
  },
  data() {
    return {
      assetsTokenList: [],
      tokenLoading: false,
    }
  },
  methods: {
    register() {
      this.$emit('create-end', 4)
    }
  },
  created() {
    console.log('token')
  },

};
</script>
<style lang="scss" scoped>
@import 'index.scss';
</style>

