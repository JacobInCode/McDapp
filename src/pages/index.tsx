import React, { useCallback, useState } from 'react';
import useMerkleContract from '../hooks/useMerkleContract';
import { shortenAddress } from '../utils/address';
import { getOnboard } from 'utils/walletUtils';
import { useWallet } from 'wallet/state';
import { utils } from 'ethers';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

const users = [{ address: '0xDdeFbEA65E0520fC31470d3f92133a71A96b1641', amount: 10 }];

const elements = users.map((x) => utils.solidityKeccak256(['address', 'uint256'], [x.address, x.amount]));

const Home: React.FunctionComponent = () => {
  const merkleContract = useMerkleContract();
  const [state, dispatch] = useWallet();
  const [address, setAddress] = useState<string | undefined>();
  const [amount, setAmount] = useState<number | undefined>();
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [claimed, setClaimed] = useState<boolean>(false);
  const merkleTree = new MerkleTree(elements, keccak256, { sort: true });

  const handleWallet = useCallback(async () => {
    const onboard = getOnboard(dispatch);

    const selected = await onboard.walletSelect(localStorage.getItem('walletName'));
    if (selected) {
      await onboard.walletCheck();
    }
  }, []);

  // useEffect(() => {
  //   const root = merkleTree.getHexRoot();
  //   console.log(root);
  // }, []);

  const claim = async (address) => {
    const indexOf = users.map((user) => user.address.toLowerCase()).indexOf(address);

    if (indexOf === -1) {
      return;
    }

    const leaf = elements[indexOf];
    const proof = merkleTree.getHexProof(leaf);
    try {
      setError(false);
      setLoading(true);
      const tx = await merkleContract.claim(users[indexOf].address, users[indexOf].amount, proof);
      // const rc = await tx.wait(); // 0ms, as tx is already confirmed
      // const event = rc.events.find(
      //   (event) => event.event === 'Claimed' && event.args[0].toLowerCase() === address.toLowerCase()
      // );
      setAmount(users[indexOf].amount);
      setLoading(false);
      setClaimed(true);
      console.log('EVENT', event);
    } catch (error) {
      setError(true);
      setLoading(false);
      console.log('ERROR', error);
    }
  };

  const submit = (e) => {
    e.preventDefault();

    if (!state.address) {
      handleWallet();
      return;
    }

    if (!address) {
      return;
    }

    claim(state.address);
  };

  return (
    <div className="flex items-center justify-center px-6 py-10 mx-auto max-w-screen-2xl">
      <div className="w-full max-w-md">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={submit}>
          {!claimed && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Address</label>
                <input
                  className="shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="Address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Address"
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-full rounded focus:outline-none focus:shadow-outline flex justify-center items-center"
                  type="submit"
                  disabled={!!loading}
                >
                  {loading ? (
                    <svg
                      className="animate-spin ml-3 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    'Claim'
                  )}
                </button>
              </div>
            </>
          )}
          {!!error && <p className="text-red-500 text-xs italic mt-4">Claim transaction failed.</p>}
          {!!claimed && (
            <p className="text-green-500 text-lg font-bold mt-4 text-center">{`${shortenAddress(
              address
            )} successfully claimed ${amount} tokens.`}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Home;
