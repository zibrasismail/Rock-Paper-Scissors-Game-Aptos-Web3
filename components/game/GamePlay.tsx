import { Button } from "@/components/ui/button";
import { Grab, Hand, Scissors, LucideIcon } from "lucide-react";

interface GamePlayProps {
  onChoice: (choice: string) => void;
  onCancelWager: () => void;
  isLoading: boolean;
}

export default function GamePlay({
  onChoice,
  onCancelWager,
  isLoading,
}: GamePlayProps) {
  return (
    <div>
      <div className="flex justify-center space-x-4 mb-6">
        <ChoiceButton
          choice="ROCK"
          Icon={Grab}
          onClick={onChoice}
          disabled={isLoading}
        />
        <ChoiceButton
          choice="PAPER"
          Icon={Hand}
          onClick={onChoice}
          disabled={isLoading}
        />
        <ChoiceButton
          choice="SCISSORS"
          Icon={Scissors}
          onClick={onChoice}
          disabled={isLoading}
        />
      </div>
      <div className="mt-4 text-center">
        <Button
          onClick={onCancelWager}
          variant="destructive"
          disabled={isLoading}
        >
          {isLoading ? "Stopping..." : "Stop Game"}
        </Button>
      </div>
    </div>
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
