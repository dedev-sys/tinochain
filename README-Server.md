# TINOCHAIN - Server-Side Overview

This document details the server-side architecture and important aspects of the TINOCHAIN application. The server-side logic is primarily handled by Next.js (Server Actions and Server Components), a custom blockchain simulation service, and Genkit for AI features.

## Core Technologies

*   **Next.js (App Router)**:
    *   **Server Components**: Used for initial page rendering and data fetching (e.g., `src/app/page.tsx` fetching initial blockchain state).
    *   **Server Actions**: Defined in `src/app/actions.ts`, these functions execute on the server and are callable from client components. They handle form submissions and data mutations (e.g., creating transactions, mining blocks).
*   **TypeScript**: Ensures type safety across the server-side codebase.
*   **Genkit (Firebase)**: Used for integrating AI models.
    *   Flows are defined in `src/ai/flows/`.
    *   The Genkit setup is in `src/ai/genkit.ts`.
*   **Node.js Environment**: The underlying environment where the Next.js server and blockchain simulation logic run.

## Key Server-Side Logic & Components

*   **`src/lib/blockchain-service.ts`**: This is the heart of the blockchain simulation.
    *   **`Blockchain` Class**: Manages the state of a single blockchain instance, including its chain, mempool, wallets, and configuration (difficulty, block reward).
    *   **Network Management**: The service is designed to handle multiple independent blockchain networks (e.g., `main`, `test`, `dev`). A global `Map` (`global.blockchainInstances`) stores an instance of the `Blockchain` class for each active network ID.
    *   **Core Operations**:
        *   `createGenesisBlock()`: Initializes a blockchain.
        *   `addTransaction()`: Validates and adds a transaction to the mempool. Includes simplified signature verification.
        *   `minePendingTransactions()`: Creates a new block with pending transactions, including a coinbase transaction for the miner (reward + transaction fees).
        *   `createWallet()`: Generates new wallet key pairs and initializes balances.
        *   `getBalanceOfAddress()`, `getAllWalletsWithBalances()`, `getChain()`, `getMempool()`, `getConfig()`: Accessor methods for blockchain data.
    *   **Automatic Block Mining**: Each blockchain instance has its own `setInterval` timer to attempt mining blocks at configured intervals if there are pending transactions.
    *   **Donation Address**: The first wallet created on each network is designated as the donation address.
*   **`src/lib/blockchain-crypto.ts`**: Contains simplified cryptographic helper functions for the simulation.
    *   `generateSimpleKeyPair()`: Simulates public/private key generation.
    *   `calculateHash()`: Uses SHA256 for hashing.
    *   `verifySignature()`: A simplified check for "manual" signatures (primarily checks if the `fromAddress` matches the sender's public key and signature is non-empty). **This is not cryptographically secure and is for simulation purposes only.**
*   **`src/lib/blockchain-types.ts`**: Defines TypeScript interfaces for core data structures like `BlockData`, `TransactionData`, `WalletData`, and `BlockchainConfig`.
*   **`src/app/actions.ts`**: Contains all Next.js Server Actions.
    *   `submitTransactionAction()`: Handles new transaction submissions.
    *   `mineBlockAction()`: Triggers manual block mining.
    *   `createWalletAction()`: Handles new wallet creation.
    *   `estimateFeeAction()`: Calls the Genkit AI flow to estimate transaction fees.
    *   All actions take `networkId` as a parameter to operate on the correct blockchain instance.
    *   They use `revalidatePath('/')` to trigger data refetching on the client after mutations.
*   **`src/ai/`**: Contains AI-related code using Genkit.
    *   **`genkit.ts`**: Initializes Genkit with the Google AI plugin and configures the default model.
    *   **`flows/estimate-transaction-fee.ts`**:
        *   Defines a Genkit flow (`estimateTransactionFeeFlow`) that uses an AI prompt (`estimateTransactionFeePrompt`) to suggest a transaction fee based on transaction details and mempool data.
        *   Includes Zod schemas (`EstimateTransactionFeeInputSchema`, `EstimateTransactionFeeOutputSchema`) for typed input and output.
        *   Exports an async wrapper function `estimateTransactionFee()` which is called by the server action.
    *   **`dev.ts`**: Entry point for running Genkit in development mode (`npm run genkit:dev`).

## Data Persistence & State

*   **In-Memory Storage**: The blockchain state (chains, mempools, wallets) is currently stored **in memory** within the Node.js server process. This means the state will be reset if the server restarts.
    *   `global.blockchainInstances` and `global.blockchainTimers` are used to maintain a single set of blockchain instances across requests/rebuilds during development.
*   **No Database**: The project does not currently use a database for persistent storage of blockchain data.

## Running Server-Side Components

*   The Next.js development server (`npm run dev`) handles Server Components and Server Actions.
*   The Genkit development server (`npm run genkit:dev`) must be run separately in another terminal if AI features are being used or developed. This server hosts the AI flows.
