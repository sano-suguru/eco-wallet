import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // テスト環境の設定（Node.jsがデフォルト）
    environment: "node",

    // グローバルテストAPIsを有効にする場合（Jest互換性向上）
    // globals: true,

    // その他の設定
    // coverage: {
    //   provider: 'v8', // または 'istanbul'
    // },
  },
});
