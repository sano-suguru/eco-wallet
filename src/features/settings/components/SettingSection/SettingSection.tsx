import { ReactNode } from "react";

/**
 * 設定セクションのプロパティ
 */
export interface SettingSectionProps {
  /** セクションタイトル */
  title: string;
  /** アイコン（オプション） */
  icon?: ReactNode;
  /** 説明文（オプション） */
  description?: string;
  /** セクションの子要素 */
  children: ReactNode;
  /** 追加のCSSクラス（オプション） */
  className?: string;
}

/**
 * 設定画面のセクションを表示するコンポーネント
 *
 * @param title セクションタイトル
 * @param icon アイコン（オプション）
 * @param description 説明文（オプション）
 * @param children セクションの子要素
 * @param className 追加のCSSクラス（オプション）
 */
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
