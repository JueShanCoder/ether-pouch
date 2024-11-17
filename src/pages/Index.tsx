import { CreateWallet } from '@/components/CreateWallet';
import { WalletPopover } from '@/components/wallet/WalletPopover';
import { MainDashboard } from '@/components/MainDashboard';
import { Wallet } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';

const Index = () => {
  const { wallet } = useWallet();

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-purple-50 to-blue-100">
      <div className="container mx-auto px-4">
        <header className="py-4 flex justify-end">
          <WalletPopover />
        </header>
        
        <div className="text-center space-y-2 mb-8">
          <div className="flex items-center justify-center mb-4">
            <Wallet className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-5xl font-bold gradient-text tracking-tight">
            ChainSwitch
          </h1>
          <p className="text-gray-600 text-lg">
            无感切链的多链钱包管理工具
          </p>
          <div className="flex gap-2 items-center justify-center text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
              多链支持
            </span>
            <span className="mx-2">•</span>
            <span>无感切换</span>
            <span className="mx-2">•</span>
            <span>安全便捷</span>
          </div>
        </div>

        {wallet ? <MainDashboard /> : <CreateWallet />}
      </div>
    </div>
  );
};

export default Index;