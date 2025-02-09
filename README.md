# GG (Gossip Girl) - Web3 Secret Spilling Platform

## Overview
GG is a retro-themed web3 application inspired by the iconic 2000s show "Gossip Girl". It combines the drama of secret-spilling with modern blockchain technology, allowing users to create, collect, and trade gossip as NFTs. The platform features a nostalgic UI that captures the essence of the 2010 era while leveraging cutting-edge blockchain capabilities.

XOXO, Gossip Girl 💋

## Core Features
- **Secret Spilling**: Create and share secrets as tweet-style NFTs
- **NFT Collections**: View and manage your collection of gossip NFTs
- **Eliza AI Bot**: Interact with our Gossip Girl-trained AI character
- **Privy Wallet Integration**: Complete web3 wallet management system
- **Social Features**: General chat and community interaction
- **Policy Management**: Create and manage server wallets and policies

## Technology Stack
### Blockchain & Web3
- **Chain**: Base Sepolia Network
- **NFT Standard**: Metaplex ERC-721
- **Wallet Integration**: Privy Wallet
- **Web3 SDK**: Coinbase onchainkit

### Frontend
- React.js
- TypeScript
- Hosted on OpenSea
- Retro-themed UI/UX inspired by 2010s web design

### Backend
- Next.js API routes
- Eliza Bot (hosted on Autonome)
- Custom-trained on Gossip Girl character dialogue

## Project Structure
```
.
├── frontend/           # React TypeScript frontend
│   ├── src/
│   │   ├── components/ # UI components including NFT modals
│   │   ├── pages/     # Main pages including collection view
│   │   └── App.tsx    # Main application entry
│   └── public/        # Static assets and images
└── backend/           # Next.js backend API
    └── src/
        └── app/
            └── api/   # API endpoints for NFT and wallet management
```

## Features In-Depth

### NFT Management
- Create tweet-style NFTs with gossip content
- Mint using Metaplex ERC-721 standard
- View and manage NFT collections
- Transfer and claim NFTs

### Privy Wallet Features
- Create and manage wallet policies
- Update policy configurations
- Fetch server wallets
- Manage policy permissions
- Secure transaction handling

### AI Integration
- Custom-trained Eliza bot for Gossip Girl-style interactions
- Natural language processing for gossip generation
- Character-accurate responses and interactions

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Privy Wallet account
- Base Sepolia testnet access
- Environment variables configured

## Environment Setup

### Backend Environment Variables
```env
ELIZA_BOT_API_KEY=your_api_key
BASE_SEPOLIA_RPC_URL=your_rpc_url
PRIVY_APP_ID=your_privy_id
PRIVY_SECRET_KEY=your_secret_key
```

### Frontend Environment Variables
```env
REACT_APP_CHAIN_ID=base_sepolia_chain_id
REACT_APP_PRIVY_APP_ID=your_privy_app_id
REACT_APP_NFT_CONTRACT_ADDRESS=your_contract_address
```

## Getting Started

### Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables as shown above

4. Start the development server:
```bash
npm run dev
```

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

The backend provides several API endpoints:

- `/api/tweet` - Create and manage gossip tweets
- `/api/nft` - NFT minting and management
- `/api/collection` - Collection viewing and management
- `/api/policy` - Privy wallet policy management
- `/api/chat` - General chat functionality
- `/api/eliza` - AI bot interaction endpoints

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security
- All secrets and sensitive data are managed through environment variables
- Privy wallet integration ensures secure transaction handling
- Policy-based access control for wallet management

## License
This project is licensed under the MIT License - see the LICENSE file for details.

---
*"You know you love me. XOXO, Gossip Girl"* 💋
