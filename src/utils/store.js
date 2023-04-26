import Vuex from 'vuex'
import Vue from "vue";

Vue.use(Vuex)

const SECRET_INFO_INIT = {
    signer: null,
    address: null,
    sdk: null,
    secretAccount: null,
}

const store = new Vuex.Store({
    state() {
        return {
            secretInfo: SECRET_INFO_INIT,
        }
    },
    mutations: {
        setSecretInfo(state, n) {
            state.secretInfo = n
        },
        setSigner(state, n) {
            state.secretInfo.signer = n
        },
        setAddress(state, n) {
            state.secretInfo.address = n
        },
        setSdk(state, n) {
            state.secretInfo.sdk = n
        },
        setSecretAccount(state, n) {
            state.secretInfo.secretAccount = n
        }
    }
})


export function getSigner() {
    return store.state?.secretInfo?.signer
}

export function getAddress() {
    return store.state?.secretInfo?.address
}

export function getSdk() {
    return store.state?.secretInfo?.sdk
}

export function getSecretAccount() {
    return store.state?.secretInfo?.secretAccount
}

export function setSigner(signer) {
    store.commit('setSigner', signer)
}

export function setAddress(address) {
    store.commit('setAddress', address)
}

export function setSdk(sdk) {
    store.commit('setSdk', sdk)
}

export function setSecretAccount(secretAccount) {
    store.commit('setSecretAccount', secretAccount)
}

export default store


