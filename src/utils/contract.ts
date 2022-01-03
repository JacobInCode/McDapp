import { Web3Provider, ExternalProvider, JsonRpcFetchFunc, JsonRpcProvider } from '@ethersproject/providers';
import { Contract, ContractInterface } from '@ethersproject/contracts';

export const getContract = (
  contractAddress: string,
  abi: ContractInterface,
  externalProvider: Web3Provider | JsonRpcProvider
) => {
  return new Contract(contractAddress, abi, externalProvider);
};
