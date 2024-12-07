"use client";

import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { PropsWithChildren } from "react";
import { Network } from "@aptos-labs/ts-sdk";
import { useAutoConnect } from "./AutoConnectProvider";

export const WalletProvider = ({ children }: PropsWithChildren) => {
  // const { autoConnect } = useAutoConnect();

  const wallets = [new PetraWallet()];

  return (
    <AptosWalletAdapterProvider
      plugins={wallets}
      // autoConnect={autoConnect}
      autoConnect={false}
      dappConfig={{
        network: Network.TESTNET,
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
};
