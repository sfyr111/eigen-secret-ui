<template>

  <div>
    <div class="component-tranaction">
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
          <tr v-for="(item,index) in pageData" :key="index" class="transaction-list-tr">
<!--            <td :class="['status-trans', `status-${getStatusTxt(item.status)}`]"><i></i>{{ getStatusTxt(item.status) }}-->
<!--            </td>-->
            <td>{{ item.status }}</td>
            <td>{{ item.operation }}</td>
            <td>{{ item.txhash }}</td>
            <td>{{ item.balance }}</td>
            <td>{{ item.assetId }}</td>
            <td>{{ item.to }}</td>
            <td>{{ item.timestamp }}</td>
          </tr>
        </table>
        <div class="no-data" v-if="!pageData || pageData.length < 1">
          <span>No more data available</span>
        </div>
      </div>
    </div>

    <div class="pagination-box">
      <el-pagination
          background
          layout="prev, pager, next"
          :total="totalCount"
          @size-change="changePageSize"
          @current-change="changePage"
          :current-page.sync="pageSize"
          @prev-click="prevPage"
          @next-click="nextPage"
      >
      </el-pagination>
    </div>

  </div>

</template>
<script>
import {getStatusTxt} from '@/utils/index';
import secretManager from '@/SecretManager/SecretManager';
import {getAlias, getSigner} from "@/store";

export default {
  name: 'Transaction',
  // props: {
  //   transactionList: {
  //     type: Array,
  //     default: () => []
  //   }
  // },
  data() {
    return {
      // newtransactionList: this.transactionList,
      getStatusTxt,
      page: 1,
      pageSize: 10,
      pageData: [],
      totalCount: 0,
    }
  },
  methods: {
    changePage(p) {
      this.page = p
    },
    changePageSize( p) {
      this.pageSize = p
    },
    prevPage() {
      if (this.page > 1) {
        this.page--;
      }
    },
    nextPage() {
      this.page++;
    },
    fetchPageData() {
      const options = {alias: getAlias(), password: secretManager.getPassword(), user: getSigner(), page: this.page, pageSize: this.pageSize}
      secretManager.getTransactions(options).then((res) => {
        if (res && Array.isArray(res.data?.transactions)) {
          this.pageData = res?.data?.transactions
          this.totalCount = res?.data?.totalPage * this.pageSize
        } else {
          this.pageData = []
        }
        console.log('getTransactions res: ', res)
        // to convert
      }).catch((e) => {
        console.error('getTransactions error: ', e)
      })
    },
    initData() {
      this.fetchPageData()
      this.$eventBus.$on('transaction-success', (data) => {
        this.fetchPageData()
      })
    }
  },
  created() {
    this.initData()
  },
  watch: {
    'page': function() {
      this.initData()
    }
  }
}
</script>
<style lang="scss" scoped>
@import 'index';
</style>
