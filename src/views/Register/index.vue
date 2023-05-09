<template>
  <div class="page-login page-container">
    <div class="login-des">Welcome to Eigen zkPay! Connect a wallet to manage your data and transactions.</div>
    <div class="login-btn-box">
      <div class="login-btn" @click="connectMetamask">
        <img src="~@/assets/metamask.png" class="metamask-icon">
        <p class="metamask-text">Register with MetaMask</p>
      </div>
    </div>

    <AlertDialog
        :dialogDes="dialogObject.dialogDes"
        :dialogType="dialogObject.dialogType"
        :dialogVisible.sync="dialogObject.dialogVisible"
        :dialogBtnTxt="dialogObject.dialogBtnTxt"
    />

  </div>
</template>

<script>

import {createSecretAccount} from "@/contractUtils/account";
import AlertDialog from '@/components/AlertDialog/index';
import {connectMetaMask, doConnectMetaMask} from "@/contractUtils/metaMask";
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
  components: {
    AlertDialog
  },
  data() {
    return {
      dialogObject: {
        dialogDes: null,
        dialogType: 1,
        dialogVisible: false,
        dialogBtnTxt: 'confirm',
      },
    }
  },


  methods: {
    showAlert(dialogDes, dialogType) {
      this.dialogObject.dialogDes = dialogDes ? dialogDes : 'System error'
      this.dialogObject.dialogType = dialogType
      this.dialogObject.dialogVisible = true
    },
    async connectMetamask() {
      const data = await doConnectMetaMask();
      if (data.errno == 0) {
        this.$emit('login-end', data.data)
      } else {
        this.showAlert(data.message, 2)
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

