import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, HelpCircle, BookOpen, Shield, FileText, Calculator, Users, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { FeedbackForm } from '@/components/feedback/FeedbackForm';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order_index: number;
}

const categoryIcons = {
  bokföring: BookOpen,
  transaktioner: Calculator,
  kvitton: FileText,
  säkerhet: Shield,
  support: HelpCircle,
  export: Settings,
  fakturor: FileText,
  grundläggande: Users,
};

const categoryColors = {
  bokföring: 'bg-blue-100 text-blue-800',
  transaktioner: 'bg-green-100 text-green-800',
  kvitton: 'bg-purple-100 text-purple-800',
  säkerhet: 'bg-red-100 text-red-800',
  support: 'bg-orange-100 text-orange-800',
  export: 'bg-gray-100 text-gray-800',
  fakturor: 'bg-indigo-100 text-indigo-800',
  grundläggande: 'bg-yellow-100 text-yellow-800',
};

const categoryLabels = {
  bokföring: 'Bokföring & Moms',
  transaktioner: 'Transaktioner',
  kvitton: 'Kvitton & Scanning',
  säkerhet: 'Säkerhet & GDPR',
  support: 'Support & Kontakt',
  export: 'Export & Rapporter',
  fakturor: 'Fakturering',
  grundläggande: 'Grundläggande',
};

export default function FAQ() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFAQs();
  }, []);

  useEffect(() => {
    filterFAQs();
  }, [faqs, searchTerm, selectedCategory]);

  const fetchFAQs = async () => {
    try {
      const { data, error } = await supabase
        .from('faq')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterFAQs = () => {
    let filtered = faqs;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(term) ||
        faq.answer.toLowerCase().includes(term)
      );
    }

    setFilteredFaqs(filtered);
  };

  const getCategoryIcon = (category: string) => {
    const Icon = categoryIcons[category as keyof typeof categoryIcons] || HelpCircle;
    return <Icon className="h-4 w-4" />;
  };

  const getCategoryColor = (category: string) => {
    return categoryColors[category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryLabel = (category: string) => {
    return categoryLabels[category as keyof typeof categoryLabels] || category;
  };

  const categories = Array.from(new Set(faqs.map(faq => faq.category)));

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Vanliga frågor</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Här hittar du svar på de vanligaste frågorna om BizPal. 
          Hittar du inte svaret du letar efter? Skicka gärna en fråga via feedback-formuläret.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Sök i frågor och svar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            Alla kategorier
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="gap-2"
            >
              {getCategoryIcon(category)}
              {getCategoryLabel(category)}
            </Button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      {searchTerm || selectedCategory !== 'all' ? (
        <div className="mb-6 text-center">
          <p className="text-sm text-muted-foreground">
            {filteredFaqs.length} fråg{filteredFaqs.length === 1 ? 'a' : 'or'} hittade
            {searchTerm && ` för "${searchTerm}"`}
            {selectedCategory !== 'all' && ` i ${getCategoryLabel(selectedCategory)}`}
          </p>
        </div>
      ) : null}

      {/* FAQ Content */}
      {filteredFaqs.length > 0 ? (
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {filteredFaqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-start gap-4 text-left">
                    <Badge variant="outline" className={getCategoryColor(faq.category)}>
                      {getCategoryLabel(faq.category)}
                    </Badge>
                    <span className="font-medium">{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="prose prose-sm max-w-none">
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ) : (
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-6">
            <HelpCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium mb-2">Inga resultat hittade</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchTerm 
                ? `Inga frågor matchar "${searchTerm}". Prova att söka på andra ord.`
                : 'Inga frågor i denna kategori än.'
              }
            </p>
            <FeedbackForm />
          </CardContent>
        </Card>
      )}

      {/* Contact Section */}
      <div className="mt-12 text-center">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Behöver du mer hjälp?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Hittade du inte svaret du letade efter? Vi hjälper dig gärna!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <FeedbackForm />
              <Button variant="outline" onClick={() => window.open('mailto:support@bizpal.se', '_blank')}>
                Skicka e-post
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 