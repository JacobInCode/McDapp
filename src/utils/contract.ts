import { Web3Provider, ExternalProvider, JsonRpcFetchFunc } from '@ethersproject/providers';
import { Contract, ContractInterface } from '@ethersproject/contracts';

export const getContract = (contractAddress: string, abi: ContractInterface, provider: Web3Provider) => {
  const signer = provider.getSigner();
  return new Contract(contractAddress, abi, signer);
};
