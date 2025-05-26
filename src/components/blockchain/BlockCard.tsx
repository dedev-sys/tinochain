import type { BlockData } from '@/lib/blockchain-service';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Cube, User, Hash, CalendarDays, ListChecks, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface BlockCardProps {
  block: BlockData;
}

export function BlockCard({ block }: BlockCardProps) {
  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Cube className="mr-2 h-5 w-5 text-primary" />
          Block #{block.height}
        </CardTitle>
        <CardDescription className="text-xs break-all">
          <Hash className="inline mr-1 h-3 w-3" /> Hash: {block.hash}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center">
          <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
          Timestamp: {new Date(block.timestamp).toLocaleString()}
        </div>
        <div className="flex items-center">
          <ListChecks className="mr-2 h-4 w-4 text-muted-foreground" />
          Transactions: {block.transactions.length}
        </div>
        {block.miner && (
          <div className="flex items-center">
            <Award className="mr-2 h-4 w-4 text-muted-foreground" />
            Miner: <Badge variant="secondary" className="ml-1 text-xs">{block.miner.substring(0,10)}...</Badge>
          </div>
        )}
        <div className="text-xs break-all">
          <Hash className="inline mr-1 h-3 w-3 text-muted-foreground" />
          Prev Hash: {block.previousHash}
        </div>
        <div className="flex items-center">
          <User className="mr-2 h-4 w-4 text-muted-foreground" />
          Nonce: {block.nonce}
        </div>
      </CardContent>
      <CardFooter>
        {block.height === 0 && <Badge variant="outline">Genesis Block</Badge>}
      </CardFooter>
    </Card>
  );
}
