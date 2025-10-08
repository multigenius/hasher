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
  | 'Newbie (1-10)'
  | 'Experienced (10-50)'
  | 'Veteran (50-200)'
  | 'Legend (200-500)'
  | 'Immortal (500+)';

export const RUN_COUNT_OPTIONS: { value: RunCountCategory; label: string; badge: string }[] = [
  { value: 'Newbie (1-10)', label: 'Newbie (1–10 runs)', badge: '🌱' },
  { value: 'Experienced (10-50)', label: 'Experienced (10–50 runs)', badge: '⭐' },
  { value: 'Veteran (50-200)', label: 'Veteran (50–200 runs)', badge: '🏃' },
  { value: 'Legend (200-500)', label: 'Legend (200–500 runs)', badge: '🏆' },
  { value: 'Immortal (500+)', label: 'Immortal (500+ runs)', badge: '👑' },
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
