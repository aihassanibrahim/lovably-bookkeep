import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, Minus, Crown, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CompetitorComparisonProps {
  onUpgrade?: () => void;
}

export const CompetitorComparison: React.FC<CompetitorComparisonProps> = ({ onUpgrade }) => {
  const competitors = [
    {
      name: 'BizPal',
      logo: '🏢',
      price: '99kr/månad',
      isBizPal: true,
      rating: '5.0/5',
      features: {
        bokföring: { available: true, quality: 'full' },
        fakturering: { available: true, quality: 'full' },
        orderhantering: { available: true, quality: 'full' },
        produktion: { available: true, quality: 'full' },
        lagerhantering: { available: true, quality: 'full' },
        ehandel: { available: true, quality: 'full' },
        kvittoscanning: { available: true, quality: 'full' },
        momsrapportering: { available: true, quality: 'full' },
        kundregister: { available: true, quality: 'full' },
        svenskSupport: { available: true, quality: 'full' },
        demoLäge: { available: true, quality: 'full' },
        alltIett: { available: true, quality: 'full' }
      }
    },
    {
      name: 'Bokio',
      logo: '📊',
      price: '199kr/månad',
      isBizPal: false,
      rating: '4.2/5',
      features: {
        bokföring: { available: true, quality: 'full' },
        fakturering: { available: true, quality: 'full' },
        orderhantering: { available: false, quality: 'none' },
        produktion: { available: false, quality: 'none' },
        lagerhantering: { available: true, quality: 'basic' },
        ehandel: { available: false, quality: 'none' },
        kvittoscanning: { available: false, quality: 'none' },
        momsrapportering: { available: true, quality: 'full' },
        kundregister: { available: true, quality: 'full' },
        svenskSupport: { available: true, quality: 'full' },
        demoLäge: { available: false, quality: 'none' },
        alltIett: { available: false, quality: 'none' }
      }
    },
    {
      name: 'Fortnox',
      logo: '💼',
      price: '399kr/månad',
      isBizPal: false,
      rating: '4.0/5',
      features: {
        bokföring: { available: true, quality: 'full' },
        fakturering: { available: true, quality: 'full' },
        orderhantering: { available: true, quality: 'basic' },
        produktion: { available: false, quality: 'none' },
        lagerhantering: { available: true, quality: 'basic' },
        ehandel: { available: false, quality: 'none' },
        kvittoscanning: { available: true, quality: 'full' },
        momsrapportering: { available: true, quality: 'full' },
        kundregister: { available: true, quality: 'full' },
        svenskSupport: { available: true, quality: 'full' },
        demoLäge: { available: false, quality: 'none' },
        alltIett: { available: false, quality: 'none' }
      }
    },
    {
      name: 'Shopify',
      logo: '🛒',
      price: '299kr/månad',
      isBizPal: false,
      rating: '4.5/5',
      features: {
        bokföring: { available: false, quality: 'none' },
        fakturering: { available: true, quality: 'basic' },
        orderhantering: { available: true, quality: 'full' },
        produktion: { available: false, quality: 'none' },
        lagerhantering: { available: true, quality: 'full' },
        ehandel: { available: true, quality: 'full' },
        kvittoscanning: { available: false, quality: 'none' },
        momsrapportering: { available: false, quality: 'none' },
        kundregister: { available: true, quality: 'basic' },
        svenskSupport: { available: false, quality: 'basic' },
        demoLäge: { available: true, quality: 'basic' },
        alltIett: { available: false, quality: 'none' }
      }
    }
  ];

  const featureLabels = {
    bokföring: 'Bokföring',
    fakturering: 'Fakturering',
    orderhantering: 'Orderhantering',
    produktion: 'Produktion',
    lagerhantering: 'Lagerhantering',
    ehandel: 'E-handel',
    kvittoscanning: 'Kvittoscanning',
    momsrapportering: 'Momsrapportering',
    kundregister: 'Kundregister',
    svenskSupport: 'Svensk support',
    demoLäge: 'Demo-läge',
    alltIett: 'Allt-i-ett lösning'
  };

  const getFeatureIcon = (feature: { available: boolean; quality: string }) => {
    if (!feature.available) return <X className="w-4 h-4 text-red-500" />;
    if (feature.quality === 'full') return <Check className="w-4 h-4 text-green-600" />;
    if (feature.quality === 'basic') return <Minus className="w-4 h-4 text-yellow-500" />;
    return <X className="w-4 h-4 text-red-500" />;
  };

  const getFeatureText = (feature: { available: boolean; quality: string }) => {
    if (!feature.available) return 'Nej';
    if (feature.quality === 'full') return 'Ja';
    if (feature.quality === 'basic') return 'Begränsat';
    return 'Nej';
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Jämför med andra lösningar
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Se varför BizPal är det bästa valet för småföretag som vill ha allt på ett ställe
          </p>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[1200px]">
            {/* Header Row */}
            <div className="grid grid-cols-5 gap-4 mb-6">
              <div className="text-sm font-medium text-gray-500">Funktioner</div>
              {competitors.map((competitor) => (
                <div key={competitor.name} className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className="text-2xl">{competitor.logo}</span>
                    {competitor.isBizPal && (
                      <Badge variant="default" className="bg-green-600">
                        <Crown className="w-3 h-3 mr-1" />
                        Bästa val
                      </Badge>
                    )}
                  </div>
                  <div className="font-bold text-lg">{competitor.name}</div>
                  <div className="text-sm text-gray-600">{competitor.price}</div>
                  <div className="flex items-center justify-center mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm ml-1">{competitor.rating}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Feature Rows */}
            {Object.entries(featureLabels).map(([key, label]) => (
              <div key={key} className="grid grid-cols-5 gap-4 py-4 border-b border-gray-200 hover:bg-white/50 transition-colors">
                <div className="flex items-center font-medium text-gray-700">
                  {label}
                </div>
                {competitors.map((competitor) => (
                  <div key={`${competitor.name}-${key}`} className="flex items-center justify-center">
                    <div className="flex items-center space-x-2">
                      {getFeatureIcon(competitor.features[key as keyof typeof competitor.features])}
                      <span className="text-sm text-gray-600">
                        {getFeatureText(competitor.features[key as keyof typeof competitor.features])}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-800">
                <Crown className="w-5 h-5" />
                <span>BizPal - Bästa valet</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-green-700">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4" />
                  <span>Alla funktioner på ett ställe</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4" />
                  <span>Lägsta priset (99kr/månad)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4" />
                  <span>Prova free med demo-läge</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4" />
                  <span>Svensk support</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-800">Bokio - Endast bokföring</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <X className="w-4 h-4 text-red-500" />
                  <span>Ingen orderhantering</span>
                </li>
                <li className="flex items-center space-x-2">
                  <X className="w-4 h-4 text-red-500" />
                  <span>Ingen produktion</span>
                </li>
                <li className="flex items-center space-x-2">
                  <X className="w-4 h-4 text-red-500" />
                  <span>Dyrare (199kr/månad)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Bra bokföring</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-800">Andra - Begränsade</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <X className="w-4 h-4 text-red-500" />
                  <span>Fokus på en del av verksamheten</span>
                </li>
                <li className="flex items-center space-x-2">
                  <X className="w-4 h-4 text-red-500" />
                  <span>Dyrare (299-399kr/månad)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <X className="w-4 h-4 text-red-500" />
                  <span>Krångligare att komma igång</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Etablerade på marknaden</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold mb-4">
            Redo att välja det bästa för ditt företag?
          </h3>
          <p className="text-lg text-gray-600 mb-6">
                            Prova BizPal free och se skillnaden själv
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={onUpgrade}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
                              Prova BizPal free
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-gray-300 text-gray-700 px-8 py-3"
            >
              Se demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}; 