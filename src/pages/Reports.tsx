import { Layout } from "@/components/Layout";

export default function Reports() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Rapporter</h1>
          <p className="text-muted-foreground">
            Visa ekonomiska rapporter och analyser
          </p>
        </div>
        
        <div className="text-center py-12 text-muted-foreground">
          Rapporter kommer snart...
        </div>
      </div>
    </Layout>
  );
}