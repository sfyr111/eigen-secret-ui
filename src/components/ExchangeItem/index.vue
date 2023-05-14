<template>
  <div class="from-box exchange-item">
    <div class="exchange-item-left">
      <p class="exchange-des" v-if="type">{{ type }}</p>
      <div class="exchange-select-list">
        <div class="exchange-select" @click="showOptionList">
          <img :src="selectedTokenInfo && selectedTokenInfo.icon" class="select-img" v-if="selectedTokenInfo">
          <img src="@/assets/exchangeitem/icon_token_eth.png" class="select-img" v-else>
          <span class="select-txt">{{ selectedTokenInfo && selectedTokenInfo['tokenName'] }}</span>
          <img src="@/assets/exchangeitem/solidDown.png" class="select-down-img">
        </div>
        <span class="max" v-if="isMax" @click="setMax">MAX</span>
      </div>
      <van-popup v-model="OptionListVisile" round :style="{ maxWidth: '400px', width: '90%' }" closeable>
        <div class="exchange-popup-box">
          <div style="margin-top: 25px;">
            <van-search v-model="searchTxt" autofocus=true @input="searchHandle(searchTxt)"/>
          </div>
          <div class="token-list-wrapper">
            <div v-if="selectOptionData.length===0 && showLoading">
              <van-loading type="spinner" class="loading-option"/>
            </div>
            <div v-else-if="selectOptionData.length===0 && !showLoading">
              <div class="none-data">No matching data</div>
            </div>
            <v-selectItem v-else
                          v-bind:rightVal="item.rightVal"
                          :labelShow='false'
                          v-bind:leftTitle="item.tokenName"
                          v-bind:leftDes="item.leftDes"
                          v-bind:icon="item.icon"
                          @childevent="selectChagne(item)"
                          v-for="(item, index) in selectOptionData" :key="index"/>
          </div>
        </div>
      </van-popup>
    </div>
    <div class="exchange-item-right">
<!--      <p class="exchange-des">Balance: {{ selectedTokenInfo && selectedTokenInfo['balanceNumberString'] }}</p>-->
      <h3 class="exchange-value">
        <!-- <input type="text" name="formVal" placeholder="0" v-model="exchangVal" @input="inputChange" :disabled="inputDisabled" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" /> -->
        <input type="text" name="formVal" :placeholder="placeholder" v-model="exchangVal" @input="inputChange"
               :disabled="inputDisabled" @keyup="hanldeValue"/>
      </h3>
<!--      <p class="exchange-des">=<label>{{ exchangeInputVal }}</label></p>-->
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import Vue from 'vue';
import {Popup, Search} from 'vant';
import selectItem from '@/components/SelectItem/index';



Vue.use(Popup);
Vue.use(Search);


export default {
  name: 'ExchangeItem',
  props: ['isMax', 'type', 'sourceData', 'inputDisabled', 'inputDefaultValue', 'showLoading', 'exchangeToInput', 'placeholder'],
  data() {
    return {
      exchangVal: '',
      OptionListVisile: false,
      selectOptionData: _.cloneDeep(this.sourceData),
      searchTxt: '',
      selectedTokenInfo: null,
      exchangeInputVal: 0,
    }
  },
  components: {
    "v-selectItem": selectItem,
  },
  watch: {
    sourceData: {
      async handler(newV, oldV) {
        this.selectOptionData = _.cloneDeep(newV)
        if (newV.length) {
          this.selectedTokenInfo = newV.length && newV[0]
          this.selectChagne(newV[0])
        }
      },
      deep: true,
    },
    inputDefaultValue() {
      if (this.type === 'To') {
        this.exchangVal = this.inputDefaultValue
        this.dealShowUs(this.exchangeToInput)
      }
    },
    selectedTokenInfo() {
      this.exchangeInputVal = this.selectedTokenInfo && this.selectedTokenInfo.rightVal || '0.0'
    },
  },
  // computed: {
  //   selectedTokenEchange() {
  //     const selectedTokenInfo = this.selectedTokenInfo
  //     if (selectedTokenInfo) {
  //       return selectedTokenInfo.rightVal;
  //     }
  //     return 0.0
  //   },

  // },
  created() {
    this.exchangeInputVal = this.selectedTokenInfo && this.selectedTokenInfo.rightVal || '0.0'
  },
  methods: {
    inputChange(e) {
      const val = e.target.value
      //this.dealShowUs(val)
      this.$emit('inputChange', this.exchangVal);
    },
    dealShowUs(val) {
      const changeCCXT = this.selectedTokenInfo && this.selectedTokenInfo.leftDes.split('$')
      let changeCCXTval = changeCCXT && changeCCXT[1] || 0
      this.exchangeInputVal = 'US$' + (val * changeCCXTval).toFixed(2)
    },
    showOptionList() {
      this.OptionListVisile = true
    },
    searchHandle(val) {
      if (!val) {
        this.selectOptionData = _.cloneDeep(this.sourceData)
        return
      }
      this.selectOptionData = this.sourceData.filter((item, index) => {
        const content = (typeof item == 'object' ? item.tokenName : item).toLocaleLowerCase()
        const lVal = val.toLocaleLowerCase()
        return content.indexOf(lVal) > -1
      })
    },
    selectChagne(item) {
      this.OptionListVisile = false
      this.selectedTokenInfo = _.cloneDeep(item)
      this.$emit('selectChagne', item);
    },
    setMax() {
      if (!this.selectedTokenInfo) {
        return
      }
      this.exchangVal = this.selectedTokenInfo.balanceNumberString
    },
    hanldeValue(e) {
      let value = e.target.value
      // if (this.limitInput) {
      value = value.replace(/^\D*(\d*(?:\.\d{0,4})?).*$/g, '$1')
      this.exchangVal = value
      this.$emit('inputChange', value);
      // }
    },
    handleResetInputValue() {
      this.exchangVal = ''
    },
    resetSelectVal() {
      this.selectedTokenInfo = null
      this.exchangVal = ''
    }
  },
  async mounted() {
    this.$eventBus.$on('resetExchangeTokenInputValue', this.handleResetInputValue)
    // var dataSource = [{id: 1,name: 'test',icon: 'https://s3.amazonaws.com/token-icons/0x6b175474e89094c44da98b954eedeac495271d0f.png'},{id: 2,name: 'test2',icon: 'https://s3.amazonaws.com/token-icons/0x6b175474e89094c44da98b954eedeac495271d0f.png'}];
  }
};
</script>
<style lang="scss" scoped>
@import "index";
</style>
