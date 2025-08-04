import { Layout } from "@/components/Layout";

export default function Suppliers() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Leverantörer</h1>
          <p className="text-muted-foreground">
            Hantera dina leverantörer och leverantörsregister
          </p>
        </div>
        
        <div className="text-center py-12 text-muted-foreground">
          Leverantörshantering kommer snart...
        </div>
      </div>
    </Layout>
  );
}