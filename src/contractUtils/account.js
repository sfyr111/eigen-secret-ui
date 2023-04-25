import {buildSdk} from "./sdk";
import {defaultContractFile as contractJson} from "./common";

export async function createSecretAccount(alias) {
    let {secretSDK, ctx, sa, accountKey} = await buildSdk(alias);
    let proofAndPublicSignals = await secretSDK.createAccount(ctx, sa.newSigningKey1, sa.newSigningKey2);

    console.log('createSecretAccount: ', proofAndPublicSignals)


    let assetId = await secretSDK.approveToken(contractJson.testToken);

    let receiver = accountKey.pubKey.pubKey;
    let proof1 = await secretSDK.send(ctx, receiver, alias, 2n, assetId);
    console.log("send proof", proof1);
    let balance2 = await secretSDK.getNotesValue(ctx, assetId);
    console.log(balance2)

    return proofAndPublicSignals
    // ...
}






