"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RecipientSelector } from "./RecipientSelector";
import { Recipient } from "../../types/transfer";
import { recentRecipients } from "../../data/recipients-data";

interface RecipientSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecipient: (recipient: Recipient) => void;
}

export const RecipientSelectorModal: React.FC<RecipientSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectRecipient,
}) => {
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(
    null,
  );

  const handleSelectRecipient = (recipient: Recipient) => {
    setSelectedRecipient(recipient);
    onSelectRecipient(recipient);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>受取人を選択</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <RecipientSelector
            recipients={recentRecipients}
            selectedRecipient={selectedRecipient}
            onSelectRecipient={handleSelectRecipient}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
