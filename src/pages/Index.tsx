import { Web3Provider } from '@/contexts/Web3Context';
import { WalletCard } from '@/components/WalletCard';

const Index = () => {
  return (
    <Web3Provider>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <WalletCard />
        </div>
      </div>
    </Web3Provider>
  );
};

export default Index;