import ethers from 'ethers';
import BoxesAbi from '../constants/abis/Boxes.json';
import { BOXES_ADDRESS } from '../utils/constants';

export async function fetch() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  if (!signer) {
    return;
  }
  const from = await signer.getAddress();
  const network = await provider.getNetwork();
  if (network.chainId !== 4) {
    return;
  }

  const forwarder = new ethers.Contract(BOXES_ADDRESS, BoxesAbi, provider);
  return forwarder.getValue(from).then((value) => value.toString());
}
