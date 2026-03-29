import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const SEED_ORDERS = [
  {
    id: "1",
    symbol: "BTC",
    side: "buy" as const,
    type: "Limit",
    amount: 0.05,
    price: 65800,
    filled: 0,
  },
  {
    id: "2",
    symbol: "ETH",
    side: "sell" as const,
    type: "Limit",
    amount: 1.2,
    price: 3650,
    filled: 0.4,
  },
  {
    id: "3",
    symbol: "SOL",
    side: "buy" as const,
    type: "Stop",
    amount: 10,
    price: 180,
    filled: 0,
  },
];

export default function OpenOrders() {
  const [orders, setOrders] = useState(SEED_ORDERS);

  const cancel = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
    toast.success("Order cancelled");
  };

  return (
    <Card className="bg-card border-border" data-ocid="openorders.card">
      <CardHeader className="py-2.5 px-4 border-b border-border">
        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Open Orders{" "}
          <Badge className="ml-1 bg-teal/20 text-teal border-0 text-xs px-1.5">
            {orders.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {orders.length === 0 ? (
          <div className="p-4 text-center" data-ocid="openorders.empty_state">
            <p className="text-muted-foreground text-sm">No open orders</p>
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
                  Filled
                </th>
                <th className="px-3 py-1.5" />
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => (
                <tr
                  key={o.id}
                  className="border-b border-border/30 hover:bg-secondary/30"
                  data-ocid={`openorders.item.${i + 1}`}
                >
                  <td className="px-3 py-1.5 font-semibold">{o.symbol}/USD</td>
                  <td className="px-3 py-1.5">
                    <Badge
                      className={cn(
                        "border-0 text-[10px] px-1.5",
                        o.side === "buy"
                          ? "bg-positive/10 text-positive"
                          : "bg-negative/10 text-negative",
                      )}
                    >
                      {o.side.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-3 py-1.5 text-right num">{o.amount}</td>
                  <td className="px-3 py-1.5 text-right num">
                    ${o.price.toLocaleString()}
                  </td>
                  <td className="px-3 py-1.5 text-right num">
                    {((o.filled / o.amount) * 100).toFixed(0)}%
                  </td>
                  <td className="px-3 py-1.5 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-5 h-5 text-muted-foreground hover:text-negative"
                      onClick={() => cancel(o.id)}
                      data-ocid={`openorders.delete_button.${i + 1}`}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}
