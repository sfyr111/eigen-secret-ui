<template>
  <div class="multi-transaction">
    <div class="left">
      <div class="recipient">
        <p class="common-block-title">Recipient</p>
        <div>
          <FormInput :disabled="transactionType == 'deposit' || transactionType == 'withdraw'" :value.sync="receiver" @inputChange="(e) => {this.receiver = e.value} " placeholder="Enter address"/>
        </div>
      </div>
      <div class="amount">
        <p class="amount-title">
          <span class="common-block-title">Amount</span>
          <span class="remainder">Balance: 0.005780 ETH</span>
        </p>
        <div>
          <ExchangeItem
              key="fromToken"
              isMax=true
              placeholder="Enter amount"
              :sourceData="assetsTokenList"
              :showLoading="tokenLoading"
              @selectChagne="val => {this.assetId = val}"
              @inputChange="val => {this.transactionValue = val}"
              ref="tokenFromSelect"/>
        </div>
      </div>
      <div class="transaction-fee">
        <p class="amount-title">
          <span class="common-block-title">Transaction Fee</span>
          <span class="remainder">Balance: 0.005780 ETH</span>
        </p>
        <div class="row" :class="transactionFee == '1' ? 'selected' : ''" @click="switchTransactionFee('1')">
          <div class="item icon">
            <el-radio v-model="transactionFee" label="1"><span></span></el-radio>
          </div>
          <div class="item title">Slow</div>
          <div class="item time"></div>
          <div class="item price">0.00034 ETH</div>
          <div class="item process">$0.58</div>
        </div>
        <div class="row" :class="transactionFee == '2' ? 'selected' : ''" @click="switchTransactionFee('2')">
          <div class="item icon">
            <el-radio v-model="transactionFee" label="2"><span></span></el-radio>
          </div>
          <div class="item title">Instant</div>
          <div class="item time">7 mins</div>
          <div class="item price">0.0085 ETH</div>
          <div class="item process">$14.56</div>
        </div>
      </div>
    </div>
    <div class="center">

    </div>
    <div class="right">
      <div class="common-block-title">Summary</div>
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

import FormSelect from '@/components/Select/index';
import FormInput from '@/components/Input/index';
import ExchangeItem from '@/components/ExchangeItem/index';
import secretManager from '@/SecretManager/SecretManager';
import msg from "@/utils/msg";
import { getAlias, getSigner } from "@/store";
import AlertDialog from '@/components/AlertDialog/index';


const assetId = 2
const Alice = "Alice"
const AliceAccount = "CKCRW1G+fKMxEVg9fKukRPitQFq4X7qNYZRk/BGfQBRkUYzsjUrNavs6jnttApm8qNZ0g45df4pr05syJZsVGj8bf5M6ERJYcgvE3U2w6iwfe53jkx9m724MCsB0MincSvdTDSAErxn80XRjvX6qaIBhU7sdcJ9ZUiJus6ZOpMM7jQCDaefVyx5h8cJagc8UX6IlsDjM6zZQuH3/OgDLKCMO2nPyJntinS9lWsBmHIRLmgQxSfpvRkbcSmdDSaRXBbkqYkOpH8O1RrK/uYw2+FyefHUkb1Zob/1GD0aooQqAg/pB4uFuQkdIPAuXKVmFhnZM8Zv8Ja9wDKaOV+dZHVhx8ciMIFgVydnpzhkRmB5mtZ+WNziujL0Klqg9GGEKnzWVdKwkCmOIth+pt6qVhHLqEJf+jc9wdTQSEq80Yvk=,1c8eed5455318bcf7c461f3e,f03ae7106aa3dbae77bb2d2b16814416";


export default {
  name: "MultiTransaction",
  components: {
    FormSelect,
    ExchangeItem,
    FormInput,
    AlertDialog
  },
  props: {
    transactionType: {
      type: String,
    },
  },
  created() {
    this.summaryTxt = msg.transaction[this.transactionType].summaryTxt
    this.buttonTxt = msg.transaction[this.transactionType].buttonTxt
    if (this.transactionType == 'deposit' || this.transactionType == 'withdraw') {
      this.receiver = getSigner().userAddress
    }
  },
  data() {
    return {
      assetsTokenList: [],
      tokenLoading: false,
      transactionFee: '1',
      summaryTxt: '',
      buttonTxt: '',
      transactionValue: null,
      receiver: null,
      assetId: 2,
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
    caller() {
      const type = this.transactionType

      if (!this.receiver && type === 'send') {
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
        assetId: 2, // todo this value from selector, default 2.
        value: this.transactionValue,
        user: getSigner(),
        receiver: this.receiver, // todo when only call send method is required
      }
      if (secretManager[type]) {
        const eloading = this.$eloading('Operation in progress, please wait')
        secretManager[type].call(secretManager, params).then((res) => {
          if (res.errno == 0) {
            this.showAlert('Transaction Confirmed!', 1)
          } else {
            this.showAlert(res.message, 2)
          }
        }).catch((e) => {
          console.error(e)
          this.showAlert(null, 2)
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
