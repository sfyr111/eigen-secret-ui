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
          <td>{{ item.asset }}</td>
          <td>{{ item.balance }}</td>
          <td>{{ item.value }}</td>
          <td>{{ item.hourReturn }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import secretManager from '@/SecretManager/SecretManager';
import {getSigner} from "@/store";

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
      const eloading = this.$eloading('Obtain asset list, please wait')
      const Alice = "Alice"
      const options = {alias: Alice, password: '123456', user: getSigner(), page: this.page, pageSize: this.pageSize}
      secretManager.getBalance(options).then((res) => {
        console.log('getAssets res: ', res)
        // to convert
      }).catch((e) => {
        console.error('getAssets error: ', e)
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

