import { useWallet } from 'wallet/state';
import { ContractInterface } from '@ethersproject/contracts';
import { getContract } from '../utils/contract';
import { Web3Provider } from '@ethersproject/providers';

export default (contractAddress: string, abi: ContractInterface, signed?: boolean) => {
  const [state] = useWallet();

  let provider = state?.external;

  if (!state?.external || !contractAddress) {
    return null;
  }

  if (signed && !state?.web3?.provider) {
    return null;
  }

  if (signed && state?.web3?.provider) {
    provider = new Web3Provider(state?.web3?.provider);
  }

  const contract = getContract(contractAddress, abi, provider);

  return contract;
};
