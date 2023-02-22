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
          <button class="submit-btn">Deposit</button>
          <button class="submit-btn">Send</button>
          <button class="submit-btn">Withdraw</button>
        </div>
      </div>
      <div class="assets-list-box">
         <div class="common-block-title">Assets</div>
         <div class="asset-list table-list">
            <table>
              <tr>
                <th>ASSET</th>
                <th>BALANCE</th>
                <th>VALUE</th>
                <th>24-hour Return</th>
              </tr>
              <tr>
                <td>eETH</td>
                <td>0.033444eETH</td>
                <td>$66.26</td>
                <td>-$21.11 -12.55%</td>
              </tr>
            </table>
         </div>
      </div>
      <div class="transaction-list-box">
        <div class="common-block-title">Transaction History</div>
        <div class="tranaction-list table-list">
          <table>
            <tr>
              <th>STATUS</th>
              <th>OPERATION</th>
              <th>TX HASH</th>
              <th>BALANCE</th>
              <th>FROM</th>
              <th>TO</th>
              <th>TIMESTAMP</th>
            </tr>
            <tr>
              <td>eETH</td>
              <td>0.033444eETH</td>
              <td>$66.26</td>
              <td>-$21.11 -12.55%</td>
              <td>0.033444eETH</td>
              <td>$66.26</td>
              <td>-$21.11 -12.55%</td>
            </tr>
          </table>
        </div>
        <div class="pagination-box">
          <!-- <el-pagination
            background
            layout="prev, pager, next"
            :total="1000">
          </el-pagination> -->
        </div>
      </div>
    </div>
    <Footer/>
  </div>
</template>

<script>
import Header from '@/components/Header/index';
import Footer from '@/components/Footer/index';
export default {
  name: 'dashboard-page',
  data() {
    return {
      
    }
  },
  components: {
    Header,
    Footer
  },
  
  methods: {
    
  },
  
  created() {
    console.log('token')
  },
  
};
</script>
<style lang="scss" scoped>
  @import 'index.scss';
</style>

