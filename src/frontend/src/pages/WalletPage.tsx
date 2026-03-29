import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Link2 } from "lucide-react";
import type { AppPage } from "../App";
import Header from "../components/Header";

interface Props {
  onNavigate: (page: AppPage) => void;
}

const LINKED_WALLETS = [
  {
    name: "MetaMask",
    address: "0x742d...3F8c",
    chain: "Ethereum",
    balance: "2.41 ETH",
  },
  {
    name: "Phantom",
    address: "9Xf2...mK4L",
    chain: "Solana",
    balance: "142 SOL",
  },
];

export default function WalletPage({ onNavigate }: Props) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header currentPage="markets" onNavigate={onNavigate} />

      <main className="flex-1 max-w-4xl mx-auto w-full p-6">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Link2 className="w-4 h-4 text-teal" /> Linked Wallets
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {LINKED_WALLETS.map((w) => (
            <Card key={w.name} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold">{w.name}</p>
                    <p className="text-muted-foreground text-xs font-mono mt-0.5">
                      {w.address}
                    </p>
                  </div>
                  <Badge className="bg-positive/10 text-positive border-0 text-xs">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Connected
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{w.chain}</span>
                  <span className="font-semibold num">{w.balance}</span>
                </div>
              </CardContent>
            </Card>
          ))}
          <Card className="bg-card border-border border-dashed cursor-pointer hover:border-teal transition-colors">
            <CardContent className="p-4 flex items-center justify-center h-full min-h-[80px]">
              <p className="text-muted-foreground text-sm flex items-center gap-2">
                <Link2 className="w-4 h-4" /> Link new wallet
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
