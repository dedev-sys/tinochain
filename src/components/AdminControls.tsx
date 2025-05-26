'use client';

import { useState, useTransition, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mineBlockAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Pickaxe, Loader2 } from 'lucide-react';
import type { WalletData } from '@/lib/blockchain-service';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from './ui/label';

interface AdminControlsProps {
  wallets: WalletData[]; // To select a miner address
}

export function AdminControls({ wallets }: AdminControlsProps) {
  const [selectedMinerAddress, setSelectedMinerAddress] = useState<string>('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    // Pre-select the first wallet as miner if available
    if (wallets.length > 0 && !selectedMinerAddress) {
      setSelectedMinerAddress(wallets[0].publicKey);
    }
  }, [wallets, selectedMinerAddress]);

  const handleMineBlock = () => {
    if (!selectedMinerAddress) {
      toast({ title: "Miner Not Selected", description: "Please select a miner address.", variant: "destructive" });
      return;
    }
    startTransition(async () => {
      const formData = new FormData();
      formData.append('minerAddress', selectedMinerAddress);
      const result = await mineBlockAction(formData);
      if (result.success) {
        toast({ title: 'Mining Successful', description: result.message });
      } else {
        toast({ title: 'Mining Failed', description: result.message, variant: 'destructive' });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Pickaxe className="mr-2 h-5 w-5 text-destructive" />
          Admin Controls
        </CardTitle>
        <CardDescription>Manually trigger blockchain operations.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="minerAddressSelect">Select Miner Wallet</Label>
          <Select value={selectedMinerAddress} onValueChange={setSelectedMinerAddress} disabled={wallets.length === 0}>
            <SelectTrigger id="minerAddressSelect">
              <SelectValue placeholder="Select miner wallet" />
            </SelectTrigger>
            <SelectContent>
              {wallets.map(wallet => (
                <SelectItem key={wallet.publicKey} value={wallet.publicKey}>
                  {wallet.publicKey.substring(0, 20)}... (Bal: {wallet.balance.toFixed(2)})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {wallets.length === 0 && <p className="text-xs text-muted-foreground mt-1">No wallets available to act as miner.</p>}
        </div>
        <Button onClick={handleMineBlock} className="w-full" disabled={isPending || wallets.length === 0 || !selectedMinerAddress}>
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Pickaxe className="mr-2 h-4 w-4" />}
          Mine Next Block
        </Button>
        <p className="text-xs text-muted-foreground">
          Note: Blocks are also set to be mined automatically at configured intervals if there are pending transactions.
        </p>
      </CardContent>
    </Card>
  );
}
