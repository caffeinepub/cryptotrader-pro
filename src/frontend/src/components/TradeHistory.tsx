import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useTradeHistory } from "../hooks/useQueries";
import type { CryptoAsset } from "../types";

const SEED_TRADES = [
  {
    id: "t1",
    symbol: "BTC",
    side: "buy",
    amount: 0.1,
    price: 66200,
    time: "14:32",
  },
  {
    id: "t2",
    symbol: "ETH",
    side: "sell",
    amount: 2.0,
    price: 3480,
    time: "13:15",
  },
  {
    id: "t3",
    symbol: "SOL",
    side: "buy",
    amount: 15,
    price: 182,
    time: "11:48",
  },
  {
    id: "t4",
    symbol: "BTC",
    side: "sell",
    amount: 0.05,
    price: 67100,
    time: "09:22",
  },
  {
    id: "t5",
    symbol: "ADA",
    side: "buy",
    amount: 1000,
    price: 0.575,
    time: "08:05",
  },
];

interface Props {
  assets: CryptoAsset[];
}

export default function TradeHistory({ assets }: Props) {
  const { data: trades, isLoading } = useTradeHistory();

  const rows =
    trades && trades.length > 0
      ? trades.slice(0, 10).map((t, i) => ({
          id: `trade-${i}`,
          symbol: t.instrument,
          side: "buy",
          amount: Number(t.tradeAmount) / 1e8,
          price: Number(t.price) / 100,
          time: new Date(Number(t.timestamp) / 1e6).toTimeString().slice(0, 5),
        }))
      : SEED_TRADES;

  return (
    <Card className="bg-card border-border" data-ocid="tradehistory.card">
      <CardHeader className="py-2.5 px-4 border-b border-border">
        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Trade History
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div
            className="p-4 flex items-center gap-2"
            data-ocid="tradehistory.loading_state"
          >
            <Loader2 className="w-4 h-4 animate-spin text-teal" />
          </div>
        ) : rows.length === 0 ? (
          <div className="p-4 text-center" data-ocid="tradehistory.empty_state">
            <p className="text-muted-foreground text-sm">No trades yet</p>
          </div>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left px-3 py-1.5 text-muted-foreground font-medium">
                  Pair
                </th>
                <th className="text-left px-3 py-1.5 text-muted-foreground font-medium">
                  Side
                </th>
                <th className="text-right px-3 py-1.5 text-muted-foreground font-medium">
                  Amount
                </th>
                <th className="text-right px-3 py-1.5 text-muted-foreground font-medium">
                  Price
                </th>
                <th className="text-right px-3 py-1.5 text-muted-foreground font-medium">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t, i) => {
                const asset = assets.find((a) => a.symbol === t.symbol);
                return (
                  <tr
                    key={t.id}
                    className={cn(
                      "border-b border-border/30 hover:bg-secondary/30",
                      i % 2 === 1 && "bg-secondary/10",
                    )}
                    data-ocid={`tradehistory.item.${i + 1}`}
                  >
                    <td className="px-3 py-1.5">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: asset?.color ?? "#888" }}
                        />
                        <span className="font-semibold">{t.symbol}/USD</span>
                      </div>
                    </td>
                    <td className="px-3 py-1.5">
                      <Badge
                        className={cn(
                          "border-0 text-[10px] px-1.5",
                          t.side === "buy"
                            ? "bg-positive/10 text-positive"
                            : "bg-negative/10 text-negative",
                        )}
                      >
                        {t.side.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-3 py-1.5 text-right num">
                      {t.amount.toFixed(4)}
                    </td>
                    <td className="px-3 py-1.5 text-right num">
                      ${t.price >= 1 ? t.price.toFixed(2) : t.price.toFixed(4)}
                    </td>
                    <td className="px-3 py-1.5 text-right text-muted-foreground">
                      {t.time}
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
