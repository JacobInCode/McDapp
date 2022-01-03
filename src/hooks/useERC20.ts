import useContract from './useContract';
import erc20Abi from '../constants/abis/ERC20.json';

export default (address: string) => {
  const contract = useContract(address, erc20Abi);

  return contract;
};
