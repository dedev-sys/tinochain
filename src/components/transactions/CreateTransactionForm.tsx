'use client';

import { useState, useTransition, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { submitTransactionAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Send, PenLine, Loader2 } from 'lucide-react';
import type { WalletData, TransactionData as MempoolTransactionData } from '@/lib/blockchain-service';
import { FeeEstimator } from './FeeEstimator';

interface CreateTransactionFormProps {
  wallets: WalletData[];
  mempool: MempoolTransactionData[]; // For FeeEstimator
}

export function CreateTransactionForm({ wallets, mempool }: CreateTransactionFormProps) {
  const [fromAddress, setFromAddress] = useState<string>('');
  const [toAddress, setToAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [fee, setFee] = useState<string>('1'); // Default fee
  const [signature, setSignature] = useState<string>('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    if (wallets.length > 0 && !fromAddress) {
      setFromAddress(wallets[0].publicKey);
    }
  }, [wallets, fromAddress]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!fromAddress) {
      toast({ title: "Validation Error", description: "Please select a sender wallet.", variant: "destructive" });
      return;
    }
    if (!signature.trim()) {
      toast({ title: "Validation Error", description: "Manual signature is required.", variant: "destructive" });
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append('fromAddress', fromAddress);
      formData.append('toAddress', toAddress);
      formData.append('amount', amount);
      formData.append('fee', fee);
      formData.append('signature', signature);

      const result = await submitTransactionAction(formData);
      if (result.success) {
        toast({ title: 'Transaction Submitted', description: result.message });
        // Reset form
        setToAddress('');
        setAmount('');
        setSignature('');
        setFee('1'); 
      } else {
        toast({ title: 'Transaction Failed', description: result.message, variant: 'destructive' });
      }
    });
  };
  
  const handleFeeEstimated = (estimatedFee: number) => {
    setFee(estimatedFee.toString());
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Send className="mr-2 h-5 w-5 text-primary" />
            Create Transaction
          </CardTitle>
          <CardDescription>Send uemfCoin to another address. Provide a manual signature.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fromAddress">From Wallet (Your Public Key)</Label>
              <Select value={fromAddress} onValueChange={setFromAddress} disabled={wallets.length === 0}>
                <SelectTrigger id="fromAddress">
                  <SelectValue placeholder="Select your wallet" />
                </SelectTrigger>
                <SelectContent>
                  {wallets.map(wallet => (
                    <SelectItem key={wallet.publicKey} value={wallet.publicKey}>
                      {wallet.publicKey.substring(0, 20)}... (Bal: {wallet.balance.toFixed(2)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {wallets.length === 0 && <p className="text-xs text-muted-foreground mt-1">No wallets available. Create one first.</p>}
            </div>
            <div>
              <Label htmlFor="toAddress">To Address (Recipient's Public Key)</Label>
              <Input id="toAddress" placeholder="Recipient's public key" value={toAddress} onChange={(e) => setToAddress(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="amount">Amount (uemfCoin)</Label>
              <Input id="amount" type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} required min="0.01" step="0.01" />
            </div>
            <div>
              <Label htmlFor="fee">Transaction Fee (uemfCoin)</Label>
              <Input id="fee" type="number" placeholder="1" value={fee} onChange={(e) => setFee(e.target.value)} required min="0" step="0.1" />
            </div>
            <div>
              <Label htmlFor="signature">Manual Digital Signature</Label>
              <Input id="signature" placeholder="Enter your manually generated signature" value={signature} onChange={(e) => setSignature(e.target.value)} required />
              <p className="text-xs text-muted-foreground mt-1">
                Generate this using your private key and transaction data with a separate Node.js program (as per project spec).
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={isPending || wallets.length === 0}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PenLine className="mr-2 h-4 w-4" />}
              Sign & Send Transaction
            </Button>
          </form>
        </CardContent>
      </Card>
      <FeeEstimator mempool={mempool} onFeeEstimated={handleFeeEstimated} />
    </div>
  );
}
