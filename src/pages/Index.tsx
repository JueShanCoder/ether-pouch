import { CreateWallet } from '@/components/CreateWallet';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-4xl font-bold text-center gradient-text">Ether Pouch</h1>
        <p className="text-gray-600 text-center">Create and manage your Ethereum wallet securely</p>
        <CreateWallet />
      </div>
    </div>
  );
};

export default Index;