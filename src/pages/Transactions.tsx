import { Layout } from "@/components/Layout";

export default function Transactions() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Transaktioner</h1>
          <p className="text-muted-foreground">
            Hantera dina bokföringsverifikationer
          </p>
        </div>
        
        <div className="text-center py-12 text-muted-foreground">
          Transaktioner kommer snart...
        </div>
      </div>
    </Layout>
  );
}