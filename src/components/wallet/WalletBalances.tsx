
'use client';

import type { WalletData } from '@/lib/blockchain-service';
import { WalletCard } from './WalletCard';
import { Button } from '@/components/ui/button';
import { createWalletAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { useState, useTransition, useEffect } from 'react';
import { Landmark, PlusCircle, Loader2 } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

interface WalletBalancesProps {
  wallets: WalletData[];
  networkId: string; // New prop
}

export function WalletBalances({ wallets: initialWallets, networkId }: WalletBalancesProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [newlyCreatedWallet, setNewlyCreatedWallet] = useState<WalletData | null>(null);
  // displayedWallets will now be directly derived from initialWallets prop, 
  // as revalidation should provide the correct list for the network.
  // We'll still use newlyCreatedWallet for immediate display of private key.

  useEffect(() => {
    // When networkId changes (which implies initialWallets changes),
    // clear any newly created wallet display from a previous network.
    setNewlyCreatedWallet(null);
  }, [networkId]);


  const handleCreateWallet = () => {
    startTransition(async () => {
      // Pass networkId to the action
      const result = await createWalletAction(networkId);
      if (result.success && result.wallet) {
        toast({
          title: 'Wallet Created',
          description: `Public Key: ${result.wallet.publicKey} on network ${networkId}`,
        });
        setNewlyCreatedWallet(result.wallet); 
        // The actual list of wallets will update via revalidation triggered by the action.
      } else {
        toast({
          title: 'Error Creating Wallet',
          description: result.message || 'An unknown error occurred.',
          variant: 'destructive',
        });
      }
    });
  };

  const currentWalletsToDisplay = initialWallets.filter(w => w.publicKey !== newlyCreatedWallet?.publicKey);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold flex items-center">
          <Landmark className="mr-2 h-6 w-6 text-primary" />
          Wallets (<span className="capitalize">{networkId}</span>)
        </h2>
        <Button onClick={handleCreateWallet} disabled={isPending}>
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
          Create Wallet
        </Button>
      </div>

      {newlyCreatedWallet && (
        <WalletCard wallet={newlyCreatedWallet} showPrivateKey={newlyCreatedWallet.privateKey} />
      )}
      
      {initialWallets.length === 0 && !newlyCreatedWallet ? (
        <p className="text-muted-foreground">No wallets found on network <span className="capitalize font-semibold">{networkId}</span>. Create one to get started!</p>
      ) : (
        currentWalletsToDisplay.length > 0 && (
            <ScrollArea className="h-[200px] pr-3">
                <div className="space-y-3">
                {currentWalletsToDisplay.map((wallet) => (
                    <WalletCard key={wallet.publicKey} wallet={wallet} />
                ))}
                </div>
            </ScrollArea>
        )
      )}
      {/* If initialWallets has items but they are all the newlyCreatedWallet, this avoids empty display */}
      {initialWallets.length > 0 && currentWalletsToDisplay.length === 0 && !newlyCreatedWallet &&
        <p className="text-muted-foreground">Create more wallets or refresh if needed.</p>
      }
    </div>
  );
}
