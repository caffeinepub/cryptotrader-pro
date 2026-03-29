import { useCallback, useEffect, useRef, useState } from "react";
import type { CryptoAsset, OHLCVData, OrderBookEntry } from "../types";

const SYMBOL_META: Record<
  string,
  { symbol: string; name: string; color: string }
> = {
  BTCUSDT: { symbol: "BTC", name: "Bitcoin", color: "#F2A93B" },
  ETHUSDT: { symbol: "ETH", name: "Ethereum", color: "#627EEA" },
  SOLUSDT: { symbol: "SOL", name: "Solana", color: "#9945FF" },
  DOGEUSDT: { symbol: "DOGE", name: "Dogecoin", color: "#C2A633" },
  LINKUSDT: { symbol: "LINK", name: "Chainlink", color: "#2A5ADA" },
  ADAUSDT: { symbol: "ADA", name: "Cardano", color: "#0033AD" },
};

const INITIAL_PRICES: CryptoAsset[] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    price: 67420,
    change24h: 2.34,
    volume24h: 28500000000,
    color: "#F2A93B",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    price: 3512,
    change24h: 1.87,
    volume24h: 15200000000,
    color: "#627EEA",
  },
  {
    symbol: "SOL",
    name: "Solana",
    price: 187,
    change24h: 4.12,
    volume24h: 3100000000,
    color: "#9945FF",
  },
  {
    symbol: "DOGE",
    name: "Dogecoin",
    price: 0.162,
    change24h: -1.23,
    volume24h: 890000000,
    color: "#C2A633",
  },
  {
    symbol: "LINK",
    name: "Chainlink",
    price: 18.4,
    change24h: 3.56,
    volume24h: 720000000,
    color: "#2A5ADA",
  },
  {
    symbol: "ADA",
    name: "Cardano",
    price: 0.58,
    change24h: -0.87,
    volume24h: 540000000,
    color: "#0033AD",
  },
];

const WS_URL =
  "wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethusdt@ticker/solusdt@ticker/dogeusdt@ticker/linkusdt@ticker/adausdt@ticker";

export function generateOHLCV(basePrice: number, count = 50): OHLCVData[] {
  const data: OHLCVData[] = [];
  let price = basePrice * 0.92;
  const now = Date.now();
  for (let i = 0; i < count; i++) {
    const open = price;
    const change = (Math.random() - 0.48) * basePrice * 0.008;
    const close = Math.max(open + change, 0.001);
    const high = Math.max(open, close) * (1 + Math.random() * 0.004);
    const low = Math.min(open, close) * (1 - Math.random() * 0.004);
    const t = new Date(now - (count - i) * 3600000);
    data.push({
      time: `${t.getHours().toString().padStart(2, "0")}:${t.getMinutes().toString().padStart(2, "0")}`,
      open,
      high,
      low,
      close,
      volume: basePrice * (0.5 + Math.random()) * 1000,
    });
    price = close;
  }
  return data;
}

export function generateOrderBook(price: number): {
  asks: OrderBookEntry[];
  bids: OrderBookEntry[];
} {
  const asks: OrderBookEntry[] = [];
  const bids: OrderBookEntry[] = [];
  for (let i = 0; i < 8; i++) {
    const askPrice = price * (1 + (i + 1) * 0.0008 + Math.random() * 0.0003);
    const askAmt = Math.random() * 2 + 0.05;
    asks.push({ price: askPrice, amount: askAmt, total: askPrice * askAmt });
    const bidPrice = price * (1 - (i + 1) * 0.0008 - Math.random() * 0.0003);
    const bidAmt = Math.random() * 2 + 0.05;
    bids.push({ price: bidPrice, amount: bidAmt, total: bidPrice * bidAmt });
  }
  return { asks, bids };
}

export function usePriceSimulation() {
  const [assets, setAssets] = useState<CryptoAsset[]>(INITIAL_PRICES);
  const [selectedSymbol, setSelectedSymbol] = useState("BTC");
  const [chartData, setChartData] = useState<OHLCVData[]>(() =>
    generateOHLCV(67420),
  );
  const [orderBook, setOrderBook] = useState(() => generateOrderBook(67420));
  const [isLive, setIsLive] = useState(false);

  const assetsRef = useRef(assets);
  assetsRef.current = assets;
  const selectedSymbolRef = useRef(selectedSymbol);
  selectedSymbolRef.current = selectedSymbol;

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  const connect = useCallback(() => {
    if (!mountedRef.current) return;

    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!mountedRef.current) return;
        setIsLive(true);
      };

      ws.onmessage = (event) => {
        if (!mountedRef.current) return;
        try {
          const msg = JSON.parse(event.data as string) as {
            stream: string;
            data: { s: string; c: string; P: string; v: string };
          };
          const { s, c, P, v } = msg.data;
          const meta = SYMBOL_META[s];
          if (!meta) return;

          const newPrice = Number.parseFloat(c);
          const newChange = Number.parseFloat(P);
          const newVolume = Number.parseFloat(v) * newPrice;

          if (Number.isNaN(newPrice) || newPrice <= 0) return;

          setAssets((prev) =>
            prev.map((a) =>
              a.symbol === meta.symbol
                ? {
                    ...a,
                    price: newPrice,
                    change24h: newChange,
                    volume24h: newVolume,
                  }
                : a,
            ),
          );

          // Append candle when live price arrives for selected symbol
          if (meta.symbol === selectedSymbolRef.current) {
            setChartData((prev) => {
              const last = prev[prev.length - 1];
              const newCandle: OHLCVData = {
                time: new Date().toTimeString().slice(0, 5),
                open: last?.close ?? newPrice,
                high:
                  Math.max(last?.close ?? newPrice, newPrice) *
                  (1 + Math.random() * 0.002),
                low:
                  Math.min(last?.close ?? newPrice, newPrice) *
                  (1 - Math.random() * 0.002),
                close: newPrice,
                volume: newPrice * (0.5 + Math.random()) * 100,
              };
              return [...prev.slice(-49), newCandle];
            });

            setOrderBook(generateOrderBook(newPrice));
          }
        } catch {
          // ignore parse errors
        }
      };

      ws.onerror = () => {
        setIsLive(false);
      };

      ws.onclose = () => {
        if (!mountedRef.current) return;
        setIsLive(false);
        // Reconnect after 3 seconds
        reconnectTimerRef.current = setTimeout(() => {
          if (mountedRef.current) connect();
        }, 3000);
      };
    } catch {
      setIsLive(false);
      reconnectTimerRef.current = setTimeout(() => {
        if (mountedRef.current) connect();
      }, 3000);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    connect();
    return () => {
      mountedRef.current = false;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
      }
    };
  }, [connect]);

  // Update chart/orderbook when selected symbol changes
  const findAsset = useCallback(
    (symbol: string) => assetsRef.current.find((a) => a.symbol === symbol),
    [],
  );

  useEffect(() => {
    const asset = findAsset(selectedSymbol);
    if (asset) {
      const newChart = generateOHLCV(asset.price);
      setChartData(newChart);
      setOrderBook(generateOrderBook(asset.price));
    }
  }, [selectedSymbol, findAsset]);

  const selectedAsset =
    assets.find((a) => a.symbol === selectedSymbol) ?? assets[0];

  return {
    assets,
    selectedAsset,
    selectedSymbol,
    setSelectedSymbol,
    chartData,
    orderBook,
    isLive,
  };
}
