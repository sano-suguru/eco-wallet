import { ReactNode } from "react";

interface TransactionDetailSectionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function TransactionDetailSection({
  title,
  icon,
  children,
  className = "",
}: TransactionDetailSectionProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center space-x-2">
        {icon}
        <h3 className="text-sm font-medium text-stone-700">{title}</h3>
      </div>
      {children}
    </div>
  );
}
