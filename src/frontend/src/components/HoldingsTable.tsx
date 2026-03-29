import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { usePortfolio } from "../hooks/useQueries";
import type { CryptoAsset } from "../types";

interface Props {
  assets: CryptoAsset[];
}

// Seed holdings for demo
const SEED_HOLDINGS: [string, number, number][] = [
  ["BTC", 0.42, 61200],
  ["ETH", 3.15, 3120],
  ["SOL", 28.5, 154],
  ["LINK", 210, 16.8],
];

export default function HoldingsTable({ assets }: Props) {
  const { data: portfolio, isLoading } = usePortfolio();

  const holdings =
    portfolio && portfolio.length > 0
      ? portfolio.map(([symbol, amount]) => {
          const asset = assets.find((a) => a.symbol === symbol);
          const qty = Number(amount) / 1e8;
          const currentPrice = asset?.price ?? 0;
          const avgBuy = currentPrice * 0.9; // mock avg buy
          return {
            symbol,
            name: asset?.name ?? symbol,
            qty,
            currentPrice,
            avgBuy,
            value: qty * currentPrice,
          };
        })
      : SEED_HOLDINGS.map(([symbol, qty, avgBuy]) => {
          const asset = assets.find((a) => a.symbol === symbol);
          const currentPrice = asset?.price ?? avgBuy;
          return {
            symbol,
            name: asset?.name ?? symbol,
            qty,
            currentPrice,
            avgBuy,
            value: qty * currentPrice,
          };
        });

  return (
    <Card className="bg-card border-border" data-ocid="holdings.card">
      <CardHeader className="py-2.5 px-4 border-b border-border">
        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Holdings
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div
            className="p-4 flex items-center gap-2"
            data-ocid="holdings.loading_state"
          >
            <Loader2 className="w-4 h-4 animate-spin text-teal" />
            <span className="text-sm text-muted-foreground">
              Loading holdings...
            </span>
          </div>
        ) : holdings.length === 0 ? (
          <div className="p-6 text-center" data-ocid="holdings.empty_state">
            <p className="text-muted-foreground text-sm">
              No holdings yet. Start trading!
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left px-4 py-2 text-xs text-muted-foreground font-medium">
                  Asset
                </th>
                <th className="text-right px-4 py-2 text-xs text-muted-foreground font-medium">
                  Amount
                </th>
                <th className="text-right px-4 py-2 text-xs text-muted-foreground font-medium">
                  Value
                </th>
                <th className="text-right px-4 py-2 text-xs text-muted-foreground font-medium">
                  Avg Buy
                </th>
                <th className="text-right px-4 py-2 text-xs text-muted-foreground font-medium">
                  P&L
                </th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h, i) => {
                const pnl = (h.currentPrice - h.avgBuy) * h.qty;
                const pnlPct = ((h.currentPrice - h.avgBuy) / h.avgBuy) * 100;
                const asset = assets.find((a) => a.symbol === h.symbol);
                return (
                  <tr
                    key={h.symbol}
                    className={cn(
                      "border-b border-border/30 hover:bg-secondary/30",
                      i % 2 === 1 && "bg-secondary/10",
                    )}
                    data-ocid={`holdings.item.${i + 1}`}
                  >
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: asset?.color ?? "#888" }}
                        />
                        <div>
                          <p className="font-semibold">{h.symbol}</p>
                          <p className="text-xs text-muted-foreground">
                            {h.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-right num">
                      {h.qty.toFixed(4)}
                    </td>
                    <td className="px-4 py-2 text-right num font-semibold">
                      $
                      {h.value.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-4 py-2 text-right num text-muted-foreground">
                      $
                      {h.avgBuy >= 1
                        ? h.avgBuy.toFixed(2)
                        : h.avgBuy.toFixed(4)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <Badge
                        className={cn(
                          "border-0 text-xs font-semibold num",
                          pnl >= 0
                            ? "bg-positive/10 text-positive"
                            : "bg-negative/10 text-negative",
                        )}
                      >
                        {pnl >= 0 ? "+" : ""}
                        {pnlPct.toFixed(2)}%
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}
