import { Layout } from "@/components/Layout";

export default function Customers() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Kunder</h1>
          <p className="text-muted-foreground">
            Hantera dina kunder och kundregister
          </p>
        </div>
        
        <div className="text-center py-12 text-muted-foreground">
          Kundhantering kommer snart...
        </div>
      </div>
    </Layout>
  );
}