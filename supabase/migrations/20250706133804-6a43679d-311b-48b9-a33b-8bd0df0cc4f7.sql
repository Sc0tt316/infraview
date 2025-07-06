
-- Create a table for servers
CREATE TABLE public.servers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  hostname TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  location TEXT NOT NULL,
  department TEXT,
  status TEXT NOT NULL DEFAULT 'offline',
  sub_status TEXT,
  cpu_usage INTEGER NOT NULL DEFAULT 0,
  memory_usage INTEGER NOT NULL DEFAULT 0,
  disk_usage INTEGER NOT NULL DEFAULT 0,
  uptime TEXT DEFAULT '0 days',
  last_active TIMESTAMP WITH TIME ZONE DEFAULT now(),
  operating_system TEXT NOT NULL,
  server_type TEXT NOT NULL,
  added_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  specs JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.servers ENABLE ROW LEVEL SECURITY;

-- Create policy that allows all authenticated users to view servers
CREATE POLICY "Allow all users to view servers" 
  ON public.servers 
  FOR SELECT 
  USING (true);

-- Create policy that allows authenticated users to insert servers
CREATE POLICY "Authenticated users can create servers" 
  ON public.servers 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated'::text);

-- Create policy that allows authenticated users to update servers
CREATE POLICY "Authenticated users can update servers" 
  ON public.servers 
  FOR UPDATE 
  USING (auth.role() = 'authenticated'::text);

-- Create policy that allows authenticated users to delete servers
CREATE POLICY "Authenticated users can delete servers" 
  ON public.servers 
  FOR DELETE 
  USING (auth.role() = 'authenticated'::text);
