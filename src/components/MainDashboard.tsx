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

const NETWORKS = {
  eth: {
    name: 'Ethereum',
    className: 'bg-blue-500'
  },
  arb: {
    name: 'Arbitrum',
    className: 'bg-blue-400'
  }
};

export function MainDashboard() {
  const { wallet } = useWallet();

  const handleNetworkChange = (network: string) => {
    toast.success(`已切换到 ${NETWORKS[network as keyof typeof NETWORKS].name} 网络`);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

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
            </div>
            <Select onValueChange={handleNetworkChange} defaultValue="eth">
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