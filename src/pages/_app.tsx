import Navbar from 'components/Navbar/Navbar';
import { AppProps } from 'next/app';
import React, { FC } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { WalletProvider } from 'wallet/state';
import '../styles/global.css';

const queryClient = new QueryClient({});

const App: FC<AppProps> = ({ Component, pageProps }: AppProps) => {
  return (
    <WalletProvider>
      <QueryClientProvider client={queryClient}>
        <Navbar />
        <Component {...pageProps} />
      </QueryClientProvider>
    </WalletProvider>
  );
};
export default App;
