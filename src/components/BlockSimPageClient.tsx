'use client';

import { BlockchainView } from '@/components/blockchain/BlockchainView';
import { MempoolView } from '@/components/mempool/MempoolView';
import { CreateTransactionForm } from '@/components/transactions/CreateTransactionForm';
import { WalletBalances } from '@/components/wallet/WalletBalances';
import { AdminControls } from '@/components/AdminControls';
import type { BlockData, TransactionData, WalletData, BlockchainConfig } from '@/lib/blockchain-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Info } from 'lucide-react';

interface BlockSimPageClientProps {
  initialChain: BlockData[];
  initialMempool: TransactionData[];
  initialWallets: WalletData[];
  blockchainConfig: BlockchainConfig;
}

export function BlockSimPageClient({
  initialChain,
  initialMempool,
  initialWallets,
  blockchainConfig,
}: BlockSimPageClientProps) {
  // This component will receive initial data as props.
  // Server Actions will trigger revalidation, causing this component to re-render with new data.
  // Local form states are managed within their respective components.

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
                <div><Badge variant="secondary">Coin Name</Badge><p className="font-semibold">{blockchainConfig.coinbaseName}</p></div>
                <div><Badge variant="secondary">Block Reward</Badge><p className="font-semibold">{blockchainConfig.blockReward} {blockchainConfig.coinbaseName}</p></div>
                <div><Badge variant="secondary">Difficulty</Badge><p className="font-semibold">{blockchainConfig.difficulty}</p></div>
                <div><Badge variant="secondary">Block Interval</Badge><p className="font-semibold">{blockchainConfig.blockIntervalMs / 60000} mins</p></div>
            </CardContent>
        </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Wallet, Transactions, Admin */}
        <div className="lg:col-span-1 space-y-6 order-2 lg:order-1">
          <WalletBalances wallets={initialWallets} />
          <CreateTransactionForm wallets={initialWallets} mempool={initialMempool} />
          <AdminControls wallets={initialWallets} />
        </div>

        {/* Column 2: Blockchain View */}
        <div className="lg:col-span-1 space-y-6 order-1 lg:order-2 min-h-[600px] max-h-[calc(100vh-12rem)] overflow-hidden flex flex-col">
          <BlockchainView chain={initialChain} />
        </div>
        
        {/* Column 3: Mempool View */}
        <div className="lg:col-span-1 space-y-6 order-3 lg:order-3 min-h-[600px] max-h-[calc(100vh-12rem)] overflow-hidden flex flex-col">
          <MempoolView mempool={initialMempool} />
        </div>
      </div>
    </div>
  );
}
