import React from 'react';
import Link from 'next/link';
import { fetchEvents, fetchCategories } from '@/lib/api';
import { EventCard } from '@/components/events/EventCard';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';

interface CategoryPageProps {
  params: Promise<{
    city: string;
    category: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { city, category } = await params;
  const formattedCity = city.charAt(0).toUpperCase() + city.slice(1);
  const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);

  return {
    title: `${formattedCategory} Events in ${formattedCity} — PULSE`,
    description: `Discover upcoming ${category} gigs, activities, and pop-ups in ${formattedCity}.`,
  };
}

export default async function CategoryHubPage({ params }: CategoryPageProps) {
  const { city, category } = await params;
  const [events, categories] = await Promise.all([
    fetchEvents({ city, category }),
    fetchCategories(),
  ]);

  const activeCategory = categories.find((c) => c.slug === category);
  const formattedCity = city.charAt(0).toUpperCase() + city.slice(1);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Interactive Map</span>
      </Link>

      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-xs font-medium text-neutral-300 border border-border mb-3">
          <Sparkles className="h-3 w-3 text-electric-violet" />
          <span>{formattedCity} Discovery</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white font-display">
          {activeCategory?.name || category} in {formattedCity}
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          Showing {events.length} active listings verified across Jubilee Hills, Banjara Hills, Gachibowli, and Old City.
        </p>
      </div>

      {events.length === 0 ? (
        <div className="rounded-3xl border border-border bg-surface p-12 text-center">
          <p className="text-sm text-neutral-400">No events currently found in this category.</p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-full bg-electric-violet px-5 py-2 text-xs font-semibold text-white"
          >
            Explore All Activities
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
