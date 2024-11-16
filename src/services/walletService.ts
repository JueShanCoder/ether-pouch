import { ethers } from 'ethers';
import { CryptoService } from './cryptoService';

export class WalletService {
  private static readonly WALLET_KEY = 'encrypted_wallet';
  private static readonly SALT_KEY = 'wallet_salt';

  // Generate new wallet
  static generateWallet(): ethers.HDNodeWallet {
    return ethers.Wallet.createRandom() as ethers.HDNodeWallet;
  }

  // Encrypt and store wallet
  static async storeWallet(wallet: ethers.HDNodeWallet, password: string): Promise<void> {
    const salt = CryptoService.generateSalt();
    const derivedKey = CryptoService.deriveKey(password, salt);
    const encryptedPrivateKey = CryptoService.encrypt(wallet.privateKey, derivedKey);

    // Store in IndexedDB
    const db = await this.openDatabase();
    const tx = db.transaction(['wallets'], 'readwrite');
    const store = tx.objectStore('wallets');
    
    await Promise.all([
      this.putInStore(store, this.WALLET_KEY, encryptedPrivateKey),
      this.putInStore(store, this.SALT_KEY, salt)
    ]);
  }

  // Load wallet from storage
  static async loadWallet(password: string): Promise<ethers.HDNodeWallet | null> {
    try {
      const db = await this.openDatabase();
      const tx = db.transaction(['wallets'], 'readonly');
      const store = tx.objectStore('wallets');

      const [encryptedPrivateKey, salt] = await Promise.all([
        this.getFromStore(store, this.WALLET_KEY),
        this.getFromStore(store, this.SALT_KEY)
      ]);

      if (!encryptedPrivateKey || !salt) {
        return null;
      }

      const derivedKey = CryptoService.deriveKey(password, salt);
      const privateKey = CryptoService.decrypt(encryptedPrivateKey, derivedKey);
      
      // Create wallet from private key using ethers.js v6 API
      return new ethers.Wallet(privateKey) as ethers.HDNodeWallet;
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

  // Helper method to put data in store
  private static putInStore(store: IDBObjectStore, key: string, value: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = store.put(value, key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Helper method to get data from store
  private static getFromStore(store: IDBObjectStore, key: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}