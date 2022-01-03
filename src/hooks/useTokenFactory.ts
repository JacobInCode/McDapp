import { useWallet } from 'wallet/state';
import useContract from './useContract';
import tokenFactoryAbi from '../constants/abis/TokenFactory.json';
import { TOKEN_CONTRACT_ADDRESS } from '../constants/contracts';

export default () => {
  const [state] = useWallet();
  const contract = useContract(TOKEN_CONTRACT_ADDRESS[state.network], tokenFactoryAbi, true);
  return contract;
};
