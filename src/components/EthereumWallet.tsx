import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ethereumService, Wallet } from "@/services/ethereumService";
import {
  Wallet as WalletIcon,
  Copy,
  ExternalLink,
  RefreshCw,
} from "lucide-react";

const EthereumWallet = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock wallet addresses for demo
  const mockAddresses = [
    "0x1234567890123456789012345678901234567890",
    "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
  ];

  const connectWallet = async (address?: string) => {
    setIsConnecting(true);
    try {
      const addressToConnect = address || walletAddress;
      if (!addressToConnect) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please enter a wallet address",
        });
        return;
      }

      const connectedWallet = await ethereumService.connectWallet(
        addressToConnect
      );
      setWallet(connectedWallet);
      setWalletAddress(addressToConnect);

      toast({
        title: "Wallet Connected!",
        description: `Successfully connected to ${addressToConnect.slice(
          0,
          6
        )}...${addressToConnect.slice(-4)}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description:
          error instanceof Error ? error.message : "Failed to connect wallet",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const refreshBalance = async () => {
    if (!wallet) return;

    setIsLoading(true);
    try {
      const updatedWallet = await ethereumService.getWallet(wallet.address);
      setWallet(updatedWallet);

      toast({
        title: "Balance Updated",
        description: "Wallet balance refreshed successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description:
          error instanceof Error ? error.message : "Failed to refresh balance",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyAddress = () => {
    if (wallet) {
      navigator.clipboard.writeText(wallet.address);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const openInExplorer = () => {
    if (wallet) {
      window.open(`https://etherscan.io/address/${wallet.address}`, "_blank");
    }
  };

  return (
    <Card className="bg-card/80 backdrop-blur-md border-neon/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <WalletIcon className="h-5 w-5 text-neon-primary" />
          <span>Ethereum Wallet</span>
        </CardTitle>
        <CardDescription>
          Connect your wallet to access blockchain features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!wallet ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wallet-address">Wallet Address</Label>
              <Input
                id="wallet-address"
                placeholder="0x..."
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label>Or use demo addresses:</Label>
              <div className="flex flex-wrap gap-2">
                {mockAddresses.map((address) => (
                  <Button
                    key={address}
                    variant="outline"
                    size="sm"
                    onClick={() => connectWallet(address)}
                    disabled={isConnecting}
                    className="font-mono text-xs"
                  >
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              onClick={() => connectWallet()}
              disabled={isConnecting || !walletAddress}
              className="w-full"
            >
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Connected Wallet</p>
                <p className="text-xs text-muted-foreground font-mono">
                  {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={copyAddress}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={openInExplorer}>
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshBalance}
                  disabled={isLoading}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                  />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className="text-lg font-bold text-neon-primary">
                  {wallet.balance} ETH
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Network</p>
                <Badge variant="secondary" className="capitalize">
                  {wallet.network}
                </Badge>
              </div>
            </div>

            <div className="pt-2 border-t border-neon/20">
              <Button
                variant="outline"
                onClick={() => setWallet(null)}
                className="w-full"
              >
                Disconnect Wallet
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EthereumWallet;
