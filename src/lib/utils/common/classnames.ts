/**
 * クラス名操作に関するユーティリティ関数
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 複数のクラス名を結合する
 * clsxでクラス名を処理し、tailwind-mergeでTailwindのクラスをマージする
 * @param inputs クラス名（文字列、オブジェクト、配列など）
 * @returns マージされたクラス名
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
