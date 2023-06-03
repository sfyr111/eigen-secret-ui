import NET_WORK_CONFIG from "./NET_WORK_CONFIG.json";

// Filter and extract enabled networks with non-empty contracts
const enabledNetworks = Object.fromEntries(
  Object.entries(NET_WORK_CONFIG).filter(([chainId, network]) => network.enable === 1 && Object.keys(network.contract).length > 0)
);

export default enabledNetworks;
