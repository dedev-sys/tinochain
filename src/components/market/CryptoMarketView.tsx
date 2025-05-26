
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownRight, Coins } from 'lucide-react';

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number; // percentage
  marketCap: number;
  logoUrl: string;
  dataAiHint: string;
}

interface FormattedCryptoData extends CryptoData {
  formattedPrice: string;
}

// Données fictives - pour une application réelle, cela proviendrait d'une API
const mockCryptoData: CryptoData[] = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 34567.89, change24h: 1.25, marketCap: 650000000000, logoUrl: 'https://placehold.co/32x32.png', dataAiHint: 'Bitcoin logo' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 2345.67, change24h: -0.55, marketCap: 280000000000, logoUrl: 'https://placehold.co/32x32.png', dataAiHint: 'Ethereum logo' },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA', price: 1.23, change24h: 3.10, marketCap: 40000000000, logoUrl: 'https://placehold.co/32x32.png', dataAiHint: 'Cardano logo' },
  { id: 'solana', name: 'Solana', symbol: 'SOL', price: 45.67, change24h: -2.15, marketCap: 20000000000, logoUrl: 'https://placehold.co/32x32.png', dataAiHint: 'Solana logo' },
  { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', price: 0.075, change24h: 5.50, marketCap: 10000000000, logoUrl: 'https://placehold.co/32x32.png', dataAiHint: 'Dogecoin logo' },
];

export function CryptoMarketView() {
  const [formattedCryptoData, setFormattedCryptoData] = useState<FormattedCryptoData[] | null>(null);

  useEffect(() => {
    const dataWithFormattedPrices = mockCryptoData.map(crypto => ({
      ...crypto,
      formattedPrice: crypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: crypto.price < 1 ? 4 : 2 })
    }));
    setFormattedCryptoData(dataWithFormattedPrices);
  }, []); // Empty dependency array ensures this runs once on mount on the client

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Coins className="mr-2 h-6 w-6 text-primary" />
          Aperçu du Marché des Cryptomonnaies
        </CardTitle>
        <CardDescription>
          Données fictives. Pour une application réelle, ces informations proviendraient d'une API de marché.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead className="text-right">Variation 24h</TableHead>
              <TableHead className="text-right">Capitalisation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formattedCryptoData ? (
              formattedCryptoData.map((crypto) => (
                <TableRow key={crypto.id}>
                  <TableCell>
                    <Image src={crypto.logoUrl} alt={`${crypto.name} logo`} width={32} height={32} className="rounded-full" data-ai-hint={crypto.dataAiHint} />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{crypto.name}</div>
                    <Badge variant="secondary" className="text-xs">{crypto.symbol}</Badge>
                  </TableCell>
                  <TableCell>${crypto.formattedPrice}</TableCell>
                  <TableCell className={`text-right ${crypto.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <div className="flex items-center justify-end">
                      {crypto.change24h >= 0 ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                      {crypto.change24h.toFixed(2)}%
                    </div>
                  </TableCell>
                  <TableCell className="text-right">${crypto.marketCap.toLocaleString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">Chargement des données du marché...</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
