<template>
  <div class="page-login page-container">
    <div class="logo-box">
      <img class="logo" src="@/assets/header/logo.png">
    </div>
    <h1 class="login-des login-des-title">Eigen Secret: Simple Private Transaction</h1>
    <div class="login-des">Welcome to Eigen Secret! Connect a wallet to manage your data and transactions.</div>
    <div class="login-btn-box">
      <div class="login-btn" @click="login">
        <img src="~@/assets/metamask.png" class="metamask-icon">
        <p class="metamask-text">Login with MetaMask</p>
      </div>
    </div>
    <p class="login-des">Don't have an account yet? <span class="sign-up" @click="toLogin">Sign up now</span></p>


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
import {connectMetaMask} from "@/contractUtils/metaMask";
import secretManager from '@/SecretManager/SecretManager';
import AlertDialog from '@/components/AlertDialog/index';
import { getSigner, setSigner, setAddress, setAlias, setSdk } from "@/store";
import { __DEFAULT_ALIAS__ } from "@eigen-secret/core/dist-browser/utils";

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
  components: {
    AlertDialog
  },
  data() {
    return {
      user: null, // todo to store
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
    async login() {
      const eloading = this.$eloading('Login in progress, please wait')
      if (!getSigner()) {
        try {
          this.user = await connectMetaMask();
          setSigner(this.user)
        } catch (e) {
          console.log('e.message ', e.message)
          if (e.message.indexOf('user rejected signing')) {
            this.showAlert('Unable to link your account. Please try again.', 2)
          } else {
            this.showAlert(null, 2)
          }
          eloading.close()
          return
        }
      }
      secretManager.initSDK({alias: __DEFAULT_ALIAS__, user: getSigner()}).then((res) => {
        if (res.errno == 0) {
          console.log('login res data ', res)
          setSdk(res.data)
          setAlias(res.data.alias)
          // // init signer
          // secretManager.initSignature({alias: __DEFAULT_ALIAS__, user: getSigner()})
          this.$router.push('/dashboard')
        } else {
          this.showAlert(res.message, 2)
        }
      }).catch(e => {
        if (e.message.indexOf('user rejected signing') != -1) {
          this.showAlert('Unable to link your account. Please try again.', 2)
        } else {
          this.showAlert(null, 2)
        }
        console.error(e)
      }).finally(() => {
        eloading.close()
      })
      // try {
      //   await secretManager.initSDK({ alias: 'EIGEN_BUILTIN_PLACEHOLDER', user: this.user });
      //   this.$emit('create-end')
      // } catch (e) {
      //   console.error(e)
      // } finally {
      //   eloading.close()
      // }
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
    this.user = getSigner()
    console.log('token')
  },

};
</script>
<style lang="scss" scoped>
@import 'index.scss';
</style>

