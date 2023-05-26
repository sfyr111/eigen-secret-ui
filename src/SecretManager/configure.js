import * as spongePoseidonContract from "../artifacts/SpongePoseidon.json";
import * as tokenRegistryContract from "../artifacts/TokenRegistry.json";
import * as rollupContract from "../artifacts/Rollup.json";
import * as testTokenContract from "../artifacts/TestToken.json";
import * as SMT from "../artifacts/SMT.json";
import * as defaultContractFile from "../artifacts/contract.json";


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
