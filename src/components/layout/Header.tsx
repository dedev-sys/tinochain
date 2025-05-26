import Image from 'next/image';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="mr-4 flex items-center">
          <Image
            src="https://placehold.co/120x40.png"
            alt="Valentino Logo Placeholder"
            width={120}
            height={40}
            className="mr-3"
            data-ai-hint="VALENTINO logo script"
          />
          <span className="font-bold text-lg">BlockSim</span>
        </div>
        {/* Future navigation items can go here */}
      </div>
    </header>
  );
}
