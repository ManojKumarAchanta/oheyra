'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { submitEvent } from '@/lib/api';
import { PlusCircle, CheckCircle2, ArrowLeft, Loader2, Sparkles } from 'lucide-react';

export default function SubmitEventPage() {
  const [formData, setFormData] = useState({
    title: '',
    categoryId: 'c1000000-0000-0000-0000-000000000001',
    venueName: '',
    address: '',
    lat: 17.4284,
    lng: 78.397,
    startTime: '',
    endTime: '',
    priceType: 'free' as const,
    priceInr: 0,
    description: '',
    coverImageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    registrationUrl: '',
    organizerName: '',
    organizerContact: '',
    honeypot: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const payload = {
        ...formData,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
      };

      const res = await submitEvent(payload);
      if (res.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(res.error?.message || 'Failed to submit event.');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mb-4">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-white font-display">Event Submitted!</h2>
        <p className="mt-2 text-sm text-neutral-300">
          Thank you for contributing to Hyderabad&apos;s cultural map. Our local curation team will verify the listing and publish it to the live map within 4 hours.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-xl bg-electric-violet px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-electric-violet/20"
        >
          Return to Discovery Feed
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Hyderabad Feed</span>
      </Link>

      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-electric-coral/15 px-3 py-1 text-xs font-semibold text-electric-coral border border-electric-coral/30 mb-2">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Community Curation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
          Post an Activity or Gig
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-neutral-400">
          Hosting an open mic, indie gig, acoustic session, or weekend food pop-up in Hyderabad? List it for free.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-border bg-surface p-6 shadow-2xl">
        {/* Anti-spam honeypot (invisible to humans) */}
        <input
          type="text"
          name="honeypot"
          value={formData.honeypot}
          onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
            Event Name *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Sunset Acoustic Jam at Jubilee Hills"
            className="w-full rounded-xl bg-surface-elevated px-4 py-2 text-sm text-white border border-border focus:border-electric-violet focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
              Category *
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full rounded-xl bg-surface-elevated px-4 py-2 text-sm text-white border border-border focus:border-electric-violet focus:outline-none"
            >
              <option value="c1000000-0000-0000-0000-000000000001">Live Music</option>
              <option value="c1000000-0000-0000-0000-000000000002">Nightlife</option>
              <option value="c1000000-0000-0000-0000-000000000003">Food & Pop-ups</option>
              <option value="c1000000-0000-0000-0000-000000000004">Arts & Culture</option>
              <option value="c1000000-0000-0000-0000-000000000005">Fitness & Outdoor</option>
              <option value="c1000000-0000-0000-0000-000000000006">Workshops</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
              Price Type
            </label>
            <select
              value={formData.priceType}
              onChange={(e) => setFormData({ ...formData, priceType: e.target.value as any })}
              className="w-full rounded-xl bg-surface-elevated px-4 py-2 text-sm text-white border border-border focus:border-electric-violet focus:outline-none"
            >
              <option value="free">Free Entry</option>
              <option value="paid">Ticketed</option>
              <option value="cover_charge">Cover Charge</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
              Start Time *
            </label>
            <input
              type="datetime-local"
              required
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="w-full rounded-xl bg-surface-elevated px-4 py-2 text-sm text-white border border-border focus:border-electric-violet focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
              End Time *
            </label>
            <input
              type="datetime-local"
              required
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              className="w-full rounded-xl bg-surface-elevated px-4 py-2 text-sm text-white border border-border focus:border-electric-violet focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
              Venue Name *
            </label>
            <input
              type="text"
              required
              value={formData.venueName}
              onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
              placeholder="e.g. Roastery Coffee House"
              className="w-full rounded-xl bg-surface-elevated px-4 py-2 text-sm text-white border border-border focus:border-electric-violet focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
              Address / Area *
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g. Road 14, Banjara Hills, Hyderabad"
              className="w-full rounded-xl bg-surface-elevated px-4 py-2 text-sm text-white border border-border focus:border-electric-violet focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
            Description *
          </label>
          <textarea
            required
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Tell people what to expect, who is performing, and any dress code or entry notes..."
            className="w-full rounded-xl bg-surface-elevated px-4 py-2 text-sm text-white border border-border focus:border-electric-violet focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
              Organizer Name *
            </label>
            <input
              type="text"
              required
              value={formData.organizerName}
              onChange={(e) => setFormData({ ...formData, organizerName: e.target.value })}
              placeholder="e.g. Hyderabad Acoustic Club"
              className="w-full rounded-xl bg-surface-elevated px-4 py-2 text-sm text-white border border-border focus:border-electric-violet focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
              Contact Email / Phone *
            </label>
            <input
              type="text"
              required
              value={formData.organizerContact}
              onChange={(e) => setFormData({ ...formData, organizerContact: e.target.value })}
              placeholder="curator@hydacoustic.org"
              className="w-full rounded-xl bg-surface-elevated px-4 py-2 text-sm text-white border border-border focus:border-electric-violet focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-electric-violet px-6 py-3 text-xs font-bold text-white hover:bg-electric-violet/90 transition-all shadow-lg shadow-electric-violet/20 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Submitting for Review...</span>
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4" />
              <span>Submit Event to Oheyra</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
