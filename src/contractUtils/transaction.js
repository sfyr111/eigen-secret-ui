import {ethers} from "ethers";
import {defaultContractABI} from "./common";

import {buildSdk} from "./sdk";

export async function deposit(alias, assetId, value) {
    let {secretSDK, ctx, sa} = buildSdk(alias);
    let nonce = 0; // TODO: get nonce from Metamask
    let receiver = sa.accountKey.pubKey.pubKey;
    // get tokenAddress by asset id
    let tokenAddress = await secretSDK.getRegisteredToken(BigInt(assetId))
    console.log("token", tokenAddress.toString());
    // approve
    let approveTx = await secretSDK.approve(tokenAddress.toString(), value);
    await approveTx.wait();
    let proofAndPublicSignals = await secretSDK.deposit(ctx, receiver, BigInt(value), Number(assetId), nonce);
    console.log(proofAndPublicSignals);
}

export async function send(alias, receiver, receiverAlias, assetId) {
    let {secretSDK, ctx} = buildSdk(alias);
    // let _receiver = sa.accountKey.pubKey.pubKey;
    let proofAndPublicSignals = await secretSDK.send(ctx, receiver, receiverAlias, BigInt(value), Number(assetId));
    console.log(proofAndPublicSignals);
}

export async function getBalance(alias, assetId) {
    let {secretSDK, ctx, signer} = buildSdk(alias);
    let balance = await secretSDK.getNotesValue(ctx, assetId);
    console.log("L2 balance", balance.toString());
    let address = await secretSDK.getRegisteredToken(BigInt(assetId));
    let tokenIns = new ethers.Contract(
        address,
        defaultContractABI.testTokenContractABI,
        signer
    );
    balance = await tokenIns.balanceOf(signer.getAddress());
    console.log("L1 balance", balance.toString());
}
