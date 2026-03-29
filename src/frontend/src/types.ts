export interface CryptoAsset {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  color: string;
}

export interface OHLCVData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

export interface Order {
  id: string;
  symbol: string;
  side: "buy" | "sell";
  type: "limit" | "market" | "stop";
  amount: number;
  price: number;
  filled: number;
  status: "open" | "filled" | "cancelled";
  createdAt: Date;
}

export interface Holding {
  symbol: string;
  name: string;
  amount: number;
  avgBuyPrice: number;
  currentPrice: number;
}
