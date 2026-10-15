'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, QrCode, PlusCircle, Bookmark, Sparkles } from 'lucide-react';

export function Navbar() {
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      try {
        const stored = localStorage.getItem('pulse_favorites');
        if (stored) {
          const parsed = JSON.parse(stored);
          setSavedCount(Array.isArray(parsed) ? parsed.length : 0);
        }
      } catch {
        setSavedCount(0);
      }
    };

    updateCount();
    window.addEventListener('storage', updateCount);
    window.addEventListener('pulse:favorites-changed', updateCount);
    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('pulse:favorites-changed', updateCount);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand & City Selector */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-electric-violet/20 text-electric-violet border border-electric-violet/40 group-hover:scale-105 transition-transform">
              <Sparkles className="h-4 w-4" />
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-electric-coral animate-ping" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-display">
              PULSE
            </span>
          </Link>

          <div className="flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-xs font-medium text-neutral-300 border border-border">
            <MapPin className="h-3 w-3 text-electric-coral" />
            <span>Hyderabad</span>
          </div>
        </div>

        {/* Quick Nav Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/qr"
            className="hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white hover:bg-surface border border-transparent hover:border-border transition-colors"
          >
            <QrCode className="h-3.5 w-3.5 text-electric-cyan" />
            <span>QR Studio</span>
          </Link>

          <Link
            href="/saved"
            aria-label="View Saved Events"
            className="relative flex items-center justify-center rounded-full p-2 text-neutral-300 hover:text-white hover:bg-surface border border-transparent hover:border-border transition-colors"
          >
            <Bookmark className="h-4 w-4" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-electric-violet text-[10px] font-bold text-white">
                {savedCount}
              </span>
            )}
          </Link>

          <Link
            href="/submit"
            className="flex items-center gap-1.5 rounded-full bg-electric-violet px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-electric-violet/90 transition-all shadow-lg shadow-electric-violet/20 hover:scale-[1.02]"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Post Event</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
