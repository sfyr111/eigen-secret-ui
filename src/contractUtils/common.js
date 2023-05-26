import spongePoseidonContract from "../artifacts/SpongePoseidon.json";
import tokenRegistryContract from "../artifacts/TokenRegistry.json";
import rollupContract from "../artifacts/Rollup.json";
import testTokenContract from "../artifacts/TestToken.json";
import SMT from "../artifacts/SMT.json";
import defaultContractFile from "../artifacts/contract.json"

// export const defaultAccountFile = path.join(__dirname, "../.account.json")
export const defaultCircuitPath = "../circuits/";
export const defaultServerEndpoint = "http://127.0.0.1:3000";

export { defaultContractFile };

export const defaultContractABI = {
    spongePoseidonContractABI: spongePoseidonContract.abi,
    tokenRegistryContractABI: tokenRegistryContract.abi,
    rollupContractABI: rollupContract.abi,
    testTokenContractABI: testTokenContract.abi,
    smtVerifierContractABI: SMT.abi
};

// export const accountFile = (alias) => {
//     return `${defaultAccountFile}.${alias}`;
// }
