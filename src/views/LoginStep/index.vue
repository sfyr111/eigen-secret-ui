<template>
  <div class="page-login-step-box">
    <div class="logo-box">
      <img class="logo" src="@/assets/header/logo.png">
    </div>
    <div class="steps">
      <el-steps :active="active" align-center>
        <el-step title="Login in with MetaMask">
        </el-step>
        <el-step title="Set an account nickname"></el-step>
        <el-step title="Login succeeded"></el-step>
      </el-steps>
    </div>
    <div class="content">
      <Register v-if="active == 0" @login-end="loginEnd"/>
      <CreateAccount @create-end="createEnd" v-if="active == 1 || active == 2 || active == 3"/>
      <AlertDialog @update:dialogVisible="registerDialogClose" :dialog-visible="registerDialog"
                   dialog-tip="Congratulations, your registration is successful!"
                   dialog-btn-txt="Confirm"/>
    </div>
  </div>
</template>

<script>

import Register from '@/views/Register/index';
import CreateAccount from '@/views/CreateAccount/index';
import AlertDialog from '@/components/AlertDialog/index';
import secretManager from '@/SecretManager/SecretManager';
import { getSigner, setSdk, setSigner, setAlias } from "@/store";
import { ehters } from 'ethers';

export default {
  name: 'LoginStep',
  components: {
    Register,
    CreateAccount,
    AlertDialog
  },
  data() {
    return {
      active: 0,
      registerDialog: false,
      user: null, // todo to store
    }
  },


  methods: {
    loginEnd(singer) {
      setSigner(singer)
      this.active = 1
    },
    createEnd(sdk) {
      this.active = 3
      setSdk(sdk.data)
      setAlias(sdk.data.alias)
      this.registerDialog = true
    },
    metamaskLogin() {
      this.$router.push('/dashboard')
    },
    registerDialogClose() {
      this.$router.push('/dashboard')
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

