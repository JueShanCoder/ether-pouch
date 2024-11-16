import { CreateWallet } from '@/components/CreateWallet';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <CreateWallet />
      </div>
    </div>
  );
};

export default Index;