import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, Copy, Rocket, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PaymentModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const UPI_ID = "himanshukagra07@oksbi";
const FEE = "₹99";

export function PaymentModal({ open, onConfirm, onCancel }: PaymentModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    toast.success("UPI ID copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent
        data-ocid="payment.dialog"
        className="max-w-sm rounded-2xl border border-border bg-card p-0 overflow-hidden"
      >
        {/* Top accent */}
        <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-70" />

        <div className="p-6 space-y-5">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
                <Rocket className="w-5 h-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="font-display font-extrabold text-lg text-foreground leading-tight">
                  Pay to Launch Your Track
                </DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  One-time distribution fee
                </p>
              </div>
            </div>
          </DialogHeader>

          {/* Fee badge */}
          <div className="flex items-center justify-center">
            <div className="px-5 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-display font-extrabold text-3xl tracking-tight btn-glow">
              {FEE}
            </div>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative rounded-2xl overflow-hidden border border-border bg-white p-2">
              <img
                src="/assets/uploads/Screenshot_2026-03-13-04-26-32-062_com.google.android.apps.nbu.paisa.user-1.jpg"
                alt="UPI QR Code"
                className="w-52 h-52 object-contain block"
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Scan with any UPI app and pay {FEE}
            </p>
          </div>

          {/* UPI ID row */}
          <div className="flex items-center gap-2 rounded-xl bg-secondary border border-border px-3 py-2">
            <span className="flex-1 text-sm font-medium text-foreground truncate select-all">
              {UPI_ID}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 text-muted-foreground hover:text-primary transition-colors p-1 rounded-lg hover:bg-primary/10"
              title="Copy UPI ID"
            >
              {copied ? (
                <Check className="w-4 h-4 text-primary" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-1">
            <Button
              data-ocid="payment.confirm_button"
              onClick={onConfirm}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold text-sm h-11 btn-glow"
            >
              <Rocket className="w-4 h-4 mr-2" />I Have Paid — Launch Track
            </Button>
            <Button
              data-ocid="payment.cancel_button"
              variant="ghost"
              onClick={onCancel}
              className="w-full rounded-xl text-muted-foreground hover:text-foreground h-10"
            >
              <X className="w-4 h-4 mr-1.5" />
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
