/*
  # Add description column to tickets table

  1. Changes
    - Add `description` column to `tickets` table
    - Make it optional (nullable) for existing tickets
    - Update table comments to reflect new structure

  2. Description
    - `description` (text, nullable) - Optional detailed description of the ticket issue
    - Allows users to provide additional context beyond the subject line
    - Backwards compatible with existing tickets that only have subject
*/

-- Add description column to tickets table
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS description text;

-- Update table comment
COMMENT ON COLUMN tickets.description IS 'Optional detailed description of the ticket issue';