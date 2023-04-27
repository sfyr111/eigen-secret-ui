<template>
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
        <tr v-for="(item,index) in newtransactionList" :key="index" class="transaction-list-tr">
          <td :class="['status-trans', `status-${getStatusTxt(item.status)}`]"><i></i>{{getStatusTxt(item.status)}}</td>
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
</template>
<script>
import {getTransactions} from "@/contractUtils/transaction";
import { getStatusTxt, timeFormat } from '@/utils/index';
import {getAllBalance} from "@/contractUtils/account";
export default {
  name: 'Transaction',
  props: {
    transactionList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      newtransactionList: this.transactionList,
      getStatusTxt,

    }
  },
  methods: {
    initData() {
      const eloading = this.$eloading('Obtaining transaction history, please wait')
      const Alice = "Alice"
      getTransactions(Alice).then((res) => {
        console.log('getTransactions res: ', res)
        // to convert
      }).finally(() => {
        eloading.close()
      })
    }
  },
  created() {
    this.initData()
  }
}
</script>
<style lang="scss" scoped>
  @import 'index';
</style>
