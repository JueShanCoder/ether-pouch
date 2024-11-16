import { createContext, useContext, useState, ReactNode } from 'react';
import { ethers } from 'ethers';
import { WalletService } from '../services/walletService';
import { toast } from 'sonner';

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

  const createWallet = async (password: string) => {
    try {
      setIsLoading(true);
      const { wallet: newWallet, mnemonic } = WalletService.generateWallet();
      await WalletService.storeWallet(newWallet, mnemonic, password);
      setWallet(newWallet);
      toast.success("钱包创建成功", {
        description: "请务必保存好您的助记词",
      });
      return mnemonic;
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
        setWallet(loadedWallet);
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

  const switchNetwork = async (chainId: number) => {
    if (!wallet) return;

    try {
      await window.ethereum?.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
      toast.success("切换网络成功");
    } catch (error: any) {
      if (error.code === 4902) {
        toast.error("请先添加该网络");
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