import { useWallet } from 'wallet/state';
import useContract from './useContract';
import merkleDistributorAbi from '../constants/abis/MerkleDistributor.json';
import { MERKLE_CONTRACT_ADDRESS } from '../constants/contracts';

export default () => {
  const [state] = useWallet();
  const contract = useContract(MERKLE_CONTRACT_ADDRESS[state.network], merkleDistributorAbi);

  return contract;
};
