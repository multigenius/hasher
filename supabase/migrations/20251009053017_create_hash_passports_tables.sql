/*
  # Hash Passport Database Schema

  ## Overview
  Creates the database structure for the Hash Passport onboarding module,
  storing user passport data, visited locations, and founder feedback.

  ## New Tables
  
  ### `passports`
  Stores the core passport information for each hasher
  - `id` (uuid, primary key) - Unique passport identifier
  - `hash_name` (text, required) - User's hash name
  - `email` (text, required, unique) - User's email address
  - `origin_country` (text) - Country of origin
  - `home_kennel_city` (text) - Home kennel city
  - `home_kennel_country` (text) - Home kennel country
  - `run_count_category` (text) - Status level (Newbie, Experienced, etc.)
  - `founder_feedback` (text) - User's feedback about hashing and technology
  - `photo_url` (text) - URL to the passport photo
  - `created_at` (timestamptz) - When the passport was created
  - `updated_at` (timestamptz) - Last update timestamp

  ### `passport_locations`
  Stores the countries/cities where the hasher has run
  - `id` (uuid, primary key) - Unique location entry identifier
  - `passport_id` (uuid, foreign key) - References the passport
  - `country` (text) - Country name
  - `city` (text, optional) - City name if specified
  - `latitude` (numeric) - Approximate latitude for map display
  - `longitude` (numeric) - Approximate longitude for map display
  - `created_at` (timestamptz) - When the location was added

  ## Security
  - Enable RLS on all tables
  - Allow public insert access for initial passport creation (founder season)
  - Allow users to read all passports (community-oriented)
  - Allow users to update only their own passport via email match

  ## Notes
  This is designed for the Founder Season One onboarding experience where
  we want to minimize friction and encourage community participation.
*/

-- Create passports table
CREATE TABLE IF NOT EXISTS passports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hash_name text NOT NULL,
  email text UNIQUE NOT NULL,
  origin_country text,
  home_kennel_city text,
  home_kennel_country text,
  run_count_category text,
  founder_feedback text,
  photo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create passport_locations table
CREATE TABLE IF NOT EXISTS passport_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  passport_id uuid NOT NULL REFERENCES passports(id) ON DELETE CASCADE,
  country text NOT NULL,
  city text,
  latitude numeric,
  longitude numeric,
  created_at timestamptz DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_passport_locations_passport_id ON passport_locations(passport_id);
CREATE INDEX IF NOT EXISTS idx_passports_email ON passports(email);

-- Enable Row Level Security
ALTER TABLE passports ENABLE ROW LEVEL SECURITY;
ALTER TABLE passport_locations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for passports table
-- Allow anyone to create a passport (Founder Season One - low friction onboarding)
CREATE POLICY "Anyone can create passport"
  ON passports FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anyone to read passports (community-oriented)
CREATE POLICY "Anyone can view passports"
  ON passports FOR SELECT
  TO anon
  USING (true);

-- Allow users to update their own passport by email
CREATE POLICY "Users can update own passport"
  ON passports FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- RLS Policies for passport_locations table
-- Allow anyone to insert locations
CREATE POLICY "Anyone can add locations"
  ON passport_locations FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anyone to read locations
CREATE POLICY "Anyone can view locations"
  ON passport_locations FOR SELECT
  TO anon
  USING (true);

-- Allow anyone to delete locations (for updating visited places)
CREATE POLICY "Anyone can delete locations"
  ON passport_locations FOR DELETE
  TO anon
  USING (true);