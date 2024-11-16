import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

interface CreateWalletFormProps {
  onSubmit: (password: string, confirmPassword: string) => Promise<void>;
  isLoading: boolean;
}

export function CreateWalletForm({ onSubmit, isLoading }: CreateWalletFormProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(password, confirmPassword);
  };

  const isPasswordValid = password.length >= 8;
  const doPasswordsMatch = password === confirmPassword;
  const canSubmit = isPasswordValid && doPasswordsMatch && !isLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          type="password"
          placeholder="输入密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
        />
        {password && !isPasswordValid && (
          <p className="text-xs text-red-500">密码至少需要8个字符</p>
        )}
        <Input
          type="password"
          placeholder="确认密码"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={8}
          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
        />
        {confirmPassword && !doPasswordsMatch && (
          <p className="text-xs text-red-500">两次输入的密码不一致</p>
        )}
      </div>
      <Button 
        type="submit" 
        className="w-full transition-all duration-200"
        disabled={!canSubmit}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            创建中...
          </>
        ) : (
          '创建钱包'
        )}
      </Button>
    </form>
  );
}