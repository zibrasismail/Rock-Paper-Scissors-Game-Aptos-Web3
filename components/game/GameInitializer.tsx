import { Button } from "@/components/ui/button";

interface GameInitializerProps {
  onInitialize: () => void;
  isLoading: boolean;
}

export default function GameInitializer({
  onInitialize,
  isLoading,
}: GameInitializerProps) {
  return (
    <Button onClick={onInitialize} disabled={isLoading}>
      {isLoading ? "Initializing..." : "Initialize Game"}
    </Button>
  );
}
