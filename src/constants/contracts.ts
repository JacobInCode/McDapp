export const NETWORKS: Record<string, number> = {
  mainnet: 1,
  matic: 137,
  ropsten: 3,
  rinkeby: 4,
  goerli: 5,
  mumbai: 80001,
};

export const MEMBERSHIP_FACTORY_CONTRACT_ADDRESS: Record<string, string> = {
  [NETWORKS.matic]: process.env.NEXT_PUBLIC_CONTRACT_ID,
  [NETWORKS.goerli]: process.env.NEXT_PUBLIC_CONTRACT_ID,
};
