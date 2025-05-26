import type { BlockData } from '@/lib/blockchain-service';
import { BlockCard } from './BlockCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Blocks } from 'lucide-react';

interface BlockchainViewProps {
  chain: BlockData[];
}

export function BlockchainView({ chain }: BlockchainViewProps) {
  return (
    <div className="space-y-4 h-full flex flex-col">
      <h2 className="text-2xl font-semibold flex items-center">
        <Blocks className="mr-2 h-6 w-6 text-primary" />
        Blockchain Explorer
      </h2>
      {chain.length === 0 ? (
        <p>No blocks in the chain yet.</p>
      ) : (
        <ScrollArea className="flex-grow pr-4">
          <div className="space-y-4">
            {chain.slice().reverse().map((block) => ( // Display newest block first
              <BlockCard key={block.hash} block={block} />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
