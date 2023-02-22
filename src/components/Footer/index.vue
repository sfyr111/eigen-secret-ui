<template>
  <div>
    <div id="footer" class="component-footer">
    <div class="page-container">
      <div class="footer-content">
          <div class="footer-item">
            <router-link :to="{ name: 'dashboard' }" ><img src="~@/assets/footer/logo.png" class="footer-logo"></router-link>
          </div>
          <div class="footer-item">
            <ul class="nav-list">
              <li v-for="item in navList" :key="item.key" @click="handleCommand(item)">{{item.key}}</li>
            </ul>
          </div>
          <div class="footer-item">
            <p class="community-title">Community</p>
            <ul class="commity-list">
              <li v-for="item in linkIconList" :key="item.key" class="link-item" @click="openPage(item.url)">
                <i :class="item.key"></i>
              </li>
            </ul>
          </div>
      </div>
    </div>
    </div>
  </div>
  
</template>
<script>
export default {
  name: 'Footer',
  data() {
    return {
      linkIconList: [
        { key: 'twitter', url: 'https://twitter.com/Eigen_Network' },
        { key: 'telegram', url: 'https://t.me/Eigen_Network' },
        { key: 'github', url: 'https://github.com/0xEigenLabs' },
      ],
      navList: [
        { key: 'Docs', url: 'https://0xEigenLabs.github.io/', _blank: true },
        { key: 'Home', url: '/' },
        { key: 'Privacy Policy', url: '/privacy' },
        { key: 'Whitepaper', url: 'https://0xEigenLabs.github.io/#/docs/whitepaper', _blank: true },
      ],
    }
  },
  methods: {
    openPage(url) {
      window.open(url, '_blank');
    },
    handleCommand(record) {
      console.log(record)
    },
  },
}
</script>
<style lang="scss" scoped>
  @import 'index';
</style>