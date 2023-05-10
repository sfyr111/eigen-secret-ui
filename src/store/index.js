import Vuex from 'vuex'
import Vue from "vue";
import { ethers } from "ethers";
import SecretManager from "@/SecretManager/SecretManager";

Vue.use(Vuex)

const SECRET_INFO_INIT = {
    alias: '',
    signer: null,
    address: null,
    sdk: null,
    secretAccount: null,
    secretManager: null,
}

const index = new Vuex.Store({
    state() {
        return {
            secretInfo: SECRET_INFO_INIT,
        }
    },
    mutations: {
        setAlias(state, n) {
            state.secretInfo.alias = n;
        },
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
        },
        setSecretManager(state, n) {
            state.secretInfo.secretManager = n
        }
    }
})

export function getAlias() {
    return index.state?.secretInfo?.alias
}

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

export function setAlias(alias) {
    index.commit('setAlias', alias)
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


export function setSecretManager(secretManager) {
    index.commit('setSecretManager', secretManager)
}

export function getSecretManager() {
    let secretManager = index.state?.secretInfo?.secretManager
    if (!secretManager) {
        secretManager = new SecretManager()
        setSecretManager(secretManager)
    }
    return secretManager
}


export default index


