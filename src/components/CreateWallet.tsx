import { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Lock, RefreshCw, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { CreateWalletForm } from './wallet/CreateWalletForm';
import { RestoreWalletForm } from './wallet/RestoreWalletForm';
import { LoginWalletForm } from './wallet/LoginWalletForm';
import { toast } from 'sonner';

export function CreateWallet() {
  const [showMnemonicDialog, setShowMnemonicDialog] = useState(false);
  const [mnemonic, setMnemonic] = useState('');
  const [isRestoring, setIsRestoring] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [tempWallet, setTempWallet] = useState<any>(null);
  const { createWallet, restoreFromMnemonic, loadWallet, isLoading } = useWallet();

  const handleCreateWallet = async (password: string, confirmPassword: string) => {
    if (password !== confirmPassword) {
      toast.error("密码不匹配");
      return;
    }
    try {
      const { mnemonic: newMnemonic, wallet: newWallet } = await createWallet(password);
      if (newMnemonic) {
        setMnemonic(newMnemonic);
        setTempWallet(newWallet);
        setShowMnemonicDialog(true);
      }
    } catch (error) {
      toast.error("创建钱包失败");
    }
  };

  const handleRestore = async (mnemonic: string, password: string) => {
    try {
      await restoreFromMnemonic(mnemonic, password);
      toast.success("钱包恢复成功");
    } catch (error) {
      toast.error("恢复钱包失败");
    }
  };

  const handleLogin = async (password: string) => {
    try {
      await loadWallet(password);
      toast.success("登录成功");
    } catch (error) {
      toast.error("登录失败");
    }
  };

  const handleCloseMnemonicDialog = async () => {
    if (tempWallet) {
      try {
        await loadWallet(tempWallet.privateKey);
        setShowMnemonicDialog(false);
        setTempWallet(null);
        toast.success("钱包创建成功");
      } catch (error) {
        toast.error("加载钱包失败");
      }
    }
  };

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
            <LoginWalletForm onSubmit={handleLogin} isLoading={isLoading} />
          ) : isRestoring ? (
            <RestoreWalletForm onSubmit={handleRestore} isLoading={isLoading} />
          ) : (
            <CreateWalletForm onSubmit={handleCreateWallet} isLoading={isLoading} />
          )}
        </CardContent>
      </Card>

      <Dialog open={showMnemonicDialog} onOpenChange={setShowMnemonicDialog}>
        <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>请保存您的助记词</DialogTitle>
            <DialogDescription>
              这是您的钱包助记词，请务必安全保管。如果遗失，将无法恢复您的钱包。
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-muted rounded-md">
            <code className="text-sm break-all font-mono text-foreground">{mnemonic}</code>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleCloseMnemonicDialog}
              className="w-full"
            >
              我已安全保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}