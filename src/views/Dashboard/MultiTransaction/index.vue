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
        <button class="submit-btn">{{buttonTxt}}</button>
      </div>
    </div>
  </div>
</template>

<script>

import FormSelect from '@/components/Select/index';
import FormInput from '@/components/Input/index';
import ExchangeItem from '@/components/ExchangeItem/index';
import {deposit, send, withdraw} from "@/contractUtils/transaction";
import prompt from "@/utils/prompt";


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
    doDeposit() {

    },
    doSend() {

    },
    doWithdraw() {

    }
  },
  watch: {
    // 监视message属性的变化
    transactionType: function(n) {
      this.summaryTxt = prompt[n].summaryTxt
      this.buttonTxt = prompt[n].buttonTxt
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'index.scss';
</style>
