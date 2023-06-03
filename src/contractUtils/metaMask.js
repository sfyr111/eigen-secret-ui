import {ethers} from "ethers";
import {rawMessage, signEOASignature} from "@eigen-secret/core/dist-browser/utils";
import {getAddress, getSigner} from "@/store";
import NET_WORK_CONFIG from "@/enableNetWorkConfig"

export async function doConnectMetaMask() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            let signer = await connectMetaMask()
            return {
                errno: 0,
                data: signer
            }
        } catch (e) {
            console.error(e)
            if (e.message.indexOf('user rejected signing') > -1) {
                return {
                    errno: -2,
                    message: 'user rejected signing'
                }
            } else {
                return {
                    errno: -1,
                    message: e.message
                }
            }
        }
    } else {
        return {
            errno: -3,
            message: 'MetaMask not found'
        }
    }
}

export async function connectMetaMask() {
    if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({method: 'eth_requestAccounts'}); // Request account access
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        // Get current network chainId
        const network = await provider.getNetwork();
        console.log('current network is: ', network)
        const currentChainId = network.chainId;

        const supportedChainIds = Object.keys(NET_WORK_CONFIG).map(Number);
        const supportedChains = Object.values(NET_WORK_CONFIG).map(network => network.name);
        const supportedChainNames = supportedChains.join(', ');

        // Check if current network is Mumbai, Polygon Mainnet, or Hardhat Local Network
        if (!supportedChainIds.includes(currentChainId)) {
            throw new Error(`Please switch to one of the following networks: ${supportedChainNames}`);
        }

        const signer = provider.getSigner();
        const address = await signer.getAddress();
        signer.address = address
        signer.userAddress = address
        console.log(address)
        return signer;
    } else {
        console.error('MetaMask not found');
    }
}

export async function buildCtx(alias) {
    if (getSigner() == null) {
        await connectMetaMask()
    }
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = await signEOASignature(getSigner(), rawMessage, getAddress(), alias, timestamp);
    const ctx = {
        alias: alias,
        ethAddress: getAddress(), // hardhat node address
        rawMessage: rawMessage,
        timestamp: timestamp,
        signature: signature
    };
    return ctx
}


