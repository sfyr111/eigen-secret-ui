<template>
  <div class="multi-transaction-tab-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="Deposit" name="Deposit">
        <MultiTransaction :eth-balance="ethBalance" :assets-infos="assetsInfos" transaction-type="deposit"/>
      </el-tab-pane>
      <el-tab-pane label="Send" name="Send">
        <MultiTransaction :eth-balance="ethBalance" :assets-infos="assetsInfos" transaction-type="send"/>
      </el-tab-pane>
      <el-tab-pane label="Withdraw" name="Withdraw">
        <MultiTransaction :eth-balance="ethBalance" :assets-infos="assetsInfos" transaction-type="withdraw"/>
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
      assetsInfos: [],
      ethBalance: '0',
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    switchTab(activeName) {
      this.activeName = activeName
    },
    async getETH() {
      this.ethBalance = await secretManager.getWeb3ETH()
      this.ethBalance = parseFloat(this.ethBalance).toFixed(4)
    },
    init() {
      const options = {alias: getAlias(), password: secretManager.getPassword(), user: getSigner()}
      secretManager.getAssetInfo(options).then(res => {
        console.log('getAssetInfo res', res)
        if (res.errno == this.$errCode.Success) {
          this.assetsInfos = res.data.map(item => {
            return {
              rightVal: item.assetId, //'$0',
              tokenName: item.tokenInfo?.symbol,
              leftDes: null,
              icon: item.tokenInfo?.logoURI,
              tokenInfo: item.tokenInfo,
              metadata: item
            }
          })
        }
      }).catch(e => {
        console.log('getAssetInfo error', e)
      })
      this.$eventBus.$on('transaction-success', (data) => {
        this.getETH()
      })
    }
  },
  created() {
    this.init()
    this.getETH()
  },
};
</script>
<style lang="scss" scoped>
@import 'index.scss';
</style>

