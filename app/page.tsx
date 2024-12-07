"use client";

import GameInterface from "@/components/game/gameInterface";
import { PetraWalletSelector } from "@/components/wallet/walletSelection";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

export default function Home() {
  const { connected } = useWallet();
  return (
    <div className="min-h-screen bg-primary relative">
      <div
        className={`p-2 bg-white bg-opacity-20 rounded-lg shadow-md ${
          connected
            ? "absolute top-4 right-4"
            : "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        }`}
      >
        <PetraWalletSelector />
      </div>
      {connected && (
        <div className="flex items-center justify-center h-screen">
          <GameInterface />
        </div>
      )}
    </div>
  );
}
