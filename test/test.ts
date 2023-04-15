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

  // 1-initialize-sdk.tsのテスト
  it('sdk is working', async function () {
    // sdkからアドレスを取得
    const address = await sdk.getSigner()?.getAddress();

    // sdkを初期化したアドレスが自分のウォレットアドレスと一致しているか確認
    assert.equal(address, WALLET_ADDRESS);
  });

  // edition-drop, ERC1155-token, gavanance-tokenの3つのコントラクトを取得
  const editionDrop = sdk.getContract(editionDropAddress, 'edition-drop');
  const token = sdk.getContract(ERCTokenAddress, 'token');
  const vote = sdk.getContract(gavananceAddress, 'vote');

  // 2-deploy-drop.tsのテスト
  it('metadata is set', async function () {
    // メタデータを取得
    const metadata = await (await editionDrop).metadata.get();

    // メタデータがsetされているかテスト
    assert.notEqual(metadata, null);

    // メタデータの内容の一部が一致しているかチェック
    assert.equal(metadata.fee_recipient, AddressZero);
  });

  // 3-config-nft.tsのテスト
  it('NFT is minted', async function () {
    // 最初にmintされたNFTの情報を取得する
    const NFTInfo = await (await editionDrop).get(0);

    // NFTの情報が空ではないことを確認する
    assert.notEqual(NFTInfo, null);
  });

  // 4-set-claim-condition.tsのテスト
  it('NFT condition is set', async function () {
    // トークンに与えられた条件を取得する
    const condition = await (
      await editionDrop
    ).erc1155.claimConditions.getActive('0');

    // 条件として与えられたものの一つであるNFTの価格が0であることを確認する
    assert.equal(condition.price.toNumber(), 0);
  });

  // 5-deploy-token.tsのテスト
  it('token contract is deployed', async function () {
    // トークンに与えられた情報を取得する
    const tokenInfo = await (await token).balance();

    // トークンのシンボルがTSCとなっているか確認する
    assert.equal(tokenInfo.symbol, 'TSC');
  });

  // 6-print-money.tsのテスト
  it('token is minted', async function () {
    // トークンの情報を取得する
    const tokenInfo = await (await token).totalSupply();

    // トークンの合計が1e+24となっているか確認する
    assert.equal(Number(tokenInfo.value).toString(), '1e+24');
  });

  // 7-airdrop-token.tsのテスト
  it('token is transfered', async function () {
    // このコントラクトのオーナーに与えられているトークンの合計を確認する
    const balance = await (await token).balanceOf(ownerWalletAddress);

    // コントラクトのトークンの合計を10進数に変換する
    const fixedBalance = Number(balance.value).toString();

    // コントラクトのトークンの合計が1e+22となっているか確認
    assert.equal(fixedBalance, '1e+22');
  });

  // 8-deploy-vote.tsのテスト
  it('vote contract has right info', async function () {
    // 投票コントラクトのメタデータを取得
    const metadata = await (await vote).metadata.get();

    // 投票コントラクトに正しく情報が入っているか確認
    assert.equal(metadata.name, 'My amazing DAO');
  });

  // 9-setup-vote.tsのテスト
  it('vote contract has as 9 times much tokens as owner has', async function () {
    // ウォレットのトークン残高を取得します
    const ownedTokenBalance = (
      await (await token).balanceOf(ownerWalletAddress)
    ).value;

    // ウォレットのトークン残高を取得します
    const contractTokenBalance = (
      await (await token).balanceOf((await vote).getAddress())
    ).value;

    // オーナーが所有するトークンの9倍のトークン量をコントラクトが所有していることを確認
    assert.equal(Number(ownedTokenBalance) * 9, Number(contractTokenBalance));
  });

  // 10-create-vote-proposals.tsのテスト
  it('vote contract has proposal', async function () {
    // 投票コントラクトに挙げられた提案を取得します
    const proposal = (await (await vote).getAll())[0];

    // 投票コントラクトへ提案がされているか確認する
    assert.equal(
      proposal.description,
      'Should the DAO mint an additional 420000 tokens into the treasury?',
    );
  });

  // 11-revoke-roles.tsのテスト
  it('token role is passed to contract', async function () {
    // 投票コントラクトに挙げられた提案を取得します
    const roles = await (await token).roles.getAll();

    // adminの権限が誰にも与えられていないlことを確認する。
    assert.equal(roles.admin, [].toString());
  });

  console.log('test');
});
