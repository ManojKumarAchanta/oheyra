'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, ArrowRight, Zap } from 'lucide-react';
import type { Banner as BannerType } from '@pulse/contracts';

interface BannerProps {
  banner: BannerType;
}

export function DynamicBanner({ banner }: BannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !banner.isActive) return null;

  return (
    <div className="relative border-b border-border bg-gradient-to-r from-surface via-surface-elevated to-surface px-4 py-2.5 text-sm text-neutral-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-electric-amber/20 text-electric-amber">
            <Zap className="h-3 w-3" />
          </span>
          <p className="truncate font-medium text-xs sm:text-sm">
            <span className="font-semibold text-white">{banner.title}</span>
            {banner.subtitle && (
              <span className="hidden md:inline text-neutral-400 ml-2">— {banner.subtitle}</span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={banner.destinationUrl}
            className="flex items-center gap-1 rounded-full bg-white/10 hover:bg-white/15 px-3 py-1 text-xs font-semibold text-white transition-colors"
          >
            <span>{banner.ctaText}</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="rounded-full p-1 text-neutral-400 hover:text-white transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
