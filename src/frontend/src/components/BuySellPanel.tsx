import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useBuyMutation, useSellMutation } from "../hooks/useQueries";
import type { CryptoAsset } from "../types";

const ORDER_TYPES = ["Limit", "Market", "Stop"];
const LEVERAGES = ["1x", "2x", "5x", "10x"];

interface Props {
  asset: CryptoAsset;
}

export default function BuySellPanel({ asset }: Props) {
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [orderType, setOrderType] = useState("Limit");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState(asset.price.toFixed(2));
  const [leverage, setLeverage] = useState("1x");

  const buyMutation = useBuyMutation();
  const sellMutation = useSellMutation();
  const isPending = buyMutation.isPending || sellMutation.isPending;

  const handleSubmit = async () => {
    const qty = Number.parseFloat(amount);
    if (Number.isNaN(qty) || qty <= 0) return;
    const amountBig = BigInt(Math.round(qty * 1e8));
    if (side === "buy") {
      await buyMutation.mutateAsync({
        instrument: asset.symbol,
        amount: amountBig,
      });
    } else {
      await sellMutation.mutateAsync({
        instrument: asset.symbol,
        amount: amountBig,
      });
    }
    setAmount("");
  };

  const total =
    (Number.parseFloat(amount) || 0) *
    (Number.parseFloat(price) || asset.price);

  return (
    <Card className="bg-card border-border" data-ocid="buysell.card">
      <CardHeader className="p-0">
        <div className="grid grid-cols-2">
          <button
            type="button"
            onClick={() => setSide("buy")}
            className={cn(
              "py-2.5 text-sm font-bold transition-colors rounded-tl-lg",
              side === "buy"
                ? "bg-positive text-white"
                : "text-muted-foreground hover:text-positive",
            )}
            data-ocid="buysell.buy.toggle"
          >
            Buy
          </button>
          <button
            type="button"
            onClick={() => setSide("sell")}
            className={cn(
              "py-2.5 text-sm font-bold transition-colors rounded-tr-lg",
              side === "sell"
                ? "bg-negative text-white"
                : "text-muted-foreground hover:text-negative",
            )}
            data-ocid="buysell.sell.toggle"
          >
            Sell
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-3 space-y-3">
        <Tabs value={orderType} onValueChange={setOrderType}>
          <TabsList className="bg-secondary w-full h-7">
            {ORDER_TYPES.map((t) => (
              <TabsTrigger
                key={t}
                value={t}
                className="flex-1 text-xs h-6 data-[state=active]:bg-card"
                data-ocid={`buysell.${t.toLowerCase()}.tab`}
              >
                {t}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {orderType !== "Market" && (
          <div>
            <Label
              htmlFor="bs-price"
              className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block"
            >
              Price (USD)
            </Label>
            <Input
              id="bs-price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-background border-border h-8 text-sm num"
              data-ocid="buysell.price.input"
            />
          </div>
        )}

        <div>
          <Label
            htmlFor="bs-amount"
            className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block"
          >
            Amount ({asset.symbol})
          </Label>
          <Input
            id="bs-amount"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-background border-border h-8 text-sm num"
            data-ocid="buysell.amount.input"
          />
          <div className="flex gap-1 mt-1">
            {["25%", "50%", "75%", "100%"].map((p) => (
              <button
                type="button"
                key={p}
                onClick={() =>
                  setAmount((Number.parseFloat(p) / 100).toFixed(4))
                }
                className="flex-1 text-[10px] bg-secondary rounded py-0.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">
            Leverage
          </Label>
          <div className="flex gap-1">
            {LEVERAGES.map((lev) => (
              <button
                type="button"
                key={lev}
                onClick={() => setLeverage(lev)}
                className={cn(
                  "flex-1 py-1 text-xs font-semibold rounded border transition-colors",
                  leverage === lev
                    ? "border-teal text-teal bg-teal/10"
                    : "border-border text-muted-foreground hover:border-border/80",
                )}
                data-ocid={`buysell.${lev}.toggle`}
              >
                {lev}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between text-xs text-muted-foreground border-t border-border pt-2">
          <span>Total</span>
          <span className="num font-semibold text-foreground">
            $
            {total.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isPending || !amount}
          className={cn(
            "w-full font-bold text-white",
            side === "buy"
              ? "bg-positive hover:opacity-90"
              : "bg-negative hover:opacity-90",
          )}
          data-ocid="buysell.submit.primary_button"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {side === "buy" ? `Buy ${asset.symbol}` : `Sell ${asset.symbol}`}
        </Button>
      </CardContent>
    </Card>
  );
}
