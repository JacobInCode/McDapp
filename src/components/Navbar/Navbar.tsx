import { MenuIcon, XIcon } from '@heroicons/react/outline';
import { Logo } from 'assets';
import Button from 'components/Button';
import { ButtonType } from 'components/Button/Button';
import { useRouter } from 'next/router';
import React, { FC, useCallback, useEffect } from 'react';
import { getOnboard } from 'utils/walletUtils';
import { useWallet } from 'wallet/state';
import ProfileDropdown from './ProfileDropdown';

const Navbar: FC<unknown> = () => {
  const router = useRouter();
  const goToHome = useCallback(() => {
    router.push('/');
  }, [router]);
  const [state, dispatch] = useWallet();

  const reconnectWallet = useCallback(async (walletName: string) => {
    const onboard = getOnboard(dispatch);
    if (await onboard.walletSelect(walletName)) {
      await onboard.walletCheck();
    }
  }, []);

  useEffect(() => {
    const previousWallet = localStorage.getItem('walletName');
    if (previousWallet) {
      reconnectWallet(previousWallet);
    }
  }, []);

  const handleWallet = useCallback(async () => {
    const onboard = getOnboard(dispatch);

    const selected = await onboard.walletSelect(localStorage.getItem('walletName'));
    if (selected) {
      await onboard.walletCheck();
    }
  }, []);

  return (
    <nav className="sticky top-0 z-20 bg-primary shadow-md">
      <div className="flex px-2 py-3.5 mx-auto md:py-0 md:h-24 max-w-screen-2xl sm:px-4 lg:px-8">
        <div className="flex items-center justify-between w-full px-2 lg:px-0 ">
          <div className="flex-shrink-0">
            <div onClick={goToHome} className="block w-auto h-full cursor-pointer text-2xl lg:hidden">
              🏭
            </div>
            <div className="flex items-center">
              <div onClick={goToHome} className="hidden w-auto h-full cursor-pointer text-2xl lg:block">
                🏭
              </div>
              <span
                onClick={goToHome}
                className="hidden h-auto pl-3 text-xl font-bold text-black cursor-pointer lg:block align-cente"
              >
                Membership Factory
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4 lg:space-12">
            {!state.address ? (
              <Button type={ButtonType.Secondary} title="Connect wallet" onClick={handleWallet} />
            ) : (
              <ProfileDropdown />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
