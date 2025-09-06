# 🎓 Metaverse University - Next-Generation Virtual Education Platform

A cutting-edge educational platform that combines virtual reality, blockchain technology, and gamified learning to create an immersive metaverse university experience.

## 🌟 Features

### 🎮 Core Platform

- **Virtual Reality Campus**: Immersive 3D learning environments
- **Gamified Learning**: Points, achievements, and leaderboards
- **AI-Powered Mentorship**: Personalized learning experiences
- **Global Collaboration**: Connect with students worldwide
- **Real-time Analytics**: Track progress and performance

### 🔗 Blockchain Integration

- **NFT Certificates**: Blockchain-verified course completion certificates
- **Token Rewards**: Earn EDU tokens for achievements and course completions
- **Wallet Integration**: Connect Ethereum wallets for seamless transactions
- **Smart Contracts**: Automated reward distribution and certificate minting
- **Blockchain Verification**: Verify degrees and achievements on-chain

### 🎯 Educational Features

- **Interactive Courses**: Engaging VR/AR learning experiences
- **Achievement System**: Unlock badges and rewards
- **Challenge System**: Compete with other students
- **Progress Tracking**: Monitor learning journey
- **Social Learning**: Collaborate with peers in virtual spaces

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Modern web browser with WebXR support (for VR features)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd metaverseuni
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Start the Ethereum microservice** (in a separate terminal)

   ```bash
   cd ethereum-microservice
   npm install
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Ethereum Dashboard: http://localhost:5173/ethereum
   - Microservice API: http://localhost:3001

## 🏗️ Project Structure

```
metaverseuni/
├── src/                          # Frontend React application
│   ├── components/               # React components
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── 3d/                  # Three.js/VR components
│   │   ├── EthereumWallet.tsx   # Wallet management
│   │   ├── NFTCertificates.tsx  # Certificate system
│   │   ├── TokenRewards.tsx     # Token rewards
│   │   └── EthereumDashboard.tsx # Blockchain dashboard
│   ├── services/                # API services
│   │   └── ethereumService.ts   # Ethereum microservice client
│   ├── pages/                   # Application pages
│   ├── hooks/                   # Custom React hooks
│   └── types/                   # TypeScript type definitions
├── ethereum-microservice/        # Blockchain backend
│   ├── server.js                # Express.js server
│   ├── package.json             # Microservice dependencies
│   └── README.md                # Microservice documentation
├── supabase/                    # Database configuration
└── public/                      # Static assets
```

## 🔧 Technology Stack

### Frontend

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful UI components
- **Three.js** - 3D graphics and VR
- **React Three Fiber** - React renderer for Three.js
- **React Router** - Client-side routing
- **Zustand** - State management
- **React Query** - Server state management

### Backend

- **Express.js** - Web framework
- **Node.js** - Runtime environment
- **Supabase** - Database and authentication
- **Ethereum Integration** - Blockchain functionality

### Blockchain

- **Ethereum** - Smart contract platform
- **NFTs** - Non-fungible tokens for certificates
- **ERC-20 Tokens** - EDU token rewards
- **Web3 Integration** - Wallet connectivity

## 🎮 Usage Guide

### Getting Started

1. **Visit the Platform**: Navigate to http://localhost:5173
2. **Sign Up/Login**: Create an account or sign in
3. **Explore the Campus**: Take a virtual tour of the university
4. **Connect Wallet**: Link your Ethereum wallet for blockchain features

### Blockchain Features

1. **Access Ethereum Dashboard**: Click "Blockchain" in navigation
2. **Connect Wallet**: Use demo addresses or connect your own
3. **Mint Certificates**: Create NFT certificates for course completions
4. **Earn Tokens**: Receive EDU tokens for achievements
5. **View Transactions**: Monitor all blockchain activity

### Demo Data

The platform includes hardcoded demo data for testing:

- **Demo Wallets**:
  - `0x1234567890123456789012345678901234567890` (2.5 ETH)
  - `0xabcdefabcdefabcdefabcdefabcdefabcdefabcd` (0.8 ETH)
- **Sample Certificates**: Pre-minted NFT certificates
- **Token Rewards**: Example EDU token distributions

## 🔗 API Endpoints

### Ethereum Microservice

- `GET /health` - Health check
- `GET /api/stats` - Platform statistics
- `POST /api/wallet/connect` - Connect wallet
- `GET /api/wallet/:address` - Get wallet info
- `POST /api/certificates/mint` - Mint NFT certificate
- `GET /api/certificates` - List certificates
- `POST /api/rewards/issue` - Issue token reward
- `GET /api/rewards` - List rewards
- `GET /api/transactions` - List transactions

## 🎯 Key Components

### EthereumWallet

- Connect and manage Ethereum wallets
- View balances and transaction history
- Copy addresses and view on Etherscan

### NFTCertificates

- Mint blockchain-verified certificates
- View certificate metadata and attributes
- Filter certificates by student address

### TokenRewards

- Issue EDU tokens for achievements
- Track reward history and statistics
- Monitor token distributions

### EthereumDashboard

- Comprehensive blockchain overview
- Real-time statistics and metrics
- Integration status monitoring

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_ETHEREUM_SERVICE_URL=http://localhost:3001/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Microservice Development

```bash
cd ethereum-microservice
npm run dev          # Start with nodemon
npm start           # Start production server
```

## 🎨 Customization

### Theming

The platform uses a custom cosmic theme with:

- Neon color palette
- Aurora effects
- Glowing animations
- Dark mode support

### Adding New Features

1. Create components in `src/components/`
2. Add API endpoints in `ethereum-microservice/server.js`
3. Update types in `src/types/`
4. Add routing in `src/App.tsx`

## 🚀 Deployment

### Frontend Deployment

```bash
npm run build
# Deploy the dist/ folder to your hosting service
```

### Microservice Deployment

```bash
cd ethereum-microservice
npm start
# Deploy to your server or cloud platform
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 🔒 Security

- CORS protection
- Helmet security headers
- Input validation
- Rate limiting
- Secure authentication with Supabase

## 📊 Analytics

The platform includes comprehensive analytics:

- User engagement metrics
- Learning progress tracking
- Blockchain transaction monitoring
- Achievement and reward statistics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:

- Check the documentation
- Review the microservice README
- Open an issue on GitHub
- Contact the development team

## 🔮 Future Roadmap

- **Real Ethereum Integration**: Connect to mainnet/testnet
- **Smart Contract Deployment**: Deploy custom contracts
- **Advanced VR Features**: Enhanced immersive experiences
- **Mobile App**: React Native mobile application
- **AI Integration**: Advanced AI tutoring and assessment
- **Cross-chain Support**: Multi-blockchain compatibility

## 🎉 Acknowledgments

- Built with modern web technologies
- Inspired by the future of education
- Powered by blockchain innovation
- Designed for the metaverse generation

---

**Metaverse University** - Where education meets the future! 🚀✨

_Experience the next generation of virtual learning with blockchain-verified achievements and immersive VR education._
