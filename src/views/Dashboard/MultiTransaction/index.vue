<template>
  <div class="multi-transaction">
    <div class="left">
      <div class="recipient">
        <p class="common-block-title">Recipient</p>
        <div>
          <FormInput placeholder="Enter nickname、ethereum address or ENS"/>
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
              @selectChagne="val=> val"
              @inputChange="val=> val"
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
        {{summaryTxt}}
      </div>
      <div class="button">
        <button class="submit-btn" @click="doOperate">{{buttonTxt}}</button>
      </div>
    </div>
  </div>
</template>

<script>

import FormSelect from '@/components/Select/index';
import FormInput from '@/components/Input/index';
import ExchangeItem from '@/components/ExchangeItem/index';
import {deposit, send, withdraw} from "@/contractUtils/transaction";
import msg from "@/utils/msg";


const assetId = 2
const Alice = "Alice"
const AliceAccount = "CKCRW1G+fKMxEVg9fKukRPitQFq4X7qNYZRk/BGfQBRkUYzsjUrNavs6jnttApm8qNZ0g45df4pr05syJZsVGj8bf5M6ERJYcgvE3U2w6iwfe53jkx9m724MCsB0MincSvdTDSAErxn80XRjvX6qaIBhU7sdcJ9ZUiJus6ZOpMM7jQCDaefVyx5h8cJagc8UX6IlsDjM6zZQuH3/OgDLKCMO2nPyJntinS9lWsBmHIRLmgQxSfpvRkbcSmdDSaRXBbkqYkOpH8O1RrK/uYw2+FyefHUkb1Zob/1GD0aooQqAg/pB4uFuQkdIPAuXKVmFhnZM8Zv8Ja9wDKaOV+dZHVhx8ciMIFgVydnpzhkRmB5mtZ+WNziujL0Klqg9GGEKnzWVdKwkCmOIth+pt6qVhHLqEJf+jc9wdTQSEq80Yvk=,1c8eed5455318bcf7c461f3e,f03ae7106aa3dbae77bb2d2b16814416";


export default {
  name: "MultiTransaction",
  components: {
    FormSelect,
    ExchangeItem,
    FormInput
  },
  props: {
    transactionType: {
      type: String,
    },
  },
  created() {
    this.summaryTxt = msg.transaction[this.transactionType].summaryTxt
    this.buttonTxt = msg.transaction[this.transactionType].buttonTxt
  },
  data() {
    return {
      assetsTokenList: [],
      tokenLoading: false,
      transactionFee: '1',
      summaryTxt: '',
      buttonTxt: '',
    }
  },
  methods: {
    switchTransactionFee(e) {
      this.transactionFee = e
    },
    doOperate() {
      const eloading = this.$eloading('Operation in progress, please wait')
      let pro = null
      if (msg.transaction[this.transactionType] == msg.transaction.deposit) {
        pro = this.doDeposit()
      }
      if (msg.transaction[this.transactionType] == msg.transaction.send) {
        pro = this.doSend()
      }
      if (msg.transaction[this.transactionType] == msg.transaction.withdraw) {
        pro = this.doWithdraw()
      }
      if (pro == null) {
        alert('操作有误')
        return
      }
      pro.then(() => {

      }).catch((e) => {
        alert('发生错误')
      }).finally(() => {
        eloading.close()
      })
    },
    doDeposit() {
      return deposit(Alice, assetId, 1, AliceAccount)
    },
    doSend() {
      return send(Alice, AliceAccount, Alice, AliceAccount, assetId, 1)
    },
    doWithdraw() {
      return withdraw(AliceAccount, assetId)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'index.scss';
</style>
