<template>
  <div class="page-login page-container">
    <div class="login-des">Welcome to Eigen zkPay! Connect a wallet to manage your data and transactions.</div>
    <div class="login-btn-box">
      <div class="login-btn" @click="connectMetamask">
        <img src="~@/assets/metamask.png" class="metamask-icon">
        <p class="metamask-text">Register with MetaMask</p>
      </div>
    </div>
  </div>
</template>

<script>

import {createSecretAccount} from "@/contractUtils/account";
import {connectMetaMask} from "@/contractUtils/metaMask";
import {getSecretAccount, getSigner, getAddress, getSecretManager} from "@/store";
import { ethers } from 'ethers';

async function loadScriptFromBlob(blob) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const url = URL.createObjectURL(blob);
    script.src = url;
    script.type = 'text/javascript';
    script.onload = () => {
      URL.revokeObjectURL(url);
      resolve(window.wc); // Assuming the script sets a global variable named 'wc'
    };
    script.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load the script'));
    };
    document.head.appendChild(script);
  });
}

export default {
  name: 'register-page',

  data() {
    return {}
  },


  methods: {
    async connectMetamask() {
      const signer = await connectMetaMask();
      this.$emit('login-end', signer)
    },
    async connect() {
      await connectMetaMask();
      // todo 连接metamask没有错误且拿到address后，跳转到输入昵称注册页面
      let address = getAddress()
      if (address) {
        this.$emit('login-end', 1)
      } else {
        // todo 签名失败, 报错，不进入下一个页面

      }
    },
    async createAccount() {
      const batchproof = await createSecretAccount('abu')
      console.log(batchproof)
    },
    async createImport() {
      let wcUrl = `http://localhost:3000/public/main_update_state_js/witness_calculator.js`;
      console.log("Fetching witness_calculator.js from:", wcUrl);

      const response = await window.fetch(wcUrl);
      const wcContent = await response.text();

      const wcContentModified = wcContent.replace(/module\.exports\s*=/, 'window.wc =');

      const wcBlob = new Blob([wcContentModified], {type: 'text/javascript'});
      console.log("Created Blob with witness_calculator.js content:", wcBlob);

      try {
        await loadScriptFromBlob(wcBlob);
        const wc = window.wc;
        console.log("Imported witness_calculator.js, default export:", wc);
      } catch (err) {
        console.error('Error loading script:', err);
      }
    },
    metamaskLogin() {
      // console.log(Prover)
      // let secretSDK = new SecretSDK('')
      // console.log(secretSDK)
      // secretSDK.createAccount();
      this.$emit('login-end', 1)
      // this.$router.push('/dashboard')
    },
  },

  async mounted() {
  },

  created() {
    console.log('token')
  },

};
</script>
<style lang="scss" scoped>
@import 'index.scss';
</style>

