import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    // テスト環境の設定（Node.jsがデフォルト）
    environment: "node",

    // In Source Testingを有効化
    includeSource: ["src/**/*.{js,ts,tsx}"],

    // グローバルテストAPIsを有効にする場合（Jest互換性向上）
    // globals: true,

    // その他の設定
    // coverage: {
    //   provider: 'v8', // または 'istanbul'
    // },
  },

  // In Source TestingでTypeScriptの型定義を有効化
  define: {
    "import.meta.vitest": "undefined",
  },

  // パスエイリアスの設定（Next.jsプロジェクトとの整合性）
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
