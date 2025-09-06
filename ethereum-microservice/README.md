# Ethereum Microservice for Metaverse University

A comprehensive Ethereum microservice that provides blockchain integration for the Metaverse University platform, including wallet management, NFT certificates, token rewards, and blockchain verification.

## 🚀 Features

### Core Functionality

- **Wallet Integration**: Connect and manage Ethereum wallets
- **NFT Certificates**: Mint blockchain-verified course completion certificates
- **Token Rewards**: Issue EDU tokens for achievements and course completions
- **Transaction Tracking**: Monitor all blockchain transactions
- **Blockchain Verification**: Verify certificates and achievements on-chain
- **Statistics Dashboard**: Real-time analytics and metrics

### API Endpoints

#### Wallet Management

- `GET /api/wallet/:address` - Get wallet information
- `POST /api/wallet/connect` - Connect a wallet
- `GET /api/wallet/:address/balance` - Get wallet balance

#### NFT Certificates

- `GET /api/certificates` - List all certificates (with optional filtering)
- `GET /api/certificates/:id` - Get specific certificate
- `POST /api/certificates/mint` - Mint new certificate

#### Token Rewards

- `GET /api/rewards` - List all token rewards (with optional filtering)
- `POST /api/rewards/issue` - Issue new token reward

#### Transactions

- `GET /api/transactions` - List transactions (with optional filtering)
- `GET /api/transactions/:hash` - Get specific transaction

#### Blockchain Verification

- `POST /api/verify` - Verify data on blockchain

#### Statistics

- `GET /api/stats` - Get platform statistics
- `GET /health` - Health check endpoint

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Navigate to the microservice directory
cd ethereum-microservice

# Install dependencies
npm install

# Start the development server
npm run dev

# Or start the production server
npm start
```

### Environment Variables

Create a `.env` file in the microservice directory:

```env
PORT=3001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

## 📊 Hardcoded Demo Data

The microservice includes comprehensive hardcoded fake data for demonstration:

### Sample Wallets

- `0x1234567890123456789012345678901234567890` (2.5 ETH)
- `0xabcdefabcdefabcdefabcdefabcdefabcdefabcd` (0.8 ETH)

### Sample Certificates

- Advanced Blockchain Development Certificate (A+)
- Metaverse Architecture Certificate (A)

### Sample Token Rewards

- Course completion rewards (100 EDU)
- Achievement rewards (50 EDU)

### Sample Transactions

- Certificate minting transactions
- Token reward transactions

## 🔧 API Usage Examples

### Connect Wallet

```javascript
const response = await fetch("http://localhost:3001/api/wallet/connect", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ address: "0x1234..." }),
});
```

### Mint Certificate

```javascript
const response = await fetch("http://localhost:3001/api/certificates/mint", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    studentAddress: "0x1234...",
    courseName: "Advanced Blockchain Development",
    grade: "A+",
    credits: 3,
  }),
});
```

### Issue Token Reward

```javascript
const response = await fetch("http://localhost:3001/api/rewards/issue", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    studentAddress: "0x1234...",
    amount: "100",
    reason: "Course Completion",
    courseName: "Advanced Blockchain Development",
  }),
});
```

## 🎯 Frontend Integration

The microservice is integrated with the React frontend through:

1. **EthereumService** (`src/services/ethereumService.ts`) - API client
2. **EthereumWallet** component - Wallet management UI
3. **NFTCertificates** component - Certificate management UI
4. **TokenRewards** component - Token rewards UI
5. **EthereumDashboard** component - Main dashboard

Access the Ethereum dashboard at: `http://localhost:5173/ethereum`

## 🔒 Security Features

- CORS protection
- Helmet security headers
- Input validation with Joi
- Rate limiting ready
- Error handling middleware

## 📈 Monitoring & Health

- Health check endpoint: `GET /health`
- Request logging with Morgan
- Error tracking and reporting
- Performance monitoring ready

## 🚀 Deployment

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 🔮 Future Enhancements

- Real Ethereum network integration
- Smart contract deployment
- Gas optimization
- Multi-signature wallet support
- Cross-chain compatibility
- Advanced analytics
- Real-time notifications

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions, please contact the Metaverse University development team.

---

**Note**: This microservice currently uses hardcoded fake data for demonstration purposes. In production, it would integrate with real Ethereum networks and smart contracts.
