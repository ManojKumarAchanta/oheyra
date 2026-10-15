import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchEventBySlug } from '@/lib/api';
import { formatToIST } from '@pulse/utils';
import { Calendar, MapPin, Navigation, Share2, ShieldCheck, ArrowLeft, ExternalLink, Ticket } from 'lucide-react';
import type { Metadata } from 'next';

interface EventPageProps {
  params: Promise<{
    city: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { city, slug } = await params;
  const event = await fetchEventBySlug(city, slug);
  if (!event) return { title: 'Event Not Found — PULSE' };

  return {
    title: `${event.title} — Hyderabad Events | PULSE`,
    description: event.description.slice(0, 160),
    openGraph: {
      title: event.title,
      description: event.description.slice(0, 160),
      images: [{ url: event.coverImageUrl }],
      type: 'article',
    },
  };
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const { city, slug } = await params;
  const event = await fetchEventBySlug(city, slug);

  if (!event) {
    notFound();
  }

  const directionsUrl =
    event.venue?.googleMapsUrl ||
    `https://www.google.com/maps/dir/?api=1&destination=${event.location.lat},${event.location.lng}`;

  const isExpired = new Date(event.endTime) < new Date();

  // Schema.org Event JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description,
    startDate: event.startTime,
    endDate: event.endTime,
    eventStatus: isExpired
      ? 'https://schema.org/EventCancelled'
      : 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: event.venue?.name || 'Local Venue',
      address: {
        '@type': 'PostalAddress',
        streetAddress: event.venue?.address || 'Hyderabad',
        addressLocality: 'Hyderabad',
        addressRegion: 'Telangana',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: event.location.lat,
        longitude: event.location.lng,
      },
    },
    image: [event.coverImageUrl],
    organizer: {
      '@type': 'Organization',
      name: event.organizerName,
    },
    offers: {
      '@type': 'Offer',
      price: event.priceInr,
      priceCurrency: 'INR',
      availability: isExpired ? 'https://schema.org/Discontinued' : 'https://schema.org/InStock',
      url: event.registrationUrl || directionsUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:py-10">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Hyderabad Discovery</span>
        </Link>

        {/* Expired Warning Banner */}
        {isExpired && (
          <div className="mb-6 rounded-xl border border-electric-amber/30 bg-electric-amber/10 p-4 text-xs text-electric-amber">
            ⚠️ This event has already taken place. Browse our home feed to discover upcoming activities tonight!
          </div>
        )}

        {/* Hero Image */}
        <div className="relative h-64 sm:h-96 w-full overflow-hidden rounded-3xl border border-border bg-neutral-900 shadow-2xl">
          <Image
            src={event.coverImageUrl}
            alt={event.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/30 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="rounded-full bg-black/70 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white border border-white/10">
              {event.category?.name || 'Local Event'}
            </span>
            {event.verificationStatus === 'official' && (
              <span className="flex items-center gap-1 rounded-full bg-electric-cyan/20 backdrop-blur-md px-3 py-1 text-xs font-semibold text-electric-cyan border border-electric-cyan/30">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Verified Official</span>
              </span>
            )}
          </div>
        </div>

        {/* Header Details */}
        <div className="mt-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              {event.title}
            </h1>
            <p className="mt-1 text-xs text-neutral-400">
              Organized by <span className="text-white font-medium">{event.organizerName}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold tracking-wide uppercase ${
                event.priceType === 'free'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-surface-elevated text-white border border-border'
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

        {/* Schedule & Location Bento Box */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Schedule */}
          <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-electric-violet/15 text-electric-violet">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Date & Time</h4>
              <p className="mt-0.5 text-sm font-semibold text-white">{formatToIST(event.startTime)}</p>
              <p className="text-xs text-neutral-400">Until {formatToIST(event.endTime, 'h:mm a IST')}</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-electric-coral/15 text-electric-coral">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Location</h4>
              <p className="mt-0.5 text-sm font-semibold text-white">{event.venue?.name || 'Local Venue'}</p>
              <p className="text-xs text-neutral-400">{event.venue?.address || 'Hyderabad'}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 sm:flex-initial items-center justify-center gap-2 rounded-xl bg-electric-violet px-6 py-3 text-xs font-bold text-white hover:bg-electric-violet/90 transition-all shadow-lg shadow-electric-violet/20"
          >
            <Navigation className="h-4 w-4" />
            <span>Open in Google Maps</span>
          </a>

          {event.registrationUrl && (
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 sm:flex-initial items-center justify-center gap-2 rounded-xl bg-surface-elevated hover:bg-surface-highlight border border-border px-6 py-3 text-xs font-bold text-white transition-colors"
            >
              <Ticket className="h-4 w-4 text-electric-amber" />
              <span>Official RSVP / Tickets</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-60" />
            </a>
          )}
        </div>

        {/* Description Section */}
        <div className="mt-8 rounded-3xl border border-border bg-surface p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-3">About This Experience</h3>
          <p className="text-sm leading-relaxed text-neutral-200 whitespace-pre-line">
            {event.description}
          </p>
        </div>
      </div>
    </>
  );
}
