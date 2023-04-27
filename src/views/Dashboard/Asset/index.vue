<template>
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
        <tr v-for="item in assetList">
          <td>{{item.asset}}</td>
          <td>{{item.balance}}</td>
          <td>{{item.value}}</td>
          <td>{{item.hourReturn}}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import {getAllBalance} from "@/contractUtils/account";
export default {
  name: 'Asset',
  data() {
    return {
      assetList: [
        {
          asset: 'eETH',
          balance: '0.033444eETH',
          value: '$66.26',
          hourReturn: '-$21.11 -12.55%',
        }
      ],
    }
  },
  methods: {
    initData() {
      const eloading = this.$eloading('Obtaining assets, please wait')
      const Alice = "Alice"
      getAllBalance(Alice).then((res) => {
        console.log('getAllBalance res: ', res)
        // to convert
      }).finally(() => {
        eloading.close()
      })
    }
  },
  created() {
    this.initData()
  },
};
</script>
<style lang="scss" scoped>
  @import 'index.scss';
</style>

