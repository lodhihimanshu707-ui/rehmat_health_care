import { create } from "zustand";

interface WalletState {
  isRechargeModalOpen: boolean;
  cachedBalance: number;
  openRechargeModal: () => void;
  closeRechargeModal: () => void;
  setCachedBalance: (balance: number) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  isRechargeModalOpen: false,
  cachedBalance: 150.0,
  openRechargeModal: () => set({ isRechargeModalOpen: true }),
  closeRechargeModal: () => set({ isRechargeModalOpen: false }),
  setCachedBalance: (balance) => set({ cachedBalance: balance }),
}));

