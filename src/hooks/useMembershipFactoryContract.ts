import { useWallet } from 'wallet/state';
import useContract from './useContract';
import membershipFactoryAbi from '../constants/abis/MembershipFactory.json';
import { MEMBERSHIP_FACTORY_CONTRACT_ADDRESS } from '../constants/contracts';

export default () => {
  const [state] = useWallet();
  const contract = useContract(MEMBERSHIP_FACTORY_CONTRACT_ADDRESS[state.network], membershipFactoryAbi);

  return contract;
};
