import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  light?: boolean;
}

export function LoadingSpinner({
  size = "md",
  className,
  light = false,
}: LoadingSpinnerProps) {
  const sizeClass = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-3",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-t-transparent",
        light ? "border-white/60" : "border-teal-700/60",
        sizeClass[size],
        className,
      )}
    />
  );
}
