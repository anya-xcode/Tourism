import { Request } from 'express';
import { Types } from 'mongoose';

// ─── Enums ────────────────────────────────────────────────
export enum UserRole {
  GUEST = 'guest',
  USER = 'user',
  ADMIN = 'admin',
}

export enum PlaceCategory {
  NATURE = 'Nature',
  FOOD = 'Food',
  HERITAGE = 'Heritage',
  ADVENTURE = 'Adventure',
  SHOPPING = 'Shopping',
  NIGHTLIFE = 'Nightlife',
  RELIGIOUS = 'Religious',
  ENTERTAINMENT = 'Entertainment',
}

export enum BudgetRange {
  FREE = 'Free',
  BUDGET = 'Budget',
  MODERATE = 'Moderate',
  PREMIUM = 'Premium',
}

export enum MediaType {
  PHOTO = 'photo',
  VIDEO = 'video',
}

export enum EventVisibility {
  OPEN = 'open',
  INVITE_ONLY = 'invite-only',
}

export enum EventStatus {
  UPCOMING = 'upcoming',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum RSVPStatus {
  GOING = 'going',
  MAYBE = 'maybe',
  DECLINED = 'declined',
}

export enum RideProvider {
  UBER = 'Uber',
  OLA = 'Ola',
  RAPIDO = 'Rapido',
}

export enum BookmarkType {
  PLACE = 'place',
  REEL = 'reel',
}

export enum FlagTargetType {
  PLACE = 'place',
  REVIEW = 'review',
  MEDIA = 'media',
  REEL = 'reel',
  THREAD = 'thread',
}

export enum FlagStatus {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
  RESOLVED = 'resolved',
}

export enum RecommendationType {
  PREFERENCE = 'preference',
  TRENDING = 'trending',
  SIMILAR = 'similar',
}

// ─── Interfaces ───────────────────────────────────────────
export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

export interface TokenPayload {
  id: string;
  email: string;
  role: UserRole;
}

export interface CloudinaryResponse {
  public_id: string;
  secure_url: string;
  resource_type: string;
}

// ─── DTOs ─────────────────────────────────────────────────
export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  city?: string;
  preferences?: string[];
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface CreatePlaceDTO {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  category: PlaceCategory;
  budgetRange: BudgetRange;
  operatingHours?: string;
  suggestedDurationMinutes?: number;
  tags?: string[];
}

export interface UpdatePlaceDTO extends Partial<CreatePlaceDTO> {}

export interface CreateReviewDTO {
  placeId: string;
  rating: number;
  text: string;
  visitDate?: Date;
}

export interface CreateReelDTO {
  placeId: string;
  caption: string;
}

export interface CreateEventDTO {
  placeId: string;
  title: string;
  description: string;
  scheduledDate: Date;
  time: string;
  maxParticipants: number;
  visibility: EventVisibility;
}

export interface CreateThreadDTO {
  placeId: string;
  content: string;
}

export interface CreateReplyDTO {
  threadId: string;
  content: string;
}

export interface RideCompareDTO {
  originLat: number;
  originLng: number;
  destLat: number;
  destLng: number;
}

export interface PlaceFilters {
  city?: string;
  category?: PlaceCategory;
  budgetRange?: BudgetRange;
  tags?: string[];
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
}

export interface FareEstimate {
  provider: RideProvider;
  fare: number;
  estimatedMinutes: number;
  distanceKm: number;
}
