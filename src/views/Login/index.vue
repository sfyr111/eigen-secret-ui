<template>
  <div class="page-login page-container">
    <div class="logo-box">
      <img class="logo" src="@/assets/header/logo.png">
    </div>
    <h1 class="login-des login-des-title">Eigen Secret: Simple Private Transaction</h1>
    <div class="login-des">Welcome to Eigen Secret! Connect a wallet to manage your data and transactions.</div>
    <div class="login-btn-box">
      <div class="login-btn" @click="login">
        <img src="~@/assets/metamask.png" class="metamask-icon">
        <p class="metamask-text">Login with MetaMask</p>
      </div>
    </div>
    <p class="login-des">Don't have an account yet? <span class="sign-up" @click="toLogin">Sign up now</span></p>


    <AlertDialog
        :dialogDes="dialogObject.dialogDes"
        :dialogType="dialogObject.dialogType"
        :dialogVisible.sync="dialogObject.dialogVisible"
        :dialogBtnTxt="dialogObject.dialogBtnTxt"
    />

  </div>
</template>

<script>

import {connectMetaMask} from "@/contractUtils/metaMask";
import secretManager from '@/SecretManager/SecretManager';
import AlertDialog from '@/components/AlertDialog/index';
import {getAlias, getSigner, setAlias, setSdk, setSigner} from "@/store";
import {__DEFAULT_ALIAS__} from "@eigen-secret/core/dist-browser/utils";

export default {
  name: 'login-page',
  components: {
    AlertDialog
  },
  data() {
    return {
      user: null, // todo to store
      dialogObject: {
        dialogDes: null,
        dialogType: 1,
        dialogVisible: false,
        dialogBtnTxt: 'confirm',
      },
    }
  },
  methods: {
    showAlert(dialogDes, dialogType) {
      this.dialogObject.dialogDes = dialogDes ? dialogDes : 'System error'
      this.dialogObject.dialogType = dialogType
      this.dialogObject.dialogVisible = true
    },
    async login() {
      const eloading = this.$eloading('Login in progress, please wait')
      if (!getSigner()) {
        try {
          this.user = await connectMetaMask();
          setSigner(this.user)
        } catch (e) {
          console.log('e.message ', e.message)
          if (e.message.indexOf('user rejected signing')) {
            this.showAlert('Unable to link your account. Please try again.', 2, e)
          } else {
            this.showAlert(null, 2, e)
          }
          eloading.close()
          return
        }
      }
      let alias = getAlias();
      let isCreate = alias
      alias = alias ? alias : __DEFAULT_ALIAS__
      secretManager.initSDK({alias: alias, user: getSigner(), isCreate: isCreate}).then((res) => {
        if (res.errno == 0) {
          console.log('login res data ', res)
          setSdk(res.data)
          setAlias(res.data.alias)
          this.$router.push('/dashboard')
        } else {
          this.showAlert(res.message, 2)
        }
      }).catch(e => {
        if (e.message.indexOf('user rejected signing') != -1) {
          this.showAlert('Unable to link your account. Please try again.', 2, e)
        } else {
          this.showAlert(null, 2, e)
        }
        console.error(e)
      }).finally(() => {
        eloading.close()
      })
    },
    toLogin() {
      this.$router.push('/LoginStep')
    },
    metamaskLogin() {
      this.$emit('login-end', 1)
    },
  },
  created() {
    if (getAlias()) {
      this.login()
    } else {
      this.user = getSigner()
    }
  },
};
</script>
<style lang="scss" scoped>
@import 'index.scss';
</style>

