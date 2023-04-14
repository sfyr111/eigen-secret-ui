<template>
    <div class="select-box select-compent-page">
      <p class="select-compent-title">{{label}}</p>
      <div v-if="dataSource.length===0">
        <el-select v-model="noneValue" filterable :popper-append-to-body="false" :placeholder="placeholder">
          <el-option value="">
            <van-loading type="spinner" class="loading-option" />
          </el-option>
        </el-select>
      </div>
      <el-select v-else v-model="thislabel" filterable :popper-append-to-body="false" :placeholder="placeholder">
        <el-option
          v-for="(item,index) in dataSource"
          :key="index"
          :label="item.leftTitle"
          :value="item.id">
            <v-selectItem
            v-bind:rightVal="item.rightVal"
            :labelShow="labelShow"
            v-bind:leftTitle="item.leftTitle"
            v-bind:leftDes="item.leftDes"
            v-bind:icon="item.icon"
            @childevent="selectChagne(item)"></v-selectItem>
        </el-option>
      </el-select>
      <img :src="thisleftIcon" v-if="thisleftIcon" class="select-input-icon">
    </div>
</template>

<script>
import Vue from 'vue';
import { Loading }  from 'vant'
import selectItem from '@/components/SelectItem/index';
Vue.use(Loading)


export default {
  name: 'FormSelect',
  props: ['label', "leftIcon", "rightIcon", "dataSource", "labelShow", "placeholder", 'defaultValue', 'showLoading'],
  data() {
    return {
      noneValue: '',
      thislabel: this.defaultValue,
      thisleftIcon: this.leftIcon,
    }
  },
  components: {
    "v-selectItem": selectItem,
  },
  watch: {
    defaultValue(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.thislabel = newValue
      }
    },
    leftIcon(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.thisleftIcon = newValue
      }
    },
  },
  mounted() {
    var that = this;
    // document.addEventListener('click',e => {
    //   var sp = document.getElementById("selectList");
    //   if(sp){
    //     if(!sp.contains(event.target)){
    //      this.optionVisible = false
    //     }
    //   }
    // })
  },
  methods: {
    selectChagne(value) {
      console.log(value)
      this.thislabel = value.id
      this.thisleftIcon = value.icon
      this.$emit('change', {value});
    },
    resetSelectVal() {
      this.thislabel = ''
    }
  },
};
</script>
<style lang="scss">
  @import "index";
</style>
