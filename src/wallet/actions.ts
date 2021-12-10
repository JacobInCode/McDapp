import { ethers } from 'ethers';

export type WalletAction = SET_ADDRESS | SET_NETWORK | SET_BALANCE | SET_WALLET | SET_WEB3 | SET_ENS | RESET;

type SET_ADDRESS = {
  type: 'SET_ADDRESS';
  payload: string;
};

type SET_NETWORK = {
  type: 'SET_NETWORK';
  payload: number;
};

type SET_BALANCE = {
  type: 'SET_BALANCE';
  payload: string;
};

type SET_WALLET = {
  type: 'SET_WALLET';
  payload: {
    name: string;
  };
};

type SET_WEB3 = {
  type: 'SET_WEB3';
  payload: ethers.providers.Web3Provider;
};

type SET_ENS = {
  type: 'SET_ENS';
  payload: string;
};

type RESET = {
  type: 'RESET';
};
