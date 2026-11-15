import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Wallet, Transaction } from "../types/wallet.types";
import { useAuthStore } from "@/features/auth/store/use-auth-store";
import { useWalletStore } from "../store/use-wallet-store";
import React from "react";

export function useWallet() {
  const { currentUser } = useAuthStore();
  const { setCachedBalance } = useWalletStore();
  const queryClient = useQueryClient();

  const walletQuery = useQuery<Wallet>({
    queryKey: ["wallet", currentUser.id],
    queryFn: async () => {
      const data = await apiClient<Wallet>(`/wallet/${currentUser.id}`);
      setCachedBalance(data.balance);
      return data;
    },
    enabled: !!currentUser.id,
    refetchInterval: 10000,
  });

  const transactionsQuery = useQuery<Transaction[]>({
    queryKey: ["transactions", currentUser.id],
    queryFn: async () => {
      return apiClient<Transaction[]>(`/wallet/${currentUser.id}/transactions`);
    },
    enabled: !!currentUser.id,
  });

  const rechargeMutation = useMutation({
    mutationFn: async ({
      amount,
      paymentMethod,
    }: {
      amount: number;
      paymentMethod: string;
    }) => {
      return apiClient<{ wallet: Wallet; transaction: Transaction }>("/wallet/recharge", {
        method: "POST",
        body: JSON.stringify({
          userId: currentUser.id,
          amount,
          paymentMethod,
          description: `Wallet Recharge via ${paymentMethod}`,
        }),
      });
    },
    onSuccess: (data) => {
      setCachedBalance(data.wallet.balance);
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  return {
    wallet: walletQuery.data,
    isLoading: walletQuery.isLoading,
    transactions: transactionsQuery.data || [],
    isLoadingTransactions: transactionsQuery.isLoading,
    recharge: rechargeMutation.mutateAsync,
    isRecharging: rechargeMutation.isPending,
    refetchWallet: walletQuery.refetch,
  };
}

