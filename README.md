# BlockSim - Local Blockchain Simulator

BlockSim is a Next.js application designed to simulate a local Proof-of-Work blockchain. It allows users to create wallets, send transactions, mine blocks, and observe the blockchain's state. The project also incorporates AI for features like transaction fee estimation and demonstrates a themable UI with network switching capabilities.

This project was built with Firebase Studio.

## Project Structure & Details

For a detailed understanding of the different parts of the application, please refer to:

*   **[Client-Side README](./README-Client.md)**: For information on the frontend, UI components, and Next.js/React structure.
*   **[Server-Side README](./README-Server.md)**: For information on the backend logic, server actions, blockchain simulation, and AI integration with Genkit.

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Run the development server for Next.js (frontend & server actions)**:
    ```bash
    npm run dev
    ```
    This will typically start the application on `http://localhost:9002`.

3.  **Run the Genkit development server (for AI flows, in a separate terminal)**:
    ```bash
    npm run genkit:dev
    ```
    This is necessary if you are using or developing AI-powered features.

## Key Technologies

*   **Next.js**: React framework for server-side rendering and static site generation.
*   **React**: JavaScript library for building user interfaces.
*   **TypeScript**: Superset of JavaScript for type safety.
*   **ShadCN UI**: Re-usable UI components.
*   **Tailwind CSS**: Utility-first CSS framework.
*   **Genkit (Firebase)**: For integrating AI models and building AI flows.
*   **Lucide React**: Icon library.
# tinochain
