import sdk from './1-initialize-sdk.js';

// これは、前のステップで取得した私たちの ERC-20 コントラクトのアドレスです。
const token = sdk.getContract(
  '0x7097bC28c0fF31c31945762129C5f9D51830558D',
  'token',
);

(async () => {
  try {
    // // 設定したい最大供給量を設定
    const amount = 1000000;
    // デプロイされた ERC-20 コントラクトを通して、トークンをミント
    await (await token).mint(amount);
    const totalSupply = await (await token).totalSupply();

    // 今、私たちのトークンがどれだけあるかを表示
    console.log(
      '✅ There now is',
      totalSupply.displayValue,
      '$TSC in circulation',
    );
  } catch (error) {
    console.error('Failed to print money', error);
  }
})();
