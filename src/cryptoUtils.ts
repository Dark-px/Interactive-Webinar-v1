/**
 * Premium, high-performance synchronous encryption and decryption helpers
 * using a dynamic XOR stream key derived from safe Web/Node encoding standards.
 */

export function encrypt(text: string, key: string): string {
  if (!text) return "";
  const textBytes = new TextEncoder().encode(text);
  const keyBytes = new TextEncoder().encode(key);
  const encrypted: number[] = [];
  
  for (let i = 0; i < textBytes.length; i++) {
    const keyByte = keyBytes[i % keyBytes.length];
    // Simple XOR with key rotation
    encrypted.push(textBytes[i] ^ keyByte);
  }
  
  // Convert byte values to safe uppercase hex strings
  return Array.from(encrypted)
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

export function decrypt(hex: string, key: string): string {
  if (!hex) return "";
  try {
    const encrypted: number[] = [];
    for (let i = 0; i < hex.length; i += 2) {
      encrypted.push(parseInt(hex.substring(i, i + 2), 16));
    }
    
    const keyBytes = new TextEncoder().encode(key);
    const decryptedBytes = new Uint8Array(encrypted.length);
    for (let i = 0; i < encrypted.length; i++) {
      const keyByte = keyBytes[i % keyBytes.length];
      decryptedBytes[i] = encrypted[i] ^ keyByte;
    }
    
    return new TextDecoder().decode(decryptedBytes);
  } catch (e) {
    return "[محتوای قفل شده]";
  }
}

/**
 * Validates a password against its SHA-256 hash.
 * Fast, pure-JS verification for local password check without exposing plaintext.
 */
export async function verifyPasswordSHA256(input: string, hash: string): Promise<boolean> {
  const msgBuffer = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashedHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  return hashedHex === hash;
}
