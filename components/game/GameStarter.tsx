import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface GameStarterProps {
  aptAmount: string;
  setAptAmount: (value: string) => void;
  onStartGame: () => void;
  isLoading: boolean;
}

export default function GameStarter({
  aptAmount,
  setAptAmount,
  onStartGame,
  isLoading,
}: GameStarterProps) {
  return (
    <div className="mt-4">
      <div className="flex items-center mb-2">
        <Input
          type="number"
          placeholder="Enter APT amount"
          value={aptAmount}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*\.?\d*$/.test(value) && parseFloat(value) <= 1000) {
              setAptAmount(value);
            }
          }}
          className="mr-2"
        />
        <span className="text-sm font-semibold">APT</span>
      </div>
      <Button
        onClick={onStartGame}
        disabled={isLoading || !aptAmount || parseFloat(aptAmount) <= 0}
      >
        {isLoading ? "Starting..." : "Start Game"}
      </Button>
    </div>
  );
}
