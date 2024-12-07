import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const WalletConnect = ({ onConnect }: { onConnect: () => void }) => {
  return (
    <Card className="w-[300px] mx-auto mt-10">
      <CardHeader>
        <CardTitle>Connect Wallet</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={onConnect} className="w-full">
          Connect Pera Wallet
        </Button>
      </CardContent>
    </Card>
  );
};

export default WalletConnect;
