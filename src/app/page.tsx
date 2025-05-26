import { Header } from '@/components/layout/Header';
import { BlockSimPageClient } from '@/components/BlockSimPageClient';
import { BlockchainService } from '@/lib/blockchain-service';
import Image from 'next/image';

export const dynamic = 'force-dynamic'; // Ensure data is fetched on each request

export default async function Home() {
  // Fetch initial data on the server
  const chain = BlockchainService.getChain();
  const mempool = BlockchainService.getMempool();
  const wallets = BlockchainService.getAllWalletsWithBalances();
  const config = BlockchainService.getConfig();

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Header />
      <BlockSimPageClient
        initialChain={chain}
        initialMempool={mempool}
        initialWallets={wallets}
        blockchainConfig={config}
      />
      <div className="flex justify-center my-12">
        <Image
          src="https://placehold.co/200x200.png"
          alt="Jeton Afrique"
          width={200}
          height={200}
          className="rounded-full shadow-lg"
          data-ai-hint="Africa token coin"
        />
      </div>
    </main>
  );
}
