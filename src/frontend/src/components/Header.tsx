import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  Shield,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import type { AppPage } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useUserProfile } from "../hooks/useQueries";

const NAV_LINKS: { label: string; page: AppPage }[] = [
  { label: "Markets", page: "markets" },
  { label: "History", page: "history" },
];

const QR_CELLS = [
  { id: "q00", on: true },
  { id: "q01", on: false },
  { id: "q02", on: true },
  { id: "q03", on: true },
  { id: "q04", on: false },
  { id: "q10", on: false },
  { id: "q11", on: true },
  { id: "q12", on: false },
  { id: "q13", on: false },
  { id: "q14", on: true },
  { id: "q20", on: true },
  { id: "q21", on: true },
  { id: "q22", on: true },
  { id: "q23", on: false },
  { id: "q24", on: false },
  { id: "q30", on: false },
  { id: "q31", on: false },
  { id: "q32", on: false },
  { id: "q33", on: true },
  { id: "q34", on: true },
  { id: "q40", on: true },
  { id: "q41", on: false },
  { id: "q42", on: true },
  { id: "q43", on: false },
  { id: "q44", on: true },
];

interface Props {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
}

export default function Header({ currentPage, onNavigate }: Props) {
  const { clear, identity } = useInternetIdentity();
  const { data: profile } = useUserProfile();
  const [twoFAOpen, setTwoFAOpen] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);

  const principal = identity?.getPrincipal().toString() ?? "";
  const displayName = profile?.name ?? `${principal.slice(0, 8)}...`;

  return (
    <header className="border-b border-border bg-card px-4 py-2.5 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-teal" />
          <span className="font-bold text-base tracking-tight">
            <span className="text-teal">Crypto</span>Trader Pro
          </span>
        </div>

        <nav className="flex items-center gap-1" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <button
              type="button"
              key={link.page}
              onClick={() => onNavigate(link.page)}
              className={cn(
                "px-3 py-1.5 rounded text-sm font-medium transition-colors",
                currentPage === link.page
                  ? "text-teal bg-teal/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary",
              )}
              data-ocid={`nav.${link.page}.link`}
            >
              {link.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          data-ocid="header.notifications.button"
        >
          <Bell className="w-4 h-4" />
          <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center text-[9px] bg-negative border-0">
            3
          </Badge>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-2"
              data-ocid="header.user.dropdown_menu"
            >
              <Avatar className="w-7 h-7">
                <AvatarFallback className="bg-teal/20 text-teal text-xs font-bold">
                  {displayName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium max-w-[100px] truncate">
                {displayName}
              </span>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-card border-border w-48"
          >
            <DropdownMenuItem
              className="gap-2"
              onClick={() => setTwoFAOpen(true)}
              data-ocid="header.2fa.button"
            >
              <Shield className="w-4 h-4 text-teal" /> Enable 2FA
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <Settings className="w-4 h-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem
              className="gap-2 text-negative"
              onClick={clear}
              data-ocid="header.logout.button"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={twoFAOpen} onOpenChange={setTwoFAOpen}>
        <DialogContent
          className="bg-card border-border max-w-sm"
          data-ocid="twofa.dialog"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-teal" /> Two-Factor Authentication
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Enable 2FA</p>
                <p className="text-muted-foreground text-xs">
                  Secure your account with an authenticator app
                </p>
              </div>
              <Switch
                checked={twoFAEnabled}
                onCheckedChange={setTwoFAEnabled}
                data-ocid="twofa.toggle"
              />
            </div>
            {twoFAEnabled && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Scan this QR code with your authenticator app:
                </p>
                <div className="w-40 h-40 mx-auto bg-secondary border border-border rounded-lg flex items-center justify-center">
                  <div className="grid grid-cols-5 gap-1 p-2">
                    {QR_CELLS.map((cell) => (
                      <div
                        key={cell.id}
                        className={cn(
                          "w-4 h-4 rounded-sm",
                          cell.on ? "bg-foreground" : "bg-transparent",
                        )}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  Secret key: JBSWY3DPEHPK3PXP
                </p>
              </div>
            )}
            <Button
              onClick={() => setTwoFAOpen(false)}
              className="w-full bg-teal text-background hover:opacity-90"
              data-ocid="twofa.close_button"
            >
              {twoFAEnabled ? "Confirm Setup" : "Close"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
