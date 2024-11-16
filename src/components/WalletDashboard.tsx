import { useState, useEffect } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink, Key, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { ethers } from 'ethers';

export function WalletDashboard() {
  const { wallet } = useWallet();
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [balance, setBalance] = useState<string>('0');

  const copyAddress = async () => {
    if (wallet?.address) {
      await navigator.clipboard.writeText(wallet.address);
      toast.success('地址已复制到剪贴板');
    }
  };

  const copyPrivateKey = async () => {
    if (wallet?.privateKey) {
      await navigator.clipboard.writeText(wallet.privateKey);
      toast.success('私钥已复制到剪贴板');
      setShowPrivateKey(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const fetchBalance = async () => {
    if (wallet?.address) {
      try {
        const provider = new ethers.JsonRpcProvider('https://eth.llamarpc.com');
        const balanceWei = await provider.getBalance(wallet.address);
        const balanceEth = ethers.formatEther(balanceWei);
        setBalance(parseFloat(balanceEth).toFixed(4));
      } catch (error) {
        console.error('Failed to fetch balance:', error);
        toast.error('获取余额失败');
      }
    }
  };

  // Fetch balance on component mount
  useEffect(() => {
    fetchBalance();
  }, [wallet?.address]);

  return (
    <Card className="w-full backdrop-blur-sm bg-white/90 shadow-xl border-t border-l border-white/20">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">我的钱包</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-gray-500">钱包地址</label>
          <div className="flex items-center gap-2">
            <code className="flex-1 p-2 bg-gray-100 rounded text-sm">
              {wallet?.address && formatAddress(wallet.address)}
            </code>
            <Button variant="outline" size="icon" onClick={copyAddress}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => window.open(`https://etherscan.io/address/${wallet?.address}`, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-500">私钥</label>
          <div className="flex items-center gap-2">
            <code className="flex-1 p-2 bg-gray-100 rounded text-sm font-mono break-all">
              {showPrivateKey ? wallet?.privateKey : '••••••••••••••••'}
            </code>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setShowPrivateKey(!showPrivateKey)}
            >
              {showPrivateKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="icon" onClick={copyPrivateKey}>
              <Key className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-500">当前网络</label>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 p-2 bg-gray-100 rounded">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm">Ethereum Mainnet</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-500">ETH 余额</label>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 p-2 bg-gray-100 rounded w-full">
              <span className="text-sm font-mono">{balance} ETH</span>
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={fetchBalance}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" strokeWidth="2" d="M20 8c-1.403-2.96-4.463-5-8-5a9 9 0 1 0 0 18 9 9 0 0 0 9-9m0-9v6h-6" />
              </svg>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}