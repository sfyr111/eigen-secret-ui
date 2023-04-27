import {ethers} from "ethers";
import {defaultContractABI} from "./common";

import {buildSdk} from "./sdk";
import {buildCtx} from "@/contractUtils/metaMask";
import {getAddress, getSecretAccount, getSigner} from "@/utils/store";

export async function deposit(alias, assetId, value, AliceAccount) {
    let ctx = await buildCtx(alias)
    let secretSDK = await buildSdk(alias, getSigner(), AliceAccount)
    const sa = getSecretAccount();

    const nonce = 0; // TODO: get nonce from Metamask
    const receiver = sa.accountKey.pubKey.pubKey;

    // get tokenAddress by asset id
    const tokenAddress = await secretSDK.getRegisteredToken(BigInt(assetId)) // todo return 0x0000000000000000000000000000000000000000
    console.log("token", tokenAddress.toString());

    // approve
    const approveTx = await secretSDK.approve(tokenAddress.toString(), value);
    await approveTx.wait();

    const proofAndPublicSignals = await secretSDK.deposit(ctx, receiver, BigInt(value), Number(assetId), nonce);
    console.log(proofAndPublicSignals);
}

export async function send(alias, AliceAccount, receiver, receiverAlias, assetId, value) {
    let ctx = await buildCtx(alias)
    let secretSDK = await buildSdk(alias, getSigner(), AliceAccount)
    // let _receiver = sa.accountKey.pubKey.pubKey;
    let proofAndPublicSignals = await secretSDK.send(ctx, receiver, receiverAlias, BigInt(value), Number(assetId));
    console.log(proofAndPublicSignals);
}


export async function sendL1(alias, AliceAccount, assetId, BobAddress) {
    const admin = getSigner();

    let secretSDK = await buildSdk(alias, getSigner(), AliceAccount)

    // get token address
    const tokenAddress = await secretSDK.getRegisteredToken(BigInt(assetId));
    const tokenIns = new ethers.Contract(
        tokenAddress,
        defaultContractABI.testTokenContractABI,
        admin
    );

    const tx = await tokenIns.transfer(BobAddress, BigInt(value));
    await tx.wait();

    const balance = await tokenIns.balanceOf(BobAddress);
    console.log("sendL1 balance", balance.toString());
}


export async function withdraw(AliceAccount,assetId) {
    let ctx = await buildCtx(alias)
    let secretSDK = await buildSdk(alias, getSigner(), AliceAccount)

    let receiver = getSecretAccount().accountKey.pubKey.pubKey;
    let proofAndPublicSignals = await secretSDK.withdraw(ctx, receiver, BigInt(value), Number(assetId));
    console.log(proofAndPublicSignals);
    await secretSDK.submitProof(ctx, proofAndPublicSignals);
}


export async function getBalance(alias, assetId, AliceAccount) {
    let ctx = await buildCtx(alias)
    let secretSDK = await buildSdk(alias, getSigner(), AliceAccount)

    let balance = await secretSDK.getNotesValue(ctx, assetId);
    console.log("L2 balance", balance.toString());

    const secretAddress = await secretSDK.getRegisteredToken(BigInt(assetId));
    const tokenIns = new ethers.Contract(
        secretAddress,
        defaultContractABI.testTokenContractABI,
        getSigner()
    );

    balance = await tokenIns.balanceOf(getAddress());
    console.log("L1 balance", balance.toString());
}

export async function getTransactions(page, pageSize, alias, aliceAccount) {
    let ctx = await buildCtx(alias)
    let secretSDK = await buildSdk(alias, getSigner(), aliceAccount)
    return secretSDK.getTransactions(ctx, {page, pageSize})
}



