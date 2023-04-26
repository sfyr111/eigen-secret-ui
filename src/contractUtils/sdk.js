import {SecretAccount} from "@eigen-secret/core/dist-browser/account";
import {SecretSDK} from "@eigen-secret/core/dist-browser/sdk";
import {buildEddsa} from "circomlibjs";
import {
    defaultCircuitPath,
    defaultContractABI,
    defaultContractFile as contractJson,
    defaultServerEndpoint
} from "./common";
import {getSdk, setSdk, setSecretAccount} from "@/utils/store";
import {Buffer} from "buffer";
import createBlakeHash from "blake-hash";


export async function buildSdk(alias, signer, account) {
    let sdk = getSdk()
    if (sdk != null) {
        return sdk;
    }
    const eddsa = await buildEddsa();

    const key = createBlakeHash("blake256").update(Buffer.from('<your password>')).digest();
    const sa = SecretAccount.deserialize(eddsa, key, account); // .account.json.Alice

    let secretSDK = new SecretSDK(
        sa,
        defaultServerEndpoint,
        defaultCircuitPath,
        eddsa,
        signer,
        contractJson.spongePoseidon,
        contractJson.tokenRegistry,
        contractJson.poseidon2,
        contractJson.poseidon3,
        contractJson.poseidon6,
        contractJson.rollup,
        contractJson.smtVerifier
    );
    await secretSDK.initialize(defaultContractABI);
    setSecretAccount(sa)
    setSdk(secretSDK)
    return getSdk()
}

