import nextEnv from '@next/env';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

// 環境変数を env ファイルから読み込む
const { loadEnvConfig } = nextEnv;
const projectDir = process.cwd();
loadEnvConfig(projectDir).combinedEnv;

// 環境変数が取得できてとれているか確認
if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY === '') {
  console.log('🛑 Private key not found.');
}

if (!process.env.CLIENT_ID || process.env.CLIENT_ID === '') {
  console.log('🛑 Client ID of API Key not found.');
}

if (!process.env.SECRET_KEY || process.env.SECRET_KEY === '') {
  console.log('🛑 Secret Key of API Key not found.');
}

const sdk = ThirdwebSDK.fromPrivateKey(process.env.PRIVATE_KEY!, 'sepolia', {
  clientId: process.env.CLIENT_ID,
  secretKey: process.env.SECRET_KEY,
});

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
