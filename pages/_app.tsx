import { ThirdwebProvider } from '@thirdweb-dev/react';
import type { AppProps } from 'next/app';

import HeadComponent from '../components/head';
import '../styles/globals.css';

// アプリケーションが動作するチェーン（Sepolia）を取得し、定義します。
const activeChainId = 11155111;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider activeChain={activeChainId}>
      <HeadComponent />
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
