import nextEnv from '@next/env';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import ethers from 'ethers';

const { loadEnvConfig } = nextEnv;
// 環境変数を env ファイルから読み込む
const { PRIVATE_KEY, ALCHEMY_API_URL, WALLET_ADDRESS } = loadEnvConfig(
  process.cwd(),
).combinedEnv;

// 環境変数が取得できてとれているか確認
if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY === '') {
  console.log('🛑 Private key not found.');
}

if (!process.env.ALCHEMY_API_URL || process.env.ALCHEMY_API_URL === '') {
  console.log('🛑 Alchemy API URL not found.');
}

if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS === '') {
  console.log('🛑 Wallet Address not found.');
}

const sdk = new ThirdwebSDK(
  new ethers.Wallet(
    process.env.PRIVATE_KEY!,
    ethers.getDefaultProvider(process.env.ALCHEMY_API_URL),
  ),
);

// ここでスクリプトを実行
(async () => {
  try {
    if (!sdk || !('getSigner' in sdk)) return;
    const address = await sdk.getSigner()?.getAddress();
    console.log('SDK initialized by address:', address);
  } catch (err) {
    console.error('Failed to get apps from the sdk', err);
  }
})();

// 初期化した sdk を他のスクリプトで再利用できるように export
export default sdk;
