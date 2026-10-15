import { z } from 'zod';
export * from '@oheyra/config';

// ==========================================
// 1. Common & Geospatial Primitives
// ==========================================
export const CoordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});
export type Coordinates = z.infer<typeof CoordinatesSchema>;

export const BoundingBoxSchema = z.string().regex(
  /^-?\d+(\.\d+)?,-?\d+(\.\d+)?,-?\d+(\.\d+)?,-?\d+(\.\d+)?$/,
  'Bounding box must be in format minLng,minLat,maxLng,maxLat'
);

// ==========================================
// 2. City & Category Schemas
// ==========================================
export const CitySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  state: z.string().min(1),
  countryCode: z.string().default('IN'),
  center: CoordinatesSchema,
  defaultZoom: z.number().int().default(12),
  isActive: z.boolean().default(true),
});
export type City = z.infer<typeof CitySchema>;

export const CategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  iconName: z.string().min(1),
  colorHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  displayOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});
export type Category = z.infer<typeof CategorySchema>;

// ==========================================
// 3. Venue Schema
// ==========================================
export const VenueSchema = z.object({
  id: z.string().uuid(),
  cityId: z.string().uuid(),
  neighborhood: z.string().optional(),
  name: z.string().min(1),
  slug: z.string().min(1),
  address: z.string().min(1),
  location: CoordinatesSchema,
  googleMapsUrl: z.string().url().optional(),
  websiteUrl: z.string().url().optional(),
  instagramHandle: z.string().optional(),
});
export type Venue = z.infer<typeof VenueSchema>;

// ==========================================
// 4. Event Schemas
// ==========================================
export const PriceTypeEnum = z.enum(['free', 'paid', 'cover_charge']);
export type PriceType = z.infer<typeof PriceTypeEnum>;

export const PublicationStatusEnum = z.enum(['draft', 'pending_review', 'published', 'rejected', 'archived']);
export type PublicationStatus = z.infer<typeof PublicationStatusEnum>;

export const VerificationStatusEnum = z.enum(['unverified', 'community_verified', 'organizer_verified', 'official']);
export type VerificationStatus = z.infer<typeof VerificationStatusEnum>;

export const EventSchema = z.object({
  id: z.string().uuid(),
  cityId: z.string().uuid(),
  venueId: z.string().uuid().nullable().optional(),
  categoryId: z.string().uuid(),
  title: z.string().min(3).max(140),
  slug: z.string().min(1),
  description: z.string().min(10),
  coverImageUrl: z.string().url(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  location: CoordinatesSchema,
  priceType: PriceTypeEnum,
  priceInr: z.number().nonnegative().default(0),
  registrationUrl: z.string().url().nullable().optional(),
  publicationStatus: PublicationStatusEnum,
  verificationStatus: VerificationStatusEnum,
  isFeatured: z.boolean().default(false),
  organizerName: z.string().min(1),
  organizerContact: z.string().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  // Denormalized relations for fast client rendering:
  category: CategorySchema.optional(),
  venue: VenueSchema.optional(),
});
export type Event = z.infer<typeof EventSchema>;

// ==========================================
// 5. Query Filters
// ==========================================
export const EventQuerySchema = z.object({
  city: z.string().default('hyderabad'),
  category: z.string().optional(),
  neighborhood: z.string().optional(),
  timeWindow: z.enum(['all', 'now', 'tonight', 'weekend']).default('all'),
  bbox: BoundingBoxSchema.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(30),
  cursor: z.string().optional(),
});
export type EventQuery = z.infer<typeof EventQuerySchema>;

// ==========================================
// 6. Dynamic Banners
// ==========================================
export const BannerPlacementEnum = z.enum(['home_top', 'feed_interstitial']);
export type BannerPlacement = z.infer<typeof BannerPlacementEnum>;

export const BannerSchema = z.object({
  id: z.string().uuid(),
  cityId: z.string().uuid().nullable().optional(),
  title: z.string().min(1),
  subtitle: z.string().nullable().optional(),
  ctaText: z.string().min(1),
  destinationUrl: z.string().url(),
  imageUrl: z.string().url().nullable().optional(),
  placement: BannerPlacementEnum,
  priority: z.number().int().default(0),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  isActive: z.boolean().default(true),
});
export type Banner = z.infer<typeof BannerSchema>;

// ==========================================
// 7. Community Submission & Report Schemas
// ==========================================
export const EventSubmissionSchema = z.object({
  citySlug: z.string().min(1).default('hyderabad'),
  title: z.string().min(3, 'Title must be at least 3 characters').max(140),
  categoryId: z.string().uuid('Valid category must be selected'),
  venueName: z.string().min(2, 'Venue name is required'),
  address: z.string().min(5, 'Address is required'),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  startTime: z.string().datetime('Valid start time required'),
  endTime: z.string().datetime('Valid end time required'),
  priceType: PriceTypeEnum,
  priceInr: z.number().nonnegative().default(0),
  description: z.string().min(20, 'Please provide at least 20 characters of description'),
  coverImageUrl: z.string().url('Cover image URL must be a valid URL'),
  registrationUrl: z.string().url().or(z.literal('')).optional(),
  organizerName: z.string().min(2, 'Organizer name is required'),
  organizerContact: z.string().min(5, 'Organizer contact email/phone is required'),
  honeypot: z.string().max(0, 'Spam detected').optional(),
});
export type EventSubmission = z.infer<typeof EventSubmissionSchema>;

export const EventReportSchema = z.object({
  eventId: z.string().uuid(),
  reason: z.enum(['cancelled', 'wrong_time', 'wrong_location', 'misleading', 'spam']),
  details: z.string().max(500).optional(),
});
export type EventReport = z.infer<typeof EventReportSchema>;

// ==========================================
// 8. API Standard Response Envelopes
// ==========================================
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  pagination?: {
    nextCursor?: string;
    hasMore: boolean;
    totalCount?: number;
  };
}
