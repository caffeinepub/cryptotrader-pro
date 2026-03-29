import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { OrderBookEntry } from "../types";

interface Props {
  orderBook: { asks: OrderBookEntry[]; bids: OrderBookEntry[] };
  midPrice: number;
}

function fmt(n: number, dp = 2) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  });
}

function fmtPrice(p: number) {
  if (p >= 1000)
    return p.toLocaleString("en-US", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
  if (p >= 1) return p.toFixed(3);
  return p.toFixed(5);
}

export default function OrderBook({ orderBook, midPrice }: Props) {
  const maxTotal = Math.max(
    ...orderBook.asks.map((a) => a.total),
    ...orderBook.bids.map((b) => b.total),
  );

  const reversedAsks = [...orderBook.asks].reverse();

  return (
    <Card className="bg-card border-border" data-ocid="orderbook.card">
      <CardHeader className="py-2.5 px-3 border-b border-border">
        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Order Book
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-3 px-3 py-1.5 text-[10px] text-muted-foreground border-b border-border/50">
          <span>Price</span>
          <span className="text-right">Amount</span>
          <span className="text-right">Total</span>
        </div>

        <div>
          {reversedAsks.map((ask, i) => (
            <div
              key={`ask-${i + 1}`}
              className="relative grid grid-cols-3 px-3 py-0.5 text-xs hover:bg-secondary/30"
              data-ocid={`orderbook.ask.item.${i + 1}`}
            >
              <div
                className="absolute inset-y-0 right-0 bg-negative/10"
                style={{ width: `${(ask.total / maxTotal) * 100}%` }}
              />
              <span className="text-negative font-mono relative z-10">
                {fmtPrice(ask.price)}
              </span>
              <span className="text-right relative z-10 num">
                {ask.amount.toFixed(4)}
              </span>
              <span className="text-right text-muted-foreground relative z-10 num">
                {fmt(ask.total)}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 px-3 py-1.5 bg-secondary/50 border-y border-border">
          <span className="col-span-2 font-bold text-sm text-teal num">
            $
            {midPrice >= 1000
              ? midPrice.toLocaleString("en-US", {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })
              : midPrice.toFixed(4)}
          </span>
          <span className="text-right text-xs text-muted-foreground">Mid</span>
        </div>

        <div>
          {orderBook.bids.map((bid, i) => (
            <div
              key={`bid-${i + 1}`}
              className="relative grid grid-cols-3 px-3 py-0.5 text-xs hover:bg-secondary/30"
              data-ocid={`orderbook.bid.item.${i + 1}`}
            >
              <div
                className="absolute inset-y-0 right-0 bg-positive/10"
                style={{ width: `${(bid.total / maxTotal) * 100}%` }}
              />
              <span className="text-positive font-mono relative z-10">
                {fmtPrice(bid.price)}
              </span>
              <span className="text-right relative z-10 num">
                {bid.amount.toFixed(4)}
              </span>
              <span className="text-right text-muted-foreground relative z-10 num">
                {fmt(bid.total)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
