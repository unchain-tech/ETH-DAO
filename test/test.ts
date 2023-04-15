import { AddressZero } from '@ethersproject/constants';
import nextEnv from '@next/env';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import assert from 'assert';
import ethers from 'ethers';
import { describe, it } from 'node:test';

import {
  editionDropAddress,
  ERCTokenAddress,
  gavananceAddress,
  ownerWalletAddress,
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

  it('sdk is working', async function () {
    const address = await sdk.getSigner()?.getAddress();
    assert.equal(address, WALLET_ADDRESS);
  });

  // edition-drop, ERC1155-token, gavanance-tokenの3つのコントラクトを取得
  const editionDrop = sdk.getContract(editionDropAddress, 'edition-drop');
  const token = sdk.getContract(ERCTokenAddress, 'token');
  const vote = sdk.getContract(gavananceAddress, 'vote');

  //   it('metadata is set correctly', async function () {
  //     // メタデータを取得
  //     const metadata = await (await editionDrop).metadata.get();

  //     // メタデータがsetされているかテスト
  //     assert.notEqual(metadata, null);

  //     // メタデータの内容の一部が一致しているかチェック
  //     assert.equal(metadata.fee_recipient, AddressZero);
  //   });

  //   it('NFT is minted', async function () {
  //     const NFTInfo = await (await editionDrop).get(0);
  //     assert.notEqual(NFTInfo, null);
  //   });

  //   it('NFT condition is set correctly', async function () {
  //     const condition = await (
  //       await editionDrop
  //     ).erc1155.claimConditions.getActive('0');
  //     assert.equal(condition.price.toNumber(), 0);z
  //   });

  //   it('token is minted correctly', async function () {
  //     const tokenInfo = await (await token).balance();
  //     assert.equal(tokenInfo.symbol, 'TSC');
  //   });

  //   it('token is minted correctly', async function () {
  //     const tokenInfo = await (await token).totalSupply();
  //     assert.equal(tokenInfo.displayValue, '1000000.0');
  //   });

  //   it('token is transfered', async function () {
  //     const balance = await (await token).balanceOf(ownerWalletAddress);
  //     const fixedBalance = Number(balance.value).toString();
  //     console.log(fixedBalance);
  //     assert.equal(fixedBalance, '1e+22');
  //   });

  //   it('vote contract has 90 % of owners token', async function () {
  //     const metadata = await (await vote).metadata.get();
  //     assert.equal(metadata.name, 'My amazing DAO');
  //   });

  //   it('vote contract has 90 % of owners token', async function () {
  //     // ウォレットのトークン残高を取得します
  //     const ownedTokenBalance = (
  //       await (await token).balanceOf(ownerWalletAddress)
  //     ).value;

  //     // ウォレットのトークン残高を取得します
  //     const contractTokenBalance = (
  //       await (await token).balanceOf((await vote).getAddress())
  //     ).value;
  //     assert.equal(Number(ownedTokenBalance), Number(contractTokenBalance) / 9);
  //   });

  it('vote contract has proposal', async function () {
    // 投票コントラクトに挙げられた提案を取得します
    const proposal = (await (await vote).getAll())[0];

    assert.equal(
      proposal.description,
      'Should the DAO mint an additional 420000 tokens into the treasury?',
    );
  });
});
