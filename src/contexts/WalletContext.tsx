import { createContext, useContext, useState, ReactNode } from 'react';
import { ethers } from 'ethers';
import { WalletService } from '../services/walletService';
import { useToast } from '@/components/ui/use-toast';

interface WalletContextType {
  wallet: ethers.Wallet | null;
  isLoading: boolean;
  createWallet: (password: string) => Promise<string>;
  loadWallet: (password: string) => Promise<void>;
  restoreFromMnemonic: (mnemonic: string, password: string) => Promise<void>;
  switchNetwork: (chainId: number) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<ethers.Wallet | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createWallet = async (password: string) => {
    try {
      setIsLoading(true);
      const { wallet: newWallet, mnemonic } = WalletService.generateWallet();
      await WalletService.storeWallet(newWallet, mnemonic, password);
      setWallet(newWallet);
      toast({
        title: "钱包创建成功",
        description: "请务必保存好您的助记词",
      });
      return mnemonic;
    } catch (error) {
      toast({
        title: "错误",
        description: "创建钱包失败",
        variant: "destructive",
      });
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
      toast({
        title: "钱包恢复成功",
        description: "您的钱包已成功恢复",
      });
    } catch (error) {
      toast({
        title: "错误",
        description: "恢复钱包失败",
        variant: "destructive",
      });
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
        setWallet(loadedWallet);
        toast({
          title: "Wallet Loaded",
          description: "Your wallet has been loaded successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load wallet",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const switchNetwork = async (chainId: number) => {
    if (!wallet) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
      toast({
        title: "Network Changed",
        description: "Successfully switched network",
      });
    } catch (error: any) {
      if (error.code === 4902) {
        toast({
          title: "Network Not Found",
          description: "Please add the network to your wallet first",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <WalletContext.Provider 
      value={{
        wallet,
        isLoading,
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
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
