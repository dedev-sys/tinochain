'use client';

import type { WalletData } from '@/lib/blockchain-service';
import { WalletCard } from './WalletCard';
import { Button } from '@/components/ui/button';
import { createWalletAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { useState, useTransition } from 'react';
import { Landmark, PlusCircle, Loader2 } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

interface WalletBalancesProps {
  wallets: WalletData[];
}

export function WalletBalances({ wallets: initialWallets }: WalletBalancesProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [newlyCreatedWallet, setNewlyCreatedWallet] = useState<WalletData | null>(null);
  const [displayedWallets, setDisplayedWallets] = useState<WalletData[]>(initialWallets);


  const handleCreateWallet = () => {
    startTransition(async () => {
      const result = await createWalletAction();
      if (result.success && result.wallet) {
        toast({
          title: 'Wallet Created',
          description: `Public Key: ${result.wallet.publicKey}`,
        });
        setNewlyCreatedWallet(result.wallet); // This will hold the private key temporarily
        // Add to displayed wallets list if not already there (it should be after revalidation)
        // For immediate feedback, we can add it, revalidatePath will update from source of truth.
        setDisplayedWallets(prev => [result.wallet!, ...prev.filter(w => w.publicKey !== result.wallet!.publicKey)]);

      } else {
        toast({
          title: 'Error Creating Wallet',
          description: result.message || 'An unknown error occurred.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold flex items-center">
          <Landmark className="mr-2 h-6 w-6 text-primary" />
          Wallets
        </h2>
        <Button onClick={handleCreateWallet} disabled={isPending}>
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
          Create Wallet
        </Button>
      </div>

      {newlyCreatedWallet && (
        <WalletCard wallet={newlyCreatedWallet} showPrivateKey={newlyCreatedWallet.privateKey} />
      )}
      
      {displayedWallets.length === 0 && !newlyCreatedWallet ? (
        <p className="text-muted-foreground">No wallets found. Create one to get started!</p>
      ) : (
        <ScrollArea className="h-[200px] pr-3"> {/* Adjust height as needed */}
            <div className="space-y-3">
            {displayedWallets.filter(w => w.publicKey !== newlyCreatedWallet?.publicKey).map((wallet) => (
                <WalletCard key={wallet.publicKey} wallet={wallet} />
            ))}
            </div>
        </ScrollArea>
      )}
    </div>
  );
}
