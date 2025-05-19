/**
 * Zustandストア用の共通型定義
 */
import { StoreApi } from "zustand";

// 将来的な拡張のためのジェネリック型
export type SliceCreator<T> = (
  set: <K extends keyof T>(
    partial: Pick<T, K> | Partial<T> | ((state: T) => Pick<T, K> | Partial<T>),
    replace?: boolean,
  ) => void,
  get: () => T,
  api: StoreApi<T>,
) => T;

// 各ストアでのインポート用
export * from "@/lib/mock-data/campaigns";
export * from "@/lib/mock-data/eco-impact";
export * from "@/types/transaction";
export * from "@/lib/mock-data/transactions-data";
