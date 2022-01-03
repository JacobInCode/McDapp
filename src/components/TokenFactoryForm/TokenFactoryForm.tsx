import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getOnboard } from 'utils/walletUtils';
import { useWallet } from 'wallet/state';
import useTokenFactory from '../../hooks/useTokenFactory';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';

const inputClass = 'shadow-sm border-2 border-gray-200 rounded text-sm p-2 w-full';
const errorClass = 'text-red-600 font-light text-xs pl-2';
const titleClass = 'text-gray-900 font-medium text-sm pl-2';
const titleWrapper = 'flex space-x-2 mb-2';

const Form: React.FunctionComponent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [state, dispatch] = useWallet();
  const tokenFactory = useTokenFactory();
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const router = useRouter();

  const handleWallet = useCallback(async () => {
    const onboard = getOnboard(dispatch);

    const selected = await onboard.walletSelect(localStorage.getItem('walletName'));
    if (selected) {
      await onboard.walletCheck();
    }
  }, []);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      if (!state?.address) {
        handleWallet();
        return;
      }

      const tx = await tokenFactory.deployERC20Token(
        data.name,
        data.symbol,
        ethers.utils.parseEther(data.initialSupply),
        data.owner
      );
      const res = await tx.wait();
      console.log(res.events[0].address);

      setLoading(false);
      router.push(`/token/${res.events[0].address}`);
    } catch (error) {
      setLoading(false);
      console.log('ERROR', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-5 mt-3 w-full max-w-xl">
      <div>
        <div className={titleWrapper}>
          <p className={titleClass}>Token Name</p>
          {errors.name && <p className={errorClass}>Token name is required.</p>}
        </div>
        <input {...register('name', { required: true })} className={inputClass} placeholder="BestFrensForever" />
      </div>
      <div>
        <div className={titleWrapper}>
          <p className={titleClass}>Token Symbol</p>
          {errors.symbol && <p className={errorClass}>Token symbol is required.</p>}
        </div>
        <input {...register('symbol', { required: true })} className={inputClass} placeholder="BFF" />
      </div>
      <div>
        <div className={titleWrapper}>
          <p className={titleClass}>Initial Supply</p>
          {errors.initialSupply && <p className={errorClass}>Please enter a number for initial supply.</p>}
        </div>
        <input
          {...register('initialSupply', { required: true, pattern: /\d+/ })}
          className={inputClass}
          placeholder="100000"
        />
      </div>
      <div>
        <div className={titleWrapper}>
          <p className={titleClass}>Owner Address</p>
          {errors.owner && <p className={errorClass}>Please enter an ethereum address as contract owner.</p>}
        </div>
        <input {...register('owner', { required: true })} className={inputClass} placeholder="0xABCD..." />
      </div>

      <button type="submit" className="bg-blue-600 text-white py-2 rounded mt-3 flex items-center justify-center">
        {loading ? (
          <svg
            className="animate-spin ml-3 mr-3 h-5 w-5 text-white"
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
        ) : (
          'Deploy'
        )}
      </button>
    </form>
  );
};

export default Form;
