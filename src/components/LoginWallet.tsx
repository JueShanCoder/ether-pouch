import { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2, Lock } from 'lucide-react';
import { toast } from 'sonner';

export function LoginWallet() {
  const [password, setPassword] = useState('');
  const { loadWallet, isLoading } = useWallet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loadWallet(password);
    } catch (error) {
      toast.error('登录失败，请检查密码是否正确');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-white/90 shadow-xl border-t border-l border-white/20">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
          <Lock className="w-5 h-5 text-primary" />
          登录钱包
        </CardTitle>
        <p className="text-sm text-gray-500 text-center">
          输入密码以访问您的钱包
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full transition-all duration-200"
            disabled={!password || isLoading}
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
      </CardContent>
    </Card>
  );
}