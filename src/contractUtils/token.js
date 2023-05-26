import {ethers} from "ethers";
import {defaultContractABI} from "./common";

import {buildSdk} from "./sdk";


export async function sendL1(alias, value, receiver, assetId) {
    let {secretSDK} = buildSdk(alias);
    // get token address
    let address = await secretSDK.getRegisteredToken(BigInt(assetId));
    let tokenIns = new ethers.Contract(
        address,
        defaultContractABI.testTokenContractABI,
        signer
    );

    let tx = await tokenIns.transfer(receiver, BigInt(value));
    await tx.wait();

    let balance = await tokenIns.balanceOf(receiver);
    console.log("balance", balance.toString());
}

