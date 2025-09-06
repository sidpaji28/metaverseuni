import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ethereumService, Stats } from "@/services/ethereumService";
import EthereumWallet from "./EthereumWallet";
import NFTCertificates from "./NFTCertificates";
import TokenRewards from "./TokenRewards";
import {
  Wallet,
  Award,
  Coins,
  TrendingUp,
  Users,
  BookOpen,
  Activity,
  ExternalLink,
  CheckCircle,
} from "lucide-react";

const EthereumDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const statsData = await ethereumService.getStats();
      setStats(statsData);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cosmic flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-neon-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cosmic">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neon-primary mb-2">
            Ethereum Integration Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage blockchain features, NFT certificates, and token rewards for
            Metaverse University
          </p>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-card/80 backdrop-blur-md border-neon/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Certificates
                </CardTitle>
                <Award className="h-4 w-4 text-neon-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-neon-primary">
                  {stats.totalCertificates}
                </div>
                <p className="text-xs text-muted-foreground">
                  NFT certificates minted
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-md border-neon/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Token Rewards
                </CardTitle>
                <Coins className="h-4 w-4 text-neon-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-neon-primary">
                  {stats.totalRewards}
                </div>
                <p className="text-xs text-muted-foreground">
                  EDU tokens distributed
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-md border-neon/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Students
                </CardTitle>
                <Users className="h-4 w-4 text-neon-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-neon-primary">
                  {stats.activeStudents}
                </div>
                <p className="text-xs text-muted-foreground">
                  Connected wallets
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-md border-neon/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Supply
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-neon-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-neon-primary">
                  {stats.totalTokenSupply}
                </div>
                <p className="text-xs text-muted-foreground">
                  EDU tokens in circulation
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Additional Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-card/80 backdrop-blur-md border-neon/20">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-neon-primary" />
                  <span className="text-sm font-medium">Courses Completed</span>
                </div>
                <p className="text-2xl font-bold text-neon-primary">
                  {stats.coursesCompleted}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-md border-neon/20">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-neon-primary" />
                  <span className="text-sm font-medium">
                    Total Transactions
                  </span>
                </div>
                <p className="text-2xl font-bold text-neon-primary">
                  {stats.totalTransactions}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-md border-neon/20">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Coins className="h-4 w-4 text-neon-primary" />
                  <span className="text-sm font-medium">
                    Tokens Distributed
                  </span>
                </div>
                <p className="text-2xl font-bold text-neon-primary">
                  {stats.tokensDistributed}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="wallet" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="wallet" className="flex items-center space-x-2">
              <Wallet className="h-4 w-4" />
              <span>Wallet</span>
            </TabsTrigger>
            <TabsTrigger
              value="certificates"
              className="flex items-center space-x-2"
            >
              <Award className="h-4 w-4" />
              <span>Certificates</span>
            </TabsTrigger>
            <TabsTrigger
              value="rewards"
              className="flex items-center space-x-2"
            >
              <Coins className="h-4 w-4" />
              <span>Rewards</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wallet">
            <EthereumWallet />
          </TabsContent>

          <TabsContent value="certificates">
            <NFTCertificates />
          </TabsContent>

          <TabsContent value="rewards">
            <TokenRewards />
          </TabsContent>
        </Tabs>

        {/* Blockchain Info */}
        <Card className="bg-card/80 backdrop-blur-md border-neon/20 mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span>Blockchain Integration Status</span>
            </CardTitle>
            <CardDescription>
              Real-time status of blockchain services and smart contracts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Certificate Contract
                  </span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Token Contract</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Network Status</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Connected
                  </Badge>
                </div>
              </div>
              <div className="space-y-4">
                <div className="text-sm">
                  <span className="text-muted-foreground">
                    Contract Address:
                  </span>
                  <p className="font-mono text-xs mt-1">
                    0xCertificateContract123456789
                  </p>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Token Symbol:</span>
                  <p className="font-mono text-xs mt-1">EDU</p>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Network:</span>
                  <p className="font-mono text-xs mt-1">Ethereum Mainnet</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EthereumDashboard;
