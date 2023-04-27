<template>
  <div class="page-dashboard">
    <div class="page-container">
      <Header/>
      <div class="nav-title">Net Worth</div>
      <div class="assets-nav-box">
        <div class="assets-nav-left">
          <p class="asset-total">$66.26</p>
          <p class="asset-change">-12.55% ($21.11)</p>
        </div>
        <div class="assets-nav-right">
          <button class="submit-btn" @click="transClick('Deposit')">Deposit</button>
          <button class="submit-btn" @click="transClick('Send')">Send</button>
          <button class="submit-btn" @click="transClick('Withdraw')">Withdraw</button>
        </div>
      </div>
      <Asset/>
      <div class="multi-transaction-box" ref="multiTransactionBox">
        <MultiTransactionTab ref="multiTransactionTab"/>
      </div>
      <div class="transaction-list-box">
        <div class="common-block-title">Transaction History</div>
        <Transaction
          :transactionList="transactionList"/>
        <div class="pagination-box">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="1000">
          </el-pagination>
        </div>
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
import MultiTransaction from './MultiTransaction/index';
import Asset from './Asset/index';
import MultiTransactionTab from './MultiTransactionTab/index';
import ConfirmDialog from '@/components/ConfirmDialog/index';
export default {
  name: 'dashboard-page',
  data() {
    return {
      transactionList: [
        {
          id: 1,
          status: 2,
          opration: '0.033444eETH',
          hash: 'txsdfdf',
          balance: '0.5eth',
          from: 'sdfsdjisd',
          to: 'sdfsdfsdf',
          time: '2023-2-23'
        }
      ],
      transactionHash: '',

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
    MultiTransaction,
    MultiTransactionTab,
    Asset
  },

  methods: {
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
        section.scrollIntoView({ behavior: 'smooth' });
      }
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

