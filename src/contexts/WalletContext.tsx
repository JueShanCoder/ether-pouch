import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ethers } from 'ethers';
import { WalletService } from '../services/walletService';
import { toast } from 'sonner';

interface WalletContextType {
  wallet: ethers.HDNodeWallet | null;
  isLoading: boolean;
  currentNetwork: 'eth' | 'arb';
  setWallet: (wallet: ethers.HDNodeWallet) => void;
  createWallet: (password: string) => Promise<{ mnemonic: string, wallet: ethers.HDNodeWallet }>;
  loadWallet: (password: string) => Promise<void>;
  restoreFromMnemonic: (mnemonic: string, password: string) => Promise<void>;
  switchNetwork: (network: 'eth' | 'arb') => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<ethers.HDNodeWallet | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState<'eth' | 'arb'>('eth');

  const createWallet = async (password: string): Promise<{ mnemonic: string, wallet: ethers.HDNodeWallet }> => {
    try {
      setIsLoading(true);
      const { wallet: newWallet, mnemonic } = WalletService.generateWallet();
      await WalletService.storeWallet(newWallet, mnemonic, password);
      return { mnemonic, wallet: newWallet };
    } catch (error) {
      toast.error("创建钱包失败");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const restoreFromMnemonic = async (mnemonic: string, password: string) => {
    try {
      setIsLoading(true);
      const newWallet = WalletService.createFromMnemonic(mnemonic);
      await WalletService.storeWallet(newWallet, mnemonic, password);
      setWallet(newWallet);
      toast.success("钱包恢复成功");
    } catch (error) {
      toast.error("恢复钱包失败");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loadWallet = async (password: string) => {
    try {
      setIsLoading(true);
      const loadedWallet = await WalletService.loadWallet(password);
      if (loadedWallet) {
        setWallet(loadedWallet as ethers.HDNodeWallet);
        toast.success("钱包登录成功");
      } else {
        toast.error("登录失败，请检查密码是否正确");
      }
    } catch (error) {
      toast.error("登录失败");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const switchNetwork = (network: 'eth' | 'arb') => {
    setCurrentNetwork(network);
    toast.success(`已切换到 ${network.toUpperCase()} 网络`);
  };

  return (
    <WalletContext.Provider 
      value={{
        wallet,
        isLoading,
        currentNetwork,
        setWallet,
        createWallet,
        loadWallet,
        restoreFromMnemonic,
        switchNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}