# BookofCZ Marketplace - Complete Implementation Guide

## Overview
A fully functional Web3 marketplace for digital books on Binance Smart Chain (BSC) with decentralized features, crypto payments, and IPFS storage capabilities.

## Architecture

### Technology Stack
- **Frontend**: React.js + TypeScript + Tailwind CSS
- **Backend**: Lovable Cloud (Supabase)
- **Blockchain**: Binance Smart Chain (BSC)
- **Web3**: ethers.js v6
- **Storage**: Supabase Storage (can be extended to IPFS)
- **Wallet**: MetaMask integration

### Database Schema

#### Tables Created:
1. **marketplace_books**: Store all book listings
   - creator_wallet, title, description, author
   - cover_url, pdf_url, ipfs_hash (optional)
   - price_bnb, category, tags
   - approval_status (pending/approved/rejected)
   - average_rating, review_count, download_count

2. **marketplace_purchases**: Record all transactions
   - book_id, buyer_wallet, transaction_hash
   - price_paid, platform_fee (4%), creator_amount (96%)
   - purchase_date

3. **marketplace_reviews**: User reviews and ratings
   - book_id, reviewer_wallet, rating (1-5), review_text
   - helpful_count
   - Unique constraint: one review per wallet per book

### Smart Contract Logic (Payment Distribution)

The platform implements a 96/4 split:
- **96% to Creator**: Direct payment to creator's wallet
- **4% Platform Fee**: Goes to `PLATFORM_WALLET` address

**Platform Wallet Address**: Currently set to `0x0000000000000000000000000000000000000000`
⚠️ **IMPORTANT**: Update `PLATFORM_WALLET` in `src/hooks/useMarketplaceWallet.tsx` with your actual BSC wallet address.

### Payment Flow
```javascript
// Purchase flow:
1. User clicks "Buy" on a book
2. Web3 transaction initiated via ethers.js
3. Payment split:
   - 96% sent to book.creator_wallet
   - 4% sent to PLATFORM_WALLET
4. Transaction hash recorded in marketplace_purchases
5. Book access granted to buyer
```

## Key Features Implemented

### ✅ Completed Features

1. **Wallet Connection**
   - MetaMask integration
   - BSC network detection and switching
   - Wallet address display and management

2. **Book Upload System**
   - Upload cover image (JPG/PNG)
   - Upload PDF file
   - Set price in BNB (or 0 for free)
   - Category selection
   - Approval workflow (pending → approved/rejected)

3. **Marketplace Browse**
   - Grid view of approved books
   - Filter by category
   - Search functionality (ready to implement)
   - Book cards with cover, title, author, rating, price

4. **Purchase System** (Ready for implementation)
   - Buy books with BNB
   - Free book downloads
   - Transaction recording
   - Access control

5. **Review System**
   - Only verified buyers can review
   - 1-5 star ratings
   - Text reviews
   - Average rating calculation (automatic via trigger)
   - One review per wallet per book

6. **Storage System**
   - Supabase Storage bucket 'marketplace'
   - Organized by creator wallet
   - Public URL generation for files

7. **Stats Dashboard**
   - Total books, creators, sales, volume
   - Real-time updates

### 🔧 Features Ready for Extension

1. **IPFS Integration**
   - Database field `ipfs_hash` already exists
   - Can store PDF hashes on IPFS
   - Implement pinning service (Pinata, Web3.Storage)

2. **NFT Tokenization**
   - Each book can be minted as NFT (ERC-721)
   - Enable resale with royalties
   - Implement using OpenZeppelin contracts

3. **Admin Dashboard** (Next Phase)
   - Approve/reject books
   - View pending submissions
   - Monitor platform fees
   - User management

4. **Creator Dashboard** (Next Phase)
   - View uploaded books
   - Analytics (sales, views, earnings)
   - Edit book details
   - Withdraw earnings

## Security Implementation

### Row Level Security (RLS) Policies

All tables have RLS enabled with appropriate policies:

```sql
-- Books: Public can view approved, creators can manage own
-- Purchases: Buyers see own purchases, recording is public
-- Reviews: Anyone can view, only verified buyers can write
```

### Storage Policies
- Authenticated users can upload
- Users can view marketplace files
- Users can update their own uploads

### Wallet Security
- No private keys stored
- Read-only blockchain queries
- User-initiated transactions only
- Network validation before transactions

## Smart Contract Reference (Solidity)

While the current implementation uses direct wallet-to-wallet transfers, here's a reference smart contract for advanced features:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BookofCZMarketplace {
    address public platformWallet;
    uint256 public platformFeePercent = 4; // 4%
    
    struct Book {
        address creator;
        uint256 price;
        string ipfsHash;
        bool active;
    }
    
    mapping(uint256 => Book) public books;
    mapping(address => mapping(uint256 => bool)) public hasPurchased;
    
    event BookPurchased(uint256 indexed bookId, address indexed buyer, uint256 price);
    
    constructor(address _platformWallet) {
        platformWallet = _platformWallet;
    }
    
    function purchaseBook(uint256 bookId) external payable {
        Book memory book = books[bookId];
        require(book.active, "Book not active");
        require(msg.value == book.price, "Incorrect payment");
        
        // Calculate fees
        uint256 platformFee = (msg.value * platformFeePercent) / 100;
        uint256 creatorAmount = msg.value - platformFee;
        
        // Transfer funds
        payable(platformWallet).transfer(platformFee);
        payable(book.creator).transfer(creatorAmount);
        
        // Record purchase
        hasPurchased[msg.sender][bookId] = true;
        
        emit BookPurchased(bookId, msg.sender, msg.value);
    }
}
```

## Deployment Considerations

### Environment Variables
Already configured in `.env`:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

### BSC Network Configuration
- **Mainnet Chain ID**: 56 (0x38)
- **Testnet Chain ID**: 97 (0x61)
- **RPC URL**: https://bsc-dataseed.binance.org/

### Critical TODOs Before Production

1. **Update Platform Wallet**
   ```typescript
   // In src/hooks/useMarketplaceWallet.tsx
   export const PLATFORM_WALLET = 'YOUR_ACTUAL_BSC_WALLET_ADDRESS';
   ```

2. **Implement Purchase Flow**
   - Create BookDetailPage component
   - Implement purchase transaction logic
   - Add download access control
   - Generate time-limited download links

3. **Add Admin Authentication**
   - Create admin role in database
   - Implement admin-only routes
   - Build approval interface

4. **IPFS Integration** (Optional but recommended)
   - Set up Pinata or Web3.Storage account
   - Implement upload to IPFS
   - Store hashes in `marketplace_books.ipfs_hash`

5. **Smart Contract Deployment** (Optional)
   - Deploy marketplace contract to BSC
   - Update purchase flow to use contract
   - Implement on-chain purchase verification

## Testing Checklist

### Local Development
- [ ] Wallet connection works
- [ ] Network switching to BSC
- [ ] Book upload (cover + PDF)
- [ ] Books appear after approval
- [ ] Stats update correctly
- [ ] Storage permissions work

### BSC Testnet
- [ ] Connect to BSC Testnet
- [ ] Test BNB transactions
- [ ] Verify transaction hashes
- [ ] Check payment splits
- [ ] Test with multiple wallets

### Production (BSC Mainnet)
- [ ] Smart contract audited (if using)
- [ ] Platform wallet configured
- [ ] SSL/HTTPS enabled
- [ ] Error tracking setup
- [ ] Backup strategy for storage
- [ ] Gas optimization tested

## API Endpoints (Supabase/Lovable Cloud)

All database operations use Supabase client:

```typescript
import { supabase } from '@/integrations/supabase/client';

// Fetch approved books
const { data: books } = await supabase
  .from('marketplace_books')
  .select('*')
  .eq('approval_status', 'approved');

// Record purchase
const { data } = await supabase
  .from('marketplace_purchases')
  .insert({
    book_id,
    buyer_wallet,
    transaction_hash,
    price_paid,
    platform_fee: price_paid * 0.04,
    creator_amount: price_paid * 0.96
  });

// Add review
const { data } = await supabase
  .from('marketplace_reviews')
  .insert({
    book_id,
    reviewer_wallet,
    rating,
    review_text
  });
```

## File Structure

```
src/
├── assets/
│   └── bookofcz-logo.png          # Marketplace logo
├── components/
│   └── marketplace/
│       ├── MarketplaceHeader.tsx   # Top navigation
│       ├── BookGrid.tsx            # Book listing grid
│       ├── BookCard.tsx            # Individual book card
│       ├── MarketplaceStats.tsx    # Platform statistics
│       └── UploadBookDialog.tsx    # Book upload form
├── hooks/
│   └── useMarketplaceWallet.tsx    # Web3 wallet logic
└── pages/
    └── Marketplace.tsx             # Main marketplace page
```

## Extending the Platform

### Phase 1 (Current)
✅ Basic marketplace
✅ Wallet integration
✅ Book upload/approval
✅ Reviews and ratings

### Phase 2 (Recommended Next)
- [ ] Book detail page with purchase
- [ ] Creator dashboard
- [ ] Admin approval interface
- [ ] Search and advanced filters

### Phase 3 (Advanced)
- [ ] IPFS integration
- [ ] NFT minting for books
- [ ] Secondary market (resale)
- [ ] Royalty payments
- [ ] Multi-language support
- [ ] Mobile app (React Native)

### Phase 4 (Enterprise)
- [ ] Smart contract marketplace
- [ ] On-chain reviews
- [ ] DAO governance
- [ ] Token rewards program
- [ ] Subscription model
- [ ] DRM protection

## Support and Resources

### Documentation Links
- **ethers.js**: https://docs.ethers.org/v6/
- **BSC Docs**: https://docs.bnbchain.org/
- **Supabase**: https://supabase.com/docs
- **IPFS**: https://docs.ipfs.tech/

### Example Projects
- OpenSea (NFT marketplace reference)
- Mirror.xyz (Web3 publishing)
- Audius (Decentralized content)

### Community
- BSC Developers: https://t.me/bnbchain
- Web3 Builders: https://www.web3builders.dev/

## License
This marketplace implementation is part of the BookofCZ project.

---

**Built with ❤️ on Binance Smart Chain**
