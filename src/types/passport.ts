export interface PassportData {
  id?: string;
  hashName: string;
  email: string;
  originCountry?: string;
  homeKennelCity?: string;
  homeKennelCountry?: string;
  runCountCategory?: RunCountCategory;
  founderFeedback?: string;
  visitedLocations?: VisitedLocation[];
  photoUrl?: string;
}

export interface VisitedLocation {
  country: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

export type RunCountCategory =
  | 'Fresh Paws (1-10)'
  | 'Pathfinder (10-50)'
  | 'Beer Chaser (50-200)'
  | 'Trail Conqueror (200-500)'
  | 'Legendary Phoenix (500+)';

export const RUN_COUNT_OPTIONS: { value: RunCountCategory; label: string; badge: string }[] = [
  { value: 'Fresh Paws (1-10)', label: 'Fresh Paws (1–10 runs)', badge: '🐾' },
  { value: 'Pathfinder (10-50)', label: 'Pathfinder (10–50 runs)', badge: '🧭' },
  { value: 'Beer Chaser (50-200)', label: 'Beer Chaser (50–200 runs)', badge: '🍺' },
  { value: 'Trail Conqueror (200-500)', label: 'Trail Conqueror (200–500 runs)', badge: '⚡' },
  { value: 'Legendary Phoenix (500+)', label: 'Legendary Phoenix (500+ runs)', badge: '🔥' },
];

export const COUNTRIES = [
  'United States', 'United Kingdom', 'Australia', 'Canada', 'Germany',
  'France', 'Netherlands', 'Singapore', 'Thailand', 'Malaysia',
  'Indonesia', 'Philippines', 'Japan', 'South Korea', 'China',
  'India', 'New Zealand', 'Ireland', 'Spain', 'Italy',
  'Belgium', 'Sweden', 'Norway', 'Denmark', 'Finland',
  'Poland', 'Czech Republic', 'Austria', 'Switzerland', 'Portugal',
  'Mexico', 'Brazil', 'Argentina', 'Chile', 'Colombia',
  'South Africa', 'Kenya', 'Egypt', 'UAE', 'Other'
];

export const POPULAR_KENNELS: Record<string, string[]> = {
  'United States': ['New York', 'Los Angeles', 'San Francisco', 'Chicago', 'Austin', 'Seattle'],
  'United Kingdom': ['London', 'Manchester', 'Edinburgh', 'Birmingham', 'Bristol'],
  'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
  'Germany': ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne'],
  'Thailand': ['Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya'],
  'Singapore': ['Singapore'],
  'Netherlands': ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht'],
  'France': ['Paris', 'Lyon', 'Marseille', 'Toulouse'],
};
