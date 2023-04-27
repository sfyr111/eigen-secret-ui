import Vuex from 'vuex'
import Vue from "vue";

Vue.use(Vuex)

const SECRET_INFO_INIT = {
    signer: null,
    address: null,
    sdk: null,
    secretAccount: null,
}

const index = new Vuex.Store({
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
    return index.state?.secretInfo?.signer
}

export function getAddress() {
    return index.state?.secretInfo?.address
}

export function getSdk() {
    return index.state?.secretInfo?.sdk
}

export function getSecretAccount() {
    return index.state?.secretInfo?.secretAccount
}

export function setSigner(signer) {
    index.commit('setSigner', signer)
}

export function setAddress(address) {
    index.commit('setAddress', address)
}

export function setSdk(sdk) {
    index.commit('setSdk', sdk)
}

export function setSecretAccount(secretAccount) {
    index.commit('setSecretAccount', secretAccount)
}

export default index


