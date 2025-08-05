-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('bug', 'suggestion', 'question', 'general')),
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  screenshot_url TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create support_tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ticket_number TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('technical', 'billing', 'feature_request', 'general')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting_for_user', 'resolved', 'closed')),
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create FAQ table
CREATE TABLE IF NOT EXISTS faq (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_faq_category ON faq(category);
CREATE INDEX IF NOT EXISTS idx_faq_active ON faq(is_active);

-- Enable RLS
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for feedback
CREATE POLICY "Users can view their own feedback" ON feedback
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own feedback" ON feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own feedback" ON feedback
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for support_tickets
CREATE POLICY "Users can view their own support tickets" ON support_tickets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own support tickets" ON support_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own support tickets" ON support_tickets
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for FAQ (public read access)
CREATE POLICY "Anyone can view FAQ" ON faq
  FOR SELECT USING (is_active = true);

-- Create function to generate ticket numbers
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TEXT AS $$
DECLARE
  ticket_num TEXT;
BEGIN
  SELECT 'TICKET-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(COALESCE(MAX(SUBSTRING(ticket_number FROM 18)), '0')::INTEGER + 1, 4, '0')
  INTO ticket_num
  FROM support_tickets
  WHERE ticket_number LIKE 'TICKET-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-%';
  
  RETURN COALESCE(ticket_num, 'TICKET-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-0001');
END;
$$ LANGUAGE plpgsql;

-- Create trigger for ticket number generation
CREATE TRIGGER generate_support_ticket_number
  BEFORE INSERT ON support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION generate_ticket_number();

-- Create triggers for updated_at
CREATE TRIGGER update_feedback_updated_at 
  BEFORE UPDATE ON feedback 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at 
  BEFORE UPDATE ON support_tickets 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faq_updated_at 
  BEFORE UPDATE ON faq 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample FAQ data
INSERT INTO faq (question, answer, category, order_index) VALUES
('Vad är moms och hur fungerar det?', 'Moms (mervärdesskatt) är en skatt som läggs på varor och tjänster. I Sverige finns olika momsatser: 0%, 6%, 12% och 25%. Som företagare måste du redovisa moms till Skatteverket.', 'bokföring', 1),
('Hur skapar jag en transaktion?', 'Gå till Transaktioner-sidan och klicka på "Ny transaktion". Fyll i belopp, beskrivning och välj konton. Systemet hjälper dig med dubbel bokföring automatiskt.', 'transaktioner', 2),
('Hur laddar jag upp ett kvitto?', 'Gå till Kvitton-sidan och använd kameran eller ladda upp en bild. Vårt system läser automatiskt av belopp och butik från kvittot.', 'kvitton', 3),
('Är min data säker?', 'Ja, vi använder kryptering och följer GDPR. Din data lagras säkert i Supabase med Row Level Security så att bara du kan se dina uppgifter.', 'säkerhet', 4),
('Hur kontaktar jag er?', 'Du kan använda feedback-formuläret i appen, skicka mail till support@bizpal.se eller använda chatten i hörnet.', 'support', 5),
('Kan jag exportera min data?', 'Ja, du kan exportera all data i CSV, PDF eller SIE-format från Rapporter-sidan.', 'export', 6),
('Hur fungerar fakturering?', 'Skapa fakturor under Fakturor-sidan. Välj kund, lägg till rader och systemet beräknar moms automatiskt. Du kan skicka fakturor via e-post.', 'fakturor', 7),
('Vad är skillnaden mellan kunder och leverantörer?', 'Kunder är de du säljer till, leverantörer är de du köper från. Båda lagras separat för enkel hantering.', 'grundläggande', 8); 