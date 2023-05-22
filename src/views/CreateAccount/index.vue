<template>
  <div class="page-create-account page-container">

    <div class="nickname-box">
      <div class="title">Set an account nickname</div>
      <div class="content">

        <div class="left input-box">
          <div>
            <FormInput :value="alias" @inputChange="handleAliasInputChange" placeholder="@nickname"/>
            <span v-if="!isAliasValid" class="error-message">Invalid alias format. It should start with a letter and contain only letters, numbers, underscores, and dots.</span>          </div>
        </div>

        <div class="create-des">
          <div>
            <span>Please set your unique account nickname. The nickname cann't be changed once you create successfully</span>
          </div>
        </div>
      </div>

<!--      <div>-->
<!--        <div class="error-tip">Already registered，please change your nickname</div>-->
<!--      </div>-->
    </div>


    <div class="create-submit">
      <button class="submit-btn page-submit" @click="createAccount">Register</button>
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

import ExchangeItem from '@/components/ExchangeItem/index';
import FormInput from '@/components/Input/index';
import {getSecretManager, getSigner} from "@/store";
import AlertDialog from '@/components/AlertDialog/index';
import secretManager from '@/SecretManager/SecretManager';
import { normalizeAlias } from '@eigen-secret/core/dist-browser/utils'


export default {
  name: 'create-accout-page',
  components: {
    ExchangeItem,
    FormInput,
    AlertDialog
  },
  data() {
    return {
      isAliasValid: true,
      assetsTokenList: [],
      tokenLoading: false,
      alias: null,
      dialogObject: {
        dialogDes: null,
        dialogType: 1,
        dialogVisible: false,
        dialogBtnTxt: 'confirm',
      },
    }
  },
  methods: {
    showAlert(dialogDes, dialogType, e) {
      this.dialogObject.dialogDes = dialogDes ? dialogDes : e ? (e.reason ?? e.messageData ?? e.message) : 'System error'
      this.dialogObject.dialogType = dialogType
      this.dialogObject.dialogVisible = true
    },
    handleAliasInputChange({ value }) {
      this.alias = value;
      this.isAliasValid = normalizeAlias(this.alias);
    },
    async createAccount() {
      const user = getSigner();
      if (!user) {
        return
      }
      if (!this.isAliasValid) {
        this.showAlert('Invalid alias format. It should start with a letter and contain only letters, numbers, underscores, and dots.', 2);
        return;
      }
      const eloading = this.$eloading('Registration in progress, please wait')
      secretManager.createAccount({ alias: this.alias, user }).then(res => {
        debugger
        if (res.errno == 0) {
          this.$emit('create-end', res)
        } else {
          this.showAlert(res.message, 2)
        }
      }).catch(e => {
        if (e.code === 'ACTION_REJECTED') {
          this.showAlert('unable to sign with MetaMask', 2, e);
        } else {
          this.showAlert(e.reason ?? e.messageData ?? e.message, 2, e);
        }
      }).finally(() => {
        eloading.close()
      })
    },
    async register() {
      const eloading = this.$eloading('Registration in progress, please wait')
      if (!this.alias) {
        this.dialogObject.dialogDes = 'Please enter a nickname'
        this.dialogObject.dialogType = 2
        this.dialogObject.dialogVisible = true
        eloading.close()
        return
      }
      const secretManager = getSecretManager();
      const signer = getSigner()
      secretManager.createAccount({
        alias: this.alias,
        password: secretManager.getPassword(),
        user: signer
      }).then(res => {
        if (res.errno == 0) {
          // todo 根据sdk的返回值判断是否注册成功, 未注册成功要提示原因
          this.$emit('create-end', 4)
        } else {
          this.dialogDes = res.message ? res.message : 'system error'
          this.dialogType = 2
          this.dialogVisible = true
        }
      }).catch(error => {
        console.log(error)
      }).finally(() => {
        eloading.close()
      })
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

