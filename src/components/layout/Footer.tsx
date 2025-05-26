
'use client';

import { Facebook, Instagram, Twitter } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
      <div className="container flex h-16 items-center justify-center space-x-6">
        <Link href="https://facebook.com/your-page-name" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors">
          <Facebook className="h-6 w-6" />
        </Link>
        <Link href="https://instagram.com/your-username" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors">
          <Instagram className="h-6 w-6" />
        </Link>
        <Link href="https://twitter.com/your-handle" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors">
          <Twitter className="h-6 w-6" />
        </Link>
      </div>
    </footer>
  );
}
