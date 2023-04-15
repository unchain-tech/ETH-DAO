import { AddressZero } from '@ethersproject/constants';
import nextEnv from '@next/env';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import assert from 'assert';
import ethers from 'ethers';
import { readFileSync } from 'fs';
import { before, describe, it } from 'node:test';

import {
  editionDropAddress,
  ERCTokenAddress,
  gavananceAddress,
} from '../src/scripts/module.js';

const { loadEnvConfig } = nextEnv;
// 環境変数を env ファイルから読み込む
const { PRIVATE_KEY, ALCHEMY_API_URL, WALLET_ADDRESS } = loadEnvConfig(
  process.cwd(),
).combinedEnv;

describe('ETH-DAO test', function () {
  // 環境変数が取得できてとれているか確認
  if (!PRIVATE_KEY || PRIVATE_KEY === '') {
    // process.
    throw new Error('🛑 Private key not found.');
  }

  if (!ALCHEMY_API_URL || ALCHEMY_API_URL === '') {
    throw new Error('🛑 Alchemy API URL not found.');
  }

  if (!WALLET_ADDRESS || WALLET_ADDRESS === '') {
    throw new Error('🛑 Wallet Address not found.');
  }

  const sdk = new ThirdwebSDK(
    new ethers.Wallet(PRIVATE_KEY!, ethers.getDefaultProvider(ALCHEMY_API_URL)),
  );

  // edition-drop, ERC1155-token, gavanance-tokenの3つのコントラクトを取得
  const editionDrop = sdk.getContract(editionDropAddress, 'edition-drop');
  const token = sdk.getContract(ERCTokenAddress, 'token');
  const vote = sdk.getContract(gavananceAddress, 'vote');

  it('sdk is working', async function () {
    const address = await sdk.getSigner()?.getAddress();
    assert.equal(address, WALLET_ADDRESS);
  });

  it('metadata is set correctly', async function () {
    // メタデータを取得
    const metadata = await (await editionDrop).metadata.get();

    // メタデータがsetされているかテスト
    assert.notEqual(metadata, null);

    // メタデータの内容の一部が一致しているかチェック
    assert.equal(metadata.fee_recipient, AddressZero);
  });

  it();
});

// ここでスクリプトを実行
// (async () => {
//   // SDKの取得をテスト
//   try {
//     if (!sdk || !('getSigner' in sdk)) return;
//     const address = await sdk.getSigner()?.getAddress();
//     console.log('SDK initialized by address:', address);
//   } catch (err) {
//     console.error('Failed to get apps from the sdk', err);
//   }

//   // ERC-1155 メンバーシップの NFT コントラクトを取得
//   const editionDrop = sdk.getContract(editionDropAddress, 'edition-drop');

//   // ERC-20 トークンコントラクトを取得
//   const token = sdk.getContract(ERCTokenAddress, 'token');

//   // 投票コントラクトのアドレスを取得
//   const vote = sdk.getContract(gavananceAddress, 'vote');

//   // editionDropの内容をテスト
//   try {
//     // メタデータを取得
//     const metadata = await (await editionDrop).metadata.get();

//     // editionDrop コントラクトのメタデータの登録をテスト
//     if (!metadata) {
//       throw new Error('🛑 metadata is not resistered correctly');
//     }

//     // balanceをテスト
//     const data = await (await editionDrop).erc1155.get(0);
//     if (!data) {
//       throw new Error('🛑 NFT is not minted correctly');
//     }
//   } catch (error) {
//     // エラーをキャッチしたら出力
//     console.log('failed to deploy editionDrop contract', error);
//   }
// })();
