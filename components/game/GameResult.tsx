import { Button } from "@/components/ui/button";

interface GameResultProps {
  playerChoice?: string;
  computerChoice?: string;
  result?: string;
  onPlayAgain?: () => void;
  isLoading?: boolean;
}

export default function GameResult({
  playerChoice,
  computerChoice,
  result,
  onPlayAgain,
  isLoading,
}: GameResultProps) {
  if (onPlayAgain) {
    return (
      <div className="mt-4">
        <Button onClick={onPlayAgain} disabled={isLoading}>
          Play Again
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center space-y-2 mt-4">
      <p className="text-lg">You chose: {playerChoice}</p>
      <p className="text-lg">Computer chose: {computerChoice}</p>
      <div className="bg-destructive/20 text-destructive font-semibold py-2 px-4 rounded">
        {result}
      </div>
    </div>
  );
}
