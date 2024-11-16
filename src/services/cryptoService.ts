import CryptoJS from 'crypto-js';

export class CryptoService {
  private static readonly ITERATION_COUNT = 1000000;
  private static readonly KEY_SIZE = 256 / 32;

  // Derive a key from password using PBKDF2
  static deriveKey(password: string, salt: string): string {
    return CryptoJS.PBKDF2(password, salt, {
      keySize: this.KEY_SIZE,
      iterations: this.ITERATION_COUNT
    }).toString();
  }

  // Encrypt data using AES-256
  static encrypt(data: string, key: string): string {
    return CryptoJS.AES.encrypt(data, key).toString();
  }

  // Decrypt data using AES-256
  static decrypt(encryptedData: string, key: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  // Generate random salt
  static generateSalt(): string {
    return CryptoJS.lib.WordArray.random(128 / 8).toString();
  }
}