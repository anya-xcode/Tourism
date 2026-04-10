// ─── Enums ────────────────────────────────────────────────

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

export enum BookmarkType {
  PLACE = 'place',
  REEL = 'reel',
}

export enum RideProvider {
  UBER = 'Uber',
  OLA = 'Ola',
  RAPIDO = 'Rapido',
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

// ─── Interfaces ───────────────────────────────────────────

export interface IUser {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  city: string;
  preferences: string[];
  createdAt: string;
}

export interface IPlace {
  _id: string;
  name: string;
  description: string;
  location: {
    type: string;
    coordinates: number[]; // [lng, lat]
  };
  address: string;
  city: string;
  category: PlaceCategory;
  budgetRange: BudgetRange;
  operatingHours: string;
  suggestedDurationMinutes: number;
  tags: string[];
  photos: string[];
  averageRating: number;
  totalReviews: number;
  addedBy: { _id: string; name: string; avatar: string } | string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IReview {
  _id: string;
  userId: { _id: string; name: string; avatar: string };
  placeId: string;
  rating: number;
  text: string;
  photos: string[];
  helpfulVotes: number;
  votedBy: string[];
  visitDate: string;
  createdAt: string;
}

export interface IReel {
  _id: string;
  userId: { _id: string; name: string; avatar: string };
  placeId: { _id: string; name: string; city: string };
  videoUrl: string;
  cloudinaryPublicId: string;
  caption: string;
  thumbnailUrl: string;
  views: number;
  likes: number;
  likedBy: string[];
  liked?: boolean;
  saves: number;
  createdAt: string;
}

export interface IMedia {
  _id: string;
  userId: string;
  placeId: string;
  type: 'photo' | 'video';
  url: string;
  cloudinaryPublicId: string;
  caption: string;
  tags: string[];
  createdAt: string;
}

export interface IVisitEvent {
  _id: string;
  placeId: { _id: string; name: string; city: string } | string;
  creatorId: { _id: string; name: string; avatar: string } | string;
  title: string;
  description: string;
  scheduledDate: string;
  time: string;
  maxParticipants: number;
  visibility: EventVisibility;
  status: EventStatus;
  currentParticipants?: number;
  createdAt: string;
}

export interface IThread {
  id: string;
  content: string;
  userId: string;
  userName: string;
  placeId: string;
  mediaUrls: string[];
  createdAt: string;
  replyCount: number;
  replies: IThreadReply[];
}

export interface IThreadReply {
  id: string;
  content: string;
  userId: string;
  userName: string;
  createdAt: string;
}

export interface IFareEstimate {
  provider: RideProvider;
  fare: number;
  estimatedMinutes: number;
  distanceKm: number;
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

export interface GeoLocation {
  latitude: number;
  longitude: number;
}
