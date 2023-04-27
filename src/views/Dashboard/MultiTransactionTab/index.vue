<template>
  <div class="multi-transaction-tab-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="Deposit" name="Deposit">
        <MultiTransaction transaction-type="deposit"/>
      </el-tab-pane>
      <el-tab-pane label="Send" name="Send">
        <MultiTransaction transaction-type="send"/>
      </el-tab-pane>
      <el-tab-pane label="Withdraw" name="Withdraw">
        <MultiTransaction transaction-type="withdraw"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

import MultiTransaction from '../MultiTransaction/index';

export default {
  name: 'MultiTransactionTab',
  components: {
    MultiTransaction
  },
  data() {
    return {
      activeName: 'Deposit'
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    switchTab(activeName) {
      this.activeName = activeName
    }
  },
  created() {

  },
};
</script>
<style lang="scss" scoped>
@import 'index.scss';
</style>

