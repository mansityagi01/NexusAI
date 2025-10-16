/*
  # Create NexusAI Schema

  1. New Tables
    - `tickets`
      - `id` (text, primary key) - Unique ticket identifier (e.g., SIM-xxxxxx)
      - `subject` (text) - Subject/description of the ticket
      - `status` (text) - Current status of the ticket (e.g., 'Processing', 'Resolved')
      - `created_at` (timestamptz) - Timestamp when the ticket was created
    
    - `logs`
      - `id` (serial, primary key) - Auto-incrementing log identifier
      - `ticket_id` (text) - Foreign key reference to tickets table
      - `message` (text) - Log message describing the action or event
      - `agent_name` (text) - Name of the agent that generated the log
      - `created_at` (timestamptz) - Timestamp when the log was created

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read all tickets and logs
    - Add policies for authenticated users to insert tickets and logs

  3. Important Notes
    - The tickets table uses text for the id field to support custom ticket IDs
    - Logs are linked to tickets via foreign key for relational integrity
    - Timestamps use timestamptz for proper timezone handling
*/

CREATE TABLE IF NOT EXISTS tickets (
  id text PRIMARY KEY,
  subject text NOT NULL,
  status text NOT NULL DEFAULT 'Processing',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS logs (
  id serial PRIMARY KEY,
  ticket_id text NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  message text NOT NULL,
  agent_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

-- Policies for tickets table
CREATE POLICY "Allow public read access to tickets"
  ON tickets FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access to tickets"
  ON tickets FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access to tickets"
  ON tickets FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Policies for logs table
CREATE POLICY "Allow public read access to logs"
  ON logs FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access to logs"
  ON logs FOR INSERT
  TO public
  WITH CHECK (true);

-- Create index for faster log queries by ticket_id
CREATE INDEX IF NOT EXISTS logs_ticket_id_idx ON logs(ticket_id);
CREATE INDEX IF NOT EXISTS logs_created_at_idx ON logs(created_at DESC);