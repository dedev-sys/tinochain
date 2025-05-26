# BlockSim - Client-Side Overview

This document details the client-side architecture and important aspects of the BlockSim application. The client is built using Next.js (App Router), React, TypeScript, ShadCN UI components, and Tailwind CSS.

## Core Technologies

*   **Next.js (App Router)**: Provides routing, server components, and client components.
    *   Server Components are used by default for efficient data fetching and rendering (e.g., `src/app/page.tsx`).
    *   Client Components (`'use client'`) are used for interactive UI elements (e.g., forms, buttons, components with `useEffect` or `useState`).
*   **React**: Used for building the user interface with a component-based architecture.
*   **TypeScript**: Ensures type safety throughout the client-side codebase.
*   **ShadCN UI**: Provides a set of beautifully designed and accessible UI components, which are heavily used across the application (e.g., `Card`, `Button`, `Input`, `Dialog`, `Select`). These are located in `src/components/ui/`.
*   **Tailwind CSS**: Powers the styling, providing utility classes for rapid UI development. Custom themes and styles are defined in `src/app/globals.css`.
*   **Lucide React**: For icons used throughout the interface.

## Key Directory Structure & Components

*   **`src/app/`**: Contains the main application pages and layouts.
    *   `layout.tsx`: The root layout for the application, including the main HTML structure, Toaster, and Footer.
    *   `page.tsx`: The main entry point and page of the application. It fetches initial data for the selected blockchain network and renders `BlockSimPageClient`.
    *   `globals.css`: Global styles and Tailwind CSS theme definitions, including HSL color variables for theming (default and "rouge-noir").
*   **`src/components/`**: Contains all reusable React components.
    *   **`ui/`**: ShadCN UI components (e.g., `Button.tsx`, `Card.tsx`, `Dialog.tsx`, `Input.tsx`, `Select.tsx`, `Table.tsx`). These are generally styled building blocks.
    *   **`layout/`**: Components related to the overall page structure.
        *   `Header.tsx`: Displays the application title ("TinoChain") and theme-switching functionality.
        *   `Footer.tsx`: Displays social media links.
    *   **`blockchain/`**: Components for displaying blockchain data.
        *   `BlockchainView.tsx`: Renders the list of blocks.
        *   `BlockCard.tsx`: Displays individual block information. Handles client-side date formatting to avoid hydration errors.
    *   **`mempool/`**: Components for displaying mempool (pending transactions) data.
        *   `MempoolView.tsx`: Renders the list of pending transactions.
        *   `TransactionCardShort.tsx`: Displays a summary of an individual transaction, including a dialog for smart contract details.
    *   **`transactions/`**: Components related to creating and managing transactions.
        *   `CreateTransactionForm.tsx`: Form for users to submit new transactions, including smart contract details.
        *   `FeeEstimator.tsx`: Component that uses an AI flow to suggest transaction fees.
    *   **`wallet/`**: Components for wallet management.
        *   `WalletBalances.tsx`: Displays a list of wallets and their balances for the current network, and allows wallet creation.
        *   `WalletCard.tsx`: Displays details for an individual wallet.
    *   **`market/`**:
        *   `CryptoMarketView.tsx`: Displays a (mock) view of cryptocurrency market data with interactive charts.
    *   **`donation/`**:
        *   `DonationCard.tsx`: Displays a message about the project's mission and a button to initiate a donation transaction.
    *   `AdminControls.tsx`: Provides UI for admin actions like manual block mining.
    *   `BlockSimPageClient.tsx`: A key client component that orchestrates the main view of the application. It manages state related to the currently selected network, passes data to child components, and handles interactions like network switching and pre-filling the donation address.

## State Management & Data Flow

*   **URL Query Parameters**: The active blockchain network (`main`, `test`, `dev`) is primarily controlled by the `?network=<networkId>` query parameter in the URL.
    *   The network selector in `BlockSimPageClient.tsx` updates this parameter.
    *   `src/app/page.tsx` (Server Component) reads this parameter to fetch the correct initial data from `BlockchainService`.
*   **Server Actions**: Form submissions (creating transactions, mining blocks, creating wallets) are handled by Next.js Server Actions defined in `src/app/actions.ts`. These actions interact with `BlockchainService`.
*   **React Context & Hooks**: Standard React hooks like `useState`, `useEffect`, and `useTransition` are used for local component state and managing asynchronous operations (e.g., submitting forms).
    *   `useToast` (from `src/hooks/use-toast.ts`) provides a global notification system.
*   **Props Drilling**: Data like `networkId`, `wallets`, `chain`, `mempool` is passed down from `page.tsx` -> `BlockSimPageClient.tsx` -> relevant child components.

## Important Client-Side Considerations

*   **Hydration Errors**: Care is taken to avoid hydration errors, particularly with date/number formatting that can differ between server and client. This is typically handled by deferring such formatting to a `useEffect` hook on the client (e.g., in `BlockCard.tsx` and `CryptoMarketView.tsx`).
*   **Component Reusability**: ShadCN UI components and custom-built components are designed to be reusable.
*   **User Experience**: Features like toast notifications, loading states for buttons, and automatic dialog opening for smart contracts enhance the user experience.
