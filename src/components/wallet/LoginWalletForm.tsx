import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

interface LoginWalletFormProps {
  onSubmit: (password: string) => Promise<void>;
  isLoading: boolean;
}

export function LoginWalletForm({ onSubmit, isLoading }: LoginWalletFormProps) {
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          type="password"
          placeholder="输入钱包密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
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
            登录中...
          </>
        ) : (
          '登录钱包'
        )}
      </Button>
    </form>
  );
}