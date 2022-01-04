import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import useERC20 from 'hooks/useERC20';
import { ethers } from 'ethers';
import { SCANNER_PATH } from 'utils/constants';

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
      const blockScannerURL = SCANNER_PATH + safeStringAddress;
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

  return (
    <div className="flex items-center justify-center px-6 py-10 max-w-screen">
      <div className="max-w-2xl bg-white shadow-lg rounded-lg border-2 border-gray-200 w-full">
        {!token && (
          <div className="h-60 flex items-center justify-center w-full">
            <svg
              className="animate-spin ml-3 mr-3 h-8 w-8 text-green-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}
        {token && (
          <div className="flex flex-col px-6 py-10 space-y-3 break-words w-full">
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
              Checkout on Polyscan &rarr;
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Token;
