import { useState } from "react";
import type { AppPage } from "../App";
import Header from "../components/Header";
import HoldingsTable from "../components/HoldingsTable";
import MarketTickers from "../components/MarketTickers";
import OpenOrders from "../components/OpenOrders";
import OrderBook from "../components/OrderBook";
import PortfolioCard from "../components/PortfolioCard";
import PriceChart from "../components/PriceChart";
import TradeHistory from "../components/TradeHistory";
import { usePriceSimulation } from "../hooks/usePriceSimulation";

interface Props {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
}

export default function DashboardPage({ currentPage, onNavigate }: Props) {
  const simulation = usePriceSimulation();
  const [timeframe, setTimeframe] = useState("1H");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header currentPage={currentPage} onNavigate={onNavigate} />

      <main className="flex-1 grid grid-cols-[220px_1fr_280px] gap-3 p-3 min-h-0">
        <aside>
          <MarketTickers
            assets={simulation.assets}
            selectedSymbol={simulation.selectedSymbol}
            onSelect={simulation.setSelectedSymbol}
            isLive={simulation.isLive}
          />
        </aside>

        <section className="flex flex-col gap-3 min-w-0">
          <PriceChart
            asset={simulation.selectedAsset}
            chartData={simulation.chartData}
            timeframe={timeframe}
            onTimeframeChange={setTimeframe}
          />
          <HoldingsTable assets={simulation.assets} />
          <div className="grid grid-cols-2 gap-3">
            <OpenOrders />
            <TradeHistory assets={simulation.assets} />
          </div>
        </section>

        <aside className="flex flex-col gap-3">
          <PortfolioCard assets={simulation.assets} />
          <OrderBook
            orderBook={simulation.orderBook}
            midPrice={simulation.selectedAsset.price}
          />
        </aside>
      </main>

      <footer className="border-t border-border px-6 py-2 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          className="text-teal hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
