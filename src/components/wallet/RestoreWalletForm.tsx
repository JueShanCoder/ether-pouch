import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

interface RestoreWalletFormProps {
  onSubmit: (mnemonic: string, password: string) => Promise<void>;
  isLoading: boolean;
}

export function RestoreWalletForm({ onSubmit, isLoading }: RestoreWalletFormProps) {
  const [mnemonic, setMnemonic] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(mnemonic, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          placeholder="输入助记词(用空格分隔)"
          value={mnemonic}
          onChange={(e) => setMnemonic(e.target.value)}
          required
          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
        />
        <Input
          type="password"
          placeholder="设置新密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
        />
      </div>
      <Button 
        type="submit" 
        className="w-full transition-all duration-200"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            恢复中...
          </>
        ) : (
          '恢复钱包'
        )}
      </Button>
    </form>
  );
}