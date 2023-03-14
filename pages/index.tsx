// 接続中のネットワークを取得するため useNetwork を新たにインポートします。
import {
  ChainId,
  ConnectWallet,
  useAddress,
  useContract,
  useNetwork,
} from '@thirdweb-dev/react';
import type { NextPage } from 'next';
import { useEffect, useMemo, useState } from 'react';

import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const address = useAddress();
  console.log('👋Wallet Address: ', address);

  const [network, switchNetwork] = useNetwork();

  // editionDrop コントラクトを初期化
  const editionDrop = useContract(
    '0x78033209618617d23191130349afCF27dc640845',
    'edition-drop',
  ).contract;
  // トークンコントラクトの初期化
  const token = useContract(
    '0x10E9C13e9f73A35d4a0C8AA8328b84EF9747b7a8',
    'token',
  ).contract;

  // ユーザーがメンバーシップ NFT を持っているかどうかを知るためのステートを定義
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);

  // NFT をミンティングしている間を表すステートを定義
  const [isClaiming, setIsClaiming] = useState(false);

  // メンバーごとの保有しているトークンの数をステートとして宣言
  const [memberTokenAmounts, setMemberTokenAmounts] = useState<any>([]);

  // DAO メンバーのアドレスをステートで宣言
  const [memberAddresses, setMemberAddresses] = useState<string[] | undefined>(
    [],
  );

  // アドレスの長さを省略してくれる便利な関数
  const shortenAddress = (str: string) => {
    return str.substring(0, 6) + '...' + str.substring(str.length - 4);
  };

  // メンバーシップを保持しているメンバーの全アドレスを取得します
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // 先ほどエアドロップしたユーザーがここで取得できます（発行された tokenID 0 のメンバーシップ NFT）
    const getAllAddresses = async () => {
      try {
        const memberAddresses =
          await editionDrop?.history.getAllClaimerAddresses(0);
        setMemberAddresses(memberAddresses);
        console.log('🚀 Members addresses', memberAddresses);
      } catch (error) {
        console.error('failed to get member list', error);
      }
    };
    getAllAddresses();
  }, [hasClaimedNFT, editionDrop?.history]);

  // 各メンバーが保持するトークンの数を取得します
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    const getAllBalances = async () => {
      try {
        const amounts = await token?.history.getAllHolderBalances();
        setMemberTokenAmounts(amounts);
        console.log('👜 Amounts', amounts);
      } catch (error) {
        console.error('failed to get member balances', error);
      }
    };
    getAllBalances();
  }, [hasClaimedNFT, token?.history]);

  // memberAddresses と memberTokenAmounts を 1 つの配列に結合します
  const memberList = useMemo(() => {
    return memberAddresses?.map((address) => {
      // memberTokenAmounts 配列でアドレスが見つかっているかどうかを確認します
      // その場合、ユーザーが持っているトークンの量を返します
      // それ以外の場合は 0 を返します
      const member = memberTokenAmounts?.find(
        ({ holder }: { holder: string }) => holder === address,
      );

      return {
        address,
        tokenAmount: member?.balance.displayValue || '0',
      };
    });
  }, [memberAddresses, memberTokenAmounts]);

  useEffect(() => {
    // もしウォレットに接続されていなかったら処理をしない
    if (!address) {
      return;
    }
    // ユーザーがメンバーシップ NFT を持っているかどうかを確認する関数を定義
    const checkBalance = async () => {
      try {
        const balance = await editionDrop!.balanceOf(address, 0);
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log('🌟 this user has a membership NFT!');
        } else {
          setHasClaimedNFT(false);
          console.log("😭 this user doesn't have a membership NFT.");
        }
      } catch (error) {
        setHasClaimedNFT(false);
        console.error('Failed to get balance', error);
      }
    };
    // 関数を実行
    checkBalance();
  }, [address, editionDrop]);

  const mintNft = async () => {
    try {
      setIsClaiming(true);
      await editionDrop!.claim('0', 1);
      console.log(
        `🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop!.getAddress()}/0`,
      );
      setHasClaimedNFT(true);
    } catch (error) {
      setHasClaimedNFT(false);
      console.error('Failed to mint NFT', error);
    } finally {
      setIsClaiming(false);
    }
  };

  // ウォレットと接続していなかったら接続を促す
  if (!address) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>Welcome to Tokyo Sauna Collective !!</h1>
          <div className={styles.connect}>
            <ConnectWallet />
          </div>
        </main>
      </div>
    );
  }
  // テストネットが Sepolia ではなかった場合に警告を表示
  else if (address && network && network?.data?.chain?.id !== 11155111) {
    console.log('wallet address: ', address);
    console.log('network: ', network?.data?.chain?.id);

    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>Sepolia に切り替えてください⚠️</h1>
          <p>この dApp は Sepolia テストネットのみで動作します。</p>
          <p>ウォレットから接続中のネットワークを切り替えてください。</p>
        </main>
      </div>
    );
  }
  // ユーザーがすでに NFT を要求している場合は、内部 DAO ページを表示します
  // これは DAO メンバーだけが見ることができ、すべてのメンバーとすべてのトークン量をレンダリングします
  else if (hasClaimedNFT) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>🍪DAO Member Page</h1>
          <p>Congratulations on being a member</p>
          <div>
            <div>
              <h2>Member List</h2>
              <table className="card">
                <thead>
                  <tr>
                    <th>Address</th>
                    <th>Token Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {memberList!.map((member) => {
                    return (
                      <tr key={member.address}>
                        <td>{shortenAddress(member.address)}</td>
                        <td>{member.tokenAmount}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    );
  }
  // ウォレットと接続されていたら Mint ボタンを表示
  else {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>Mint your free 🍪DAO Membership NFT</h1>
          <button disabled={isClaiming} onClick={mintNft}>
            {isClaiming ? 'Minting...' : 'Mint your nft (FREE)'}
          </button>
        </main>
      </div>
    );
  }
};

export default Home;
