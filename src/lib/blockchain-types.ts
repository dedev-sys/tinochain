export interface WalletData {
  publicKey: string;
  privateKey: string; // Keep this conceptual, don't store private keys insecurely
  balance: number;
}

export interface TransactionData {
  id: string;
  fromAddress: string | null; // Null for coinbase/reward transactions
  toAddress: string;
  amount: number;
  fee: number;
  timestamp: number;
  signature: string; // User-provided manual signature
  smartContractDetails?: string; // Optional: Details of the smart contract
  payload?: any; // Optional: for more complex transactions if needed for fee estimation
}

export interface BlockData {
  height: number;
  timestamp: number;
  transactions: TransactionData[];
  previousHash: string;
  hash: string;
  nonce: number;
  miner?: string; // Address of the miner
}

export interface BlockchainConfig {
  blockReward: number;
  difficulty: number;
  coinbaseName: string;
  blockIntervalMs: number;
}
