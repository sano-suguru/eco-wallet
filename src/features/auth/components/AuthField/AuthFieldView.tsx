"use client";

import { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Result型対応認証フィールドプロパティ
 */
export interface AuthFieldViewProps {
  /** フィールドID */
  id: string;
  /** ラベルテキスト */
  label: string;
  /** フィールドタイプ */
  type?: string;
  /** プレースホルダーテキスト */
  placeholder?: string;
  /** 入力値 */
  value: string;
  /** 変更ハンドラー */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** 無効化フラグ */
  disabled?: boolean;
  /** 必須フラグ */
  required?: boolean;
  /** エラーメッセージ */
  error?: string | null;
  /** 追加の説明テキスト */
  description?: string;
  /** フィールド前のアイコン */
  icon?: ReactNode;
  /** フィールドに関連するアクション（リンクなど） */
  action?: ReactNode;
}

/**
 * Result型対応認証フォーム用入力フィールドコンポーネント
 *
 * ラベル、入力フィールド、エラー表示、説明などを含む
 */
export function AuthFieldView({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  error,
  description,
  icon,
  action,
}: AuthFieldViewProps) {
  return (
    <div className="space-y-2 text-left">
      <div className="flex justify-between">
        <Label
          htmlFor={id}
          className="text-sm font-medium text-stone-800 mb-1 inline-block"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
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
          name={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`${
            error
              ? "border-red-300 ring-red-100"
              : "focus:border-teal-700 focus:ring-teal-100"
          } ${icon ? "pl-10" : ""} h-10 border-stone-300 bg-white`}
        />
      </div>

      {error && <p className="text-xs text-red-600 mt-1.5">{error}</p>}
      {description && (
        <p className="text-xs text-stone-500 mt-1.5">{description}</p>
      )}
    </div>
  );
}
