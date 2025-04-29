import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorMessageProps {
  message: string | null;
  className?: string;
}

export function ErrorMessage({ message, className }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div
      className={cn(
        "flex items-start p-3 text-sm bg-red-50 text-red-700 rounded-md border border-red-200",
        className,
      )}
    >
      <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}
