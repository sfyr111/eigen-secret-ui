<template>
  <div id="nav" class="component-header">
      <div class="head-wrapper">
        <img src="~@/assets/header/logo.png" class="header-logo"/>
        <el-dropdown>
          <div class="head-right">
            <img src="~@/assets/metamask.png" class="user-icon">
            <span>
                {{ alias }}
              </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><span @click="copyAddress" :title="address">Eigen Address: {{address.substring(0, 10)}}...</span></el-dropdown-item>
              <el-dropdown-item><span  @click="quit" class="dropdown-txt">Quit</span></el-dropdown-item>
            </el-dropdown-menu>
          </div>
        </el-dropdown>
      </div>
  </div>
</template>
<script>
import {getAlias, getSigner, setAlias, setSigner} from "@/store";
import secretManager from "@/SecretManager/SecretManager";

export default {
  name: 'Header',
  data() {
    return {
      alias: null,
      address: null,
    }
  },
  methods: {
    init() {
      this.alias = getAlias()
      this.address = secretManager.getPubKey()
    },
    copyAddress() {
      navigator.clipboard.writeText(this.address)
    },
    quit() {
      setAlias(null)
      setSigner(null)
      this.$router.push('/')
    }
  },
  created() {
    this.init()
  }
}
</script>
<style lang="scss" scoped>
@import 'index';
</style>
