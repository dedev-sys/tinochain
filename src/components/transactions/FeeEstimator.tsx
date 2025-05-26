'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { estimateFeeAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Gauge, Lightbulb, Loader2, Info } from 'lucide-react';
import type { TransactionData } from '@/lib/blockchain-service';

interface FeeEstimatorProps {
  mempool: TransactionData[];
  onFeeEstimated: (fee: number) => void;
}

export function FeeEstimator({ mempool, onFeeEstimated }: FeeEstimatorProps) {
  const [transactionDetails, setTransactionDetails] = useState('');
  const [estimatedFee, setEstimatedFee] = useState<number | null>(null);
  const [reasoning, setReasoning] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const getMempoolSummary = (): string => {
    const txCount = mempool.length;
    if (txCount === 0) {
      return "Mempool is currently empty.";
    }
    const fees = mempool.map(tx => tx.fee).filter(fee => fee > 0);
    const avgFee = fees.length > 0 ? (fees.reduce((a, b) => a + b, 0) / fees.length).toFixed(2) : "N/A";
    return `Mempool has ${txCount} transaction(s). Average fee (if any): ${avgFee} uemfCoin.`;
  };

  const handleSubmit = () => {
    if (!transactionDetails.trim()) {
      toast({ title: "Input Required", description: "Please describe your transaction.", variant: "destructive" });
      return;
    }
    setEstimatedFee(null);
    setReasoning(null);

    startTransition(async () => {
      const mempoolSummary = getMempoolSummary();
      const result = await estimateFeeAction(transactionDetails, mempoolSummary);
      if (result.success && result.suggestedFee !== undefined) {
        setEstimatedFee(result.suggestedFee);
        setReasoning(result.reasoning || 'No specific reasoning provided.');
        onFeeEstimated(result.suggestedFee);
        toast({ title: 'Fee Estimated!', description: `Suggested fee: ${result.suggestedFee} uemfCoin` });
      } else {
        toast({ title: 'Estimation Failed', description: result.message || 'Could not estimate fee.', variant: 'destructive' });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Gauge className="mr-2 h-5 w-5 text-primary" />
          AI Fee Estimator
        </CardTitle>
        <CardDescription>
          Describe your transaction to get an AI-suggested fee for faster processing.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="transactionDetails">Transaction Description</Label>
          <Textarea
            id="transactionDetails"
            placeholder="e.g., Sending 100 uemfCoin for a service, urgent payment"
            value={transactionDetails}
            onChange={(e) => setTransactionDetails(e.target.value)}
            className="min-h-[60px]"
          />
        </div>
        <Button onClick={handleSubmit} disabled={isPending} className="w-full">
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
          Estimate Fee
        </Button>
        {estimatedFee !== null && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Fee Suggestion: {estimatedFee} uemfCoin</AlertTitle>
            {reasoning && <AlertDescription>{reasoning}</AlertDescription>}
          </Alert>
        )}
      </CardContent>
      <CardFooter>
         <p className="text-xs text-muted-foreground">Current Mempool: {getMempoolSummary()}</p>
      </CardFooter>
    </Card>
  );
}
