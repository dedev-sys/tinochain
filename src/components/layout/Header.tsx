
'use client';

import { useState, useEffect } from 'react';
// Removed: useSearchParams, useRouter, usePathname
// Removed: Select components
import { Button } from '@/components/ui/button';

// These constants define the available networks and can be used by other parts of the application.
export const NETWORKS = [
  { id: 'main', name: 'Main Simulation' },
  { id: 'test', name: 'Test Simulation' },
  { id: 'dev', name: 'Development Net' },
];
export const DEFAULT_NETWORK_ID = 'main';
const APP_THEME_STORAGE_KEY = 'app-theme';

export function Header() {
  const [activeTheme, setActiveTheme] = useState('default'); // 'default' or 'rouge-noir'

  useEffect(() => {
    const storedTheme = localStorage.getItem(APP_THEME_STORAGE_KEY);
    if (storedTheme === 'rouge-noir') {
      document.documentElement.classList.add('theme-rouge-noir');
      setActiveTheme('rouge-noir');
    } else {
      document.documentElement.classList.remove('theme-rouge-noir');
      setActiveTheme('default');
    }
  }, []);

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
      <div className="container flex h-14 items-center">
        <div className="flex-1">
          {/* Left spacer, can be used for other elements later if needed */}
        </div>
        <div className="flex justify-center">
          <Button variant="ghost" onClick={toggleTheme} className="font-bold text-lg p-0 hover:bg-transparent">
            TinoChain
          </Button>
        </div>
        <div className="flex-1 flex justify-end">
          {/* Right spacer, network selector moved to BlockSimPageClient */}
        </div>
      </div>
    </header>
  );
}
