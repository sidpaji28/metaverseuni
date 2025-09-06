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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ethereumService, TokenReward } from "@/services/ethereumService";
import {
  Coins,
  ExternalLink,
  Copy,
  TrendingUp,
  Award,
  BookOpen,
} from "lucide-react";

const TokenRewards = () => {
  const [rewards, setRewards] = useState<TokenReward[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isIssuing, setIsIssuing] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [issueForm, setIssueForm] = useState({
    studentAddress: "",
    amount: "",
    reason: "",
    courseName: "",
    achievementName: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async (address?: string) => {
    setIsLoading(true);
    try {
      const response = await ethereumService.getRewards(address);
      setRewards(response.data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to fetch rewards",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const issueReward = async () => {
    if (!issueForm.studentAddress || !issueForm.amount || !issueForm.reason) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
      });
      return;
    }

    setIsIssuing(true);
    try {
      const newReward = await ethereumService.issueReward({
        studentAddress: issueForm.studentAddress,
        amount: issueForm.amount,
        reason: issueForm.reason,
        courseName: issueForm.courseName || undefined,
        achievementName: issueForm.achievementName || undefined,
      });

      setRewards((prev) => [newReward, ...prev]);
      setIssueForm({
        studentAddress: "",
        amount: "",
        reason: "",
        courseName: "",
        achievementName: "",
      });

      toast({
        title: "Reward Issued!",
        description: `${issueForm.amount} EDU tokens issued successfully`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Issuing Failed",
        description:
          error instanceof Error ? error.message : "Failed to issue reward",
      });
    } finally {
      setIsIssuing(false);
    }
  };

  const copyTransactionHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    toast({
      title: "Transaction Hash Copied",
      description: "Transaction hash copied to clipboard",
    });
  };

  const openInExplorer = (hash: string) => {
    window.open(`https://etherscan.io/tx/${hash}`, "_blank");
  };

  const getReasonIcon = (reason: string) => {
    switch (reason.toLowerCase()) {
      case "course completion":
        return <BookOpen className="h-4 w-4" />;
      case "achievement unlocked":
        return <Award className="h-4 w-4" />;
      default:
        return <Coins className="h-4 w-4" />;
    }
  };

  const getReasonColor = (reason: string) => {
    switch (reason.toLowerCase()) {
      case "course completion":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "achievement unlocked":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "challenge completed":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      default:
        return "bg-green-500/20 text-green-400 border-green-500/30";
    }
  };

  const totalRewards = rewards.reduce(
    (sum, reward) => sum + parseInt(reward.amount),
    0
  );

  return (
    <div className="space-y-6">
      {/* Issue Reward Form */}
      <Card className="bg-card/80 backdrop-blur-md border-neon/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Coins className="h-5 w-5 text-neon-primary" />
            <span>Issue Token Reward</span>
          </CardTitle>
          <CardDescription>
            Issue EDU tokens as rewards for achievements and course completions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reward-student-address">Student Address</Label>
              <Input
                id="reward-student-address"
                placeholder="0x..."
                value={issueForm.studentAddress}
                onChange={(e) =>
                  setIssueForm((prev) => ({
                    ...prev,
                    studentAddress: e.target.value,
                  }))
                }
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reward-amount">Amount (EDU)</Label>
              <Input
                id="reward-amount"
                type="number"
                placeholder="100"
                value={issueForm.amount}
                onChange={(e) =>
                  setIssueForm((prev) => ({ ...prev, amount: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reward-reason">Reason</Label>
              <Select
                value={issueForm.reason}
                onValueChange={(value) =>
                  setIssueForm((prev) => ({ ...prev, reason: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Course Completion">
                    Course Completion
                  </SelectItem>
                  <SelectItem value="Achievement Unlocked">
                    Achievement Unlocked
                  </SelectItem>
                  <SelectItem value="Challenge Completed">
                    Challenge Completed
                  </SelectItem>
                  <SelectItem value="Perfect Score">Perfect Score</SelectItem>
                  <SelectItem value="Streak Bonus">Streak Bonus</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="course-name">Course Name (Optional)</Label>
              <Input
                id="course-name"
                placeholder="Advanced Blockchain Development"
                value={issueForm.courseName}
                onChange={(e) =>
                  setIssueForm((prev) => ({
                    ...prev,
                    courseName: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="achievement-name">
                Achievement Name (Optional)
              </Label>
              <Input
                id="achievement-name"
                placeholder="Perfect Score"
                value={issueForm.achievementName}
                onChange={(e) =>
                  setIssueForm((prev) => ({
                    ...prev,
                    achievementName: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <Button onClick={issueReward} disabled={isIssuing} className="w-full">
            {isIssuing ? "Issuing Reward..." : "Issue Token Reward"}
          </Button>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/80 backdrop-blur-md border-neon/20">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-neon-primary" />
              <span className="text-sm font-medium">Total Rewards</span>
            </div>
            <p className="text-2xl font-bold text-neon-primary">
              {totalRewards} EDU
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-md border-neon/20">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Coins className="h-4 w-4 text-neon-primary" />
              <span className="text-sm font-medium">Total Transactions</span>
            </div>
            <p className="text-2xl font-bold text-neon-primary">
              {rewards.length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-md border-neon/20">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-neon-primary" />
              <span className="text-sm font-medium">Unique Students</span>
            </div>
            <p className="text-2xl font-bold text-neon-primary">
              {new Set(rewards.map((r) => r.studentAddress)).size}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search */}
      <Card className="bg-card/80 backdrop-blur-md border-neon/20">
        <CardHeader>
          <CardTitle>Filter Rewards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="filter-reward-address">Filter by Address</Label>
              <Input
                id="filter-reward-address"
                placeholder="0x..."
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="font-mono"
              />
            </div>
            <div className="flex items-end space-x-2">
              <Button
                onClick={() => fetchRewards(walletAddress || undefined)}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Filter"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setWalletAddress("");
                  fetchRewards();
                }}
              >
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rewards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Token Rewards ({rewards.length})
          </h3>
        </div>

        {rewards.length === 0 ? (
          <Card className="bg-card/80 backdrop-blur-md border-neon/20">
            <CardContent className="py-8 text-center">
              <Coins className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No rewards found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {rewards.map((reward) => (
              <Card
                key={reward.id}
                className="bg-card/80 backdrop-blur-md border-neon/20"
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getReasonIcon(reward.reason)}
                        <div>
                          <p className="font-medium">{reward.amount} EDU</p>
                          <p className="text-sm text-muted-foreground">
                            {reward.reason}
                            {reward.courseName && ` - ${reward.courseName}`}
                            {reward.achievementName &&
                              ` - ${reward.achievementName}`}
                          </p>
                        </div>
                      </div>
                      <Badge className={getReasonColor(reward.reason)}>
                        {reward.reason}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <p className="text-sm font-mono">
                          {reward.studentAddress.slice(0, 6)}...
                          {reward.studentAddress.slice(-4)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(reward.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyTransactionHash(reward.transactionHash)
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openInExplorer(reward.transactionHash)}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenRewards;
