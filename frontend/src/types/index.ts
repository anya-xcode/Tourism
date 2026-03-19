export const PlaceCategory = {
  NATURE: 'Nature',
  FOOD: 'Food',
  HERITAGE: 'Heritage',
  ADVENTURE: 'Adventure',
  SHOPPING: 'Shopping',
  NIGHTLIFE: 'Nightlife',
  RELIGIOUS: 'Religious',
  ENTERTAINMENT: 'Entertainment',
} as const;

export type PlaceCategory = typeof PlaceCategory[keyof typeof PlaceCategory];

export const BudgetRange = {
  FREE: 'Free',
  BUDGET: 'Budget',
  MODERATE: 'Moderate',
  PREMIUM: 'Premium',
} as const;

export type BudgetRange = typeof BudgetRange[keyof typeof BudgetRange];

export const BookmarkType = {
  PLACE: 'place',
  REEL: 'reel',
} as const;

export type BookmarkType = typeof BookmarkType[keyof typeof BookmarkType];
