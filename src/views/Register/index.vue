<template>
  <div class="page-login page-container">
    <div class="login-des">Welcome to Eigen Secret! Connect a wallet to manage your data and transactions.</div>
    <div class="login-btn-box">
      <div class="login-btn" @click="connectMetamask">
        <img src="~@/assets/metamask.png" class="metamask-icon">
        <p class="metamask-text">Create with MetaMask</p>
      </div>
    </div>

    <AlertDialog
        :dialogDes="dialogObject.dialogDes"
        :dialogType="dialogObject.dialogType"
        :dialogVisible.sync="dialogObject.dialogVisible"
        :dialogBtnTxt="dialogObject.dialogBtnTxt"
    />

  </div>
</template>

<script>

import AlertDialog from '@/components/AlertDialog/index';
import {doConnectMetaMask} from "@/contractUtils/metaMask";

export default {
  name: 'register-page',
  components: {
    AlertDialog
  },
  data() {
    return {
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
    async connectMetamask() {
      const data = await doConnectMetaMask();
      if (data.errno == 0) {
        this.$emit('login-end', data.data)
      } else {
        this.showAlert(data.message, 2)
      }
    },
    metamaskLogin() {
      this.$emit('login-end', 1)
    },
  },

};
</script>
<style lang="scss" scoped>
@import 'index.scss';
</style>

