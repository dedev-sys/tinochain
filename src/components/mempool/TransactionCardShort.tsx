import type { TransactionData } from '@/lib/blockchain-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRightLeft, Coins, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TransactionCardShortProps {
  transaction: TransactionData;
}

export function TransactionCardShort({ transaction }: TransactionCardShortProps) {
  const isCoinbase = !transaction.fromAddress;
  return (
    <Card className="w-full text-xs shadow-sm">
      <CardHeader className="p-3">
        <CardTitle className="flex items-center text-sm">
          <ArrowRightLeft className="mr-2 h-4 w-4 text-accent" />
          Tx: {transaction.id.substring(0, 12)}...
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 space-y-1">
        {isCoinbase ? (
          <p><strong>To:</strong> <Badge variant="outline">{transaction.toAddress.substring(0,10)}...</Badge> (Coinbase)</p>
        ) : (
          <p><strong>From:</strong> <Badge variant="outline">{transaction.fromAddress?.substring(0,10)}...</Badge></p>
        )}
        {!isCoinbase && <p><strong>To:</strong> <Badge variant="outline">{transaction.toAddress.substring(0,10)}...</Badge></p>}
        <p className="flex items-center"><Coins className="mr-1 h-3 w-3" /> Amount: {transaction.amount} uemfCoin</p>
        {!isCoinbase && <p className="flex items-center"><Tag className="mr-1 h-3 w-3" /> Fee: {transaction.fee} uemfCoin</p>}
         <CardDescription>Signature: {transaction.signature.substring(0,15)}...</CardDescription>
      </CardContent>
    </Card>
  );
}
