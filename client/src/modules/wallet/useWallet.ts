import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { Wallet, Transaction } from "./types";
import { useAuthStore } from "@/stores/auth.store";
import { useWalletStore } from "@/stores/wallet.store";

export function useWallet() {
  const { currentUser } = useAuthStore();
  const { setCachedBalance } = useWalletStore();
  const queryClient = useQueryClient();

  const walletQuery = useQuery<Wallet>({
    queryKey: ["wallet", currentUser.id],
    queryFn: async () => {
      const data = await apiClient.get<Wallet>(`/wallet/${currentUser.id}`);
      setCachedBalance(data.balance);
      return data;
    },
    enabled: !!currentUser.id,
    refetchInterval: 10000,
  });

  const transactionsQuery = useQuery<Transaction[]>({
    queryKey: ["transactions", currentUser.id],
    queryFn: async () => {
      return apiClient.get<Transaction[]>(`/wallet/${currentUser.id}/transactions`);
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
      return apiClient.post<{ wallet: Wallet; transaction: Transaction }>("/wallet/recharge", {
        userId: currentUser.id,
        amount,
        paymentMethod,
        description: `Wallet Recharge via ${paymentMethod}`,
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

