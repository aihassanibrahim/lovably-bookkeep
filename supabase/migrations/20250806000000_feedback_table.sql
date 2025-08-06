-- Create feedback table
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert feedback (for non-authenticated users)
CREATE POLICY "Anyone can insert feedback" ON public.feedback
    FOR INSERT WITH CHECK (true);

-- Only allow reading feedback if you're the one who created it (by email)
CREATE POLICY "Users can read own feedback" ON public.feedback
    FOR SELECT USING (email = auth.jwt() ->> 'email');

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON public.feedback(created_at);
CREATE INDEX IF NOT EXISTS idx_feedback_email ON public.feedback(email);

-- Add comments
COMMENT ON TABLE public.feedback IS 'Stores user feedback from the landing page';
COMMENT ON COLUMN public.feedback.name IS 'Name of the person giving feedback';
COMMENT ON COLUMN public.feedback.email IS 'Email of the person giving feedback';
COMMENT ON COLUMN public.feedback.message IS 'The feedback message';
COMMENT ON COLUMN public.feedback.created_at IS 'When the feedback was submitted'; 