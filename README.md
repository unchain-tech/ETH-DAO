## 💬 ETH-DAO(prototype)

本レポジトリは ETH-DAO の完成版を示したものになります。

以下の手順を実行することで ETH-DAO の挙動を確認できます。

### レポジトリのクローン

[こちら](https://github.com/unchain-tech/ETH-DAO.git)から ETH-DAO をクローンします。

### コントラクトとフロントの準備

1. 環境構築

まずは必要なパッケージをインストールするために下のコマンドを実行します。

```
yarn install
```

次に[こちら](https://app.unchain.tech/learn/ETH-DAO/ja/2/1/)のページを参考にして`.env.local`ファイルを作成してその中の変数を指定してください。

2. コントラクトのデプロイ

本プロジェクトでは`thirdweb`というフレームワークを使用してコントラクトのデプロイとコントラクトとのやりとりを行います。そのため次に示す手順に従ってターミナルでコマンドを実行することで投票用のコントラクトを作成していきます。

まずは thirdweb の初期化を行います。

```
yarn node --loader ts-node/esm src/scripts/1-initialize-sdk.ts
```

次に DAO コレクションの画像を deploy します。

```
yarn node --loader ts-node/esm src/scripts/2-deploy-drop.ts
```

成功すると、以下のように得られた結果が出力されます（少し時間がかかります）。

```bash
SDK initialized by address: 0x8cB688A30D5Fd6f2e5025d8915eD95e770832933
✅ Successfully deployed editionDrop contract, address: 0x445c4D7d80EA463f29Ab0411A33dd760F8181546
✅ editionDrop metadata: {
  name: 'Tokyo Sauna Collective',
  description: 'A DAO for sauna enthusiasts in Tokyo',
  image: 'https://gateway.ipfscdn.io/ipfs/QmSofk2vWgECKmY6ovmGUD2Q89p9xx4qtR3kGeYYzcJmc7/0',
  seller_fee_basis_points: 0,
  fee_recipient: '0x0000000000000000000000000000000000000000',
  merkle: {},
  symbol: ''
}
Done in 40.59s.
```

この中の`Successfully deployed editionDrop contract, address:`に続くコントラクトアドレスを`src/scripts/modules.ts`の editionDropAddress 変数に代入します。

次にコントラクトの NFT を mint します。

```
yarn node --loader ts-node/esm src/scripts/3-config-nft.ts
```

NFT の詳細情報を指定します。

```
yarn node --loader ts-node/esm src/scripts/4-set-claim-condition.ts
```

DAO のトークンを発行します。

```
yarn node --loader ts-node/esm src/scripts/5-deploy-token.ts
```

以下のような表示がされたら、成功です。

```bash
SDK initialized by address: 0x8cB688A30D5Fd6f2e5025d8915eD95e770832933
✅ Successfully deployed token module, address: 0x925d850A8A83af24a8F0C6B1E78B20A475a0c71E
Done in 40.70s.
```

この中の`SDK initialized by address:`に続くコントラクトアドレスを`src/scripts/modules.ts`の ERCTokenAddress 変数に代入します。

次にトークンの詳細設定を行なっていきます。

```
yarn node --loader ts-node/esm src/scripts/6-print-money.ts
```

エアドロップをしていきます。

```
yarn node --loader ts-node/esm src/scripts/7-airdrop-token.ts
```

投票のためのコントラクトを deploy します。

```
yarn node --loader ts-node/esm src/scripts/8-deploy-vote.ts
```

以下のような表示がされたら、成功です。

```bash
SDK initialized by address: 0x8cB688A30D5Fd6f2e5025d8915eD95e770832933
✅ Successfully deployed vote contract, address: 0xCA7D13D6A51141D04C3fC05cFE4EBeE9f9ac6Bc2
Done in 50.84s.
```

この中の`Successfully deployed vote contract, address:`に続くコントラクトアドレスを`src/scripts/modules.ts`の governanceAddress 変数に代入します。

投票の詳細設定を行なっていきます。

```
yarn node --loader ts-node/esm src/scripts/9-setup-vote.ts
```

2 つの新しい提案を行います。

```
yarn node --loader ts-node/esm src/scripts/10-create-vote-proposals.ts
```

最後にコントラクトの管理権限を放棄して本物の DAO に昇華させます！

```
yarn node --loader ts-node/esm src/scripts/11-revoke-roles.ts
```

これでコントラクトとフロントエンドの準備は完了です！

### コントラクトのテスト

ではコントラクトのテストを行いましょう。下のコマンドを実行させることでテストを実行することができます。

```
yarn test
```

下のような結果が出ていれば成功です!

![](/public/passed_image.png)

### フロントエンドを起動

下のコマンドを実行させることでフロントエンドの動きを確認してみましょう。

```
yarn dev
```
