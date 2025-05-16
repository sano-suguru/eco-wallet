import { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AuthFieldProps {
  id: string;
  label: string;
  type?: string;
  name: string; // name プロパティを追加
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string | null;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function AuthField({
  id,
  label,
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  error,
  description,
  icon,
  action,
}: AuthFieldProps) {
  return (
    <div className="space-y-2 text-left">
      <div className="flex justify-between">
        <Label
          htmlFor={id}
          className="text-sm font-medium text-stone-800 mb-1 inline-block"
        >
          {label}
        </Label>
        {action}
      </div>

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-500">
            {icon}
          </div>
        )}

        <Input
          id={id}
          name={name} // nameプロパティを追加
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`${error ? "border-red-300 ring-red-100" : "focus:border-teal-700 focus:ring-teal-100"} ${
            icon ? "pl-10" : ""
          } h-10 border-stone-300 bg-white`}
        />
      </div>

      {error && <p className="text-xs text-red-600 mt-1.5">{error}</p>}
      {description && (
        <p className="text-xs text-stone-500 mt-1.5">{description}</p>
      )}
    </div>
  );
}
