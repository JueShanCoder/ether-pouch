import { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2, Lock } from 'lucide-react';

export function CreateWallet() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { createWallet, isLoading } = useWallet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return;
    }
    await createWallet(password);
  };

  const isPasswordValid = password.length >= 8;
  const doPasswordsMatch = password === confirmPassword;
  const canSubmit = isPasswordValid && doPasswordsMatch && !isLoading;

  return (
    <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-white/90 shadow-xl border-t border-l border-white/20">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
          <Lock className="w-5 h-5 text-primary" />
          Create New Wallet
        </CardTitle>
        <p className="text-sm text-gray-500 text-center">
          Set a strong password to protect your wallet
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
            {password && !isPasswordValid && (
              <p className="text-xs text-red-500">Password must be at least 8 characters</p>
            )}
            <Input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
            {confirmPassword && !doPasswordsMatch && (
              <p className="text-xs text-red-500">Passwords do not match</p>
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
                Creating Wallet...
              </>
            ) : (
              'Create Wallet'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}