
'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { BlockchainView } from '@/components/blockchain/BlockchainView';
import { MempoolView } from '@/components/mempool/MempoolView';
import { CreateTransactionForm } from '@/components/transactions/CreateTransactionForm';
import { WalletBalances } from '@/components/wallet/WalletBalances';
import { AdminControls } from '@/components/AdminControls';
import { DonationCard } from '@/components/donation/DonationCard';
import type { BlockData, TransactionData, WalletData, BlockchainConfig } from '@/lib/blockchain-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Info, NetworkIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { NETWORKS, DEFAULT_NETWORK_ID } from '@/components/layout/Header'; // Import network configs

interface BlockSimPageClientProps {
  networkId: string;
  initialChain: BlockData[];
  initialMempool: TransactionData[];
  initialWallets: WalletData[];
  blockchainConfig: BlockchainConfig;
}

export function BlockSimPageClient({
  networkId, // This is the currently active networkId passed from page.tsx
  initialChain,
  initialMempool,
  initialWallets,
  blockchainConfig,
}: BlockSimPageClientProps) {
  const [autoOpenContractTxId, setAutoOpenContractTxId] = useState<string | null>(null);
  const [suggestedToAddress, setSuggestedToAddress] = useState<string | null>(null);
  const createTransactionFormRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setAutoOpenContractTxId(null);
    setSuggestedToAddress(null);
  }, [networkId]);

  const clearAutoOpenContractTxId = () => {
    setAutoOpenContractTxId(null);
  };

  const handleNetworkChange = (newNetworkId: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('network', newNetworkId);
    router.push(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
  };

  const handleDonateClick = (donationAddress: string) => {
    setSuggestedToAddress(donationAddress);
    const formElement = document.getElementById('toAddress');
    if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        formElement.focus();
    } else {
        const createTxCard = document.querySelector('#createTransactionCard');
        if(createTxCard) {
             createTxCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center text-xl">
                    <Info className="mr-2 h-5 w-5 text-primary" />
                    Blockchain Information
                </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-sm items-end">
                <div className="sm:col-span-2 md:col-span-1">
                  <Label htmlFor="networkSelectorInCard" className="mb-1 block text-muted-foreground">Active Network</Label>
                  <Select value={networkId} onValueChange={handleNetworkChange} name="networkSelectorInCard">
                    <SelectTrigger className="w-full text-sm">
                      <SelectValue placeholder="Select Network" />
                    </SelectTrigger>
                    <SelectContent>
                      {NETWORKS.map(network => (
                        <SelectItem key={network.id} value={network.id} className="text-sm">
                          {network.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div><Badge variant="secondary" className="mb-1">Coin Name</Badge><p className="font-semibold">{blockchainConfig.coinbaseName}</p></div>
                <div><Badge variant="secondary" className="mb-1">Block Reward</Badge><p className="font-semibold">{blockchainConfig.blockReward} {blockchainConfig.coinbaseName}</p></div>
                <div><Badge variant="secondary" className="mb-1">Difficulty</Badge><p className="font-semibold">{blockchainConfig.difficulty}</p></div>
                <div><Badge variant="secondary" className="mb-1">Block Interval</Badge><p className="font-semibold">{blockchainConfig.blockIntervalMs / 60000} mins</p></div>
            </CardContent>
        </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6 order-2 lg:order-1">
          <WalletBalances wallets={initialWallets} networkId={networkId} />
          <div ref={createTransactionFormRef} id="createTransactionCard">
            <CreateTransactionForm 
              wallets={initialWallets} 
              mempool={initialMempool} 
              networkId={networkId}
              setAutoOpenContractTxId={setAutoOpenContractTxId} 
              initialToAddress={suggestedToAddress}
            />
          </div>
          <AdminControls wallets={initialWallets} networkId={networkId} />
          <DonationCard networkId={networkId} onDonateClick={handleDonateClick} />
        </div>

        <div className="lg:col-span-1 space-y-6 order-1 lg:order-2 min-h-[600px] max-h-[calc(100vh-12rem)] overflow-hidden flex flex-col">
          <BlockchainView chain={initialChain} />
        </div>
        
        <div className="lg:col-span-1 space-y-6 order-3 lg:order-3 min-h-[600px] max-h-[calc(100vh-12rem)] overflow-hidden flex flex-col">
          <MempoolView 
            mempool={initialMempool} 
            autoOpenContractTxId={autoOpenContractTxId}
            clearAutoOpenContractTxId={clearAutoOpenContractTxId}
          />
        </div>
      </div>
    </div>
  );
}
