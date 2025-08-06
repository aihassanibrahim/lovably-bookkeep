-- Create profiles table for user/company information
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    company_name VARCHAR(255),
    company_org_number VARCHAR(20),
    company_address TEXT,
    company_phone VARCHAR(50),
    company_email VARCHAR(255),
    contact_person VARCHAR(255),
    industry VARCHAR(100),
    company_size VARCHAR(50),
    vat_number VARCHAR(50),
    bank_account VARCHAR(50),
    currency VARCHAR(3) DEFAULT 'SEK',
    timezone VARCHAR(50) DEFAULT 'Europe/Stockholm',
    language VARCHAR(10) DEFAULT 'sv',
    onboarding_completed BOOLEAN DEFAULT false,
    onboarding_step INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_company_name ON public.profiles(company_name);
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_completed ON public.profiles(onboarding_completed);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add comments
COMMENT ON TABLE public.profiles IS 'Stores user profile and company information';
COMMENT ON COLUMN public.profiles.company_name IS 'Company name for the user';
COMMENT ON COLUMN public.profiles.company_org_number IS 'Swedish organization number';
COMMENT ON COLUMN public.profiles.onboarding_completed IS 'Whether user has completed onboarding';
COMMENT ON COLUMN public.profiles.onboarding_step IS 'Current step in onboarding process (0-6)'; 