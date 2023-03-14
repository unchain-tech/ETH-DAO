import { Sepolia } from '@thirdweb-dev/chains';
import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';
import type { AppProps } from 'next/app';

import HeadComponent from '../components/head';
import '../styles/globals.css';

// アプリケーションが動作するチェーン（Goerli）を取得し、定義します。
const activeChainId = 11155111;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider activeChain={Sepolia}>
      <HeadComponent />
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
