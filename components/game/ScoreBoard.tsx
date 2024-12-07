interface ScoreBoardProps {
  computerScore: number;
  playerScore: number;
}

export default function ScoreBoard({
  computerScore,
  playerScore,
}: ScoreBoardProps) {
  return (
    <div className="text-right mb-6">
      <p className="text-lg font-semibold">Computer : {computerScore}</p>
      <p className="text-lg font-semibold">You : {playerScore}</p>
    </div>
  );
}
