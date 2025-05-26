
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BlockchainService } from '@/lib/blockchain-service';
import { useToast } from '@/hooks/use-toast';
import { Gift, Heart } from 'lucide-react';
import { useState } from 'react';

interface DonationCardProps {
  networkId: string;
  onDonateClick: (donationAddress: string) => void;
}

export function DonationCard({ networkId, onDonateClick }: DonationCardProps) {
  const { toast } = useToast();
  const [donationAddress, setDonationAddress] = useState<string | null>(null);

  const handleInitiateDonation = () => {
    const address = BlockchainService.getDonationAddress(networkId);
    if (address) {
      setDonationAddress(address); // Store for display if needed
      onDonateClick(address);
      toast({
        title: 'Prêt à faire un don !',
        description: `L'adresse du destinataire a été pré-remplie: ${address.substring(0, 20)}...`,
      });
    } else {
      toast({
        title: 'Erreur',
        description: "Impossible de trouver l'adresse de donation pour ce réseau.",
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Heart className="mr-2 h-5 w-5 text-red-500" />
          Soutenir Notre Mission
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Participez à notre effort pour démocratiser la technologie blockchain.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm leading-relaxed">
          Le développement de ce projet est là pour aider les personnes en difficulté en faisant la promotion de la blockchain. Votre soutien nous permet de continuer ce travail.
        </p>
        <Button onClick={handleInitiateDonation} className="w-full bg-green-600 hover:bg-green-700 text-white">
          <Gift className="mr-2 h-4 w-4" />
          Faire un don
        </Button>
        {donationAddress && (
             <p className="text-xs text-muted-foreground text-center pt-2">
                L'adresse de donation pour le réseau <span className="font-semibold capitalize">{networkId}</span> est : <br/> <span className="font-mono break-all">{donationAddress}</span>.
             </p>
        )}
      </CardContent>
    </Card>
  );
}
