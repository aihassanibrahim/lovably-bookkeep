import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StripeCheckout } from '@/components/StripeCheckout';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tillbaka till startsidan
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Välj din plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Få tillgång till alla funktioner du behöver för att hantera din verksamhet effektivt
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-lg mx-auto">
          <StripeCheckout />
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Vanliga frågor
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Kan jag avbryta när som helst?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Ja, du kan avbryta din prenumeration när som helst. Du behåller tillgång till alla funktioner till slutet av din betalningsperiod.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Finns det någon gratis testperiod?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Vi erbjuder en 14-dagars gratis testperiod så att du kan prova alla funktioner innan du bestämmer dig.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vilka betalningsmetoder accepterar ni?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Vi accepterar alla större kreditkort och betalkort via Stripe, inklusive Visa, Mastercard och American Express.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Får jag support?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Ja, alla kunder får tillgång till vår e-postsupport. Vi svarar vanligtvis inom 24 timmar på vardagar.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Har du fler frågor?
          </h3>
          <p className="text-gray-600 mb-6">
            Kontakta oss så hjälper vi dig att hitta rätt lösning för ditt företag.
          </p>
          <Button variant="outline" asChild>
            <a href="mailto:support@bizpal.se">
              Kontakta support
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}