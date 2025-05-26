
'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const NETWORKS = [
  { id: 'main', name: 'Main Simulation' },
  { id: 'test', name: 'Test Simulation' },
  { id: 'dev', name: 'Development Net' },
];
export const DEFAULT_NETWORK_ID = 'main'; // Export for use elsewhere, e.g. page.tsx

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentNetwork = NETWORKS.some(n => n.id === searchParams.get('network')) ? searchParams.get('network')! : DEFAULT_NETWORK_ID;

  const handleNetworkChange = (networkId: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('network', networkId);
    router.push(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="mr-4 flex items-center">
          <span className="font-bold text-lg">BlockSim</span>
        </div>
        <div>
          <Select value={currentNetwork} onValueChange={handleNetworkChange}>
            <SelectTrigger className="w-[200px] text-sm">
              <SelectValue placeholder="Select Network" />
            </SelectTrigger>
            <SelectContent>
              {NETWORKS.map(network => (
                <SelectItem key={network.id} value={network.id} className="text-sm">
                  {network.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
}
