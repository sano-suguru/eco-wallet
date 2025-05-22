"use client";

import { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthFieldProps } from "../../types/auth";

/**
 * 拡張認証フィールドプロパティ
 * 基本的なAuthFieldPropsに追加のプロパティを追加
 */
export interface ExtendedAuthFieldProps extends AuthFieldProps {
  /** 追加の説明テキスト */
  description?: string;
  /** フィールド前のアイコン */
  icon?: ReactNode;
  /** フィールドに関連するアクション（リンクなど） */
  action?: ReactNode;
  /** 必須フラグ */
  required?: boolean;
}

/**
 * 認証フォーム用の入力フィールドコンポーネント
 *
 * ラベル、入力フィールド、エラー表示、説明などを含む
 */
export function AuthField({
  id,
  label,
  type = "text",
  placeholder,
  register,
  errors,
  disabled = false,
  description,
  icon,
  action,
  required = false,
}: ExtendedAuthFieldProps) {
  // エラーメッセージを取得
  const errorMessage = errors[id]?.message as string | undefined;

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
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={`${
            errorMessage
              ? "border-red-300 ring-red-100"
              : "focus:border-teal-700 focus:ring-teal-100"
          } ${icon ? "pl-10" : ""} h-10 border-stone-300 bg-white`}
          {...register(id)}
        />
      </div>

      {errorMessage && (
        <p className="text-xs text-red-600 mt-1.5">{errorMessage}</p>
      )}
      {description && (
        <p className="text-xs text-stone-500 mt-1.5">{description}</p>
      )}
    </div>
  );
}
