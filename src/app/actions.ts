
'use server';
import { revalidatePath } from 'next/cache';
import { BlockchainService, TransactionData, EstimateTransactionFeeInput } from '@/lib/blockchain-service';

// Helper to create query string for revalidation, though revalidatePath('/') might be enough
// const makePathWithNetwork = (path: string, networkId: string) => `${path}?network=${networkId}`;

export async function submitTransactionAction(networkId: string, formData: FormData) {
  try {
    const fromAddress = formData.get('fromAddress') as string;
    const toAddress = formData.get('toAddress') as string;
    const amount = parseFloat(formData.get('amount') as string);
    const fee = parseFloat(formData.get('fee') as string);
    const signature = formData.get('signature') as string;
    const smartContractDetails = formData.get('smartContractDetails') as string | undefined;

    if (isNaN(amount) || isNaN(fee)) {
      return { success: false, message: 'Invalid amount or fee.' };
    }
    
    const transaction: Omit<TransactionData, 'id' | 'timestamp'> = {
      fromAddress,
      toAddress,
      amount,
      fee,
      signature,
      smartContractDetails: smartContractDetails && smartContractDetails.trim() !== '' ? smartContractDetails : undefined,
    };

    const result = BlockchainService.addTransaction(networkId, transaction);
    if (result.success) {
      revalidatePath('/'); // Revalidates the current page, page.tsx will use current searchParams
      // If smart contract details were present, include the new transaction ID in the success response
      if (transaction.smartContractDetails && result.transactionId) {
        return { ...result, newTxIdWithContract: result.transactionId };
      }
    }
    return result;
  } catch (error) {
    console.error('Error submitting transaction:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}

export async function mineBlockAction(networkId: string, formData: FormData) {
  try {
    const minerAddress = formData.get('minerAddress') as string;
    if (!minerAddress) {
      return { success: false, message: "Miner address is required." };
    }
    const minedBlock = BlockchainService.minePendingTransactions(networkId, minerAddress);
    if (minedBlock) {
      revalidatePath('/');
      return { success: true, message: `Block #${minedBlock.height} mined successfully on network ${networkId} by ${minerAddress}.` };
    }
    return { success: false, message: 'No transactions to mine or mining failed.' };
  } catch (error) {
    console.error('Error mining block:', error);
    return { success: false, message: 'An unexpected error occurred during mining.' };
  }
}

export async function createWalletAction(networkId: string) {
  try {
    // For createWallet, publicKey might be optional if we're always generating new ones via UI.
    // BlockchainService.createWallet(networkId, publicKeyIfAny)
    const newWallet = BlockchainService.createWallet(networkId); 
    revalidatePath('/');
    return { success: true, wallet: newWallet, message: `Wallet created successfully on network ${networkId}.` };
  } catch (error) {
    console.error('Error creating wallet:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}

export async function estimateFeeAction(networkId: string, transactionDetails: string, mempoolSummary: string) {
  try {
    const input: EstimateTransactionFeeInput = {
      transactionDetails,
      mempoolData: mempoolSummary, // This summary should be for the given networkId
    };
    // BlockchainService.estimateFee now also takes networkId, though the Genkit flow itself might not use it directly.
    const result = await BlockchainService.estimateFee(networkId, input);
    return { success: true, ...result };
  } catch (error)
{
    console.error('Error estimating fee:', error);
    return { success: false, message: 'Failed to estimate fee using AI.' };
  }
}
