import {buildSdk} from "./sdk";
import {buildCtx} from "@/contractUtils/metaMask";
import {getSecretAccount, getSigner} from "@/utils/store";


export async function createSecretAccount(alias) {

    const assetId = 2
    const Alice = "Alice"
    const AliceAccount = "CKCRW1G+fKMxEVg9fKukRPitQFq4X7qNYZRk/BGfQBRkUYzsjUrNavs6jnttApm8qNZ0g45df4pr05syJZsVGj8bf5M6ERJYcgvE3U2w6iwfe53jkx9m724MCsB0MincSvdTDSAErxn80XRjvX6qaIBhU7sdcJ9ZUiJus6ZOpMM7jQCDaefVyx5h8cJagc8UX6IlsDjM6zZQuH3/OgDLKCMO2nPyJntinS9lWsBmHIRLmgQxSfpvRkbcSmdDSaRXBbkqYkOpH8O1RrK/uYw2+FyefHUkb1Zob/1GD0aooQqAg/pB4uFuQkdIPAuXKVmFhnZM8Zv8Ja9wDKaOV+dZHVhx8ciMIFgVydnpzhkRmB5mtZ+WNziujL0Klqg9GGEKnzWVdKwkCmOIth+pt6qVhHLqEJf+jc9wdTQSEq80Yvk=,1c8eed5455318bcf7c461f3e,f03ae7106aa3dbae77bb2d2b16814416";

    let ctx = await buildCtx(alias)
    let sdk = await buildSdk(alias, getSigner(), AliceAccount)
    const sa = getSecretAccount();
    const proofAndPublicSignals = await sdk.createAccount(ctx, sa.newSigningKey1, sa.newSigningKey2);
    console.log(proofAndPublicSignals)
    return proofAndPublicSignals;
    // ...
}






