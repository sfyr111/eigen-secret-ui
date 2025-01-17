<template>
  <div class="multi-transaction">
    <div class="left">
      <div class="recipient">
        <p class="common-block-title">Recipient</p>
        <div>
          <FormInput :value.sync="receiver" @inputChange="(e) => {this.receiver = e.value} "
                     placeholder="Enter address"/>
        </div>
      </div>
      <div class="amount">
        <p class="amount-title">
          <span class="common-block-title">Amount</span>
          <span class="remainder">Balance: {{ ethBalance }} ETH</span>
        </p>
        <div>
          <ExchangeItem
              key="fromToken"
              isMax=true
              placeholder="Enter amount"
              :sourceData="assetsInfos"
              :showLoading="tokenLoading"
              @selectChagne="val => {this.assetId = val.rightVal}"
              @inputChange="val => {this.transactionValue = val}"
              :maxCallback="getMaxBalance"
              ref="tokenFromSelect"/>
        </div>
      </div>
    </div>
    <div class="center">

    </div>
    <div class="right">
      <div class="common-block-title">Tips</div>
      <div class="content">
        {{ summaryTxt }}
      </div>
      <div class="button">
        <button class="submit-btn" @click="caller">{{ buttonTxt }}</button>
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

import FormInput from '@/components/Input/index';
import ExchangeItem from '@/components/ExchangeItem/index';
import secretManager from '@/SecretManager/SecretManager';
import msg from "@/utils/msg";
import {getAlias, getSigner} from "@/store";
import AlertDialog from '@/components/AlertDialog/index';

export default {
  name: "MultiTransaction",
  components: {
    ExchangeItem,
    FormInput,
    AlertDialog
  },
  props: {
    transactionType: {
      type: String,
    },
    assetsInfos: {
      type: Array,
    },
    ethBalance: {
      type: String
    }
  },
  created() {
    this.summaryTxt = msg.transaction[this.transactionType].summaryTxt
    this.buttonTxt = msg.transaction[this.transactionType].buttonTxt
    if (this.transactionType == 'deposit' || this.transactionType == 'withdraw') {
      this.receiver = secretManager.getPubKey()// getSigner().userAddress
    }
  },
  data() {
    return {
      tokenLoading: false,
      transactionFee: '1',
      summaryTxt: '',
      buttonTxt: '',
      transactionValue: null,
      receiver: null,
      assetId: null,
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
    switchTransactionFee(e) {
      this.transactionFee = e
    },
    getMaxBalance(callback) {
      const params = {
        alias: getAlias(),
        assetId: this.assetId,
        user: getSigner(),
      }
      this.assetsInfos.forEach(item => {
        if (item.rightVal == this.assetId) {
          params.decimals = item.tokenInfo?.decimals
          params.token = item.metadata?.contractAddress
        }
      })
      if (!params.token) {
        console.log('getL1Balance error no token')
        return
      }
      const eloading = this.$eloading('Operation in progress, please wait')
      secretManager.getL1Balance(params).then(res => {
        console.log('getL1Balance res ', res)
        if (res.errno == this.$errCode.Success) {
          callback(res.data)
        } else {
          this.showAlert(res.message, 2)
        }
      }).catch((e) => {
        console.error(e)
        this.showAlert(null, 2, e)
      }).finally(() => {
        eloading.close()
      })
    },
    caller() {
      const type = this.transactionType

      if (!this.receiver) {
        this.showAlert('Please enter the recipient address', 2)
        return
      }
      if (!this.transactionValue) {
        this.showAlert('Please enter the operation amount', 2)
        return
      }
      if (!this.assetId) {
        this.showAlert('Please select an asset type', 2)
        return
      }
      const params = {
        alias: getAlias(),
        assetId: this.assetId, // todo this value from selector, default 2.
        value: this.transactionValue,
        user: getSigner(),
        receiver: this.receiver, // todo when only call send method is required
      }
      if (secretManager[type]) {
        const eloading = this.$eloading('Operation in progress, please wait')
        this.assetsInfos.forEach(item => {
          if (item.rightVal == this.assetId) {
            params.decimals = item.tokenInfo?.decimals
          }
        })
        secretManager[type].call(secretManager, params).then((res) => {
          if (res.errno == this.$errCode.Success) {
            this.showAlert('Transaction Confirmed!', 1)
            this.$eventBus.$emit('transaction-success', {value: true})
          } else {
            this.showAlert(res.message, 2)
          }
        }).catch((e) => {
          console.error(e)
          this.showAlert(null, 2, e)
        }).finally(() => {
          eloading.close()
        })
      }
    },
  }
}
</script>

<style lang="scss" scoped>
@import 'index.scss';
</style>
