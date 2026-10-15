'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Navigation, Bookmark, CheckCircle2, ShieldCheck } from 'lucide-react';
import type { Event } from '@pulse/contracts';
import { formatToIST } from '@pulse/utils';

interface EventCardProps {
  event: Event;
  isHighlighted?: boolean;
  onSelect?: (event: Event) => void;
}

export function EventCard({ event, isHighlighted = false, onSelect }: EventCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('pulse_favorites');
      if (stored) {
        const ids = JSON.parse(stored);
        setIsSaved(Array.isArray(ids) && ids.includes(event.id));
      }
    } catch {
      setIsSaved(false);
    }
  }, [event.id]);

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const stored = localStorage.getItem('pulse_favorites');
      let ids: string[] = stored ? JSON.parse(stored) : [];
      if (ids.includes(event.id)) {
        ids = ids.filter((id) => id !== event.id);
        setIsSaved(false);
      } else {
        ids.push(event.id);
        setIsSaved(true);
      }
      localStorage.setItem('pulse_favorites', JSON.stringify(ids));
      window.dispatchEvent(new Event('pulse:favorites-changed'));
    } catch {
      // Ignored in restricted environments
    }
  };

  const directionsUrl =
    event.venue?.googleMapsUrl ||
    `https://www.google.com/maps/dir/?api=1&destination=${event.location.lat},${event.location.lng}`;

  return (
    <article
      onClick={() => onSelect?.(event)}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-200 cursor-pointer ${
        isHighlighted
          ? 'border-electric-violet bg-surface-elevated shadow-xl shadow-electric-violet/15 ring-2 ring-electric-violet/50'
          : 'border-border/60 bg-surface hover:border-border-glow hover:bg-surface-elevated'
      }`}
    >
      {/* Cover Image & Category Badges */}
      <div className="relative h-44 w-full overflow-hidden bg-neutral-900">
        <Image
          src={event.coverImageUrl}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-black/40" />

        {/* Category Pill */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-xs font-semibold text-white border border-white/10">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: event.category?.colorHex || '#8B5CF6' }}
          />
          <span>{event.category?.name || 'Local Event'}</span>
        </div>

        {/* Bookmark Button */}
        <button
          onClick={toggleSave}
          aria-label={isSaved ? 'Remove from saved' : 'Save event'}
          className={`absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all ${
            isSaved
              ? 'bg-electric-violet text-white shadow-md'
              : 'bg-black/60 text-neutral-300 hover:text-white hover:bg-black/80'
          }`}
        >
          <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Price Tag */}
        <div className="absolute bottom-2.5 left-3">
          <span
            className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-bold tracking-wide uppercase ${
              event.priceType === 'free'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-black/70 text-white border border-white/20'
            }`}
          >
            {event.priceType === 'free'
              ? 'Free Entry'
              : event.priceType === 'cover_charge'
              ? `Cover ₹${event.priceInr}`
              : `₹${event.priceInr}`}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-4">
        {/* Verification Status */}
        <div className="mb-1.5 flex items-center gap-1.5 text-[11px] text-neutral-400">
          {event.verificationStatus === 'official' ? (
            <span className="flex items-center gap-1 text-electric-cyan font-medium">
              <ShieldCheck className="h-3 w-3" />
              <span>Official Event</span>
            </span>
          ) : event.verificationStatus === 'community_verified' ? (
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <CheckCircle2 className="h-3 w-3" />
              <span>Community Verified</span>
            </span>
          ) : (
            <span>Organizer Listed</span>
          )}
          <span>•</span>
          <span>{event.organizerName}</span>
        </div>

        {/* Title */}
        <h3 className="line-clamp-1 text-base font-semibold text-white group-hover:text-electric-violet transition-colors">
          <Link href={`/events/hyderabad/${event.slug}`}>{event.title}</Link>
        </h3>

        {/* Date & Time */}
        <div className="mt-2 flex items-center gap-1.5 text-xs text-neutral-300">
          <Calendar className="h-3.5 w-3.5 text-electric-violet shrink-0" />
          <span>{formatToIST(event.startTime)}</span>
        </div>

        {/* Venue & Neighborhood */}
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-neutral-400">
          <MapPin className="h-3.5 w-3.5 text-electric-coral shrink-0" />
          <span className="truncate">
            {event.venue?.name || 'Local Venue'}
            {event.venue?.neighborhood ? `, ${event.venue.neighborhood}` : ''}
          </span>
        </div>

        {/* Quick Actions Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-xs font-semibold text-electric-cyan hover:text-white transition-colors"
          >
            <Navigation className="h-3 w-3" />
            <span>Directions</span>
          </a>

          <Link
            href={`/events/hyderabad/${event.slug}`}
            className="text-xs font-medium text-neutral-400 hover:text-white transition-colors"
          >
            Details →
          </Link>
        </div>
      </div>
    </article>
  );
}
