/*
  # Add Photo Support to Hash Passports

  ## Overview
  Adds the ability to store passport photos (uploaded or AI-generated)
  for hashers in their digital passports.

  ## Changes
  
  ### Modified Tables
  
  #### `passports`
  - Add `photo_url` (text, optional) - URL to the passport photo in Supabase Storage or AI-generated image

  ## Notes
  Photos can be either:
  1. Uploaded by users and stored in Supabase Storage
  2. Generated using AI based on user preferences
  
  The photo_url field stores the full URL to the image resource.
*/

-- Add photo_url column to passports table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'passports' AND column_name = 'photo_url'
  ) THEN
    ALTER TABLE passports ADD COLUMN photo_url text;
  END IF;
END $$;