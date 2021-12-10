import { createRaribleSdk } from '@rarible/protocol-ethereum-sdk';
import React, { createContext, Dispatch, useContext, useReducer } from 'react';
import { NETWORK_ID, NETWORK_NAME } from 'utils/constants';
import { ethers } from 'ethers';
import type { WalletAction } from './actions';
import reducer from './reducers';

export const initialState: WalletState = {
  balance: '-1',
  address: undefined,
  wallet: { name: '' },
  network: Number.parseInt(NETWORK_ID),
  web3: undefined,
  ens: undefined,
};

type WalletState = {
  balance: string;
  address: string;
  wallet: { name: string };
  network: number;
  web3?: ethers.providers.Web3Provider;
  ens: string;
};

const WalletContext = createContext<[WalletState, Dispatch<WalletAction>]>(null);
const useWallet = () => useContext(WalletContext);
const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <WalletContext.Provider value={[state, dispatch]}>{children}</WalletContext.Provider>;
};

export type { WalletState };
export { WalletProvider, useWallet };
