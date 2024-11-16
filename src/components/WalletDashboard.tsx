import { useWallet } from '@/contexts/WalletContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export function WalletDashboard() {
  const { wallet } = useWallet();

  const copyAddress = async () => {
    if (wallet?.address) {
      await navigator.clipboard.writeText(wallet.address);
      toast.success('地址已复制到剪贴板');
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

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
          <label className="text-sm text-gray-500">当前网络</label>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 p-2 bg-gray-100 rounded">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm">Ethereum Mainnet</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}