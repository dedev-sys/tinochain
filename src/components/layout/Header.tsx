
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button'; // Import Button

const NETWORKS = [
  { id: 'main', name: 'Main Simulation' },
  { id: 'test', name: 'Test Simulation' },
  { id: 'dev', name: 'Development Net' },
];
export const DEFAULT_NETWORK_ID = 'main'; // Export for use elsewhere, e.g. page.tsx
const APP_THEME_STORAGE_KEY = 'app-theme';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentNetwork = NETWORKS.some(n => n.id === searchParams.get('network')) ? searchParams.get('network')! : DEFAULT_NETWORK_ID;

  const [activeTheme, setActiveTheme] = useState('default'); // 'default' or 'rouge-noir'

  useEffect(() => {
    // This effect runs only on the client
    const storedTheme = localStorage.getItem(APP_THEME_STORAGE_KEY);
    if (storedTheme === 'rouge-noir') {
      document.documentElement.classList.add('theme-rouge-noir');
      setActiveTheme('rouge-noir');
    } else {
      document.documentElement.classList.remove('theme-rouge-noir'); // Ensure it's removed if not set or set to default
      setActiveTheme('default');
    }
  }, []);

  const handleNetworkChange = (networkId: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('network', networkId);
    router.push(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
  };

  const toggleTheme = () => {
    if (activeTheme === 'rouge-noir') {
      document.documentElement.classList.remove('theme-rouge-noir');
      localStorage.setItem(APP_THEME_STORAGE_KEY, 'default');
      setActiveTheme('default');
    } else {
      document.documentElement.classList.add('theme-rouge-noir');
      localStorage.setItem(APP_THEME_STORAGE_KEY, 'rouge-noir');
      setActiveTheme('rouge-noir');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="mr-4 flex items-center">
          <Button variant="ghost" onClick={toggleTheme} className="font-bold text-lg p-0 hover:bg-transparent">
            TinoChain
          </Button>
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
