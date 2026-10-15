'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchEvents } from '@/lib/api';
import type { Event } from '@pulse/contracts';
import { EventCard } from '@/components/events/EventCard';
import { Bookmark, ArrowLeft } from 'lucide-react';

export default function SavedEventsPage() {
  const [savedEvents, setSavedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSaved() {
      try {
        const stored = localStorage.getItem('pulse_favorites');
        const ids: string[] = stored ? JSON.parse(stored) : [];

        if (ids.length > 0) {
          const allEvents = await fetchEvents({ city: 'hyderabad' });
          const matches = allEvents.filter((e) => ids.includes(e.id));
          setSavedEvents(matches);
        } else {
          setSavedEvents([]);
        }
      } catch {
        setSavedEvents([]);
      } finally {
        setLoading(false);
      }
    }

    loadSaved();
    window.addEventListener('pulse:favorites-changed', loadSaved);
    return () => window.removeEventListener('pulse:favorites-changed', loadSaved);
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Hyderabad Discovery</span>
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-electric-violet/20 text-electric-violet border border-electric-violet/40">
          <Bookmark className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white font-display">Saved Activities</h1>
          <p className="text-xs text-neutral-400">
            {savedEvents.length} bookmarked experiences in Hyderabad
          </p>
        </div>
      </div>

      {savedEvents.length === 0 ? (
        <div className="rounded-3xl border border-border bg-surface p-12 text-center">
          <Bookmark className="mx-auto h-8 w-8 text-neutral-600 mb-3" />
          <h3 className="text-sm font-semibold text-white">No saved events yet</h3>
          <p className="mt-1 text-xs text-neutral-400 max-w-xs mx-auto">
            Click the bookmark icon on any event card to save it for later. No sign-up required.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-full bg-electric-violet px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-electric-violet/20"
          >
            Explore Events
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
