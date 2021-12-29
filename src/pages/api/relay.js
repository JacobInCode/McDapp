import { Relayer } from 'defender-relay-client';
import { ethers } from 'ethers';
import ForwarderAbi from '../../constants/abis/Forwarder.json';

import { TypedDataUtils } from 'eth-sig-util';
import { bufferToHex } from 'ethereumjs-util';
import { RELAYER_API_KEY, RELAYER_SECRET_KEY, FORWARDER_ADDRESS } from '../../utils/constants';

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
    chainId: 5,
    verifyingContract: FORWARDER_ADDRESS,
  },
  primaryType: 'ForwardRequest',
  types: {
    EIP712Domain: EIP712DomainType,
    ForwardRequest: ForwardRequestType,
  },
  message: {},
};

const GenericParams = 'address from,address to,uint256 value,uint256 gas,uint256 nonce,bytes data';
const TypeName = `ForwardRequest(${GenericParams})`;
const TypeHash = ethers.utils.id(TypeName);

const DomainSeparator = bufferToHex(TypedDataUtils.hashStruct('EIP712Domain', TypedData.domain, TypedData.types));
const SuffixData = '0x';

async function relay(request) {
  // Unpack request
  const { to, from, value, gas, nonce, data, signature } = request;

  // Validate request
  const provider = new ethers.providers.InfuraProvider('goerli', process.env.NEXT_PUBLIC_INFURA_ID);
  const forwarder = new ethers.Contract(FORWARDER_ADDRESS, ForwarderAbi, provider);
  const args = [{ to, from, value, gas, nonce, data }, DomainSeparator, TypeHash, SuffixData, signature];
  await forwarder.verify(...args);

  // Send meta-tx through Defender
  const forwardData = forwarder.interface.encodeFunctionData('execute', args);
  const relayer = new Relayer({ apiKey: RELAYER_API_KEY, apiSecret: RELAYER_SECRET_KEY });
  const tx = await relayer.sendTransaction({
    speed: 'fast',
    to: FORWARDER_ADDRESS,
    gasLimit: gas,
    data: forwardData,
  });

  console.log(`Sent meta-tx: ${tx.hash}`);
  return tx;
}

export default async function handler(req, res) {
  try {
    const response = await relay(req.body);
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ error: err });
  }
}
