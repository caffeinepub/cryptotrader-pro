import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";

export type AppPage = "dashboard" | "markets" | "history";

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const [currentPage, setCurrentPage] = useState<AppPage>("dashboard");

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">
            Loading CryptoTrader Pro...
          </p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return (
      <>
        <LoginPage />
        <Toaster theme="dark" />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardPage currentPage={currentPage} onNavigate={setCurrentPage} />
      <Toaster theme="dark" />
    </div>
  );
}
