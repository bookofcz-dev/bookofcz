# BookofCZ Marketplace

A decentralized digital book marketplace built on **BNB Smart Chain (BSC)** where creators can publish, sell, and earn from their digital books with transparent on-chain transactions and a 96/4 creator-platform revenue split.

## Technology Stack

- **Blockchain**: BNB Smart Chain (BSC)
- **Smart Contracts**: Direct wallet-to-wallet transfers with ERC20 token support
- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Tailwind CSS + shadcn-ui components
- **Web3 Integration**: ethers.js v6 + MetaMask
- **Backend**: Lovable Cloud (Supabase) with PostgreSQL + Edge Functions + Storage
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM v6

## Supported Networks

- **BNB Smart Chain Mainnet** (Chain ID: 56)
- **BNB Smart Chain Testnet** (Chain ID: 97)

## Contract Addresses

| Network     | BOCZ Token | USDT Token | Platform Fee Wallet |
|-------------|------------|------------|---------------------|
| BSC Mainnet | `0x701bE97c604A35aB7BCF6C75cA6de3aba0704444` | `0x55d398326f99059fF775485246999027B3197955` | `0x55dEa7A2f92Db5f96Aeb0eDf589Ddc8c83D54004` |
| BSC Testnet | `0x701bE97c604A35aB7BCF6C75cA6de3aba0704444` | `0x55d398326f99059fF775485246999027B3197955` | `0x55dEa7A2f92Db5f96Aeb0eDf589Ddc8c83D54004` |

## Features

- **Decentralized Book Marketplace**: Browse, purchase, and sell digital books (PDF/EPUB) on BSC
- **Multi-Token Support**: Pay with BNB, USDT, or BOCZ tokens
- **Creator-First Economics**: 96% revenue goes to creators, 4% platform fee
- **Wallet-Based Authentication**: Secure MetaMask integration with signature-based auth
- **Token-Gated Access**: BOCZ token holders get exclusive access to premium content
- **Real-Time Price Oracle**: Live BNB and BOCZ price feeds via CoinGecko API
- **Review & Rating System**: Community-driven book reviews with verified purchase validation
- **Creator Dashboard**: Track earnings, sales, and book performance analytics
- **Secure File Storage**: Encrypted PDF/EPUB storage with watermarking capabilities
- **Admin Moderation**: Book approval workflow with rejection reasons
- **Gas-Efficient Design**: Optimized for BNB Smart Chain's low transaction costs

## Getting Started

### Prerequisites

- Node.js 16+ and npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- MetaMask browser extension
- BNB tokens for gas fees

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd bookofcz-marketplace

# Install dependencies
npm i

# Start the development server
npm run dev
```

### Environment Variables

The project uses Lovable Cloud backend. Environment variables are automatically configured:

- `VITE_SUPABASE_URL` - Lovable Cloud backend URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Public API key
- `VITE_SUPABASE_PROJECT_ID` - Project identifier

## Project Structure

```
src/
├── components/        # React components
│   ├── marketplace/  # Marketplace-specific components
│   ├── creator/      # Creator dashboard components
│   ├── admin/        # Admin dashboard components
│   └── ui/           # Reusable UI components (shadcn)
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and book content
├── pages/            # Route pages
├── contexts/         # React contexts (WalletContext)
└── integrations/     # Lovable Cloud integration

supabase/
├── functions/        # Edge functions for serverless logic
└── config.toml       # Supabase configuration
```

## Key Integrations

- **Lovable Cloud**: Backend-as-a-Service providing database, storage, and serverless functions
- **MetaMask**: Web3 wallet for transaction signing and authentication
- **CoinGecko API**: Real-time cryptocurrency price feeds
- **ElevenLabs**: Text-to-speech for audiobook generation (optional)

## Development

**Use Lovable AI Editor**

Visit the [Lovable Project](https://lovable.dev/projects/213e7147-2c30-45a9-a939-ff0bf31d7907) to edit using AI prompts. Changes are automatically committed to this repo.

**Use Your Preferred IDE**

Clone the repo and push changes. Pushed changes sync automatically to Lovable.

**GitHub Codespaces**

Open the repo in Codespaces for a cloud-based development environment.

## Deployment

Deploy via Lovable: Project → Share → Publish

## Custom Domain

Navigate to Project → Settings → Domains → Connect Domain

[Learn more about custom domains](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Security

- Row Level Security (RLS) policies on all database tables
- Wallet signature verification for authentication
- Secure file storage with access control
- Token balance verification for gated content
- Admin role-based permissions

## License

MIT

## Resources

- [Lovable Documentation](https://docs.lovable.dev)
- [BNB Smart Chain Docs](https://docs.bnbchain.org)
- [ethers.js Documentation](https://docs.ethers.org/v6/)
- [Supabase Documentation](https://supabase.com/docs)
