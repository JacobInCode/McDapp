import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import useERC20 from 'hooks/useERC20';
import { ethers } from 'ethers';

type Token = {
  name: string;
  symbol: string;
  supply: string;
  contractAddress: string;
  ownerAddress: string;
  blockScannerURL: string;
};

const Token = () => {
  const router = useRouter();
  const { address } = router.query;
  const [token, setToken] = useState<Token>();
  const erc20Contract = useERC20(address?.toString());

  const getToken = async () => {
    const safeStringAddress = address.toString();

    try {
      const name = await erc20Contract.name();
      const symbol = await erc20Contract.symbol();
      const supply = await erc20Contract.totalSupply();
      const ownerAddress = await erc20Contract.owner();
      const blockScannerURL = 'https://www.goerli.etherscan.io/address/' + safeStringAddress;
      setToken({
        name,
        symbol,
        supply: ethers.utils.formatEther(supply),
        contractAddress: safeStringAddress,
        ownerAddress,
        blockScannerURL,
      });
    } catch (error) {
      console.log('ERROR', error.message);
    }
  };

  useEffect(() => {
    if (!address) {
      return;
    }
    getToken();
  }, [address]);

  if (!token) {
    return (
      <div className="flex items-center justify-center px-6 py-10 max-w-screen">
        <div>loading...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center px-6 py-10 max-w-screen">
      <div className="flex flex-col px-6 py-10 space-y-3 max-w-screen bg-white shadow-lg rounded-lg border-2 border-gray-200">
        <div>
          <strong>Name: </strong>
          {token.name}
        </div>
        <div>
          <strong>Symbol: </strong>
          {token.symbol}
        </div>
        <div>
          <strong>Total Supply: </strong>
          {token.supply}
        </div>
        <div>
          <strong>Contract Address: </strong>
          {token.contractAddress}
        </div>
        <div>
          <strong>Owner Address: </strong>
          {token.ownerAddress}
        </div>
        <a href={token.blockScannerURL} target="_blank" className="underline font-bold">
          Checkout on Etherscan &rarr;
        </a>
      </div>
    </div>
  );
};

export default Token;
