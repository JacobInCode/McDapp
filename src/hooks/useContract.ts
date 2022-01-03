import { useWallet } from 'wallet/state';
import { Contract, ContractInterface } from '@ethersproject/contracts';
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

  return new Contract(contractAddress, abi, signed ? provider.getSigner() : provider);
};
