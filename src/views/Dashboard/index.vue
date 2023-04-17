<template>
  <div class="page-dashboard">
    <div class="page-container">
      <Header/>
      <div class="nav-title">Net Worth</div>
      <div class="assets-nav-box">
        <div class="assets-nav-left">
          <p class="asset-total">${{totalBalanceUSD}}</p>
<!--          <p class="asset-change">-12.55% ($21.11)</p>-->
        </div>
        <div class="assets-nav-right">
          <button class="submit-btn" @click="transClick('Deposit')">Deposit</button>
          <button class="submit-btn" @click="transClick('Send')">Send</button>
          <button class="submit-btn" @click="transClick('Withdraw')">Withdraw</button>
        </div>
      </div>
      <Asset :asset-list="assetList"/>
      <div class="multi-transaction-box" ref="multiTransactionBox">
        <MultiTransactionTab ref="multiTransactionTab"/>
      </div>
      <div class="transaction-list-box">
        <div class="common-block-title">Transaction History</div>
        <Transaction/>
      </div>
    </div>
    <ConfirmDialog
        :dialogDes="dialogDes"
        :dialogType="dialogType"
        :dialogVisible.sync="dialogVisible"
    />
    <Footer/>
  </div>
</template>

<script>
import Header from '@/components/Header/index';
import Footer from '@/components/Footer/index';
import Transaction from './Transaction/index';
import Asset from './Asset/index';
import MultiTransactionTab from './MultiTransactionTab/index';
import ConfirmDialog from '@/components/ConfirmDialog/index';
import secretManager from '@/SecretManager/SecretManager';
import {getAlias, getSigner} from "@/store";

export default {
  name: 'dashboard-page',
  data() {
    return {
      assetList: [],
      totalBalanceUSD: 0,
      dialogDes: '',
      dialogType: '',
      dialogVisible: false,
    }
  },
  components: {
    Header,
    Footer,
    Transaction,
    ConfirmDialog,
    MultiTransactionTab,
    Asset
  },

  methods: {
    getAllBalance() {
      const options = {
        alias: getAlias(),
        password: secretManager.getPassword(),
        user: getSigner(),
        page: this.page,
        pageSize: this.pageSize
      }
      secretManager.getAllBalance(options).then((res) => {
        this.assetList = res?.data?.assetInfo?.map(item => {
          return {
            symbol: item.tokenInfo?.symbol,
            asset: item.assetId,
            balance: item.balance,
            value: item.balanceUSD,
            hourReturn: item.profit24Hour + ' ' + item.return
          }
        })
        this.totalBalanceUSD = res?.data?.totalBalanceUSD
        console.log('getAssets res2: ', this.assetList)
        console.log('getAssets res: ', res)
        // to convert
      }).catch((e) => {
        console.error('getAssets error: ', e)
      })
    },
    onTransaction() {
      this.$eventBus.$on('transaction-success', (data) => {
        this.getAllBalance()
      })
    },
    transClick(type) {
      this.$refs.multiTransactionTab.switchTab(type)
      this.scrollToSection()
      // this.dialogType = type
      // switch(type) {
      //   case 'Deposit':
      //     this.dialogDes = 'Transfer assets from the layer1 wallet（e.g.connected MetaMask wallet）to the EigeMoney l2 wallet to experience gas-low token transfer and asap. you can withdraw assets to the layer1 wallet at any time.'
      //     break;
      //   case 'Send':
      //     this.dialogDes = 'Send assets to another user on EigenMoney via their nicknames and enjoy gas-low transfer. Please make sure that the nickname is correct.'
      //     break;
      //   case 'Withdraw':
      //     this.dialogDes = 'Withdraw assets from EigenMoney L2 to L1 at any time. The default address is your signing wallet address. You can also withdraw to other L1 addresses. Please make sure the address is correct.'
      //     break;
      //   default:
      //     break;
      // }
      // this.dialogVisible = true
    },
    scrollToSection() {
      const section = this.$refs.multiTransactionBox;
      if (section) {
        section.scrollIntoView({behavior: 'smooth'});
      }
    }
  },

  created() {
    this.getAllBalance()
    this.onTransaction()
  },

};
</script>
<style lang="scss" scoped>
@import 'index.scss';
</style>

