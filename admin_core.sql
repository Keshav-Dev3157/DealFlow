-- ADMIN & SECURITY FOUNDATION (REFINED)
-- Run this in the Supabase SQL Editor

-- 1. Ensure Columns Exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS application_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS revenue_goal NUMERIC DEFAULT 0;

ALTER TABLE deals
ADD COLUMN IF NOT EXISTS platform TEXT DEFAULT 'Instagram';

-- 4. Update the trigger to ensure new users are 'pending' and store email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, application_status, is_admin)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.email,
    'pending',
    COALESCE((new.raw_user_meta_data->>'is_admin')::boolean, false)
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    application_status = EXCLUDED.application_status;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create Security Helper Function (Bypasses RLS to check admin status)
CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Enhanced RLS Policies (Using the helper to avoid recursion)
-- Profile Select Policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles" ON profiles 
FOR SELECT USING (public.check_is_admin());

-- Profile Update Policies
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can update profile status" ON profiles;
CREATE POLICY "Admins can update profile status" ON profiles 
FOR UPDATE USING (public.check_is_admin());

-- Deal Select Policies
DROP POLICY IF EXISTS "Users can view their own deals" ON deals;
CREATE POLICY "Users can view their own deals" ON deals FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all deals" ON deals;
CREATE POLICY "Admins can view all deals" ON deals 
FOR SELECT USING (public.check_is_admin());

-- 4. Re-sync Logic (Update existing admin if needed)
-- UPDATE profiles SET is_admin = true, application_status = 'approved' WHERE id = 'YOUR_USER_ID';

-- 5. Deliverables Infrastructure (Lighweight Checklist)
CREATE TABLE IF NOT EXISTS deliverables (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_id UUID REFERENCES deals(id) ON DELETE CASCADE NOT NULL,
  label TEXT NOT NULL,
  proof_url TEXT,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE deliverables ENABLE ROW LEVEL SECURITY;

-- Policy: Users can manage deliverables for their own deals
DROP POLICY IF EXISTS "Users can manage their own deliverables" ON deliverables;
CREATE POLICY "Users can manage their own deliverables"
ON deliverables
FOR ALL
USING (EXISTS (
  SELECT 1 FROM deals 
  WHERE deals.id = deliverables.deal_id 
  AND deals.user_id = auth.uid()
));

-- Policy: Admins can view all deliverables
DROP POLICY IF EXISTS "Admins can view all deliverables" ON deliverables;
CREATE POLICY "Admins can view all deliverables"
ON deliverables
FOR SELECT
USING (public.check_is_admin());
