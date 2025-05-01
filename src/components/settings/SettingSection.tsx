import { ReactNode } from "react";

interface SettingSectionProps {
  title: string;
  icon?: ReactNode;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function SettingSection({
  title,
  icon,
  description,
  children,
  className = "",
}: SettingSectionProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-2">
        {icon}
        <h3 className="text-sm font-medium text-stone-800">{title}</h3>
      </div>

      {description && <p className="text-xs text-stone-600">{description}</p>}

      {children}
    </div>
  );
}
