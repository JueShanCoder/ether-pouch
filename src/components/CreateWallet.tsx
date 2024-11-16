import { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2, Lock, RefreshCw, LogIn } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function CreateWallet() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const [showMnemonicDialog, setShowMnemonicDialog] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [restoreMnemonic, setRestoreMnemonic] = useState('');
  const [restorePassword, setRestorePassword] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const { createWallet, restoreFromMnemonic, loadWallet, isLoading } = useWallet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return;
    }
    const newMnemonic = await createWallet(password);
    setMnemonic(newMnemonic);
    setShowMnemonicDialog(true);
  };

  const handleRestore = async (e: React.FormEvent) => {
    e.preventDefault();
    await restoreFromMnemonic(restoreMnemonic, restorePassword);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await loadWallet(loginPassword);
  };

  const isPasswordValid = password.length >= 8;
  const doPasswordsMatch = password === confirmPassword;
  const canSubmit = isPasswordValid && doPasswordsMatch && !isLoading;

  return (
    <>
      <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-white/90 shadow-xl border-t border-l border-white/20">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            {isLoggingIn ? "登录钱包" : isRestoring ? "恢复钱包" : "创建新钱包"}
          </CardTitle>
          <div className="flex justify-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsRestoring(false);
                setIsLoggingIn(!isLoggingIn);
              }}
              className="text-primary"
            >
              <LogIn className="w-4 h-4 mr-2" />
              {isLoggingIn ? "创建新钱包" : "登录钱包"}
            </Button>
            {!isLoggingIn && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsRestoring(!isRestoring)}
                className="text-primary"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {isRestoring ? "创建新钱包" : "恢复钱包"}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoggingIn ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="输入钱包密码"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
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
          ) : isRestoring ? (
            <form onSubmit={handleRestore} className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="输入助记词(用空格分隔)"
                  value={restoreMnemonic}
                  onChange={(e) => setRestoreMnemonic(e.target.value)}
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
                <Input
                  type="password"
                  placeholder="设置新密码"
                  value={restorePassword}
                  onChange={(e) => setRestorePassword(e.target.value)}
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
          ) : (
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
          )}
        </CardContent>
      </Card>

      <Dialog open={showMnemonicDialog} onOpenChange={setShowMnemonicDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>请保存您的助记词</DialogTitle>
            <DialogDescription>
              这是您的钱包助记词，请务必安全保管。如果遗失，将无法恢复您的钱包。
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-gray-100 rounded-md">
            <code className="text-sm break-all">{mnemonic}</code>
          </div>
          <Button onClick={() => setShowMnemonicDialog(false)}>
            我已安全保存
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}