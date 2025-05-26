import type { TransactionData } from '@/lib/blockchain-service';
import { TransactionCardShort } from './TransactionCardShort';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ClipboardList, ArchiveX } from 'lucide-react'; // Added ArchiveX

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
        <div className="flex-grow flex flex-col items-center justify-center text-muted-foreground p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
          <ArchiveX className="w-16 h-16 mb-4 text-accent/60" />
          <p className="text-lg font-medium">Mempool Vide</p>
          <p className="text-sm text-center">Aucune transaction en attente pour le moment.</p>
        </div>
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
