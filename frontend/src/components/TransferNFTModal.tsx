"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface TransferNFTModalProps {
  isOpen: boolean
  onClose: () => void
  tokenId: string
  onTransfer: (to: string) => Promise<void>
}

export function TransferNFTModal({ isOpen, onClose, tokenId, onTransfer }: TransferNFTModalProps) {
  const [recipientAddress, setRecipientAddress] = useState("")
  const [isTransferring, setIsTransferring] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isValidAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address)
  }

  const handleTransfer = async () => {
    if (!isValidAddress(recipientAddress)) {
      setError("Please enter a valid Ethereum address")
      return
    }
    
    setError(null)
    setIsTransferring(true)
    try {
      await onTransfer(recipientAddress)
      onClose()
    } catch (error) {
      setError("Transfer failed. Please try again.")
      console.error("Transfer failed:", error)
    } finally {
      setIsTransferring(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-semibold">Transfer NFT</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Enter the recipient's address to transfer NFT <span className="font-medium">#{tokenId}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="recipient" className="text-sm font-medium">
              Recipient Address
            </Label>
            <Input
              id="recipient"
              value={recipientAddress}
              onChange={(e) => {
                setRecipientAddress(e.target.value)
                setError(null)
              }}
              placeholder="0x..."
              className={cn(
                "font-mono",
                error && "border-red-500 focus-visible:ring-red-500"
              )}
              disabled={isTransferring}
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isTransferring}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleTransfer}
            disabled={isTransferring || !recipientAddress}
            className="w-full sm:w-auto"
          >
            {isTransferring ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Transferring...
              </>
            ) : (
              "Transfer"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

