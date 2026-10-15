'use client';

import React, { useState, useEffect } from 'react';
import { fetchEvents, fetchCategories, fetchBanners } from '@/lib/api';
import type { Event, Category, Banner } from '@oheyra/contracts';
import { DiscoveryMap } from '@/components/map/DiscoveryMap';
import { BottomSheetFeed } from '@/components/events/BottomSheetFeed';
import { DynamicBanner } from '@/components/ui/Banner';
import { Map, List } from 'lucide-react';

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTimeWindow, setSelectedTimeWindow] = useState<string>('all');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'map' | 'list'>('map');
  const [loading, setLoading] = useState(true);

  // Load Initial Discovery Data
  useEffect(() => {
    async function loadData() {
      try {
        const [cats, bans, evts] = await Promise.all([
          fetchCategories(),
          fetchBanners(),
          fetchEvents({ city: 'hyderabad' }),
        ]);
        setCategories(cats);
        setBanners(bans);
        setEvents(evts);
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Re-fetch on filter changes
  useEffect(() => {
    async function filterEvents() {
      const filtered = await fetchEvents({
        city: 'hyderabad',
        category: selectedCategory || undefined,
        timeWindow: selectedTimeWindow,
      });
      setEvents(filtered);
    }
    filterEvents();
  }, [selectedCategory, selectedTimeWindow]);

  const handleSelectEvent = (event: Event) => {
    setSelectedEventId(event.id);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden relative">
      {/* Top Dynamic Banner if available */}
      {banners.length > 0 && <DynamicBanner banner={banners[0]} />}

      {/* Main Dual View Area (Map + Feed) */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Map View */}
        <div
          className={`h-full w-full md:w-7/12 lg:w-2/3 ${
            mobileView === 'list' ? 'hidden md:block' : 'block'
          }`}
        >
          <DiscoveryMap
            events={events}
            selectedEventId={selectedEventId}
            onSelectEvent={handleSelectEvent}
          />
        </div>

        {/* Feed View */}
        <div
          className={`h-full w-full md:w-5/12 lg:w-1/3 flex flex-col ${
            mobileView === 'map' ? 'hidden md:flex' : 'flex'
          }`}
        >
          <BottomSheetFeed
            events={events}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedTimeWindow={selectedTimeWindow}
            onSelectTimeWindow={setSelectedTimeWindow}
            selectedEventId={selectedEventId}
            onSelectEvent={handleSelectEvent}
          />
        </div>

        {/* Mobile View Toggle Float Button */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 md:hidden">
          <button
            onClick={() => setMobileView(mobileView === 'map' ? 'list' : 'map')}
            className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold text-black shadow-2xl shadow-black/80 border border-white/20 active:scale-95 transition-transform"
          >
            {mobileView === 'map' ? (
              <>
                <List className="h-4 w-4" />
                <span>Show List Feed ({events.length})</span>
              </>
            ) : (
              <>
                <Map className="h-4 w-4 text-electric-violet" />
                <span>Show Map</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
