import { ReactNode, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error-message";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface AuthFormProps {
  children: ReactNode;
  onSubmit: (e: FormEvent) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
  submitLabel: string;
  loadingLabel?: string;
  footer?: ReactNode;
}

export function AuthForm({
  children,
  onSubmit,
  isLoading,
  error,
  submitLabel,
  loadingLabel,
  footer,
}: AuthFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {children}

      {error && <ErrorMessage message={error} />}

      <Button
        type="submit"
        variant="eco"
        className="w-full h-10 font-medium"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <LoadingSpinner size="sm" light className="mr-2" />
            {loadingLabel || "処理中..."}
          </div>
        ) : (
          submitLabel
        )}
      </Button>

      {footer}
    </form>
  );
}
