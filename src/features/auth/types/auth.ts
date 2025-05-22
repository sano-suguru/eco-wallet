/**
 * 認証機能の型定義
 */

import { Session } from "next-auth";
import { FieldErrors, UseFormRegister } from "react-hook-form";

/**
 * ユーザー認証情報の型
 */
export interface AuthUser {
  /** ユーザーID */
  id: string;
  /** 名前 */
  name: string;
  /** メールアドレス */
  email: string;
  /** アバター画像URL */
  image?: string;
  /** エコランク */
  ecoRank?: string;
  /** 認証済みフラグ */
  isVerified?: boolean;
  /** メンバーシップレベル */
  membershipLevel?: string;
}

/**
 * ログインフォームの値型
 */
export interface LoginFormValues {
  /** メールアドレス */
  email: string;
  /** パスワード */
  password: string;
  /** ログイン状態を記憶するか */
  remember?: boolean;
}

/**
 * 登録フォームの値型
 */
export interface RegisterFormValues {
  /** 名前 */
  name: string;
  /** メールアドレス */
  email: string;
  /** パスワード */
  password: string;
  /** パスワード（確認用） */
  passwordConfirm: string;
  /** 利用規約に同意するか */
  termsAccepted: boolean;
}

/**
 * 認証フィールドのプロパティ型
 */
export interface AuthFieldProps {
  /** フィールドID */
  id: string;
  /** ラベルテキスト */
  label: string;
  /** フィールドタイプ */
  type: string;
  /** プレースホルダーテキスト */
  placeholder?: string;
  /** 入力値の表示処理 */
  register: UseFormRegister<Record<string, unknown>>;
  /** バリデーションエラー */
  errors: FieldErrors;
  /** 無効化フラグ */
  disabled?: boolean;
}

/**
 * 認証フォームのプロパティ型
 */
export interface AuthFormProps {
  /** タイトル */
  title: string;
  /** サブタイトル */
  subtitle?: string;
  /** 送信ボタンテキスト */
  submitText: string;
  /** 送信処理中フラグ */
  isSubmitting?: boolean;
  /** エラーメッセージ */
  error?: string | null;
  /** フォーム内容 */
  children: React.ReactNode;
  /** 送信ハンドラー */
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  /** フッターリンク */
  footerLink?: React.ReactNode;
}

/**
 * ログイン状態型
 */
export interface AuthState {
  /** 認証済みフラグ */
  isAuthenticated: boolean;
  /** ユーザー情報 */
  user: AuthUser | null;
  /** セッション情報 */
  session: Session | null;
  /** ローディング状態 */
  loading: boolean;
  /** エラー情報 */
  error: string | null;
}

/**
 * ログアウトボタンのプロパティ型
 */
export interface LogoutButtonProps {
  /** ボタンテキスト */
  label?: string;
  /** アイコンを表示するか */
  showIcon?: boolean;
  /** ボタンバリアント */
  variant?:
    | "link"
    | "ghost"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | null
    | undefined;
  /** クラス名 */
  className?: string;
}
