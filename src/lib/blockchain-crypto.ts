// IMPORTANT: This is a simplified simulation for educational purposes.
// DO NOT use these functions for actual cryptographic security.
import { SHA256 } from 'crypto-js'; // Using a common hashing library for simplicity

// Simulate key pair generation
export function generateSimpleKeyPair(): { publicKey: string; privateKey: string } {
  const privateKey = `priv_${Date.now().toString(36)}_${Math.random().toString(36).substring(2)}`;
  const publicKey = `pub_${SHA256(privateKey).toString().substring(0, 20)}`;
  return { publicKey, privateKey };
}

// Simulate calculating a hash for a transaction or block
export function calculateHash(data: any): string {
  if (typeof data !== 'string') {
    try {
      data = JSON.stringify(data);
    } catch (e) {
      console.error("Failed to stringify data for hashing:", data, e);
      return 'error_hashing_data';
    }
  }
  return SHA256(data).toString();
}

// Simulate signing data (user will provide signature manually in this app)
// This function is more for conceptual understanding if we were to automate it
export function signData(data: any, privateKey: string): string {
  const hash = calculateHash(data);
  // Simplified signature: hash + part of private key
  return `sig_${calculateHash(hash + privateKey).substring(0, 16)}`;
}

// Simulate verifying a signature (user-provided signature)
export function verifySignature(data: any, signature: string, publicKey: string, originalFromAddress: string | null): boolean {
  // In this simplified model, if a signature is provided and matches the fromAddress, we consider it "valid"
  // as per the project description of "manual digital signature verification".
  // A real verification would involve cryptographic checks using the public key.
  // For now, we check if the provided signature is non-empty and if the publicKey matches the transaction's fromAddress
  if (!signature || signature.trim() === '') {
    return false;
  }
  if (originalFromAddress === null) return true; // Coinbase transactions don't need signature from a user wallet
  
  // This is a placeholder for actual signature verification.
  // Since signature is manual, we'll just check if it's not empty.
  // A more involved manual check might involve the user re-typing something based on their private key.
  // For the prompt, we assume the server gets a string and "verifies" it.
  // Let's assume any non-empty string is a "valid manual signature" for this demo.
  // And critically, that the fromAddress matches the publicKey of the sender's wallet.
  return publicKey === originalFromAddress;
}
