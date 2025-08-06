import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Users, 
  Target, 
  Award, 
  Phone, 
  Mail, 
  MapPin,
  CheckCircle,
  Star,
  Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Building2 className="h-12 w-12 text-primary mr-3" />
            <h1 className="text-4xl font-bold">Om BizPal</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Vi hjälper småföretag att hantera sin ekonomi enkelt och effektivt. 
            BizPal är det moderna ekonomisystemet som växer med ditt företag.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <div className="flex items-center mb-2">
                <Target className="h-6 w-6 text-blue-600 mr-2" />
                <CardTitle>Vårt Uppdrag</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Att göra bokföring och ekonomihantering tillgängligt för alla småföretag. 
                Vi tror att varje företag förtjänar professionella verktyg för att växa och utvecklas.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center mb-2">
                <Award className="h-6 w-6 text-green-600 mr-2" />
                <CardTitle>Vår Vision</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Att bli Sveriges ledande ekonomisystem för småföretag, där enkelhet 
                möter funktionalitet och varje användare känner sig bekväm med sin ekonomi.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Team Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Vårt Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-12 w-12 text-white" />
                </div>
                <CardTitle>Hassan</CardTitle>
                <CardDescription>Grundare & VD</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Entreprenör och utvecklare med passion för att hjälpa småföretag växa. 
                  Har byggt flera framgångsrika företag och förstår utmaningarna småföretag möter.
                </p>
                <div className="flex justify-center mt-4 space-x-2">
                  <Badge variant="secondary">Entreprenör</Badge>
                  <Badge variant="secondary">Utvecklare</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Star className="h-12 w-12 text-white" />
                </div>
                <CardTitle>BizPal Team</CardTitle>
                <CardDescription>Utveckling & Support</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Ett dedikerat team av utvecklare, designers och support-specialister 
                  som arbetar för att göra BizPal till det bästa valet för småföretag.
                </p>
                <div className="flex justify-center mt-4 space-x-2">
                  <Badge variant="secondary">React</Badge>
                  <Badge variant="secondary">TypeScript</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Heart className="h-12 w-12 text-white" />
                </div>
                <CardTitle>Våra Användare</CardTitle>
                <CardDescription>Småföretagare</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Hjärtat i BizPal - alla småföretagare som använder vårt system. 
                  Era feedback och idéer driver vår utveckling framåt.
                </p>
                <div className="flex justify-center mt-4 space-x-2">
                  <Badge variant="secondary">Feedback</Badge>
                  <Badge variant="secondary">Samarbete</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Values */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Våra Värderingar</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center mb-2">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                  <CardTitle>Enkelhet</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Vi tror på enkelhet i allt vi gör. Komplexa system ska vara enkla att använda.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center mb-2">
                  <Star className="h-6 w-6 text-yellow-600 mr-2" />
                  <CardTitle>Kvalitet</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Vi levererar högkvalitativa lösningar som småföretag kan lita på dag in och dag ut.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center mb-2">
                  <Users className="h-6 w-6 text-blue-600 mr-2" />
                  <CardTitle>Kundfokus</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Våra kunder kommer alltid först. Vi lyssnar, lär oss och anpassar oss efter era behov.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Kontakta Oss</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Mail className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle>E-post</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">info@bizpal.se</p>
                <p className="text-sm text-muted-foreground">Support: support@bizpal.se</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Phone className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle>Telefon</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">070-XXX XX XX</p>
                <p className="text-sm text-muted-foreground">Mån-Fre 9:00-17:00</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle>Adress</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Stockholm, Sverige</p>
                <p className="text-sm text-muted-foreground">Remote-first företag</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Redo att komma igång?</CardTitle>
              <CardDescription>
                Börja använda BizPal idag och se hur enkelt ekonomihantering kan vara.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/">Prova Gratis</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/faq">Läs FAQ</Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Ingen kreditkort krävs • 14 dagars gratis provperiod • Avbryt när som helst
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About; 