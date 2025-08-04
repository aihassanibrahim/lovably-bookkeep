import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useProfitData } from '@/hooks/useProfitData';

export const ProfitCard = () => {
  const { profitData, loading } = useProfitData();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Resultat</CardTitle>
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

  const isProfit = profitData.profit_before_tax >= 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Resultat före skatt</CardTitle>
        {isProfit ? (
          <TrendingUp className="h-4 w-4 text-green-600" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-600" />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {profitData.profit_before_tax.toLocaleString('sv-SE', {
            style: 'currency',
            currency: 'SEK',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        </div>
        <div className="space-y-1 mt-2 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Intäkter:</span>
            <span className="text-green-600">
              +{profitData.total_revenue.toLocaleString('sv-SE', {
                style: 'currency',
                currency: 'SEK',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Utgifter:</span>
            <span className="text-red-600">
              -{profitData.total_expenses.toLocaleString('sv-SE', {
                style: 'currency',
                currency: 'SEK',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </span>
          </div>
          <div className="flex justify-between border-t pt-1">
            <span>Efter skatt (ca):</span>
            <span className={isProfit ? 'text-green-600' : 'text-red-600'}>
              {profitData.profit_after_tax.toLocaleString('sv-SE', {
                style: 'currency',
                currency: 'SEK',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};