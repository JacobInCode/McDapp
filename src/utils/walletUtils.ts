import Onboard from 'bnc-onboard';
import { WalletAction } from 'wallet/actions';
import { ethers } from 'ethers';
import { NETWORK_ID, INFURA_KEY } from './constants';

let onboard: ReturnType<typeof Onboard>;

// the network id that your dapp runs on
const wallets = [
  { walletName: 'metamask', preferred: true },
  {
    walletName: 'walletConnect',
    infuraKey: INFURA_KEY,
  },
];

// initialize onboard
const initOnboard = (subscriptions) =>
  Onboard({
    hideBranding: true,
    darkMode: true,
    networkId: Number.parseInt(NETWORK_ID),
    subscriptions,
    walletSelect: { wallets },
    walletCheck: [{ checkName: 'connect' }, { checkName: 'network' }, { checkName: 'balance' }],
  });

export function getOnboard(dispatch: React.Dispatch<WalletAction>): ReturnType<typeof Onboard> {
  if (!onboard) {
    onboard = initOnboard({
      address: async (address) => {
        dispatch({
          type: 'SET_ADDRESS',
          payload: address,
        });
      },
      network: (network) => {
        dispatch({
          type: 'SET_NETWORK',
          payload: network,
        });
      },
      balance: (balance) => {
        dispatch({
          type: 'SET_BALANCE',
          payload: balance,
        });
      },
      wallet: (wallet) => {
        let ethersProvider;
        if (wallet && wallet.name) {
          ethersProvider = new ethers.providers.Web3Provider(wallet.provider);
          localStorage.setItem('walletName', wallet.name);
        }
        dispatch({
          type: 'SET_WALLET',
          payload: wallet,
        });
        dispatch({
          type: 'SET_WEB3',
          payload: ethersProvider,
        });
      },
    } as Pick<Parameters<typeof Onboard>[0], 'subscriptions'>);
  }
  return onboard;
}
