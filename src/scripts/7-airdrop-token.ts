import sdk from './1-initialize-sdk.js';

// ERC-1155 メンバーシップの NFT コントラクトアドレス
const editionDrop = sdk.getContract(
  '0x78033209618617d23191130349afCF27dc640845',
  'edition-drop',
);

// ERC-20 トークンコントラクトのアドレス
const token = sdk.getContract(
  '0x10E9C13e9f73A35d4a0C8AA8328b84EF9747b7a8',
  'token',
);

(async () => {
  try {
    // メンバーシップ NFT を所有している人のアドレスをすべて取得
    // tokenId が 0 メンバーシップ NFT
    const walletAddresses = await (
      await editionDrop
    ).history.getAllClaimerAddresses(0);

    if (walletAddresses.length === 0) {
      console.log(
        'No NFTs have been claimed yet, maybe get some friends to claim your free NFTs!',
      );
      process.exit(0);
    }

    // アドレスの配列をループ
    const airdropTargets = walletAddresses.map((address) => {
      // 1000 から 10000 の間でランダムな数を取得
      const randomAmount = Math.floor(
        Math.random() * (10000 - 1000 + 1) + 1000,
      );
      console.log('✅ Going to airdrop', randomAmount, 'tokens to', address);

      // ターゲットを設定
      const airdropTarget = {
        toAddress: address,
        amount: randomAmount,
      };

      return airdropTarget;
    });

    // 全てのエアドロップ先で transferBatch を呼び出す
    console.log('🌈 Starting airdrop...');
    await (await token).transferBatch(airdropTargets);
    console.log(
      '✅ Successfully airdropped tokens to all the holders of the NFT!',
    );
  } catch (err) {
    console.error('Failed to airdrop tokens', err);
  }
})();
