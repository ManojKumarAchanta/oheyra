'use client';

import React, { useState } from 'react';
import { Search, Flame, Clock, CalendarDays, SlidersHorizontal, Sparkles } from 'lucide-react';
import type { Event, Category } from '@oheyra/contracts';
import { EventCard } from './EventCard';

interface BottomSheetFeedProps {
  events: Event[];
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  selectedTimeWindow: string;
  onSelectTimeWindow: (window: string) => void;
  selectedEventId: string | null;
  onSelectEvent: (event: Event) => void;
}

export function BottomSheetFeed({
  events,
  categories,
  selectedCategory,
  onSelectCategory,
  selectedTimeWindow,
  onSelectTimeWindow,
  selectedEventId,
  onSelectEvent,
}: BottomSheetFeedProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('all');

  const filtered = events.filter((e) => {
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = e.title.toLowerCase().includes(q);
      const matchVenue = e.venue?.name?.toLowerCase().includes(q) || false;
      const matchNeighborhood = e.venue?.neighborhood?.toLowerCase().includes(q) || false;
      if (!matchTitle && !matchVenue && !matchNeighborhood) return false;
    }

    // Neighborhood filter
    if (selectedNeighborhood !== 'all') {
      const hood = e.venue?.neighborhood?.toLowerCase() || '';
      if (!hood.includes(selectedNeighborhood.toLowerCase())) return false;
    }

    return true;
  });

  return (
    <div className="flex h-full flex-col bg-background/95 backdrop-blur-xl border-t md:border-t-0 md:border-l border-border">
      {/* Search & Filter Header */}
      <div className="flex flex-col gap-3 p-4 border-b border-border/60">
        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events, live music, or cafés in Hyderabad..."
            className="w-full rounded-xl bg-surface pl-10 pr-4 py-2 text-sm text-white placeholder-neutral-500 border border-border focus:border-electric-violet focus:outline-none focus:ring-1 focus:ring-electric-violet"
          />
        </div>

        {/* Time Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => onSelectTimeWindow('all')}
            className={`flex items-center gap-1 rounded-full px-3 py-1 font-medium transition-colors shrink-0 ${
              selectedTimeWindow === 'all'
                ? 'bg-white text-black font-semibold'
                : 'bg-surface text-neutral-300 hover:text-white border border-border'
            }`}
          >
            <Sparkles className="h-3 w-3" />
            <span>All Time</span>
          </button>

          <button
            onClick={() => onSelectTimeWindow('now')}
            className={`flex items-center gap-1 rounded-full px-3 py-1 font-medium transition-colors shrink-0 ${
              selectedTimeWindow === 'now'
                ? 'bg-electric-coral text-white font-semibold shadow-md shadow-electric-coral/25'
                : 'bg-surface text-neutral-300 hover:text-white border border-border'
            }`}
          >
            <Flame className="h-3 w-3 text-electric-coral" />
            <span>Right Now</span>
          </button>

          <button
            onClick={() => onSelectTimeWindow('tonight')}
            className={`flex items-center gap-1 rounded-full px-3 py-1 font-medium transition-colors shrink-0 ${
              selectedTimeWindow === 'tonight'
                ? 'bg-electric-violet text-white font-semibold shadow-md shadow-electric-violet/25'
                : 'bg-surface text-neutral-300 hover:text-white border border-border'
            }`}
          >
            <Clock className="h-3 w-3 text-electric-violet" />
            <span>Tonight</span>
          </button>

          <button
            onClick={() => onSelectTimeWindow('weekend')}
            className={`flex items-center gap-1 rounded-full px-3 py-1 font-medium transition-colors shrink-0 ${
              selectedTimeWindow === 'weekend'
                ? 'bg-electric-cyan text-black font-semibold shadow-md shadow-electric-cyan/25'
                : 'bg-surface text-neutral-300 hover:text-white border border-border'
            }`}
          >
            <CalendarDays className="h-3 w-3 text-electric-cyan" />
            <span>This Weekend</span>
          </button>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => onSelectCategory('')}
            className={`rounded-full px-3 py-1 font-medium shrink-0 transition-colors ${
              !selectedCategory
                ? 'bg-surface-highlight text-white border border-white/20'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug === selectedCategory ? '' : cat.slug)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-medium shrink-0 transition-all ${
                cat.slug === selectedCategory
                  ? 'bg-surface-elevated text-white border border-electric-violet shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 bg-surface/50 border border-transparent'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: cat.colorHex }} />
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Neighborhood Pills Bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-surface/40 border-b border-border/40 text-[11px] overflow-x-auto no-scrollbar">
        <span className="text-neutral-500 font-semibold uppercase tracking-wider shrink-0">Area:</span>
        {['all', 'Jubilee Hills', 'Banjara Hills', 'Gachibowli', 'Old City'].map((hood) => (
          <button
            key={hood}
            onClick={() => setSelectedNeighborhood(hood)}
            className={`rounded-full px-2.5 py-0.5 shrink-0 transition-colors ${
              selectedNeighborhood === hood
                ? 'bg-white/20 text-white font-medium'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {hood === 'all' ? 'All Areas' : hood}
          </button>
        ))}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-4 py-2 text-xs text-neutral-400">
        <span>{filtered.length} activities happening in Hyderabad</span>
        <span className="text-[11px] text-neutral-500">Auto-refreshed</span>
      </div>

      {/* Scrollable Events List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface border border-border text-neutral-500 mb-3">
              <SlidersHorizontal className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-semibold text-white">No activities found</h4>
            <p className="mt-1 text-xs text-neutral-400 max-w-xs">
              Try adjusting your category or time filters, or select a different neighborhood.
            </p>
            <button
              onClick={() => {
                onSelectCategory('');
                onSelectTimeWindow('all');
                setSelectedNeighborhood('all');
                setSearchQuery('');
              }}
              className="mt-4 rounded-full bg-surface px-4 py-1.5 text-xs font-medium text-electric-violet border border-electric-violet/40 hover:bg-surface-elevated transition-colors"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          filtered.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isHighlighted={event.id === selectedEventId}
              onSelect={onSelectEvent}
            />
          ))
        )}
      </div>
    </div>
  );
}
