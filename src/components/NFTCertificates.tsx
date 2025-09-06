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
import { ethereumService, Certificate } from "@/services/ethereumService";
import { Award, ExternalLink, Copy, Download, CheckCircle } from "lucide-react";

const NFTCertificates = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [mintForm, setMintForm] = useState({
    studentAddress: "",
    courseName: "",
    grade: "",
    credits: "3",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async (address?: string) => {
    setIsLoading(true);
    try {
      const response = await ethereumService.getCertificates(address);
      setCertificates(response.data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to fetch certificates",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const mintCertificate = async () => {
    if (!mintForm.studentAddress || !mintForm.courseName || !mintForm.grade) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
      });
      return;
    }

    setIsMinting(true);
    try {
      const newCertificate = await ethereumService.mintCertificate({
        studentAddress: mintForm.studentAddress,
        courseName: mintForm.courseName,
        grade: mintForm.grade,
        credits: parseInt(mintForm.credits),
      });

      setCertificates((prev) => [newCertificate, ...prev]);
      setMintForm({
        studentAddress: "",
        courseName: "",
        grade: "",
        credits: "3",
      });

      toast({
        title: "Certificate Minted!",
        description: `NFT certificate created for ${mintForm.courseName}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Minting Failed",
        description:
          error instanceof Error ? error.message : "Failed to mint certificate",
      });
    } finally {
      setIsMinting(false);
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

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A+":
      case "A":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "B+":
      case "B":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "C+":
      case "C":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Mint Certificate Form */}
      <Card className="bg-card/80 backdrop-blur-md border-neon/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-neon-primary" />
            <span>Mint NFT Certificate</span>
          </CardTitle>
          <CardDescription>
            Create a blockchain-verified certificate for course completion
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="student-address">Student Address</Label>
              <Input
                id="student-address"
                placeholder="0x..."
                value={mintForm.studentAddress}
                onChange={(e) =>
                  setMintForm((prev) => ({
                    ...prev,
                    studentAddress: e.target.value,
                  }))
                }
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course-name">Course Name</Label>
              <Input
                id="course-name"
                placeholder="Advanced Blockchain Development"
                value={mintForm.courseName}
                onChange={(e) =>
                  setMintForm((prev) => ({
                    ...prev,
                    courseName: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grade">Grade</Label>
              <Select
                value={mintForm.grade}
                onValueChange={(value) =>
                  setMintForm((prev) => ({ ...prev, grade: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="C+">C+</SelectItem>
                  <SelectItem value="C">C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="credits">Credits</Label>
              <Input
                id="credits"
                type="number"
                placeholder="3"
                value={mintForm.credits}
                onChange={(e) =>
                  setMintForm((prev) => ({ ...prev, credits: e.target.value }))
                }
              />
            </div>
          </div>
          <Button
            onClick={mintCertificate}
            disabled={isMinting}
            className="w-full"
          >
            {isMinting ? "Minting Certificate..." : "Mint NFT Certificate"}
          </Button>
        </CardContent>
      </Card>

      {/* Filter and Search */}
      <Card className="bg-card/80 backdrop-blur-md border-neon/20">
        <CardHeader>
          <CardTitle>Filter Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="filter-address">Filter by Address</Label>
              <Input
                id="filter-address"
                placeholder="0x..."
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="font-mono"
              />
            </div>
            <div className="flex items-end space-x-2">
              <Button
                onClick={() => fetchCertificates(walletAddress || undefined)}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Filter"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setWalletAddress("");
                  fetchCertificates();
                }}
              >
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certificates List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            NFT Certificates ({certificates.length})
          </h3>
        </div>

        {certificates.length === 0 ? (
          <Card className="bg-card/80 backdrop-blur-md border-neon/20">
            <CardContent className="py-8 text-center">
              <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No certificates found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certificates.map((certificate) => (
              <Card
                key={certificate.id}
                className="bg-card/80 backdrop-blur-md border-neon/20"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      {certificate.metadata.name}
                    </CardTitle>
                    <Badge className={getGradeColor(certificate.grade)}>
                      {certificate.grade}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    Token ID: {certificate.tokenId}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Course:</span>
                      <span className="font-medium">
                        {certificate.courseName}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Completed:</span>
                      <span>
                        {new Date(
                          certificate.completionDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Student:</span>
                      <span className="font-mono text-xs">
                        {certificate.studentAddress.slice(0, 6)}...
                        {certificate.studentAddress.slice(-4)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neon/20">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Block #{certificate.blockNumber}</span>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyTransactionHash(certificate.transactionHash)
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            openInExplorer(certificate.transactionHash)
                          }
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-xs text-green-400">
                      Blockchain Verified
                    </span>
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

export default NFTCertificates;
