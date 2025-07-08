
-- Drop existing policies for profiles table
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.profiles;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.profiles;

-- Create new comprehensive policies for user management
-- Allow all authenticated users to view all profiles (needed for user management)
CREATE POLICY "Authenticated users can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.role() = 'authenticated'::text);

-- Allow authenticated users to insert new profiles (for user creation)
CREATE POLICY "Authenticated users can create profiles" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated'::text);

-- Allow authenticated users to update any profile (for user management)
CREATE POLICY "Authenticated users can update profiles" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.role() = 'authenticated'::text);

-- Allow authenticated users to delete any profile (for user management)
CREATE POLICY "Authenticated users can delete profiles" 
  ON public.profiles 
  FOR DELETE 
  USING (auth.role() = 'authenticated'::text);
