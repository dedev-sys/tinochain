import { BlockData, TransactionData, WalletData, BlockchainConfig } from './blockchain-types';
import { calculateHash, generateSimpleKeyPair, verifySignature } from './blockchain-crypto';
import { EstimateTransactionFeeInput, estimateTransactionFee } from '@/ai/flows/estimate-transaction-fee';

const DEFAULT_CONFIG: BlockchainConfig = {
  blockReward: 50,
  difficulty: 2, // Number of leading zeros
  coinbaseName: 'uemfCoin',
  blockIntervalMs: 10 * 60 * 1000, // 10 minutes
};

class Blockchain {
  public chain: BlockData[];
  public pendingTransactions: TransactionData[];
  public wallets: Map<string, WalletData>; // publicKey -> WalletData
  private config: BlockchainConfig;

  constructor(config: Partial<BlockchainConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.chain = [this.createGenesisBlock()];
    this.pendingTransactions = [];
    this.wallets = new Map();
    this.initializeDefaultWallets();

    // Start block mining interval
    // This check is to prevent multiple intervals in dev hot-reloading
    if (!global.blockchainTimerInitialized) {
        setInterval(() => this.mineScheduledBlock(), this.config.blockIntervalMs);
        global.blockchainTimerInitialized = true;
        console.log(`Blockchain initialized. Block interval: ${this.config.blockIntervalMs / 60000} minutes. Difficulty: ${this.config.difficulty}`);
    }
  }

  private initializeDefaultWallets() {
    // Create a couple of default wallets for demo purposes
    for (let i = 0; i < 2; i++) {
      const { publicKey, privateKey } = generateSimpleKeyPair();
      this.wallets.set(publicKey, { publicKey, privateKey, balance: i === 0 ? 1000 : 500 }); // Give first wallet some initial coins
    }
  }

  private createGenesisBlock(): BlockData {
    return {
      height: 0,
      timestamp: Date.now(),
      transactions: [],
      previousHash: '0',
      hash: calculateHash('GenesisBlock'),
      nonce: 0,
    };
  }

  getLatestBlock(): BlockData {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(minerAddress: string): BlockData | null {
    if (!this.wallets.has(minerAddress)) {
      console.warn(`Miner address ${minerAddress} does not exist. Creating it.`);
      this.createWallet(minerAddress); // Auto-create miner wallet if it doesn't exist
    }

    const rewardTx: TransactionData = {
      id: `coinbase-${Date.now()}`,
      fromAddress: null, // Coinbase transaction
      toAddress: minerAddress,
      amount: this.config.blockReward,
      fee: 0,
      timestamp: Date.now(),
      signature: 'coinbase',
    };

    const transactionsToMine = [rewardTx, ...this.pendingTransactions];
    
    const newBlock = this.mineBlock(transactionsToMine, minerAddress);
    this.chain.push(newBlock);

    // Update balances for transactions in the new block
    newBlock.transactions.forEach(tx => {
      if (tx.fromAddress) {
        const senderWallet = this.wallets.get(tx.fromAddress);
        if (senderWallet) senderWallet.balance -= (tx.amount + tx.fee);
      }
      const recipientWallet = this.wallets.get(tx.toAddress);
      if (recipientWallet) recipientWallet.balance += tx.amount;
    });
    
    // Clear pending transactions
    this.pendingTransactions = [];
    console.log(`Block mined by ${minerAddress}. Reward: ${this.config.blockReward} ${this.config.coinbaseName}. Transactions: ${newBlock.transactions.length-1}`);
    return newBlock;
  }
  
  private mineScheduledBlock() {
    console.log('Attempting scheduled block mining...');
    if (this.pendingTransactions.length > 0) {
        // In a real system, a miner would be chosen or compete. Here, we'll use a default.
        const defaultMinerAddress = this.wallets.keys().next().value || 'default-miner-wallet';
        if (!this.wallets.has(defaultMinerAddress)) {
            this.createWallet(defaultMinerAddress);
        }
        this.minePendingTransactions(defaultMinerAddress);
    } else {
        console.log('No pending transactions to mine.');
    }
  }

  private mineBlock(transactions: TransactionData[], minerAddress: string): BlockData {
    const newBlockHeight = this.getLatestBlock().height + 1;
    const previousHash = this.getLatestBlock().hash;
    let nonce = 0;
    let timestamp = Date.now();
    let hash = calculateHash(`${newBlockHeight}${timestamp}${JSON.stringify(transactions)}${previousHash}${nonce}`);

    while (hash.substring(0, this.config.difficulty) !== Array(this.config.difficulty + 1).join('0')) {
      nonce++;
      timestamp = Date.now(); // Recalculate timestamp to be more realistic
      hash = calculateHash(`${newBlockHeight}${timestamp}${JSON.stringify(transactions)}${previousHash}${nonce}`);
    }
    
    return {
      height: newBlockHeight,
      timestamp,
      transactions,
      previousHash,
      hash,
      nonce,
      miner: minerAddress,
    };
  }

  addTransaction(transaction: Omit<TransactionData, 'id' | 'timestamp'>): { success: boolean, message: string } {
    // Basic validation
    if (!transaction.fromAddress || !transaction.toAddress || transaction.amount <= 0) {
      return { success: false, message: 'Transaction must include from, to, and a positive amount.' };
    }

    const senderWallet = this.wallets.get(transaction.fromAddress);
    if (!senderWallet) {
      return { success: false, message: 'Sender wallet not found.' };
    }

    if (senderWallet.balance < (transaction.amount + transaction.fee)) {
      return { success: false, message: 'Insufficient balance.' };
    }
    
    // Simplified signature verification
    // The 'signature' field is manually entered by the user.
    // The 'verifySignature' function here is a placeholder for how it might be checked.
    // For this project, "manual digital signature verification" means the server receives a string and "verifies" it.
    // Our simplified verifySignature checks if signature is present and fromAddress matches sender's public key.
    const transactionDataToSign = { fromAddress: transaction.fromAddress, toAddress: transaction.toAddress, amount: transaction.amount, fee: transaction.fee };
    if (!verifySignature(transactionDataToSign, transaction.signature, senderWallet.publicKey, transaction.fromAddress)) {
        return { success: false, message: 'Invalid signature or mismatched sender address.' };
    }
    
    const newTransaction: TransactionData = {
      ...transaction,
      id: calculateHash(JSON.stringify(transaction) + Date.now()), // Simple unique ID
      timestamp: Date.now(),
    };

    this.pendingTransactions.push(newTransaction);
    return { success: true, message: 'Transaction added to mempool.' };
  }

  getBalanceOfAddress(address: string): number {
    const wallet = this.wallets.get(address);
    return wallet ? wallet.balance : 0;
  }
  
  getAllWalletsWithBalances(): WalletData[] {
    return Array.from(this.wallets.values()).map(wallet => ({
        publicKey: wallet.publicKey,
        privateKey: '***hidden***', // Never expose private keys
        balance: wallet.balance
    }));
  }

  createWallet(publicKey?: string): WalletData {
    const keys = publicKey ? { publicKey, privateKey: `simulated_priv_for_${publicKey}` } : generateSimpleKeyPair();
    if (this.wallets.has(keys.publicKey)) {
      // If trying to create an existing wallet (e.g. for miner), just return it
      return this.wallets.get(keys.publicKey)!;
    }
    const newWallet: WalletData = { ...keys, balance: 0 };
    this.wallets.set(keys.publicKey, newWallet);
    return { ...newWallet, privateKey: keys.privateKey }; // Return with private key for user to note
  }

  getChain(): BlockData[] {
    return [...this.chain];
  }

  getMempool(): TransactionData[] {
    return [...this.pendingTransactions];
  }

  getConfig(): BlockchainConfig {
    return {...this.config};
  }
}

// Singleton instance of the Blockchain
// Ensure it's only created once, especially in development with hot-reloading
declare global {
  var blockchainInstance: Blockchain;
  var blockchainTimerInitialized: boolean;
}

let blockchainInstance: Blockchain;

if (process.env.NODE_ENV === 'production') {
  blockchainInstance = new Blockchain();
} else {
  if (!global.blockchainInstance) {
    global.blockchainInstance = new Blockchain();
  }
  blockchainInstance = global.blockchainInstance;
}

export const BlockchainService = {
  addTransaction: (transaction: Omit<TransactionData, 'id' | 'timestamp'>) => blockchainInstance.addTransaction(transaction),
  minePendingTransactions: (minerAddress: string) => blockchainInstance.minePendingTransactions(minerAddress),
  getBalanceOfAddress: (address: string) => blockchainInstance.getBalanceOfAddress(address),
  getAllWalletsWithBalances: () => blockchainInstance.getAllWalletsWithBalances(),
  createWallet: (publicKey?: string) => blockchainInstance.createWallet(publicKey),
  getChain: () => blockchainInstance.getChain(),
  getMempool: () => blockchainInstance.getMempool(),
  getConfig: () => blockchainInstance.getConfig(),
  estimateFee: async (input: EstimateTransactionFeeInput) => estimateTransactionFee(input)
};

// Export types for use in server actions and components
export type { BlockData, TransactionData, WalletData, BlockchainConfig, EstimateTransactionFeeInput };
