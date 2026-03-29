import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useBalance, usePortfolio } from "../hooks/useQueries";
import type { CryptoAsset } from "../types";

interface Props {
  assets: CryptoAsset[];
}

export default function PortfolioCard({ assets }: Props) {
  const { data: balance, isLoading: balLoading } = useBalance();
  const { data: portfolio, isLoading: portLoading } = usePortfolio();

  const usdBalance = balance ? Number(balance) / 100 : 10000;

  const portfolioValue = portfolio
    ? portfolio.reduce((sum, [symbol, amount]) => {
        const asset = assets.find((a) => a.symbol === symbol);
        return sum + (asset ? (Number(amount) / 1e8) * asset.price : 0);
      }, 0)
    : 24350.8;

  const totalValue = usdBalance + portfolioValue;
  const changePercent = 3.42;

  return (
    <Card className="bg-card border-border" data-ocid="portfolio.card">
      <CardHeader className="py-2.5 px-3 border-b border-border">
        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Portfolio Balance
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 space-y-3">
        {balLoading || portLoading ? (
          <div
            className="flex items-center gap-2"
            data-ocid="portfolio.loading_state"
          >
            <Loader2 className="w-4 h-4 animate-spin text-teal" />
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
        ) : (
          <>
            <div>
              <p className="text-2xl font-bold num">
                $
                {totalValue.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-positive text-sm font-semibold">
                +{changePercent.toFixed(2)}% today
              </p>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <div className="bg-secondary rounded p-2">
                <p className="text-muted-foreground">Cash</p>
                <p className="font-semibold num">
                  $
                  {usdBalance.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="bg-secondary rounded p-2">
                <p className="text-muted-foreground">Assets</p>
                <p className="font-semibold num">
                  $
                  {portfolioValue.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
