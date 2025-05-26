
import { Header } from '@/components/layout/Header';
import { BlockSimPageClient } from '@/components/BlockSimPageClient';
import { BlockchainService } from '@/lib/blockchain-service';
import { CryptoMarketView } from '@/components/market/CryptoMarketView';
import { DEFAULT_NETWORK_ID } from '@/components/layout/Header'; // Import default network ID

export const dynamic = 'force-dynamic'; // Ensure data is fetched on each request

const VALID_NETWORK_IDS = ['main', 'test', 'dev'];

export default async function Home({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  let networkId = typeof searchParams?.network === 'string' && VALID_NETWORK_IDS.includes(searchParams.network)
    ? searchParams.network
    : DEFAULT_NETWORK_ID;

  // Fetch initial data on the server, now with networkId
  const chain = BlockchainService.getChain(networkId);
  const mempool = BlockchainService.getMempool(networkId);
  const wallets = BlockchainService.getAllWalletsWithBalances(networkId);
  const config = BlockchainService.getConfig(networkId);

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Header /> {/* Header will internally use useSearchParams to get current network */}
      <BlockSimPageClient
        networkId={networkId} // Pass networkId to client component
        initialChain={chain}
        initialMempool={mempool}
        initialWallets={wallets}
        blockchainConfig={config}
      />
      <div className="container mx-auto p-4 mt-8">
        <CryptoMarketView />
      </div>
    </main>
  );
}
