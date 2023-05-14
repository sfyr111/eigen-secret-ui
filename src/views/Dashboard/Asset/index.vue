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
      <div class="no-data" v-if="!assetList || assetList.length < 1">
        <span>No more data available</span>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Asset',
  props: {
    assetList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {}
  },
  methods: {},
  created() {

  },
};
</script>
<style lang="scss" scoped>
@import 'index.scss';
</style>

