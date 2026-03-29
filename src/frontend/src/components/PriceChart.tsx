import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CryptoAsset, OHLCVData } from "../types";

const TIMEFRAMES = ["1H", "4H", "1D", "1W"];

interface Props {
  asset: CryptoAsset;
  chartData: OHLCVData[];
  timeframe: string;
  onTimeframeChange: (tf: string) => void;
}

function formatPrice(price: number): string {
  if (price >= 1000)
    return `$${price.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  if (price >= 1) return `$${price.toFixed(2)}`;
  return `$${price.toFixed(4)}`;
}

export default function PriceChart({
  asset,
  chartData,
  timeframe,
  onTimeframeChange,
}: Props) {
  const isPositive = asset.change24h >= 0;
  const lastClose = chartData[chartData.length - 1]?.close ?? asset.price;
  const firstClose = chartData[0]?.close ?? asset.price;
  const chartPositive = lastClose >= firstClose;

  const strokeColor = chartPositive ? "#2ED47A" : "#E25555";
  const gradientId = `gradient-${asset.symbol}`;

  return (
    <Card className="bg-card border-border" data-ocid="chart.card">
      <CardHeader className="py-3 px-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">{asset.symbol}/USD</span>
              <span className="text-2xl font-bold num">
                {formatPrice(asset.price)}
              </span>
              <Badge
                className={cn(
                  "border-0 font-semibold",
                  isPositive
                    ? "bg-positive/10 text-positive"
                    : "bg-negative/10 text-negative",
                )}
              >
                {isPositive ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                {isPositive ? "+" : ""}
                {asset.change24h.toFixed(2)}%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {asset.name} · 24h
            </p>
          </div>

          <div className="flex items-center gap-1">
            {TIMEFRAMES.map((tf) => (
              <Button
                key={tf}
                variant="ghost"
                size="sm"
                onClick={() => onTimeframeChange(tf)}
                className={cn(
                  "h-7 px-2.5 text-xs font-semibold",
                  timeframe === tf
                    ? "bg-teal/20 text-teal"
                    : "text-muted-foreground",
                )}
                data-ocid={`chart.${tf.toLowerCase()}.tab`}
              >
                {tf}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 pb-2">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 8, right: 8, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={strokeColor} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.22 0.025 230 / 0.5)"
                vertical={false}
              />
              <XAxis
                dataKey="time"
                tick={{ fill: "oklch(0.62 0.02 230)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                interval={9}
              />
              <YAxis
                domain={["auto", "auto"]}
                tick={{ fill: "oklch(0.62 0.02 230)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) =>
                  v >= 1000
                    ? `$${(v / 1000).toFixed(0)}k`
                    : v >= 1
                      ? `$${v.toFixed(0)}`
                      : `$${v.toFixed(3)}`
                }
              />
              <Tooltip
                contentStyle={{
                  background: "oklch(0.17 0.02 235)",
                  border: "1px solid oklch(0.22 0.025 230)",
                  borderRadius: "6px",
                  fontSize: "12px",
                  color: "oklch(0.92 0.01 240)",
                }}
                formatter={(value: number) => [formatPrice(value), "Price"]}
                labelStyle={{ color: "oklch(0.62 0.02 230)" }}
              />
              <Area
                type="monotone"
                dataKey="close"
                stroke={strokeColor}
                strokeWidth={1.5}
                fill={`url(#${gradientId})`}
                dot={false}
                activeDot={{ r: 4, fill: strokeColor }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
