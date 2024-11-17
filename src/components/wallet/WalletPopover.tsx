import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { WalletDashboard } from "../WalletDashboard";

export function WalletPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="w-10 h-10">
          <Wallet className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="end">
        <WalletDashboard />
      </PopoverContent>
    </Popover>
  );
}