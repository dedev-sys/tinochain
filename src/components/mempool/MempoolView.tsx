import type { TransactionData } from '@/lib/blockchain-service';
import { TransactionCardShort } from './TransactionCardShort';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ClipboardList } from 'lucide-react';

interface MempoolViewProps {
  mempool: TransactionData[];
}

export function MempoolView({ mempool }: MempoolViewProps) {
  return (
    <div className="space-y-4 h-full flex flex-col">
      <h2 className="text-2xl font-semibold flex items-center">
        <ClipboardList className="mr-2 h-6 w-6 text-accent" />
        Mempool ({mempool.length})
      </h2>
      {mempool.length === 0 ? (
        <p className="text-muted-foreground">Mempool is empty. No pending transactions.</p>
      ) : (
        <ScrollArea className="flex-grow pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {mempool.map((tx) => (
              <TransactionCardShort key={tx.id} transaction={tx} />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
