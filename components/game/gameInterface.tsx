"use client";

import { useState } from "react";
import {
  InputTransactionData,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";
import { Card, CardContent } from "@/components/ui/card";
import Confetti from "react-confetti";
import ScoreBoard from "./ScoreBoard";
import GameInitializer from "./GameInitializer";
import GameStarter from "./GameStarter";
import GamePlay from "./GamePlay";
import GameResult from "./GameResult";
import { MODULE_ADDRESS, MODULE_NAME } from "@/lib/constants";
import { LucideIcon } from "lucide-react";
import { Button } from "../ui/button";

export default function GameInterface() {
  const [computerScore, setComputerScore] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [playerChoice, setPlayerChoice] = useState("");
  const [computerChoice, setComputerChoice] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGameActive, setIsGameActive] = useState(false);
  const [aptAmount, setAptAmount] = useState("");
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isRoundEnded, setIsRoundEnded] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { account, signAndSubmitTransaction } = useWallet();

  const handleInitializeGame = async () => {
    if (!account?.address) return;
    setIsLoading(true);
    try {
      const payload: InputTransactionData = {
        data: {
          function: `${MODULE_ADDRESS}::${MODULE_NAME}::initialize_game`,
          functionArguments: [],
        },
      };
      const response = await signAndSubmitTransaction(payload);
      console.log("Game initialized:", response);
      setIsGameActive(true);
    } catch (error) {
      console.error("Error initializing game:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartGame = async () => {
    if (!account?.address) return;
    setIsLoading(true);
    try {
      const aptValue = parseFloat(aptAmount);
      const octaAmount = Math.floor(aptValue * 100000000); // Convert APT to Octa
      const payload: InputTransactionData = {
        data: {
          function: `${MODULE_ADDRESS}::${MODULE_NAME}::start_game`,
          functionArguments: [octaAmount],
        },
      };
      const response = await signAndSubmitTransaction(payload);
      console.log("Game started:", response);
      setIsGameStarted(true);
    } catch (error) {
      console.error("Error starting game:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChoice = async (choice: string) => {
    if (!account?.address) return;
    setIsLoading(true);
    setPlayerChoice(choice);
    const moveNumber = choice === "ROCK" ? 1 : choice === "PAPER" ? 2 : 3;
    try {
      const payload: InputTransactionData = {
        data: {
          function: `${MODULE_ADDRESS}::${MODULE_NAME}::play_game`,
          functionArguments: [moveNumber],
        },
      };
      const response = await signAndSubmitTransaction(payload);
      console.log("Move played:", response);

      // Simulate getting computer's choice and result from the blockchain
      // In a real scenario, you'd parse this from the transaction response
      const computerMoveNumber = Math.floor(Math.random() * 3) + 1;
      const computerMove =
        computerMoveNumber === 1
          ? "ROCK"
          : computerMoveNumber === 2
          ? "PAPER"
          : "SCISSORS";
      setComputerChoice(computerMove);

      // Determine the result
      let gameResult;
      if (choice === computerMove) {
        gameResult = "It's a tie!";
        setShowConfetti(false);
      } else if (
        (choice === "ROCK" && computerMove === "SCISSORS") ||
        (choice === "PAPER" && computerMove === "ROCK") ||
        (choice === "SCISSORS" && computerMove === "PAPER")
      ) {
        gameResult = "You win!";
        setPlayerScore((prevScore) => prevScore + 1);
        setShowConfetti(true);
      } else {
        gameResult = "Computer wins!";
        setComputerScore((prevScore) => prevScore + 1);
        setShowConfetti(false);
      }
      setResult(gameResult);
      setIsRoundEnded(true);
    } catch (error) {
      console.error("Error playing move:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelWager = async () => {
    if (!account?.address) return;
    setIsLoading(true);
    try {
      const payload: InputTransactionData = {
        data: {
          function: `${MODULE_ADDRESS}::${MODULE_NAME}::cancel_wager`,
          functionArguments: [],
        },
      };
      const response = await signAndSubmitTransaction(payload);
      console.log("Wager canceled:", response);
      // Reset game state to allow new input and start
      setIsGameStarted(false);
      setAptAmount("");
      setPlayerChoice("");
      setComputerChoice("");
      setResult("");
      setIsRoundEnded(false);
    } catch (error) {
      console.error("Error canceling wager:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayAgain = () => {
    setPlayerChoice("");
    setComputerChoice("");
    setResult("");
    setIsRoundEnded(false);
    setIsGameStarted(false);
    setAptAmount("");
    setShowConfetti(false);
  };

  return (
    <>
      {showConfetti && <Confetti />}
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <ScoreBoard computerScore={computerScore} playerScore={playerScore} />

          {!isGameActive ? (
            <GameInitializer
              onInitialize={handleInitializeGame}
              isLoading={isLoading}
            />
          ) : !isGameStarted ? (
            <GameStarter
              aptAmount={aptAmount}
              setAptAmount={setAptAmount}
              onStartGame={handleStartGame}
              isLoading={isLoading}
            />
          ) : isRoundEnded ? (
            <GameResult onPlayAgain={handlePlayAgain} isLoading={isLoading} />
          ) : (
            <GamePlay
              onChoice={handleChoice}
              onCancelWager={handleCancelWager}
              isLoading={isLoading}
            />
          )}

          {result && (
            <GameResult
              playerChoice={playerChoice}
              computerChoice={computerChoice}
              result={result}
            />
          )}
        </CardContent>
      </Card>
    </>
  );
}

interface ChoiceButtonProps {
  choice: string;
  Icon: LucideIcon;
  onClick: (choice: string) => void;
  disabled: boolean;
}

const ChoiceButton: React.FC<ChoiceButtonProps> = ({
  choice,
  Icon,
  onClick,
  disabled,
}) => (
  <Button
    variant="outline"
    size="lg"
    className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-primary border-none hover:bg-primary/90"
    onClick={() => onClick(choice)}
    disabled={disabled}
  >
    <Icon size={40} />
  </Button>
);
