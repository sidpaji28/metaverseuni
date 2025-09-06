// Ethereum Microservice API Client
const API_BASE_URL =
  import.meta.env.VITE_ETHEREUM_SERVICE_URL || "http://localhost:3001/api";

export interface Wallet {
  address: string;
  balance: string;
  balanceWei: string;
  network: string;
  isConnected: boolean;
}

export interface Certificate {
  id: string;
  tokenId: string;
  contractAddress: string;
  studentAddress: string;
  courseName: string;
  completionDate: string;
  grade: string;
  metadata: {
    name: string;
    description: string;
    image: string;
    attributes: Array<{
      trait_type: string;
      value: string;
    }>;
  };
  transactionHash: string;
  blockNumber: number;
}

export interface TokenReward {
  id: string;
  studentAddress: string;
  amount: string;
  tokenSymbol: string;
  reason: string;
  courseName?: string;
  achievementName?: string;
  timestamp: string;
  transactionHash: string;
  status: string;
}

export interface Transaction {
  id: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  gasUsed: string;
  gasPrice: string;
  timestamp: string;
  type: string;
  status: string;
  blockNumber: number;
}

export interface Verification {
  id: string;
  type: string;
  data: any;
  verified: boolean;
  timestamp: string;
  blockNumber: number;
  transactionHash: string;
  verificationDetails: {
    contractAddress: string;
    method: string;
    gasUsed: string;
    gasPrice: string;
  };
}

export interface Stats {
  totalCertificates: number;
  totalRewards: number;
  totalTransactions: number;
  totalWallets: number;
  totalTokenSupply: string;
  activeStudents: number;
  coursesCompleted: number;
  tokensDistributed: number;
}

class EthereumService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Network error" }));
      throw new Error(error.message || error.error || "Request failed");
    }

    const data = await response.json();
    return data.data || data;
  }

  // Wallet methods
  async connectWallet(address: string): Promise<Wallet> {
    return this.request<Wallet>("/wallet/connect", {
      method: "POST",
      body: JSON.stringify({ address }),
    });
  }

  async getWallet(address: string): Promise<Wallet> {
    return this.request<Wallet>(`/wallet/${address}`);
  }

  async getWalletBalance(
    address: string
  ): Promise<{
    address: string;
    balance: string;
    balanceWei: string;
    symbol: string;
    network: string;
  }> {
    return this.request(`/wallet/${address}/balance`);
  }

  // Certificate methods
  async getCertificates(
    studentAddress?: string
  ): Promise<{ data: Certificate[]; count: number }> {
    const params = studentAddress ? `?studentAddress=${studentAddress}` : "";
    return this.request(`/certificates${params}`);
  }

  async getCertificate(id: string): Promise<Certificate> {
    return this.request<Certificate>(`/certificates/${id}`);
  }

  async mintCertificate(data: {
    studentAddress: string;
    courseName: string;
    grade: string;
    credits?: number;
  }): Promise<Certificate> {
    return this.request<Certificate>("/certificates/mint", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Token reward methods
  async getRewards(
    studentAddress?: string
  ): Promise<{ data: TokenReward[]; count: number }> {
    const params = studentAddress ? `?studentAddress=${studentAddress}` : "";
    return this.request(`/rewards${params}`);
  }

  async issueReward(data: {
    studentAddress: string;
    amount: string;
    reason: string;
    courseName?: string;
    achievementName?: string;
  }): Promise<TokenReward> {
    return this.request<TokenReward>("/rewards/issue", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Transaction methods
  async getTransactions(
    address?: string,
    type?: string
  ): Promise<{ data: Transaction[]; count: number }> {
    const params = new URLSearchParams();
    if (address) params.append("address", address);
    if (type) params.append("type", type);
    const queryString = params.toString();
    return this.request(`/transactions${queryString ? `?${queryString}` : ""}`);
  }

  async getTransaction(hash: string): Promise<Transaction> {
    return this.request<Transaction>(`/transactions/${hash}`);
  }

  // Verification methods
  async verify(data: { type: string; data: any }): Promise<Verification> {
    return this.request<Verification>("/verify", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Statistics
  async getStats(): Promise<Stats> {
    return this.request<Stats>("/stats");
  }

  // Health check
  async healthCheck(): Promise<{
    status: string;
    service: string;
    timestamp: string;
    version: string;
  }> {
    return this.request("/health");
  }
}

export const ethereumService = new EthereumService();
