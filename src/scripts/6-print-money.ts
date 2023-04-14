import sdk from './1-initialize-sdk.js';
import { ERCTokenAddress } from './module.js';

// これは、前のステップで取得した私たちの ERC-20 コントラクトのアドレスです。
const token = sdk.getContract(ERCTokenAddress, 'token');

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
