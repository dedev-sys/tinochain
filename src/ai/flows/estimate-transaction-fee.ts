'use server';

/**
 * @fileOverview AI agent that suggests transaction fees based on mempool conditions.
 *
 * - estimateTransactionFee - A function that suggests transaction fees.
 * - EstimateTransactionFeeInput - The input type for the estimateTransactionFee function.
 * - EstimateTransactionFeeOutput - The return type for the estimateTransactionFee function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EstimateTransactionFeeInputSchema = z.object({
  transactionDetails: z
    .string()
    .describe('Details of the transaction, including sender, recipient, amount, and any other relevant information.'),
  mempoolData: z
    .string()
    .describe('Current state of the mempool, including transaction volume, gas prices, and waiting times.'),
});
export type EstimateTransactionFeeInput = z.infer<typeof EstimateTransactionFeeInputSchema>;

const EstimateTransactionFeeOutputSchema = z.object({
  suggestedFee: z
    .number()
    .describe('The suggested transaction fee, in uemfCoin, to ensure timely processing.'),
  reasoning: z
    .string()
    .describe('Explanation of why this fee is suggested, based on the current mempool conditions.'),
});
export type EstimateTransactionFeeOutput = z.infer<typeof EstimateTransactionFeeOutputSchema>;

export async function estimateTransactionFee(input: EstimateTransactionFeeInput): Promise<EstimateTransactionFeeOutput> {
  return estimateTransactionFeeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'estimateTransactionFeePrompt',
  input: {schema: EstimateTransactionFeeInputSchema},
  output: {schema: EstimateTransactionFeeOutputSchema},
  prompt: `You are an expert in blockchain transaction fee estimation.

  Based on the provided transaction details and current mempool data, you will suggest an optimal transaction fee to ensure timely processing without overpaying.

  Transaction Details: {{{transactionDetails}}}
  Mempool Data: {{{mempoolData}}}

  Consider the transaction size, mempool congestion, and desired confirmation time when determining the fee. Provide a brief explanation of your reasoning.
  `,
});

const estimateTransactionFeeFlow = ai.defineFlow(
  {
    name: 'estimateTransactionFeeFlow',
    inputSchema: EstimateTransactionFeeInputSchema,
    outputSchema: EstimateTransactionFeeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
