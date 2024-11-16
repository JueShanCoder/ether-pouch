import { useState } from 'react';
import { useWeb3 } from '@/contexts/Web3Context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

export function WalletCard() {
  const { account, balance, isConnected, isConnecting, connect, disconnect, sendTransaction } = useWeb3();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!recipient || !amount) return;
    setIsSending(true);
    try {
      await sendTransaction(recipient, amount);
      setRecipient('');
      setAmount('');
    } finally {
      setIsSending(false);
    }
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="wallet-card">
      <h2 className="text-2xl font-bold mb-6 gradient-text">Web3 Wallet</h2>
      
      {!isConnected ? (
        <Button
          onClick={connect}
          className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
          disabled={isConnecting}
        >
          {isConnecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            'Connect Wallet'
          )}
        </Button>
      ) : (
        <div className="space-y-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Connected Account</div>
            <div className="font-mono">{shortenAddress(account)}</div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Balance</div>
            <div className="font-mono">{parseFloat(balance || '0').toFixed(4)} ETH</div>
          </div>

          <div className="space-y-4">
            <Input
              placeholder="Recipient Address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
            <Input
              placeholder="Amount (ETH)"
              type="number"
              step="0.0001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Button
              onClick={handleSend}
              className="w-full bg-success hover:bg-success-hover"
              disabled={isSending || !recipient || !amount}
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send ETH'
              )}
            </Button>
          </div>

          <Button
            onClick={disconnect}
            variant="outline"
            className="w-full"
          >
            Disconnect
          </Button>
        </div>
      )}
    </div>
  );
}