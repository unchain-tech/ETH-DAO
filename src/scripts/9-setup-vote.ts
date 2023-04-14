import sdk from './1-initialize-sdk.js';

// ガバナンスコントラクトのアドレスを設定します
const vote = sdk.getContract(
  '0xB8338C5A06DAd370098CEc6aB1998f29eb3f6a0D',
  'vote',
);

// ERC-20 コントラクトのアドレスを設定します。
const token = sdk.getContract(
  '0x7097bC28c0fF31c31945762129C5f9D51830558D',
  'token',
);

(async () => {
  try {
    // 必要に応じて追加のトークンを作成する権限をトレジャリーに与えます
    await (await token).roles.grant('minter', (await vote).getAddress());

    console.log(
      'Successfully gave vote contract permissions to act on token contract',
    );
  } catch (error) {
    console.error(
      'failed to grant vote contract permissions on token contract',
      error,
    );
  }

  try {
    // ウォレットのトークン残高を取得します
    const ownedTokenBalance = await (
      await token
    ).balanceOf(process.env.WALLET_ADDRESS!);

    // 保有する供給量の 90% を取得します
    const ownedAmount = ownedTokenBalance.displayValue;
    const percent90 = (Number(ownedAmount) / 100) * 90;

    // 供給量の 90% をガバナンスコントラクトへ移動します
    await (await token).transfer((await vote).getAddress(), percent90);

    console.log(
      '✅ Successfully transferred ' + percent90 + ' tokens to vote contract',
    );
  } catch (err) {
    console.error('failed to transfer tokens to vote contract', err);
  }
})();
