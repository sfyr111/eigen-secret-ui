import { ethers } from "ethers";
import { rawMessage, signEOASignature } from "@eigen-secret/core/dist-browser/utils";
import {setSigner, setAddress, getSigner, getAddress} from "@/store";

export async function connectMetaMask() {
  if (typeof window.ethereum !== 'undefined') {
    await window.ethereum.request({ method: 'eth_requestAccounts' }); // Request account access
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
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
  const timestamp = Math.floor(Date.now()/1000).toString();
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


