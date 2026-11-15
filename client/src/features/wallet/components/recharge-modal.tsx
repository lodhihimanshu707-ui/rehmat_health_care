import React, { useState } from "react";
import { useWalletStore } from "../store/use-wallet-store";
import { useWallet } from "../hooks/use-wallet";
import { formatCurrency } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, QrCode, CreditCard, Smartphone, ShieldCheck, Loader2 } from "lucide-react";

const PRESET_AMOUNTS = [100, 250, 500, 1000];

export function RechargeModal() {
  const { isRechargeModalOpen, closeRechargeModal } = useWalletStore();
  const { recharge, isRecharging } = useWallet();

  const [selectedAmount, setSelectedAmount] = useState<number>(250);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("UPI (Google Pay / PhonePe)");
  const [successReceipt, setSuccessReceipt] = useState<any | null>(null);

  const finalAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;

  const handleSelectPreset = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
  };

  const handleRecharge = async () => {
    if (finalAmount < 10) {
      alert("Minimum recharge amount is ₹10");
      return;
    }

    try {
      const res = await recharge({
        amount: finalAmount,
        paymentMethod,
      });
      setSuccessReceipt(res.transaction);
    } catch (err: any) {
      alert(err.message || "Recharge failed");
    }
  };

  const handleClose = () => {
    setSuccessReceipt(null);
    closeRechargeModal();
  };

  return (
    <Dialog open={isRechargeModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white rounded-3xl p-6">
        {!successReceipt ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span>Recharge Calling Wallet</span>
                <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-800 text-[10px]">
                  Instant Credit
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Choose a pack to fund your Rehmat Health Care consultation balance.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 py-2">
              {/* Preset Amount Pills */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2">
                  Select Pack Amount (INR)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_AMOUNTS.map((amt) => {
                    const isSelected = selectedAmount === amt && !customAmount;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handleSelectPreset(amt)}
                        className={`py-2.5 px-2 rounded-xl text-center font-bold text-sm transition-all border ${
                          isSelected
                            ? "border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm"
                            : "border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        ₹{amt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Amount Input */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Or enter custom amount
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">₹</span>
                  <Input
                    type="number"
                    min="10"
                    placeholder="Enter amount (min ₹10)"
                    value={customAmount}
                    onChange={handleCustomChange}
                    className="pl-8 rounded-xl border-slate-200"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2">
                  Select Payment Method (Simulated Demo Gateway)
                </label>
                <div className="space-y-2">
                  {[
                    { id: "UPI (Google Pay / PhonePe)", label: "UPI (GPay / PhonePe / Paytm)", icon: Smartphone },
                    { id: "UPI QR Code", label: "Scan UPI QR Code", icon: QrCode },
                    { id: "Debit / Credit Card", label: "Debit or Credit Card", icon: CreditCard },
                  ].map((method) => {
                    const isChosen = paymentMethod === method.id;
                    const Icon = method.icon;
                    return (
                      <div
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                          isChosen
                            ? "border-emerald-600 bg-emerald-50/50 text-emerald-950 font-semibold"
                            : "border-slate-200 hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`h-4 w-4 ${isChosen ? "text-emerald-600" : "text-slate-400"}`} />
                          <span className="text-xs">{method.label}</span>
                        </div>
                        <input
                          type="radio"
                          name="payment"
                          checked={isChosen}
                          onChange={() => setPaymentMethod(method.id)}
                          className="h-4 w-4 accent-emerald-600"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Security notice */}
              <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Simulated instant checkout for client demo presentation. Zero waiting time.</span>
              </div>
            </div>

            <Button
              onClick={handleRecharge}
              disabled={isRecharging || finalAmount < 10}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 rounded-xl text-sm gap-2"
            >
              {isRecharging ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <span>Pay & Add {formatCurrency(finalAmount)} to Wallet</span>
              )}
            </Button>
          </>
        ) : (
          /* Success Receipt View */
          <div className="text-center py-4 space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">Recharge Successful!</h3>
              <p className="text-xs text-slate-500">Your wallet balance has been updated immediately.</p>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Credited:</span>
                <span className="font-bold text-emerald-800">{formatCurrency(successReceipt.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction ID:</span>
                <span className="font-mono text-slate-700 font-semibold">{successReceipt.referenceId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Mode:</span>
                <span className="text-slate-700">{successReceipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-semibold text-emerald-700 uppercase">{successReceipt.status}</span>
              </div>
            </div>

            <Button
              onClick={handleClose}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 rounded-xl text-sm"
            >
              Done & Browse Doctors
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

