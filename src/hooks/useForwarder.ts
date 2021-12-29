import { useWallet } from 'wallet/state';
import useContract from './useContract';
import ForwarderAbi from '../constants/abis/Forwarder.json';
import { FORWARDER_ADDRESS } from 'utils/constants';

export default () => {
  const [state] = useWallet();
  const contract = useContract(FORWARDER_ADDRESS, ForwarderAbi);

  return contract;
};
