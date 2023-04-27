<template>
  <div class="page-create-account page-container">

    <div class="nickname-box">
      <div class="title">Set an account nickname</div>
      <div class="content">

        <div class="left input-box">
          <div>
            <FormInput :value="alias" @inputChange="(v) => {this.alias = v.value}" placeholder="@nickname"/>
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


    <div class="create-submit">
      <button class="submit-btn page-submit" @click="register">Register</button>
    </div>
  </div>
</template>

<script>

import ExchangeItem from '@/components/ExchangeItem/index';
import FormInput from '@/components/Input/index';
import {createSecretAccount} from "@/contractUtils/account";

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
      alias: null,
    }
  },
  methods: {
    openFullScreen2() {

    },
    async register() {
      const eloading = this.$eloading('Registration in progress, please wait')
      try {
        if (!this.alias) {
          alert('请登录')
          return
        }
        let info;
        try {
          info = await createSecretAccount();
        } catch (e) {
          if (e.code == 'ACTION_REJECTED') {
            alert('Unable to link your account. Please try again.')
          } else {
            alert('create account error')
          }
          console.dir(e)
        }
        if (info) {

          this.$emit('create-end', 4)
        } else {

        }
      }  finally {
        eloading.close()
      }
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

