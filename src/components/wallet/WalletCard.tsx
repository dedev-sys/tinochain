import type { WalletData } from '@/lib/blockchain-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Copy, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface WalletCardProps {
  wallet: WalletData;
  showPrivateKey?: string; // Only for newly created wallets
}

export function WalletCard({ wallet, showPrivateKey }: WalletCardProps) {
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: `${label} Copied!`, description: text });
    }).catch(err => {
      toast({ title: 'Copy Failed', description: 'Could not copy to clipboard.', variant: 'destructive' });
      console.error('Failed to copy: ', err);
    });
  };

  return (
    <Card className="w-full shadow">
      <CardHeader>
        <CardTitle className="flex items-center text-md">
          <Wallet className="mr-2 h-5 w-5 text-primary" />
          Wallet
        </CardTitle>
        <CardDescription className="text-xs break-all">
          Public Key: {wallet.publicKey}
          <Button variant="ghost" size="icon" className="ml-1 h-5 w-5" onClick={() => copyToClipboard(wallet.publicKey, 'Public Key')}>
            <Copy className="h-3 w-3" />
          </Button>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-1 text-sm">
        <div className="flex items-center font-semibold">
          <Coins className="mr-2 h-4 w-4 text-amber-500" />
          Balance: {wallet.balance.toFixed(2)} uemfCoin
        </div>
        {showPrivateKey && (
          <div className="mt-2 p-2 border rounded bg-muted text-xs">
            <p className="font-semibold text-destructive">Save your Private Key securely!</p>
            <p className="break-all">Private Key: {showPrivateKey}
              <Button variant="ghost" size="icon" className="ml-1 h-5 w-5" onClick={() => copyToClipboard(showPrivateKey, 'Private Key')}>
                <Copy className="h-3 w-3" />
              </Button>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
