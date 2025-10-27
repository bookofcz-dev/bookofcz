# Security Documentation - BSC Web3 Integration

## Overview
This document outlines the security measures implemented for the Book of CZ token-gated marketplace with wallet-based authentication.

## Recent Security Enhancements (2025-10-27)

### 1. Wallet-Based Supabase Authentication
- **Anonymous Auth Sessions**: When users connect their wallet, the app creates a Supabase auth session
- **JWT Token Generation**: Each wallet connection generates a JWT token with wallet address in metadata
- **Session Persistence**: Auth sessions are maintained across page reloads and reconnections
- **Automatic Cleanup**: Sessions are properly cleaned up on wallet disconnection or account switching

### 2. Server-Side Purchase Verification
- **Edge Function Protection**: Both watermark-pdf and watermark-epub functions now verify purchases server-side
- **Download Limit Enforcement**: 5-download limit is enforced at the backend, not just client-side
- **Transaction Validation**: All watermark requests validate that the purchase exists with matching transaction hash

### 3. Input Validation with Zod
- **Parameter Validation**: All edge function inputs are validated using Zod schemas
- **UUID Validation**: bookId must be valid UUID format
- **Wallet Address Validation**: Validates Ethereum address format (0x + 40 hex characters)
- **Transaction Hash Validation**: Ensures transaction hashes are properly formatted (0x + 64 hex characters)
- **Path Traversal Prevention**: Input validation prevents directory traversal attacks in storage paths

### 4. Row-Level Security (RLS) Policies
- **Purchase Data Protection**: Removed public access to purchase records
- **Buyer Access**: Users can only view their own purchases via JWT claims
- **Creator Access**: Book creators can view purchases of their books
- **Admin Access**: Admins with proper roles can view all purchases
- **Authenticated Inserts**: Purchase records can only be created by authenticated wallets

## Security Features

### 1. Read-Only Operations
- **No Transaction Signing**: The integration ONLY reads data from the blockchain
- **No Private Keys**: No private keys are stored, transmitted, or handled by the application
- **View Functions Only**: Uses only `balanceOf()` and `decimals()` which are read-only functions
- **No State Changes**: No functions that modify blockchain state are called

### 2. Address Validation
- **Checksum Verification**: All addresses are validated using `isAddress()` from ethers.js
- **Format Validation**: Checksummed addresses are used to prevent address manipulation
- **Input Sanitization**: All user inputs are validated before blockchain calls

### 3. Network Security
- **Fixed Chain ID**: Hard-coded to BSC mainnet (Chain ID: 56)
- **Network Verification**: Validates network before and after switching
- **Official RPC**: Uses Binance's official RPC endpoint (`https://bsc-dataseed.binance.org/`)

### 4. Token Contract Security
- **Immutable Address**: Token contract address is defined as a constant
- **Standard ERC20**: Uses standard, well-audited ERC20 interface
- **Response Validation**: Validates all data returned from contract calls

### 5. User Control
- **Explicit Connection**: Users must explicitly click to connect wallet
- **Account Approval**: Requires user approval via wallet interface
- **Disconnect Option**: Users can disconnect at any time
- **No Auto-Connect**: No automatic wallet connections on page load

### 6. Error Handling
- **Graceful Failures**: All errors are caught and displayed to users
- **No Sensitive Logging**: Production environment doesn't log sensitive details
- **User-Friendly Messages**: Clear error messages without exposing system details

### 7. Data Protection
- **No Data Storage**: No wallet information is stored in local storage or databases
- **Session Only**: All wallet data is kept in component state only
- **No Backend Calls**: All verification happens client-side via blockchain

## What This Integration Does NOT Do

❌ **Does NOT**:
- Sign transactions
- Request private keys
- Transfer funds
- Modify blockchain state
- Store wallet credentials
- Make backend API calls with wallet data
- Auto-connect to wallets
- Request unnecessary permissions

✅ **Does ONLY**:
- Read token balance
- Verify network
- Display connection status

## Dependencies

### ethers.js v6
- Well-established, audited library
- Official Ethereum JavaScript library
- Used by major DeFi protocols
- Regular security updates

## Best Practices Implemented

1. **Principle of Least Privilege**: Only requests minimal permissions needed
2. **Input Validation**: All inputs validated before use
3. **Fail Securely**: Errors default to denying access
4. **Transparency**: Clear messaging about what data is being accessed
5. **User Control**: Users maintain full control of their wallet

## Token Contract Information

- **Contract Address**: `0x701bE97c604A35aB7BCF6C75cA6de3aba0704444`
- **Network**: Binance Smart Chain (BSC) Mainnet
- **Chain ID**: 56
- **Standard**: ERC20
- **Verification**: Contract can be verified on BSCScan

## Audit Recommendations

For production use, consider:
1. Professional smart contract audit of the token contract
2. Security review of the Web3 integration code
3. Penetration testing of the frontend
4. Regular dependency updates
5. Bug bounty program for community security testing

## Reporting Security Issues

If you discover a security vulnerability, please report it responsibly:
- Do not disclose publicly until patched
- Contact the development team directly
- Provide detailed reproduction steps

## Updates and Maintenance

- Regular updates to ethers.js library
- Monitoring of security advisories
- Periodic code reviews
- Community feedback integration

---

**Last Updated**: 2025-10-27
**Version**: 2.0.0

## Changelog

### v2.0.0 (2025-10-27)
- **CRITICAL**: Implemented wallet-based Supabase authentication with JWT tokens
- **CRITICAL**: Added server-side purchase verification to watermark edge functions
- **HIGH**: Added comprehensive input validation with Zod to all edge functions
- **CRITICAL**: Restricted purchase data access via RLS policies based on JWT claims
- **MEDIUM**: Enforced 5-download limit at backend level
- **LOW**: Enhanced error messages for security failures

### v1.0.0 (2025-10-17)
- Initial security documentation
- Read-only blockchain operations
- Basic wallet connection flow
