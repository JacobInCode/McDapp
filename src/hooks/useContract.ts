import { useWallet } from 'wallet/state';
import { ContractInterface } from '@ethersproject/contracts';
import { getContract } from '../utils/contract';

export default (contractAddress: string, abi: ContractInterface) => {
  const [state] = useWallet();

  if (!state?.web3?.provider || !contractAddress) {
    return null;
  }

  const contract = getContract(contractAddress, abi, state?.web3?.provider);

  return contract;
};
