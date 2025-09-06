import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(compression());
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Hardcoded fake data for demonstration
const FAKE_DATA = {
  // Fake wallet addresses and balances
  wallets: {
    "0x1234567890123456789012345678901234567890": {
      address: "0x1234567890123456789012345678901234567890",
      balance: "2.5",
      balanceWei: "2500000000000000000",
      network: "ethereum",
      isConnected: true,
    },
    "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd": {
      address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
      balance: "0.8",
      balanceWei: "800000000000000000",
      network: "ethereum",
      isConnected: true,
    },
  },

  // Fake NFT certificates
  certificates: [
    {
      id: "cert-001",
      tokenId: "1",
      contractAddress: "0xCertificateContract123456789",
      studentAddress: "0x1234567890123456789012345678901234567890",
      courseName: "Advanced Blockchain Development",
      completionDate: "2024-01-15",
      grade: "A+",
      metadata: {
        name: "Blockchain Developer Certificate",
        description:
          "Certificate of completion for Advanced Blockchain Development course",
        image: "https://metaverse-uni.com/certificates/blockchain-dev.png",
        attributes: [
          { trait_type: "Course", value: "Advanced Blockchain Development" },
          { trait_type: "Grade", value: "A+" },
          { trait_type: "Completion Date", value: "2024-01-15" },
          { trait_type: "Credits", value: "3" },
        ],
      },
      transactionHash:
        "0xabc123def456789012345678901234567890123456789012345678901234567890",
      blockNumber: 12345678,
    },
    {
      id: "cert-002",
      tokenId: "2",
      contractAddress: "0xCertificateContract123456789",
      studentAddress: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
      courseName: "Metaverse Architecture",
      completionDate: "2024-01-20",
      grade: "A",
      metadata: {
        name: "Metaverse Architect Certificate",
        description:
          "Certificate of completion for Metaverse Architecture course",
        image: "https://metaverse-uni.com/certificates/metaverse-arch.png",
        attributes: [
          { trait_type: "Course", value: "Metaverse Architecture" },
          { trait_type: "Grade", value: "A" },
          { trait_type: "Completion Date", value: "2024-01-20" },
          { trait_type: "Credits", value: "4" },
        ],
      },
      transactionHash:
        "0xdef456abc789012345678901234567890123456789012345678901234567890123",
      blockNumber: 12345680,
    },
  ],

  // Fake token rewards
  tokenRewards: [
    {
      id: "reward-001",
      studentAddress: "0x1234567890123456789012345678901234567890",
      amount: "100",
      tokenSymbol: "EDU",
      reason: "Course Completion",
      courseName: "Advanced Blockchain Development",
      timestamp: "2024-01-15T10:30:00Z",
      transactionHash:
        "0xreward123456789012345678901234567890123456789012345678901234567890",
      status: "completed",
    },
    {
      id: "reward-002",
      studentAddress: "0x1234567890123456789012345678901234567890",
      amount: "50",
      tokenSymbol: "EDU",
      reason: "Achievement Unlocked",
      achievementName: "Perfect Score",
      timestamp: "2024-01-16T14:20:00Z",
      transactionHash:
        "0xreward456789012345678901234567890123456789012345678901234567890123",
      status: "completed",
    },
  ],

  // Fake transactions
  transactions: [
    {
      id: "tx-001",
      hash: "0xabc123def456789012345678901234567890123456789012345678901234567890",
      from: "0x1234567890123456789012345678901234567890",
      to: "0xCertificateContract123456789",
      value: "0",
      gasUsed: "150000",
      gasPrice: "20000000000",
      timestamp: "2024-01-15T10:30:00Z",
      type: "certificate_mint",
      status: "confirmed",
      blockNumber: 12345678,
    },
    {
      id: "tx-002",
      hash: "0xreward123456789012345678901234567890123456789012345678901234567890",
      from: "0x0000000000000000000000000000000000000000",
      to: "0x1234567890123456789012345678901234567890",
      value: "100000000000000000000",
      gasUsed: "21000",
      gasPrice: "20000000000",
      timestamp: "2024-01-15T10:30:00Z",
      type: "token_reward",
      status: "confirmed",
      blockNumber: 12345679,
    },
  ],
};

// Routes

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "ethereum-microservice",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// Wallet endpoints
app.get("/api/wallet/:address", (req, res) => {
  const { address } = req.params;
  const wallet = FAKE_DATA.wallets[address.toLowerCase()];

  if (!wallet) {
    return res.status(404).json({
      error: "Wallet not found",
      message: "Wallet address not found in our records",
    });
  }

  res.json({
    success: true,
    data: wallet,
  });
});

app.post("/api/wallet/connect", (req, res) => {
  const { address } = req.body;

  if (!address) {
    return res.status(400).json({
      error: "Address required",
      message: "Wallet address is required",
    });
  }

  // Simulate wallet connection
  const wallet = FAKE_DATA.wallets[address.toLowerCase()] || {
    address: address.toLowerCase(),
    balance: "0.0",
    balanceWei: "0",
    network: "ethereum",
    isConnected: true,
  };

  res.json({
    success: true,
    message: "Wallet connected successfully",
    data: wallet,
  });
});

app.get("/api/wallet/:address/balance", (req, res) => {
  const { address } = req.params;
  const wallet = FAKE_DATA.wallets[address.toLowerCase()];

  if (!wallet) {
    return res.status(404).json({
      error: "Wallet not found",
      message: "Wallet address not found in our records",
    });
  }

  res.json({
    success: true,
    data: {
      address: wallet.address,
      balance: wallet.balance,
      balanceWei: wallet.balanceWei,
      symbol: "ETH",
      network: wallet.network,
    },
  });
});

// Certificate endpoints
app.get("/api/certificates", (req, res) => {
  const { studentAddress } = req.query;

  let certificates = FAKE_DATA.certificates;

  if (studentAddress) {
    certificates = certificates.filter(
      (cert) =>
        cert.studentAddress.toLowerCase() === studentAddress.toLowerCase()
    );
  }

  res.json({
    success: true,
    data: certificates,
    count: certificates.length,
  });
});

app.get("/api/certificates/:id", (req, res) => {
  const { id } = req.params;
  const certificate = FAKE_DATA.certificates.find((cert) => cert.id === id);

  if (!certificate) {
    return res.status(404).json({
      error: "Certificate not found",
      message: "Certificate with the specified ID not found",
    });
  }

  res.json({
    success: true,
    data: certificate,
  });
});

app.post("/api/certificates/mint", (req, res) => {
  const { studentAddress, courseName, grade, credits } = req.body;

  if (!studentAddress || !courseName || !grade) {
    return res.status(400).json({
      error: "Missing required fields",
      message: "studentAddress, courseName, and grade are required",
    });
  }

  // Generate fake certificate
  const newCertificate = {
    id: `cert-${uuidv4().substring(0, 8)}`,
    tokenId: (FAKE_DATA.certificates.length + 1).toString(),
    contractAddress: "0xCertificateContract123456789",
    studentAddress: studentAddress.toLowerCase(),
    courseName,
    completionDate: new Date().toISOString().split("T")[0],
    grade,
    metadata: {
      name: `${courseName} Certificate`,
      description: `Certificate of completion for ${courseName} course`,
      image: `https://metaverse-uni.com/certificates/${courseName
        .toLowerCase()
        .replace(/\s+/g, "-")}.png`,
      attributes: [
        { trait_type: "Course", value: courseName },
        { trait_type: "Grade", value: grade },
        {
          trait_type: "Completion Date",
          value: new Date().toISOString().split("T")[0],
        },
        { trait_type: "Credits", value: credits || "3" },
      ],
    },
    transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
    blockNumber: 12345678 + Math.floor(Math.random() * 1000),
  };

  FAKE_DATA.certificates.push(newCertificate);

  res.json({
    success: true,
    message: "Certificate minted successfully",
    data: newCertificate,
  });
});

// Token rewards endpoints
app.get("/api/rewards", (req, res) => {
  const { studentAddress } = req.query;

  let rewards = FAKE_DATA.tokenRewards;

  if (studentAddress) {
    rewards = rewards.filter(
      (reward) =>
        reward.studentAddress.toLowerCase() === studentAddress.toLowerCase()
    );
  }

  res.json({
    success: true,
    data: rewards,
    count: rewards.length,
  });
});

app.post("/api/rewards/issue", (req, res) => {
  const { studentAddress, amount, reason, courseName, achievementName } =
    req.body;

  if (!studentAddress || !amount || !reason) {
    return res.status(400).json({
      error: "Missing required fields",
      message: "studentAddress, amount, and reason are required",
    });
  }

  // Generate fake reward
  const newReward = {
    id: `reward-${uuidv4().substring(0, 8)}`,
    studentAddress: studentAddress.toLowerCase(),
    amount: amount.toString(),
    tokenSymbol: "EDU",
    reason,
    courseName,
    achievementName,
    timestamp: new Date().toISOString(),
    transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
    status: "completed",
  };

  FAKE_DATA.tokenRewards.push(newReward);

  res.json({
    success: true,
    message: "Token reward issued successfully",
    data: newReward,
  });
});

// Transaction endpoints
app.get("/api/transactions", (req, res) => {
  const { address, type } = req.query;

  let transactions = FAKE_DATA.transactions;

  if (address) {
    transactions = transactions.filter(
      (tx) =>
        tx.from.toLowerCase() === address.toLowerCase() ||
        tx.to.toLowerCase() === address.toLowerCase()
    );
  }

  if (type) {
    transactions = transactions.filter((tx) => tx.type === type);
  }

  res.json({
    success: true,
    data: transactions,
    count: transactions.length,
  });
});

app.get("/api/transactions/:hash", (req, res) => {
  const { hash } = req.params;
  const transaction = FAKE_DATA.transactions.find((tx) => tx.hash === hash);

  if (!transaction) {
    return res.status(404).json({
      error: "Transaction not found",
      message: "Transaction with the specified hash not found",
    });
  }

  res.json({
    success: true,
    data: transaction,
  });
});

// Blockchain verification endpoint
app.post("/api/verify", (req, res) => {
  const { type, data } = req.body;

  if (!type || !data) {
    return res.status(400).json({
      error: "Missing required fields",
      message: "type and data are required",
    });
  }

  // Simulate blockchain verification
  const verification = {
    id: `verify-${uuidv4().substring(0, 8)}`,
    type,
    data,
    verified: true,
    timestamp: new Date().toISOString(),
    blockNumber: 12345678 + Math.floor(Math.random() * 1000),
    transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
    verificationDetails: {
      contractAddress: "0xVerificationContract123456789",
      method: "verify",
      gasUsed: "50000",
      gasPrice: "20000000000",
    },
  };

  res.json({
    success: true,
    message: "Verification completed successfully",
    data: verification,
  });
});

// Statistics endpoint
app.get("/api/stats", (req, res) => {
  const stats = {
    totalCertificates: FAKE_DATA.certificates.length,
    totalRewards: FAKE_DATA.tokenRewards.length,
    totalTransactions: FAKE_DATA.transactions.length,
    totalWallets: Object.keys(FAKE_DATA.wallets).length,
    totalTokenSupply: "1000000",
    activeStudents: Object.keys(FAKE_DATA.wallets).length,
    coursesCompleted: FAKE_DATA.certificates.length,
    tokensDistributed: FAKE_DATA.tokenRewards.reduce(
      (sum, reward) => sum + parseInt(reward.amount),
      0
    ),
  };

  res.json({
    success: true,
    data: stats,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal server error",
    message: "Something went wrong on our end",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Not found",
    message: "The requested endpoint does not exist",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Ethereum Microservice running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🎓 Metaverse University Ethereum Integration Ready!`);
});

export default app;
