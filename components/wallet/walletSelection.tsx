"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function PetraWalletSelector() {
  const { connected, connect, disconnect, wallet, wallets } = useWallet();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const closeDialog = useCallback(() => setIsDialogOpen(false), []);

  const connectWallet = useCallback(
    async (wallet: any) => {
      try {
        console.log("Attempting to connect to wallet:", wallet.name);
        await connect(wallet.name);
        closeDialog();
      } catch (error) {
        console.error("Failed to connect:", error);
        setError("Failed to connect. Please try again.");
      }
    },
    [connect, closeDialog]
  );

  useEffect(() => {
    console.log("Available wallets:", wallets);
    console.log("Connected:", connected);
    console.log("Current wallet:", wallet);
  }, [wallets, connected, wallet]);

  return connected ? (
    <Button onClick={disconnect}>Disconnect</Button>
  ) : (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => console.log("Connect button clicked")}>
            Connect Petra Wallet
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect Petra Wallet</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 pt-3">
            {wallets
              ?.filter((wallet) => wallet.name.toLowerCase().includes("petra"))
              .map((wallet) => (
                <Button key={wallet.name} onClick={() => connectWallet(wallet)}>
                  Connect {wallet.name}
                </Button>
              ))}
          </div>
          {error && <p className="text-red-500">{error}</p>}
        </DialogContent>
      </Dialog>
    </>
  );
}
