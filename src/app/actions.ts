'use server';
import { revalidatePath } from 'next/cache';
import { BlockchainService, TransactionData, EstimateTransactionFeeInput } from '@/lib/blockchain-service';

export async function submitTransactionAction(formData: FormData) {
  try {
    const fromAddress = formData.get('fromAddress') as string;
    const toAddress = formData.get('toAddress') as string;
    const amount = parseFloat(formData.get('amount') as string);
    const fee = parseFloat(formData.get('fee') as string);
    const signature = formData.get('signature') as string; // Manually entered signature

    if (isNaN(amount) || isNaN(fee)) {
      return { success: false, message: 'Invalid amount or fee.' };
    }
    
    const transaction: Omit<TransactionData, 'id' | 'timestamp'> = {
      fromAddress,
      toAddress,
      amount,
      fee,
      signature,
    };

    const result = BlockchainService.addTransaction(transaction);
    if (result.success) {
      revalidatePath('/');
    }
    return result;
  } catch (error) {
    console.error('Error submitting transaction:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}

export async function mineBlockAction(formData: FormData) {
  try {
    const minerAddress = formData.get('minerAddress') as string;
    if (!minerAddress) {
      return { success: false, message: "Miner address is required." };
    }
    const minedBlock = BlockchainService.minePendingTransactions(minerAddress);
    if (minedBlock) {
      revalidatePath('/');
      return { success: true, message: `Block #${minedBlock.height} mined successfully by ${minerAddress}.` };
    }
    return { success: false, message: 'No transactions to mine or mining failed.' };
  } catch (error) {
    console.error('Error mining block:', error);
    return { success: false, message: 'An unexpected error occurred during mining.' };
  }
}

export async function createWalletAction() {
  try {
    const newWallet = BlockchainService.createWallet();
    revalidatePath('/');
    return { success: true, wallet: newWallet, message: 'Wallet created successfully.' };
  } catch (error) {
    console.error('Error creating wallet:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}

export async function estimateFeeAction(transactionDetails: string, mempoolSummary: string) {
  try {
    const input: EstimateTransactionFeeInput = {
      transactionDetails,
      mempoolData: mempoolSummary,
    };
    const result = await BlockchainService.estimateFee(input);
    return { success: true, ...result };
  } catch (error) {
    console.error('Error estimating fee:', error);
    return { success: false, message: 'Failed to estimate fee using AI.' };
  }
}
