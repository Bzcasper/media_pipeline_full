'use client';

import { Bell, User } from 'lucide-react';
import { Button } from './ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-spotify-gray bg-spotify-dark/95 backdrop-blur px-8">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-white">Welcome back</h2>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-spotify-green" />
        </Button>

        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
