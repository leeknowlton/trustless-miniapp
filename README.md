# The Trustless Manifesto - Farcaster Mini App

A Farcaster Mini App built with [Next.js](https://nextjs.org/) + TypeScript + React that allows users to sign their commitment to the Trustless Manifesto by interacting with an Ethereum smart contract.

## Overview

This app displays the full text of **The Trustless Manifesto** (authored by Yoav Weiss, Vitalik Buterin, and Marissa Posner) and provides a streamlined interface for users to:

1. **Read the manifesto** - Full text displayed with dark mode styling
2. **Sign the pledge** - Submit a transaction on Ethereum mainnet to record their signature
3. **Share their signature** - Post to Farcaster with a single click using the Cast Compose SDK

The manifesto emphasizes the importance of trustlessness in blockchain systems and serves as a declaration against centralization in protocols.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Farcaster account (for full Mini App experience)
- An Ethereum wallet (to sign the pledge)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will run on `http://localhost:3000`

## Features

- **Dynamic OG Images**: Custom generated og:image with manifesto pledge text
- **Ethereum Integration**: Uses Wagmi + Viem for wallet management
- **Farcaster SDK**: Native cast compose integration for sharing
- **Pre-flight Simulation**: Contract calls are simulated before execution
- **Dark Mode Only**: Optimized dark interface with gold accents
- **Responsive Design**: Works seamlessly on mobile and desktop

## Smart Contract

- **Address**: `0x32AA964746ba2be65C71fe4A5cB3c4a023cA3e20`
- **Chain**: Ethereum Mainnet
- **Functions**:
  - `pledge()` - Sign the manifesto
  - `has_pledged(address)` - Check if an address has signed

## Building for Production

```bash
npm run build
npm start
```

## Deployment

Deploy to Vercel with:

```bash
npm run deploy:vercel
```

Or manually push to your Vercel project connected to this repository.

## Code Quality

```bash
npm run lint        # Run ESLint
npm run typecheck   # TypeScript type checking
npm run check:all   # Full type and lint check
```

## Architecture

See [CLAUDE.md](./CLAUDE.md) for detailed architecture documentation, including:
- Project structure
- Key components
- Ethereum integration details
- Farcaster SDK usage
- Development patterns

## Learn More

- [Farcaster Mini Apps Docs](https://docs.neynar.com/docs/create-farcaster-miniapp-in-60s)
- [The Trustless Manifesto (Original)](https://trustlessness.eth.limo/general/2025/11/11/the-trustless-manifesto.html)
- [Wagmi Documentation](https://wagmi.sh/)
- [Next.js Documentation](https://nextjs.org/docs)

