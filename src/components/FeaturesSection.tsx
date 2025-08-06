import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, 
  Receipt, 
  Calculator, 
  FileText, 
  BarChart3 
} from 'lucide-react';

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
}

export const FeaturesSection: React.FC = () => {
  const features: Feature[] = [
    {
      icon: Users,
      title: 'Kundregister',
      description: 'Hantera alla dina kunder och leverantörer på ett ställe med fullständig orderhistorik och kontaktinformation.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Receipt,
      title: 'Kvittoscanning',
      description: 'Skanna kvitton med AI för automatisk bokföring. Sparar timmar av manuellt arbete varje månad.',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Calculator,
      title: 'Momsrapportering',
      description: 'Automatisk momsberäkning och rapportering. Få alltid rätt moms och enkla rapporter för Skatteverket.',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: FileText,
      title: 'Bokföring',
      description: 'Enkel och intuitiv bokföring som passar småföretag. Hantera inkomster, utgifter och transaktioner.',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      icon: BarChart3,
      title: 'Rapporter',
      description: 'Få insikter om din verksamhet med detaljerade rapporter. Se lönsamhet, trender och tillväxt.',
      color: 'bg-red-100 text-red-600'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Allt du behöver för din bokföring
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Från grundläggande bokföring till avancerade funktioner. 
            BizPal växer med ditt företag och ger dig verktygen du behöver.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            
            return (
              <Card 
                key={index} 
                className="border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
              >
                <CardContent className="p-6 space-y-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Feature Badge */}
                  <div className="pt-2">
                    {index === 1 || index === 2 || index === 4 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Pro-funktion
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Inkluderat
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Redo att förenkla din bokföring?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Börja free idag och uppgradera när du behöver fler funktioner. 
              Ingen bindningstid och full kontroll över din data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Kom igång free
              </button>
              <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                Se demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 