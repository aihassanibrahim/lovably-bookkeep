import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Users, Receipt, Building2 } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Översikt</h1>
        <p className="text-muted-foreground">
          Välkommen till ditt bokföringssystem
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totala tillgångar</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 kr</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Ingen förändring
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skulder</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 kr</div>
            <p className="text-xs text-muted-foreground">
              Totala skulder
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kunder</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Registrerade kunder
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transaktioner</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Denna månad
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Senaste transaktioner</CardTitle>
            <CardDescription>
              Dina senaste bokföringsverifikationer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              Inga transaktioner ännu. Börja med att skapa ditt första konto.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Snabbåtgärder</CardTitle>
            <CardDescription>
              Kom igång snabbt med dessa funktioner
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <a 
              href="/accounts" 
              className="flex items-center gap-3 p-3 rounded-md hover:bg-accent transition-colors"
            >
              <Building2 className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Skapa kontoplan</p>
                <p className="text-sm text-muted-foreground">Lägg till dina första konton</p>
              </div>
            </a>
            <a 
              href="/customers" 
              className="flex items-center gap-3 p-3 rounded-md hover:bg-accent transition-colors"
            >
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Registrera kunder</p>
                <p className="text-sm text-muted-foreground">Lägg till dina kunder</p>
              </div>
            </a>
            <a 
              href="/transactions" 
              className="flex items-center gap-3 p-3 rounded-md hover:bg-accent transition-colors"
            >
              <Receipt className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Skapa transaktion</p>
                <p className="text-sm text-muted-foreground">Gör din första bokföring</p>
              </div>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}