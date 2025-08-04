import { Layout } from "@/components/Layout";

export default function Accounts() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Kontoplan</h1>
          <p className="text-muted-foreground">
            Hantera dina konton och kontoplan
          </p>
        </div>
        
        <div className="text-center py-12 text-muted-foreground">
          Kontoplan kommer snart...
        </div>
      </div>
    </Layout>
  );
}