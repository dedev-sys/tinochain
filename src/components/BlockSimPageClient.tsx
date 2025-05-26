
'use client';

import { BlockchainView } from '@/components/blockchain/BlockchainView';
import { MempoolView } from '@/components/mempool/MempoolView';
import { CreateTransactionForm } from '@/components/transactions/CreateTransactionForm';
import { WalletBalances } from '@/components/wallet/WalletBalances';
import { AdminControls } from '@/components/AdminControls';
import type { BlockData, TransactionData, WalletData, BlockchainConfig } from '@/lib/blockchain-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Info, NetworkIcon } from 'lucide-react'; // Assuming NetworkIcon exists or placeholder

interface BlockSimPageClientProps {
  networkId: string; // New prop
  initialChain: BlockData[];
  initialMempool: TransactionData[];
  initialWallets: WalletData[];
  blockchainConfig: BlockchainConfig;
}

export function BlockSimPageClient({
  networkId, // Use this
  initialChain,
  initialMempool,
  initialWallets,
  blockchainConfig,
}: BlockSimPageClientProps) {

  return (
    <div className="container mx-auto p-4 space-y-8">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center text-xl">
                    <Info className="mr-2 h-5 w-5 text-primary" />
                    Blockchain Information
                </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div><Badge variant="secondary">Network ID</Badge><p className="font-semibold capitalize">{networkId}</p></div>
                <div><Badge variant="secondary">Coin Name</Badge><p className="font-semibold">{blockchainConfig.coinbaseName}</p></div>
                <div><Badge variant="secondary">Block Reward</Badge><p className="font-semibold">{blockchainConfig.blockReward} {blockchainConfig.coinbaseName}</p></div>
                <div><Badge variant="secondary">Difficulty</Badge><p className="font-semibold">{blockchainConfig.difficulty}</p></div>
                <div><Badge variant="secondary">Block Interval</Badge><p className="font-semibold">{blockchainConfig.blockIntervalMs / 60000} mins</p></div>
            </CardContent>
        </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6 order-2 lg:order-1">
          <WalletBalances wallets={initialWallets} networkId={networkId} />
          <CreateTransactionForm wallets={initialWallets} mempool={initialMempool} networkId={networkId} />
          <AdminControls wallets={initialWallets} networkId={networkId} />
        </div>

        <div className="lg:col-span-1 space-y-6 order-1 lg:order-2 min-h-[600px] max-h-[calc(100vh-12rem)] overflow-hidden flex flex-col">
          <BlockchainView chain={initialChain} />
        </div>
        
        <div className="lg:col-span-1 space-y-6 order-3 lg:order-3 min-h-[600px] max-h-[calc(100vh-12rem)] overflow-hidden flex flex-col">
          <MempoolView mempool={initialMempool} />
        </div>
      </div>
    </div>
  );
}
