import { ethers } from 'ethers';
import BoxesAbi from '../constants/abis/Boxes.json';
import ForwarderAbi from '../constants/abis/Forwarder.json';
import { BOXES_ADDRESS, FORWARDER_ADDRESS, NETWORK_ID } from '../utils/constants';

const EIP712DomainType = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'chainId', type: 'uint256' },
  { name: 'verifyingContract', type: 'address' },
];

const ForwardRequestType = [
  { name: 'from', type: 'address' },
  { name: 'to', type: 'address' },
  { name: 'value', type: 'uint256' },
  { name: 'gas', type: 'uint256' },
  { name: 'nonce', type: 'uint256' },
  { name: 'data', type: 'bytes' },
];

const TypedData = {
  domain: {
    name: 'Defender',
    version: '1',
    chainId: NETWORK_ID,
    verifyingContract: FORWARDER_ADDRESS,
  },
  primaryType: 'ForwardRequest',
  types: {
    EIP712Domain: EIP712DomainType,
    ForwardRequest: ForwardRequestType,
  },
  message: {},
};

export async function submit(number, from, provider, nonce) {
  // Initialize provider and signer from metamask
  // await window.ethereum.enable();
  // const provider = new ethers.providers.Web3Provider(window.ethereum);
  // const signer = provider.getSigner();
  // const from = await signer.getAddress();
  // const network = await provider.getNetwork();
  // if (network.chainId !== 4) {
  //   throw new Error('Must be connected to Rinkeby');
  // }

  // Get nonce for current signer

  console.log("HERE 2", nonce)

  // Encode meta-tx request
  const boxesInterface = new ethers.utils.Interface(BoxesAbi);
  const data = boxesInterface.encodeFunctionData('setValue', [number]);
  const request = {
    from,
    to: BOXES_ADDRESS,
    value: 0,
    gas: 1e6,
    nonce: nonce.toNumber(),
    data,
  };
  const toSign = { ...TypedData, message: request };

  // Directly call the JSON RPC interface, since ethers does not support signTypedDataV4 yet
  // See https://github.com/ethers-io/ethers.js/issues/830
  const signature = await provider.send('eth_signTypedData_v4', [from, JSON.stringify(toSign)]);

  // Send request to the server
  const response = await fetch('/api/relay', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...request, signature }),
  }).then((r) => r.json());

  return response;
}
