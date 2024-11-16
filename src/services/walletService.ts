import { ethers } from 'ethers';
import { CryptoService } from './cryptoService';

export class WalletService {
  private static readonly WALLET_KEY = 'encrypted_wallet';
  private static readonly SALT_KEY = 'wallet_salt';

  // Generate new wallet
  static generateWallet(): ethers.Wallet {
    return ethers.Wallet.createRandom();
  }

  // Encrypt and store wallet
  static async storeWallet(wallet: ethers.Wallet, password: string): Promise<void> {
    const salt = CryptoService.generateSalt();
    const derivedKey = CryptoService.deriveKey(password, salt);
    const encryptedPrivateKey = CryptoService.encrypt(wallet.privateKey, derivedKey);

    // Store in IndexedDB
    const db = await this.openDatabase();
    const tx = db.transaction(['wallets'], 'readwrite');
    const store = tx.objectStore('wallets');
    
    await Promise.all([
      store.put(encryptedPrivateKey, this.WALLET_KEY),
      store.put(salt, this.SALT_KEY)
    ]);
  }

  // Load wallet from storage
  static async loadWallet(password: string): Promise<ethers.Wallet | null> {
    try {
      const db = await this.openDatabase();
      const tx = db.transaction(['wallets'], 'readonly');
      const store = tx.objectStore('wallets');

      const [encryptedPrivateKey, salt] = await Promise.all([
        store.get(this.WALLET_KEY),
        store.get(this.SALT_KEY)
      ]);

      if (!encryptedPrivateKey || !salt) {
        return null;
      }

      const derivedKey = CryptoService.deriveKey(password, salt);
      const privateKey = CryptoService.decrypt(encryptedPrivateKey, derivedKey);
      return new ethers.Wallet(privateKey);
    } catch (error) {
      console.error('Failed to load wallet:', error);
      return null;
    }
  }

  // Initialize IndexedDB
  private static openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('WalletDB', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        db.createObjectStore('wallets');
      };
    });
  }
}