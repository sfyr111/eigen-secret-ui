import Vue from 'vue'
import App from './App.vue'
import router from './router';
import ElementUI from "element-ui"
import "element-ui/lib/theme-chalk/index.css"
import 'vant/lib/index.css'
import locale from 'element-ui/lib/locale/lang/en'
import store from "@/store";
import {hideAddress} from "@/utils/common";
import {ErrCode} from '@eigen-secret/core/dist-browser/error';

Vue.use(ElementUI, {locale});

Vue.config.productionTip = false
Vue.prototype.$eventBus = new Vue()
Vue.prototype.$hideAddress = hideAddress;
Vue.prototype.$errCode = ErrCode

Vue.prototype.$eloading = function (txt) {
    const loading = this.$loading({
        lock: true,
        text: txt,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
    });
    return loading
}

// Listen to network changes
window.ethereum && window.ethereum.on('chainChanged', async (_chainId) => {
    window.location.reload();
});

new Vue({
    store,
    router,
    render: h => h(App),
}).$mount('#app')
