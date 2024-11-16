import { CreateWallet } from '@/components/CreateWallet';
import { Wallet } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-purple-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center mb-4">
            <Wallet className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-5xl font-bold gradient-text tracking-tight">
            Ether Pouch
          </h1>
          <p className="text-gray-600 text-lg">
            安全便捷的以太坊钱包管理工具
          </p>
          <div className="flex gap-2 items-center justify-center text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
              安全加密
            </span>
            <span className="mx-2">•</span>
            <span>本地存储</span>
            <span className="mx-2">•</span>
            <span>简单易用</span>
          </div>
        </div>
        <CreateWallet />
      </div>
    </div>
  );
};

export default Index;