<template>
  <div class="multi-transaction-tab-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="Deposit" name="Deposit">
        <MultiTransaction :assets-infos="assetsInfos" transaction-type="deposit"/>
      </el-tab-pane>
      <el-tab-pane label="Send" name="Send">
        <MultiTransaction :assets-infos="assetsInfos" transaction-type="send"/>
      </el-tab-pane>
      <el-tab-pane label="Withdraw" name="Withdraw">
        <MultiTransaction :assets-infos="assetsInfos" transaction-type="withdraw"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

import MultiTransaction from '../MultiTransaction/index';
import {getAlias, getSigner} from "@/store";
import secretManager from "@/SecretManager/SecretManager";

export default {
  name: 'MultiTransactionTab',
  components: {
    MultiTransaction
  },
  data() {
    return {
      activeName: 'Deposit',
      assetsInfos: []
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    switchTab(activeName) {
      this.activeName = activeName
    },
    init() {
      const options = {alias: getAlias(), password: '123456', user: getSigner()}
      secretManager.getAssetInfo(options).then(res => {
        console.log('getAssetInfo res', res)
        if (res.errno == 0) {
          this.assetsInfos = res.data.map(item => {
            return {
              rightVal: item.assetId,
              tokenName: item.token_symbol,
              leftDes: null,
              icon: null,
            }
          })
        }
      }).catch(e => {
        console.log('getAssetInfo error', e)
      })
    }
  },
  created() {
    this.init()
  },
};
</script>
<style lang="scss" scoped>
@import 'index.scss';
</style>

