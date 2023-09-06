import { readFileSync } from 'fs';

import sdk from './1-initialize-sdk';
import { editionDropAddress } from './module';

// 先ほどメモして残していた editionDrop のコントラクトアドレスをこちらに記載してください
const editionDrop = sdk.getContract(editionDropAddress, 'edition-drop');

(async () => {
  try {
    await (
      await editionDrop
    ).createBatch([
      {
        name: "Member's symbol",
        description:
          'Japan Crack Organization にアクセスすることができる限定アイテムです',
        image: readFileSync('src/scripts/assets/NFT.png'),
      },
    ]);
    console.log('✅ Successfully created a new NFT in the drop!');
  } catch (error) {
    console.error('failed to create the new NFT', error);
  }
})();
