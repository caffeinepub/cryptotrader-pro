import { Button } from "@/components/ui/button";
import { BarChart2, Shield, TrendingUp, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const FEATURES = [
  {
    icon: BarChart2,
    title: "Advanced Charts",
    desc: "Candlestick charts with 20+ technical indicators and multi-timeframe analysis",
  },
  {
    icon: Zap,
    title: "Real-Time Data",
    desc: "Live price feeds with sub-second updates across BTC, ETH, SOL and 50+ pairs",
  },
  {
    icon: Shield,
    title: "Secure by Design",
    desc: "Internet Identity authentication with end-to-end encryption and 2FA support",
  },
];

export default function LoginPage() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-teal" />
          <span className="font-bold text-lg tracking-tight">
            <span className="text-teal">Crypto</span>Trader Pro
          </span>
        </div>
        <Button
          onClick={login}
          disabled={isLoggingIn}
          className="bg-teal text-background hover:opacity-90 font-semibold px-6"
          data-ocid="login.primary_button"
        >
          {isLoggingIn ? "Connecting..." : "Sign In"}
        </Button>
      </header>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-4xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-teal/10 text-teal border border-teal/20 rounded-full px-4 py-1 text-xs font-medium mb-6">
              <Zap className="w-3 h-3" /> Real-time crypto trading platform
            </div>
            <h1 className="text-5xl font-bold tracking-tight mb-4">
              Trade <span className="text-teal">smarter</span>,<br />
              not harder
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
              Advanced charting, real-time order books, and seamless execution
              across major exchanges. Built for serious traders.
            </p>
            <Button
              onClick={login}
              disabled={isLoggingIn}
              size="lg"
              className="bg-teal text-background hover:opacity-90 font-bold px-10 text-base"
              data-ocid="login.submit_button"
            >
              {isLoggingIn ? "Connecting..." : "Start Trading"}
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-card border border-border rounded-lg p-5"
              >
                <f.icon className="w-8 h-8 text-teal mb-3" />
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </main>

      <footer className="border-t border-border px-6 py-4 text-center text-xs text-muted-foreground">
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
