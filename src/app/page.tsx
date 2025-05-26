
import { Header } from '@/components/layout/Header';
import { BlockSimPageClient } from '@/components/BlockSimPageClient';
import { BlockchainService } from '@/lib/blockchain-service';
import { CryptoMarketView } from '@/components/market/CryptoMarketView'; // Nouveau composant

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
      {/* L'image du jeton africain a été supprimée ici */}
      <div className="container mx-auto p-4 mt-8">
        <CryptoMarketView />
      </div>
    </main>
  );
}
