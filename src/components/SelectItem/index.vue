<template>
    <li class="select-item" @click="selectChange">
      <div class="select-left">
        <div class="select-left-icon">
          <img :src="icon">
        </div>
        <div class="select-left-text">
          <h3 class="select-left-title">{{leftTitle}}</h3>
          <p class="select-left-value">{{leftDes}}</p>
        </div>
      </div>
      <h3 class="select-price-right">
        <span v-if="!showInput">{{rightVal}}<label v-if="labelShow">Gwei</label></span>
        <span v-else>
          <input v-model="value" @input="inputChange" type="text" class="input-text" placeholder="" @keyup="hanldeValue" >
          <label >Gwei</label>
        </span>
      </h3>
    </li>
</template>

<script>
import Vue from 'vue';

export default {
  name: 'selectItem',
  props: ['rightVal', "labelShow", "leftTitle", "leftDes", "icon", "showInput"],
  data(){
    return { value: this.rightVal }
  },
  methods: {
    selectChange() {
      this.$emit('childevent');
    },
    inputChange(e) {
      const value = e.target.value
      this.$emit('inputChange',{ value });
    },
    hanldeValue(e) {
      let value = e.target.value
      value=value.replace(/^(0+)|[^\d]+/g,'')
      this.value = value
      this.$emit('inputChange',{ value });
    },
  },
};
</script>
<style lang="scss" scoped>
  @import "index";
</style>
