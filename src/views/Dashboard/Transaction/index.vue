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
            <td :class="['status-trans', `status-${getStatusTxt(item.status)}`]"><i></i>{{ getStatusTxt(item.status) }}
            </td>
            <td>{{ item.opration }}</td>
            <td>{{ item.hash }}</td>
            <td>{{ item.balance }}</td>
            <td>
              <div class="address-td">
                <i class="address-icon"></i>{{ item.from }}
              </div>
            </td>
            <td>
              <div class="address-td">
                <i class="address-icon"></i>{{ item.to }}
              </div>
            </td>
            <td>{{ item.time }}</td>
          </tr>
        </table>
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
import {getSigner} from "@/store";

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
    initData() {
      const eloading = this.$eloading('Obtaining transaction history, please wait')
      const Alice = "Alice"
      const options = {alias: Alice, password: '123456', user: getSigner(), page: this.page, pageSize: this.pageSize}
      secretManager.getTransactions(options).then((res) => {
        console.log('getTransactions res: ', res)
        // to convert
      }).catch((e) => {
        console.error('getTransactions error: ', e)
      }).finally(() => {
        eloading.close()
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
