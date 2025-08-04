import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Receipt } from 'lucide-react';
import { useProfitData } from '@/hooks/useProfitData';

export const VatCard = () => {
  const { profitData, loading } = useProfitData();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Moms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const shouldPay = profitData.net_vat > 0;
  const shouldReceive = profitData.net_vat < 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Moms att betala/få tillbaka</CardTitle>
        <Receipt className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${shouldPay ? 'text-red-600' : shouldReceive ? 'text-green-600' : ''}`}>
          {Math.abs(profitData.net_vat).toLocaleString('sv-SE', {
            style: 'currency',
            currency: 'SEK',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {shouldPay && 'Att betala till Skatteverket'}
          {shouldReceive && 'Att få tillbaka från Skatteverket'}
          {!shouldPay && !shouldReceive && 'Ingen moms att betala eller få tillbaka'}
        </p>
      </CardContent>
    </Card>
  );
};