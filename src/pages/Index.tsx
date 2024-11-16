import { CreateWallet } from '@/components/CreateWallet';
import { LoginWallet } from '@/components/LoginWallet';
import { WalletDashboard } from '@/components/WalletDashboard';
import { Wallet } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { wallet } = useWallet();
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-purple-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
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
        
        {wallet ? (
          <WalletDashboard />
        ) : (
          <div className="space-y-4">
            {showLogin ? (
              <>
                <LoginWallet />
                <div className="text-center">
                  <Button 
                    variant="link" 
                    onClick={() => setShowLogin(false)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    没有钱包？创建一个新钱包
                  </Button>
                </div>
              </>
            ) : (
              <>
                <CreateWallet />
                <div className="text-center">
                  <Button 
                    variant="link" 
                    onClick={() => setShowLogin(true)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    已有钱包？点此登录
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;