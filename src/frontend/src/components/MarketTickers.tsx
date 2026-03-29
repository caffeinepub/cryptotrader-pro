import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { CryptoAsset } from "../types";

interface Props {
  assets: CryptoAsset[];
  selectedSymbol: string;
  onSelect: (symbol: string) => void;
  isLive?: boolean;
}

function formatPrice(price: number): string {
  if (price >= 1000)
    return price.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  if (price >= 1)
    return price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  return price.toFixed(4);
}

export default function MarketTickers({
  assets,
  selectedSymbol,
  onSelect,
  isLive = false,
}: Props) {
  return (
    <Card className="bg-card border-border h-full">
      <CardHeader className="py-3 px-3 border-b border-border">
        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <span
            className={cn(
              "w-2 h-2 rounded-full flex-shrink-0",
              isLive
                ? "bg-green-400 shadow-[0_0_6px_2px_rgba(74,222,128,0.6)] animate-pulse"
                : "bg-gray-500",
            )}
          />
          Live Market Tickers
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {assets.map((asset, i) => (
          <button
            type="button"
            key={asset.symbol}
            onClick={() => onSelect(asset.symbol)}
            className={cn(
              "w-full px-3 py-2.5 flex flex-col gap-1 text-left transition-colors border-b border-border/50 last:border-0",
              selectedSymbol === asset.symbol
                ? "bg-teal/10 border-l-2 border-l-teal"
                : "hover:bg-secondary/50",
            )}
            data-ocid={`tickers.item.${i + 1}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: asset.color }}
                />
                <span className="font-bold text-sm">{asset.symbol}</span>
              </div>
              <Badge
                className={cn(
                  "text-[10px] px-1.5 py-0 border-0 font-semibold",
                  asset.change24h >= 0
                    ? "bg-positive/10 text-positive"
                    : "bg-negative/10 text-negative",
                )}
              >
                {asset.change24h >= 0 ? "+" : ""}
                {asset.change24h.toFixed(2)}%
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">
                {asset.name}
              </span>
              <span className="font-semibold text-sm num">
                ${formatPrice(asset.price)}
              </span>
            </div>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
