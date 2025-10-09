/*
  # Create Storage Bucket for Passport Photos

  ## Overview
  Creates a public storage bucket for passport photos (uploaded or AI-generated)
  with appropriate access policies for the Hash Passport application.

  ## Changes
  
  ### Storage
  
  #### New Bucket: `passport-photos`
  - Public bucket for storing passport photos
  - Allows anyone to upload photos (anon access)
  - Allows anyone to read photos (public access)
  
  ## Security
  - Public read access for community visibility
  - Public write access for founder season onboarding (low friction)
  - 5MB file size limit enforced at application level
  
  ## Notes
  - Photos can be uploaded by users or generated via AI
  - All photos are publicly accessible via URL
  - Consider adding authentication requirements in future seasons
*/

-- Create the passport-photos storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('passport-photos', 'passport-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to upload photos (anon users)
CREATE POLICY "Anyone can upload passport photos"
  ON storage.objects FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'passport-photos');

-- Allow anyone to read photos (public bucket)
CREATE POLICY "Anyone can view passport photos"
  ON storage.objects FOR SELECT
  TO anon
  USING (bucket_id = 'passport-photos');

-- Allow anyone to delete their uploads if needed
CREATE POLICY "Anyone can delete passport photos"
  ON storage.objects FOR DELETE
  TO anon
  USING (bucket_id = 'passport-photos');