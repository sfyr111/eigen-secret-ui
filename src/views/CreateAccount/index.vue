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


export default {
  name: 'create-accout-page',
  components: {
    ExchangeItem,
    FormInput,
    AlertDialog
  },
  data() {
    return {
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
    showAlert(dialogDes, dialogType) {
      this.dialogObject.dialogDes = dialogDes ? dialogDes : 'System error'
      this.dialogObject.dialogType = dialogType
      this.dialogObject.dialogVisible = true
    },
    async createAccount() {
      const user = getSigner();
      if (!user) {
        return
      }
      const eloading = this.$eloading('Registration in progress, please wait')
      secretManager.createAccount({ alias: this.alias, user }).then(res => {
        if (res.errno == 0) {
          this.$emit('create-end', res)
        } else {
          this.showAlert(res.message, 2)
        }
      }).catch(e => {
        this.showAlert(null, 2)
        console.log('create error ', e)
        console.error(e)
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

