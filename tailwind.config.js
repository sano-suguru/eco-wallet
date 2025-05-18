/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["class", ".dark *"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // デザインガイドラインに沿った色定義
        teal: {
          50: "#e6fffa",
          100: "#E0F2F1", // ライトティール（環境関連情報の背景）
          200: "#81e6d9",
          300: "#4fd1c5",
          400: "#38b2ac",
          500: "#319795",
          600: "#0F766E", // プライマリカラー: ティール
          700: "#0E6760", // ダークティール (ホバー状態)
          800: "#234e52",
          900: "#1d4044",
        },
        stone: {
          50: "#fafaf9",
          100: "#F5F5F4", // ライトストーン（ページ背景）
          200: "#e7e5e4",
          300: "#d6d3d1",
          400: "#a8a29e",
          500: "#78716C", // セカンダリーカラー: ストーン
          600: "#57534e",
          700: "#44403c",
          800: "#292524",
          900: "#1c1917",
        },
        amber: {
          100: "#FEF3C7", // ライトアンバー（キャンペーン情報背景）
          500: "#F59E0B",
          600: "#D97706", // アクセントカラー: アンバー
          700: "#B45309", // ダークアンバー
        },
        blue: {
          600: "#2563EB", // アクセントカラー: ブルー (入金、増加)
        },
        red: {
          100: "#FEE2E2", // ライトレッド
          600: "#DC2626", // アクセントカラー: レッド (エラー、警告)
          700: "#B91C1C", // ダークレッド
        },
        green: {
          600: "#16A34A", // アクセントカラー: グリーン (CO2削減)
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius-md)",
        sm: "var(--radius-sm)",
        xl: "var(--radius-xl)",
      },
    },
  },
};

export default config;
