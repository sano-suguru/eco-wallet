import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus } from "lucide-react";
import { Recipient } from "../../types/transfer";

interface RecipientSelectorProps {
  recipients: Recipient[];
  selectedRecipient: Recipient | null;
  onSelectRecipient: (recipient: Recipient) => void;
  onAddRecipient?: () => void;
}

export const RecipientSelector: React.FC<RecipientSelectorProps> = ({
  recipients,
  selectedRecipient,
  onSelectRecipient,
  onAddRecipient,
}) => {
  return (
    <div className="bg-stone-50 rounded-md p-3">
      <p className="text-xs text-stone-500 mb-2">最近の送金先</p>
      <div className="flex space-x-2 overflow-x-auto pb-1">
        {recipients.map((recipient) => (
          <div
            key={recipient.id}
            className="flex-shrink-0 flex flex-col items-center space-y-1 cursor-pointer"
            onClick={() => onSelectRecipient(recipient)}
          >
            <Avatar
              className={`h-12 w-12 border ${
                selectedRecipient?.id === recipient.id
                  ? "border-teal-500"
                  : "border-stone-200"
              }`}
            >
              <AvatarImage src={recipient.avatar} alt={recipient.name} />
              <AvatarFallback
                className={`bg-${recipient.color}-100 text-${recipient.color}-800`}
              >
                {recipient.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs">{recipient.name}</span>
          </div>
        ))}
        {onAddRecipient && (
          <div
            className="flex-shrink-0 flex flex-col items-center space-y-1 cursor-pointer"
            onClick={onAddRecipient}
          >
            <div className="h-12 w-12 rounded-full border border-dashed border-stone-300 flex items-center justify-center bg-white hover:bg-stone-50 transition-colors">
              <UserPlus className="h-5 w-5 text-stone-400" />
            </div>
            <span className="text-xs">追加</span>
          </div>
        )}
      </div>
    </div>
  );
};
