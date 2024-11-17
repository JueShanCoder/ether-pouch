import { useWallet } from "@/contexts/WalletContext";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

const NETWORKS = {
  eth: {
    name: 'Ethereum',
    className: 'bg-blue-500',
    rpc: 'https://eth.llamarpc.com'
  },
  arb: {
    name: 'Arbitrum',
    className: 'bg-blue-400',
    rpc: 'https://arb1.arbitrum.io/rpc'
  }
};

export function MainDashboard() {
  const { wallet, currentNetwork, switchNetwork } = useWallet();
  const [balance, setBalance] = useState<string>('0');

  const handleNetworkChange = (network: string) => {
    switchNetwork(network as 'eth' | 'arb');
    toast.success(`已切换到 ${NETWORKS[network as keyof typeof NETWORKS].name} 网络`);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const fetchBalance = async () => {
    if (wallet?.address) {
      try {
        const provider = new ethers.JsonRpcProvider(NETWORKS[currentNetwork].rpc);
        const balanceWei = await provider.getBalance(wallet.address);
        const balanceEth = ethers.formatEther(balanceWei);
        setBalance(parseFloat(balanceEth).toFixed(4));
      } catch (error) {
        console.error('Failed to fetch balance:', error);
        toast.error('获取余额失败');
      }
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [wallet?.address, currentNetwork]);

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">
                我的钱包
              </h2>
              <p className="text-sm text-muted-foreground">
                {wallet?.address ? formatAddress(wallet.address) : '未连接钱包'}
              </p>
              <p className="text-sm text-muted-foreground">
                余额: {balance} {currentNetwork.toUpperCase()}
              </p>
            </div>
            <Select value={currentNetwork} onValueChange={handleNetworkChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="选择网络" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eth">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${NETWORKS.eth.className}`} />
                    <span>{NETWORKS.eth.name}</span>
                  </div>
                </SelectItem>
                <SelectItem value="arb">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${NETWORKS.arb.className}`} />
                    <span>{NETWORKS.arb.name}</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}