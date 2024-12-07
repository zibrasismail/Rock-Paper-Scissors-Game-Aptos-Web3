import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AutoConnectProvider } from "@/components/wallet/AutoConnectProvider";
import { WalletProvider } from "@/components/wallet/walletProvider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rock Paper Scissor",
  description: "Rock Paper Scissor Game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AutoConnectProvider>
          <WalletProvider>{children}</WalletProvider>
        </AutoConnectProvider>
      </body>
    </html>
  );
}
