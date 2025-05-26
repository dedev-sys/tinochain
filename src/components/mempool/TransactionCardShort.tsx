
'use client'; // Needs to be a client component for useState and useEffect

import type { TransactionData } from '@/lib/blockchain-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowRightLeft, Coins, Tag, UserCircle, Award, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react'; // Import useState and useEffect

interface TransactionCardShortProps {
  transaction: TransactionData;
  autoOpenContractTxId: string | null;
  clearAutoOpenContractTxId: () => void;
}

export function TransactionCardShort({ transaction, autoOpenContractTxId, clearAutoOpenContractTxId }: TransactionCardShortProps) {
  const isCoinbase = !transaction.fromAddress;
  
  const [isDialogOpen, setIsDialogOpen] = useState(
    !!(transaction.smartContractDetails && transaction.id === autoOpenContractTxId)
  );

  useEffect(() => {
    if (transaction.smartContractDetails && transaction.id === autoOpenContractTxId) {
      // Dialog was auto-opened, clear the trigger so it doesn't re-open on unrelated re-renders
      clearAutoOpenContractTxId();
    }
    // This effect should primarily react to the initial auto-open condition.
    // Re-running if transaction.id or autoOpenContractTxId changes is fine,
    // but the clearAutoOpenContractTxId ensures it's a one-time effect for a given ID.
  }, [transaction.id, autoOpenContractTxId, clearAutoOpenContractTxId, transaction.smartContractDetails]);

  return (
    <Card className="w-full text-xs shadow-md hover:shadow-lg transition-shadow duration-200 border border-accent/30 rounded-lg">
      <CardHeader className="p-3">
        <CardTitle className="flex items-center text-sm justify-between">
          <div className="flex items-center">
            <ArrowRightLeft className="mr-2 h-4 w-4 text-accent" />
            <span className="font-mono">Tx: {transaction.id.substring(0, 10)}...</span>
          </div>
          {isCoinbase && <Badge variant="secondary" className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-600">Coinbase</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 space-y-2">
        {!isCoinbase && (
          <div className="space-y-1">
            <div className="flex items-center">
              <UserCircle className="mr-2 h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <strong className="mr-1">De:</strong>
              <Badge variant="outline" className="ml-1 text-xs font-mono truncate" title={transaction.fromAddress || ""}>{transaction.fromAddress?.substring(0,12)}...</Badge>
            </div>
            <div className="flex items-center">
              <UserCircle className="mr-2 h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <strong className="mr-1">À:</strong>
              <Badge variant="outline" className="ml-1 text-xs font-mono truncate" title={transaction.toAddress}>{transaction.toAddress.substring(0,12)}...</Badge>
            </div>
          </div>
        )}
        {isCoinbase && (
           <div className="flex items-center">
             <Award className="mr-2 h-3.5 w-3.5 text-amber-600 dark:text-amber-500 flex-shrink-0" />
             <strong className="mr-1">À:</strong>
             <Badge variant="outline" className="ml-1 text-xs font-mono truncate" title={transaction.toAddress}>{transaction.toAddress.substring(0,12)}...</Badge>
           </div>
        )}
        
        <div className="flex items-center mt-1">
          <Coins className="mr-2 h-3.5 w-3.5 text-green-600 dark:text-green-500 flex-shrink-0" />
          <strong className="mr-1">Montant:</strong>
          <span className="font-semibold text-green-700 dark:text-green-400">{transaction.amount} uemfCoin</span>
        </div>

        {!isCoinbase && transaction.fee > 0 && (
          <div className="flex items-center">
            <Tag className="mr-2 h-3.5 w-3.5 text-orange-600 dark:text-orange-500 flex-shrink-0" />
            <strong className="mr-1">Frais:</strong>
            <span className="font-semibold text-orange-700 dark:text-orange-400">{transaction.fee} uemfCoin</span>
          </div>
        )}
        <CardDescription className="pt-1 text-muted-foreground font-mono text-[10px]">
          Sign: {transaction.signature.substring(0,18)}...
        </CardDescription>

        {transaction.smartContractDetails && (
          <div className="mt-2 text-right">
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs py-1 px-2 h-auto">
                  <FileText className="mr-1 h-3 w-3" />
                  Contrat
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-primary" />
                    Détails du Contrat Intelligent (Simulation)
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-sm text-left max-h-[400px] overflow-y-auto whitespace-pre-wrap break-words text-foreground">
                    {transaction.smartContractDetails}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Fermer</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
