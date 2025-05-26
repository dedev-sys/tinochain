
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownRight, Coins, LineChart as LineChartIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ChartConfig } from '@/components/ui/chart';

interface HistoricalPriceData {
  date: string;
  price: number;
}

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number; // percentage
  marketCap: number;
  logoUrl: string;
  dataAiHint: string;
  historicalPrices: HistoricalPriceData[];
}

interface FormattedCryptoData extends CryptoData {
  formattedPrice: string;
  formattedMarketCap: string;
}

// Mock data - for a real app, this would come from an API
const mockCryptoData: CryptoData[] = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 34567.89, change24h: 1.25, marketCap: 650000000000, logoUrl: 'https://placehold.co/32x32.png', dataAiHint: 'Bitcoin logo', historicalPrices: [
    { date: 'Jan', price: 30000 }, { date: 'Feb', price: 32000 }, { date: 'Mar', price: 31000 }, { date: 'Apr', price: 34000 }, { date: 'May', price: 34567.89 },
  ]},
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 2345.67, change24h: -0.55, marketCap: 280000000000, logoUrl: 'https://placehold.co/32x32.png', dataAiHint: 'Ethereum logo', historicalPrices: [
    { date: 'Jan', price: 2000 }, { date: 'Feb', price: 2200 }, { date: 'Mar', price: 2100 }, { date: 'Apr', price: 2300 }, { date: 'May', price: 2345.67 },
  ]},
  { id: 'cardano', name: 'Cardano', symbol: 'ADA', price: 1.23, change24h: 3.10, marketCap: 40000000000, logoUrl: 'https://placehold.co/32x32.png', dataAiHint: 'Cardano logo', historicalPrices: [
    { date: 'Jan', price: 1.0 }, { date: 'Feb', price: 1.1 }, { date: 'Mar', price: 1.05 }, { date: 'Apr', price: 1.15 }, { date: 'May', price: 1.23 },
  ]},
  { id: 'solana', name: 'Solana', symbol: 'SOL', price: 45.67, change24h: -2.15, marketCap: 20000000000, logoUrl: 'https://placehold.co/32x32.png', dataAiHint: 'Solana logo', historicalPrices: [
    { date: 'Jan', price: 40 }, { date: 'Feb', price: 42 }, { date: 'Mar', price: 38 }, { date: 'Apr', price: 43 }, { date: 'May', price: 45.67 },
  ]},
  { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', price: 0.075, change24h: 5.50, marketCap: 10000000000, logoUrl: 'https://placehold.co/32x32.png', dataAiHint: 'Dogecoin logo', historicalPrices: [
    { date: 'Jan', price: 0.06 }, { date: 'Feb', price: 0.07 }, { date: 'Mar', price: 0.065 }, { date: 'Apr', price: 0.08 }, { date: 'May', price: 0.075 },
  ]},
];

const chartConfig = {
  price: {
    label: "Price (USD)",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function CryptoMarketView() {
  const [formattedCryptoData, setFormattedCryptoData] = useState<FormattedCryptoData[] | null>(null);
  const [selectedCrypto, setSelectedCrypto] = useState<FormattedCryptoData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const dataWithFormattedPrices = mockCryptoData.map(crypto => ({
      ...crypto,
      formattedPrice: crypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: crypto.price < 1 ? 4 : 2 }),
      formattedMarketCap: crypto.marketCap.toLocaleString(),
    }));
    setFormattedCryptoData(dataWithFormattedPrices);
  }, []);

  const handleRowClick = (crypto: FormattedCryptoData) => {
    setSelectedCrypto(crypto);
    setIsModalOpen(true);
  };

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Coins className="mr-2 h-6 w-6 text-primary" />
            Aperçu du Marché des Cryptomonnaies
          </CardTitle>
          <CardDescription>
            Cliquez sur une cryptomonnaie pour plus de détails. Données fictives.
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
                  <TableRow key={crypto.id} onClick={() => handleRowClick(crypto)} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <Image src={crypto.logoUrl} alt={`${crypto.name} logo`} width={32} height={32} className="rounded-full" data-ai-hint={crypto.dataAiHint} />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{crypto.name}</div>
                      <Badge variant="secondary" className="text-xs">{crypto.symbol}</Badge>
                    </TableCell>
                    <TableCell>${crypto.formattedPrice}</TableCell>
                    <TableCell className={`text-right ${crypto.change24h >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      <div className="flex items-center justify-end">
                        {crypto.change24h >= 0 ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                        {crypto.change24h.toFixed(2)}%
                      </div>
                    </TableCell>
                    <TableCell className="text-right">${crypto.formattedMarketCap}</TableCell>
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

      {selectedCrypto && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Image src={selectedCrypto.logoUrl} alt={`${selectedCrypto.name} logo`} width={24} height={24} className="rounded-full mr-2" data-ai-hint={selectedCrypto.dataAiHint} />
                {selectedCrypto.name} ({selectedCrypto.symbol})
              </DialogTitle>
              <DialogDescription>
                Détails et performance de {selectedCrypto.name}. (Données fictives)
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><strong>Prix Actuel:</strong> ${selectedCrypto.formattedPrice}</div>
                <div className={`${selectedCrypto.change24h >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  <strong>Variation 24h:</strong> {selectedCrypto.change24h.toFixed(2)}%
                </div>
                <div><strong>Capitalisation:</strong> ${selectedCrypto.formattedMarketCap}</div>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <LineChartIcon className="mr-2 h-5 w-5 text-primary" />
                    Historique de Prix (Fictif)
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[250px] w-full p-0">
                  <ChartContainer config={chartConfig} className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={selectedCrypto.historicalPrices}
                        margin={{
                          top: 5, right: 20, left: -10, bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `$${value.toLocaleString()}`} />
                        <Tooltip
                          contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                          labelStyle={{ color: 'hsl(var(--foreground))' }}
                        />
                        <Legend wrapperStyle={{fontSize: "12px"}} />
                        <Line type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--primary))" }} activeDot={{ r: 6 }} name="Prix (USD)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
