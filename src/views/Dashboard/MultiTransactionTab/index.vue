<template>
  <div class="multi-transaction-tab-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="Deposit" name="first">
        <MultiTransaction/>
      </el-tab-pane>
      <el-tab-pane label="Send" name="second">
        <MultiTransaction/>
      </el-tab-pane>
      <el-tab-pane label="Withdraw" name="third">
        <MultiTransaction/>
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
      activeName: 'first'
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  },
  created() {

  },
};
</script>
<style lang="scss" scoped>
@import 'index.scss';
</style>

