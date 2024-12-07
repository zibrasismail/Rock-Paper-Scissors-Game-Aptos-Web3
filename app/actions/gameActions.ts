import { MODULE_ADDRESS, MODULE_NAME } from "@/lib/constants";
import {
  Aptos,
  AptosConfig,
  Network,
  AccountAddress,
} from "@aptos-labs/ts-sdk";
import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";

// Initialize Aptos client
const config = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(config);

async function signAndSubmitTransaction(senderAddress: string, payload: any) {
  try {
    const transaction = await aptos.transaction.build.simple({
      sender: AccountAddress.fromString(senderAddress),
      data: payload,
    });

    return transaction;
  } catch (error) {
    console.error("Error building transaction:", error);
    throw error;
  }
}

export async function initializeGame(address: string) {
  const payload: InputTransactionData = {
    data: {
      function: `${MODULE_ADDRESS}::${MODULE_NAME}::initialize_game`,
      functionArguments: [],
    },
  };
  console.log("payload", payload);
  try {
    const transaction = await signAndSubmitTransaction(address, payload);
    return { success: true, data: transaction };
  } catch (error) {
    console.error("Error initializing game:", error);
    return { success: false, error: error };
  }
}

export async function startGame(senderAddress: string, aptAmount: number) {
  const payload = {
    function: `${MODULE_ADDRESS}::${MODULE_NAME}::start_game`,
    functionArguments: [aptAmount],
  };

  try {
    const transaction = await signAndSubmitTransaction(senderAddress, payload);
    return { success: true, data: transaction };
  } catch (error) {
    console.error("Error starting game:", error);
    return { success: false, error: "Failed to start game" };
  }
}

export async function playGame(senderAddress: string, move: number) {
  const payload = {
    function: `${MODULE_ADDRESS}::${MODULE_NAME}::play_game`,
    functionArguments: [move],
  };

  try {
    const transaction = await signAndSubmitTransaction(senderAddress, payload);
    return { success: true, data: transaction };
  } catch (error) {
    console.error("Error playing game:", error);
    return { success: false, error: "Failed to play game" };
  }
}

export async function cancelWager(senderAddress: string) {
  const payload = {
    function: `${MODULE_ADDRESS}::${MODULE_NAME}::cancel_wager`,
    functionArguments: [],
  };

  try {
    const transaction = await signAndSubmitTransaction(senderAddress, payload);
    return { success: true, data: transaction };
  } catch (error) {
    console.error("Error canceling wager:", error);
    return { success: false, error: "Failed to cancel wager" };
  }
}
