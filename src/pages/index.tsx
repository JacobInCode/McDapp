import React, { useCallback, useState } from 'react';
import useMembershipFactoryContract from '../hooks/useMembershipFactoryContract';
import { getOnboard } from 'utils/walletUtils';
import { useWallet } from 'wallet/state';
import { Switch } from '@headlessui/react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Home: React.FunctionComponent = () => {
  const membershipFactoryContract = useMembershipFactoryContract();
  const [state, dispatch] = useWallet();
  const [name, setName] = useState<string | undefined>();
  const [symbol, setSymbol] = useState<string | undefined>();
  const [organization, setOrganization] = useState<string | undefined>();
  const [address, setAddress] = useState<string | undefined>();
  const [transferable, setTransferable] = useState<boolean | undefined>(false);

  const handleWallet = useCallback(async () => {
    const onboard = getOnboard(dispatch);

    const selected = await onboard.walletSelect(localStorage.getItem('walletName'));
    if (selected) {
      await onboard.walletCheck();
    }
  }, []);

  const submit = (e) => {
    e.preventDefault();
    if (!state.address) {
      handleWallet();
      return;
    }

    if (!name || !symbol || !organization || !address) return;

    membershipFactoryContract.createMemberships(name, symbol, organization, transferable, address);
  };

  return (
    <div className="flex items-center justify-center px-6 py-10 mx-auto max-w-screen-2xl">
      <div className="w-full max-w-md">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={submit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="McDAO Contract"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Symbol</label>
            <input
              className={`shadow appearance-none border ${''} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              id="Symbol"
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="MCD"
            />
            {/* <p className="text-red-500 text-xs italic">Please choose a symbol.</p> */}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Organization</label>
            <input
              className={`shadow appearance-none border ${''} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              id="Organization"
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="McDAO"
            />
            {/* <p className="text-red-500 text-xs italic">Please choose a symbol.</p> */}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Owner Address</label>
            <input
              className={`shadow appearance-none border ${''} rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline`}
              id="Owner Address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x..."
            />
            {/* <p className="text-red-500 text-xs italic">Please choose a symbol.</p> */}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Transferable</label>
            <Switch
              checked={transferable}
              onChange={setTransferable}
              className={classNames(
                !transferable ? 'bg-gray-200' : 'bg-indigo-600',
                'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              )}
            >
              <span className="sr-only">Use setting</span>
              <span
                aria-hidden="true"
                className={classNames(
                  !transferable ? 'translate-x-0' : 'translate-x-5',
                  'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                )}
              />
            </Switch>
          </div>

          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-full rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Create Membership Contract
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;
