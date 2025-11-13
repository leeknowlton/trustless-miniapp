# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**The Trustless Manifesto** is a Farcaster Mini App built with Next.js, TypeScript, and React. It displays the full text of the Trustless Manifesto and allows users to sign a pledge to the manifesto by interacting with an Ethereum smart contract on mainnet.

## Core Technologies

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Wallet Integration**: Wagmi + Viem (Ethereum), @farcaster/miniapp-sdk
- **UI**: React 19, Tailwind CSS
- **Authentication**: Farcaster Mini App SDK for user auth

## Key Commands

```bash
# Development
npm run dev              # Start dev server (runs on http://localhost:3000)

# Building & Deployment
npm run build            # Production build
npm run build:raw        # Alternative build command
npm start                # Run production server

# Code Quality
npm run lint             # Run ESLint
npm run typecheck        # TypeScript type checking
npm run check:all        # Run typecheck, lint:types, and lint:links
npm run lint:types       # Check for type-specific issues (any types, etc.)
npm run lint:links       # Validate HTML link usage

# Deployment
npm run deploy:vercel    # Deploy to Vercel (automated)
npm run deploy:raw       # Direct Vercel deployment

# Cleanup
npm run cleanup          # Clean up temporary files
```

## Project Architecture

### Directory Structure

```
src/
├── app/                           # Next.js App Router
│   ├── api/                       # API routes
│   │   ├── opengraph-image/      # OG image generation (dynamic)
│   │   ├── auth/                 # Farcaster authentication routes
│   │   ├── webhook/              # Notification webhooks
│   │   └── ...
│   ├── share/[fid]/               # Share page (dynamic by FID)
│   ├── layout.tsx                 # Root layout with metadata
│   ├── page.tsx                   # Home page
│   ├── providers.tsx              # React providers (Wagmi, etc.)
│   ├── app.tsx                    # App shell component
│   └── globals.css                # Global styles
├── components/
│   ├── App.tsx                    # Main app component
│   └── ui/
│       ├── tabs/                  # Tab components
│       │   ├── TrustlessManifestoTab.tsx  # Main manifesto display (formerly HomeTab)
│       │   ├── ActionsTab.tsx     # Actions tab
│       │   ├── WalletTab.tsx      # Wallet tab
│       │   ├── ContextTab.tsx     # Context tab
│       │   └── index.ts           # Tab exports
│       ├── wallet/                # Wallet interaction components
│       ├── Button.tsx             # Reusable button component
│       ├── Share.tsx              # Share component
│       └── ...
└── lib/
    ├── constants.ts               # App constants (contract addresses, chain IDs)
    ├── neynar.ts                  # Neynar API integration
    ├── errorUtils.tsx             # Error handling utilities
    ├── notifs.ts                  # Notification utilities
    ├── kv.ts                      # Key-value storage
    ├── utils.ts                   # General utilities
    ├── devices.ts                 # Device detection
    ├── localStorage.ts            # Browser storage helpers
    └── truncateAddress.ts         # Address formatting
```

### Key Components

1. **TrustlessManifestoTab** (`src/components/ui/tabs/TrustlessManifestoTab.tsx`)
   - Main component displaying the Trustless Manifesto text
   - Handles Ethereum wallet connection via Wagmi
   - Simulates contract calls before execution for UX
   - Shows share button after successful transaction signing via Farcaster SDK
   - Features dark mode only styling

2. **OG Image Route** (`src/app/api/opengraph-image/route.tsx`)
   - Generates dynamic OG images using Next.js `ImageResponse`
   - Displays with faint background text from the manifesto pledge
   - Size: 1200x800px

3. **Authentication System** (`src/app/api/auth/`)
   - Farcaster user authentication with nonces and signers
   - Stores session data for persistence

4. **Share Page** (`src/app/share/[fid]/`)
   - Dynamic route based on Farcaster user FID
   - Allows users to view and share their signatures

### Styling & Colors

- **Background**: `rgb(28, 28, 28)` (dark charcoal)
- **Primary Text**: `rgb(238, 238, 238)` (off-white)
- **Accent Color**: `rgb(195, 165, 84)` (gold)
- **Borders**: `rgb(128, 128, 128)` (medium gray)
- **Buttons**: Gold gradient and blue gradient (vibrant)
- **Dark Mode Only**: No light mode styles (all `dark:` prefixes removed)

## Ethereum Integration

- **Contract**: `0x32AA964746ba2be65C71fe4A5cB3c4a023cA3e20` (Ethereum Mainnet)
- **Functions**:
  - `pledge()`: Sign the manifesto (nonpayable)
  - `has_pledged(address)`: Check if address has signed (view)
- **Chain**: Ethereum Mainnet only
- **Wagmi Setup**: Configured in `src/components/providers/WagmiProvider`

## Farcaster SDK Integration

- **SDK**: `@farcaster/miniapp-sdk`
- **Usage**:
  - `sdk.actions.composeCast()` for sharing signatures to Farcaster
  - Pre-filled text: "Signed the trustless manifesto!"
- **Located in**: `TrustlessManifestoTab.tsx` share button handler

## Environment Variables

Create a `.env.local` file (copy from `.env` if needed). Key variables:
- `NEXT_PUBLIC_*`: Public variables exposed to browser
- Neynar API key (for fetching user data)
- Vercel deployment settings

## Recent Changes

- Renamed `HomeTab` to `TrustlessManifestoTab` for clarity (legacy alias maintained for backwards compatibility)
- Converted to dark mode only (removed all light mode styles)
- Added Farcaster Cast Compose SDK integration for sharing
- Dynamic OG image with faint manifesto text in background
- Custom button styling with gradient effects (gold for signing, blue for sharing)
- Share button replaces sign button after transaction completion

## Type Safety

- Strict TypeScript enabled (`"strict": true`)
- Path alias: `~/*` maps to `./src/*`
- No `any` types allowed (enforced by linter)

## Common Development Patterns

1. **Wallet Interaction**: Use `wagmi` hooks (`useAccount`, `useWriteContract`, `useWaitForTransactionReceipt`)
2. **Error Handling**: Use `renderError()` from `lib/errorUtils.tsx` for consistent error display
3. **Component Styling**: Tailwind CSS with inline styles for complex layouts (especially OG images)
4. **API Routes**: Use Next.js App Router for RESTful endpoints

## Testing & Building

- No test framework currently configured (can be added as needed)
- Linting is strict and checks for type issues and HTML link errors
- Build process includes type checking via TypeScript
- Pre-deployment checklist: Run `npm run check:all` before deploying

## Deployment

The app is designed for Vercel deployment. The build process:
1. Runs TypeScript type checking
2. Builds Next.js app
3. Generates OG images on-demand
4. Optimizes for serverless functions

To deploy: `npm run deploy:vercel` (automated with prompts for environment setup)
