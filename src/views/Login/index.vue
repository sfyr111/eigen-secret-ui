<template>
  <div class="page-login page-container">
    <div class="logo-box">
      <img class="logo" src="@/assets/header/logo.png">
    </div>
    <h1 class="login-des login-des-title">Trusted Encrypted Private Payments for You</h1>
    <div class="login-des">Welcome to Eigen zkPay! Connect a wallet to manage your data and transactions.</div>
    <div class="login-btn-box">
      <div class="login-btn" @click="login">
        <img src="~@/assets/metamask.png" class="metamask-icon">
        <p class="metamask-text">Login with MetaMask</p>
      </div>
    </div>
    <p class="login-des">Don't have an account yet? <span class="sign-up" @click="toLogin">Sign up now</span></p>
  </div >
</template>

<script>

import {createSecretAccount} from "@/contractUtils/account";
import {connectMetaMask} from "@/contractUtils/metaMask";
import secretManager from '@/SecretManager/SecretManager';
import {getSecretAccount, getSigner, getAddress, getSecretManager} from "@/store";

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
  name: 'login-page',
  data() {
    return {
      user: null, // todo to store
    }
  },
  methods: {
    async login() {
      if (!this.user) {
        this.user = await connectMetaMask();
      }
      const eloading = this.$eloading('Registration in progress, please wait')
      try {
        await secretManager.initSDK({ alias: 'Alice', user: this.user });
        this.$emit('create-end')
      } catch (e) {
        console.error(e)
      } finally {
        eloading.close()
      }

    },
    toLogin() {
      this.$router.push('/LoginStep')
    },
    async connect() {
      // await connectMetaMask();
      // let secretManager = getSecretManager();
      // await secretManager.initSDK({alias: 'EIGEN_BUILTIN_PLACEHOLDER', password: '12356', user: getSigner()})
      //   this.$router.push('/dashboard')
      //} else {
        // todo 弹出error
      //}

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

