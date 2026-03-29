import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useActor } from "./useActor";

export function useBalance() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["balance"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getCallerBalance();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePortfolio() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["portfolio"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCallersInvestmentPortfolio();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTradeHistory() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["tradeHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTradeHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBuyMutation() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      instrument,
      amount,
    }: { instrument: string; amount: bigint }) => {
      if (!actor) throw new Error("Not connected");
      return actor.buy(instrument, amount);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["balance"] });
      qc.invalidateQueries({ queryKey: ["portfolio"] });
      qc.invalidateQueries({ queryKey: ["tradeHistory"] });
      toast.success("Buy order executed successfully!");
    },
    onError: (e: Error) => toast.error(`Buy failed: ${e.message}`),
  });
}

export function useSellMutation() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      instrument,
      amount,
    }: { instrument: string; amount: bigint }) => {
      if (!actor) throw new Error("Not connected");
      return actor.sell(instrument, amount);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["balance"] });
      qc.invalidateQueries({ queryKey: ["portfolio"] });
      qc.invalidateQueries({ queryKey: ["tradeHistory"] });
      toast.success("Sell order executed successfully!");
    },
    onError: (e: Error) => toast.error(`Sell failed: ${e.message}`),
  });
}

export function useDepositMutation() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (amount: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deposit(amount);
    },
    onSuccess: (bal) => {
      qc.invalidateQueries({ queryKey: ["balance"] });
      toast.success(
        `Deposited! New balance: $${(Number(bal) / 100).toFixed(2)}`,
      );
    },
    onError: (e: Error) => toast.error(`Deposit failed: ${e.message}`),
  });
}

export function useCreateUser() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.createUser();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}
