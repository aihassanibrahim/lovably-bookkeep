import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StripeCheckout } from '@/components/StripeCheckout';
import { ArrowLeft, Check, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Pricing() {
  return (
    <div className="min-h-screen bg-[hsl(var(--light-gray))] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center text-[hsl(var(--teal-primary))] hover:text-[hsl(var(--teal-secondary))] mb-6 font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tillbaka till startsidan
          </Link>
          <Badge className="bg-[hsl(var(--teal-primary))]/10 text-[hsl(var(--teal-primary))] border-0 mb-6">
            VÄLJ PLAN
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold text-[hsl(var(--dark-navy))] mb-6">
            Välj din plan
          </h1>
          <p className="text-large text-gray-600 max-w-2xl mx-auto">
            Få tillgång till alla funktioner du behöver för att hantera din verksamhet effektivt
          </p>
        </div>

        {/* Free Plan Card */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="finpay-card p-8">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-2xl font-semibold">Gratis</CardTitle>
              <CardDescription className="text-lg">
                Perfekt för att komma igång
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-[hsl(var(--dark-navy))]">0 kr</div>
                <div className="text-gray-500">/månad</div>
              </div>
              
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>Upp till 10 ordrar/månad</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>Grundläggande kundhantering</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>Produktkatalog</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>E-postsupport</span>
                </li>
              </ul>

              <Button 
                asChild
                className="w-full finpay-button-secondary h-12"
              >
                <Link to="/login">
                  Kom igång gratis
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan with Stripe Checkout */}
          <div>
          <StripeCheckout />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-[hsl(var(--dark-navy))] mb-8">
            Vanliga frågor
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                question: "Kan jag avbryta när som helst?",
                answer: "Ja, du kan avbryta din prenumeration när som helst. Du behåller tillgång till alla funktioner till slutet av din betalningsperiod."
              },
              {
                question: "Finns det någon gratis testperiod?",
                answer: "Vi erbjuder en 14-dagars gratis testperiod så att du kan prova alla funktioner innan du bestämmer dig."
              },
              {
                question: "Vilka betalningsmetoder accepterar ni?",
                answer: "Vi accepterar alla större kreditkort och betalkort via Stripe, inklusive Visa, Mastercard och American Express."
              },
              {
                question: "Får jag support?",
                answer: "Ja, alla kunder får tillgång till vår e-postsupport. Vi svarar vanligtvis inom 24 timmar på vardagar."
              }
            ].map((faq, index) => (
              <Card key={index} className="finpay-card">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold text-[hsl(var(--dark-navy))] mb-4">
            Har du fler frågor?
          </h3>
          <p className="text-gray-600 mb-6 text-large">
            Kontakta oss så hjälper vi dig att hitta rätt lösning för ditt företag.
          </p>
          <Button 
            variant="outline" 
            asChild
            className="finpay-button-secondary"
          >
            <a href="mailto:support@bizpal.se">
              Kontakta support
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}