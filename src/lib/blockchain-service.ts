
import { BlockData, TransactionData, WalletData, BlockchainConfig } from './blockchain-types';
import { calculateHash, generateSimpleKeyPair, verifySignature } from './blockchain-crypto';
import { EstimateTransactionFeeInput, estimateTransactionFee } from '@/ai/flows/estimate-transaction-fee';
import { DEFAULT_NETWORK_ID as APP_DEFAULT_NETWORK_ID } from '@/components/layout/Header';

// Define global types for process.env augmentation if not already present
declare global {
  // eslint-disable-next-line no-var
  var blockchainInstances: Map<string, Blockchain>;
  // eslint-disable-next-line no-var
  var blockchainTimers: Map<string, NodeJS.Timeout>;
}


const DEFAULT_BLOCKCHAIN_CONFIG: BlockchainConfig = {
  blockReward: 50,
  difficulty: 2, // Number of leading zeros
  coinbaseName: 'uemfCoin',
  blockIntervalMs: 10 * 60 * 1000, // 10 minutes
};

const NETWORK_CONFIGS: Record<string, Partial<BlockchainConfig>> = {
  main: { difficulty: 2, blockReward: 50 },
  test: { difficulty: 1, blockReward: 100, blockIntervalMs: 1 * 60 * 1000 }, // Testnet mines faster
  dev: { difficulty: 1, blockReward: 200, blockIntervalMs: 30 * 1000 }, // Devnet mines very fast
};

class Blockchain {
  public chain: BlockData[];
  public pendingTransactions: TransactionData[];
  public wallets: Map<string, WalletData>; // publicKey -> WalletData
  private config: BlockchainConfig;
  private networkId: string;

  constructor(networkId: string, specificConfig: Partial<BlockchainConfig> = {}) {
    this.networkId = networkId;
    this.config = { ...DEFAULT_BLOCKCHAIN_CONFIG, ...specificConfig };
    this.chain = [this.createGenesisBlock()];
    this.pendingTransactions = [];
    this.wallets = new Map();
    this.initializeDefaultWallets();

    if (!global.blockchainTimers) {
      global.blockchainTimers = new Map();
    }

    if (!global.blockchainTimers.has(this.networkId)) {
      const timerId = setInterval(() => this.mineScheduledBlock(), this.config.blockIntervalMs);
      global.blockchainTimers.set(this.networkId, timerId);
      console.log(`Blockchain instance [${this.networkId}] initialized. Interval: ${this.config.blockIntervalMs / 60000}m, Difficulty: ${this.config.difficulty}`);
    }
  }

  private initializeDefaultWallets() {
    for (let i = 0; i < 2; i++) {
      const { publicKey, privateKey } = generateSimpleKeyPair();
       // Give first wallet some initial coins based on network
      const initialBalance = this.networkId === 'test' ? 2000 : (this.networkId === 'dev' ? 5000 : 1000);
      this.wallets.set(publicKey, { publicKey, privateKey, balance: i === 0 ? initialBalance : initialBalance / 2 });
    }
  }

  private createGenesisBlock(): BlockData {
    return {
      height: 0,
      timestamp: Date.now(),
      transactions: [],
      previousHash: '0',
      hash: calculateHash(`GenesisBlock-${this.networkId}`), // Make genesis hash network-specific
      nonce: 0,
    };
  }

  getLatestBlock(): BlockData {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(minerAddress: string): BlockData | null {
    if (!this.wallets.has(minerAddress)) {
      console.warn(`[${this.networkId}] Miner address ${minerAddress} does not exist. Creating it.`);
      this.createWallet(minerAddress);
    }

    const rewardTx: TransactionData = {
      id: `coinbase-${this.networkId}-${Date.now()}`,
      fromAddress: null,
      toAddress: minerAddress,
      amount: this.config.blockReward,
      fee: 0,
      timestamp: Date.now(),
      signature: 'coinbase',
    };

    const transactionsToMine = [rewardTx, ...this.pendingTransactions];
    
    const newBlock = this.mineBlockLogic(transactionsToMine, minerAddress);
    this.chain.push(newBlock);

    newBlock.transactions.forEach(tx => {
      if (tx.fromAddress) {
        const senderWallet = this.wallets.get(tx.fromAddress);
        if (senderWallet) senderWallet.balance -= (tx.amount + tx.fee);
      }
      const recipientWallet = this.wallets.get(tx.toAddress);
      if (recipientWallet) recipientWallet.balance += tx.amount;
    });
    
    this.pendingTransactions = [];
    console.log(`[${this.networkId}] Block mined by ${minerAddress}. Reward: ${this.config.blockReward} ${this.config.coinbaseName}. Tx: ${newBlock.transactions.length-1}`);
    return newBlock;
  }
  
  private mineScheduledBlock() {
    console.log(`[${this.networkId}] Attempting scheduled block mining...`);
    if (this.pendingTransactions.length > 0) {
        const minerAddresses = Array.from(this.wallets.keys());
        const defaultMinerAddress = minerAddresses.length > 0 ? minerAddresses[0] : `default-miner-${this.networkId}`;
        if (!this.wallets.has(defaultMinerAddress)) {
            this.createWallet(defaultMinerAddress);
        }
        this.minePendingTransactions(defaultMinerAddress);
    } else {
        console.log(`[${this.networkId}] No pending transactions to mine.`);
    }
  }

  private mineBlockLogic(transactions: TransactionData[], minerAddress: string): BlockData {
    const newBlockHeight = this.getLatestBlock().height + 1;
    const previousHash = this.getLatestBlock().hash;
    let nonce = 0;
    let timestamp = Date.now();
    let hash = calculateHash(`${newBlockHeight}${timestamp}${JSON.stringify(transactions)}${previousHash}${nonce}${this.networkId}`);

    while (hash.substring(0, this.config.difficulty) !== Array(this.config.difficulty + 1).join('0')) {
      nonce++;
      timestamp = Date.now();
      hash = calculateHash(`${newBlockHeight}${timestamp}${JSON.stringify(transactions)}${previousHash}${nonce}${this.networkId}`);
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
    if (!transaction.fromAddress || !transaction.toAddress || transaction.amount <= 0) {
      return { success: false, message: 'Transaction must include from, to, and a positive amount.' };
    }

    const senderWallet = this.wallets.get(transaction.fromAddress);
    if (!senderWallet) {
      return { success: false, message: 'Sender wallet not found.' };
    }

    if (senderWallet.balance < (transaction.amount + transaction.fee)) {
      return { success: false, message: `Insufficient balance on network ${this.networkId}. Needed: ${transaction.amount + transaction.fee}, Has: ${senderWallet.balance}` };
    }
    
    const transactionDataToSign = { fromAddress: transaction.fromAddress, toAddress: transaction.toAddress, amount: transaction.amount, fee: transaction.fee };
    if (!verifySignature(transactionDataToSign, transaction.signature, senderWallet.publicKey, transaction.fromAddress)) {
        return { success: false, message: 'Invalid signature or mismatched sender address.' };
    }
    
    const newTransaction: TransactionData = {
      ...transaction,
      id: calculateHash(JSON.stringify(transaction) + Date.now() + this.networkId),
      timestamp: Date.now(),
    };

    this.pendingTransactions.push(newTransaction);
    return { success: true, message: `Transaction added to mempool on network ${this.networkId}.` };
  }

  getBalanceOfAddress(address: string): number {
    const wallet = this.wallets.get(address);
    return wallet ? wallet.balance : 0;
  }
  
  getAllWalletsWithBalances(): WalletData[] {
    return Array.from(this.wallets.values()).map(wallet => ({
        publicKey: wallet.publicKey,
        privateKey: '***hidden***',
        balance: wallet.balance
    }));
  }

  createWallet(publicKey?: string): WalletData {
    const keys = publicKey ? { publicKey, privateKey: `simulated_priv_for_${publicKey}_${this.networkId}` } : generateSimpleKeyPair();
    if (this.wallets.has(keys.publicKey)) {
      return this.wallets.get(keys.publicKey)!;
    }
    const newWallet: WalletData = { ...keys, balance: 0 };
    this.wallets.set(keys.publicKey, newWallet);
    console.log(`[${this.networkId}] Wallet created: ${keys.publicKey}`);
    return { ...newWallet, privateKey: keys.privateKey };
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

function getBlockchainInstance(networkId: string): Blockchain {
  if (!global.blockchainInstances) {
    global.blockchainInstances = new Map<string, Blockchain>();
  }
  if (!global.blockchainInstances.has(networkId)) {
    console.log(`Creating new blockchain instance for network: ${networkId}`);
    const networkSpecificConfig = NETWORK_CONFIGS[networkId] || {};
    const newInstance = new Blockchain(networkId, networkSpecificConfig);
    global.blockchainInstances.set(networkId, newInstance);
  }
  return global.blockchainInstances.get(networkId)!;
}

export const BlockchainService = {
  addTransaction: (networkId: string, transaction: Omit<TransactionData, 'id' | 'timestamp'>) => getBlockchainInstance(networkId).addTransaction(transaction),
  minePendingTransactions: (networkId: string, minerAddress: string) => getBlockchainInstance(networkId).minePendingTransactions(minerAddress),
  getBalanceOfAddress: (networkId: string, address: string) => getBlockchainInstance(networkId).getBalanceOfAddress(address),
  getAllWalletsWithBalances: (networkId: string) => getBlockchainInstance(networkId).getAllWalletsWithBalances(),
  createWallet: (networkId: string, publicKey?: string) => getBlockchainInstance(networkId).createWallet(publicKey),
  getChain: (networkId: string) => getBlockchainInstance(networkId).getChain(),
  getMempool: (networkId: string) => getBlockchainInstance(networkId).getMempool(),
  getConfig: (networkId: string) => getBlockchainInstance(networkId).getConfig(),
  estimateFee: async (networkId: string, input: EstimateTransactionFeeInput) => {
    // The Genkit flow itself is network-agnostic, but the input data (mempoolSummary) comes from a specific network.
    // So, no direct change to estimateTransactionFee call, but context is network-specific.
    return estimateTransactionFee(input);
  }
};

export type { BlockData, TransactionData, WalletData, BlockchainConfig, EstimateTransactionFeeInput };
