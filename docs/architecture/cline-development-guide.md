# Cline開発ガイド - TypeScript特化プロンプトエンジニアリング

## 概要

このガイドは、Eco WalletプロジェクトでCline（AI Coding Agent）を効果的に活用するためのTypeScript特化プロンプトエンジニアリングのベストプラクティスをまとめたものです。

### なぜ言語特化プロンプトが必要か

- Coding Agentは言語ごとのユースケースに最適化されていない
- TypeScript周辺は技術選定で発散しがち
- プログラミング言語間の転移学習は不安定
- ツールの組み合わせで性能が変わる

### プロンプトを書くコツ

- **書きすぎない**（再現性ある範囲で詠唱破棄）
- 執拗に出力例を例示
- 両立条件の矛盾を避ける
- 規模感に合わせて厳しく

## 効果的なプロンプトパターン

### 1. テスト駆動開発（TDD）- 最重要

````markdown
TDD を実施する。コードを生成するときは、それに対応するユニットテストを常に生成する。
コードを追加で修正したとき、`npm test` がパスすることを常に確認する。

```ts
function add(a: number, b: number) {
  return a + b;
}
test("1+2=3", () => {
  expect(add(1, 2)).toBe(3);
});
```
````

````

**メリット:**
- 自己修復能力
- 高品質なテストがあればエージェントを放置しても完成する

**Eco Wallet適用例:**
```markdown
@/src/features/balance/utils/calculation.ts に残高計算関数を追加。
TDDで実装し、各関数に対応するテストを同じファイルに書く。
````

### 2. コメントによる自己記述

````markdown
各ファイルの冒頭にはコメントで仕様を記述する。

出力例

```ts
/**
 * 2点間のユークリッド距離を計算する
 */
type Point = { x: number; y: number };
export function distance(a: Point, b: Point): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}
```
````

````

**メリット:**
- 再修正時のコード解釈で一貫性を保てる

**Eco Wallet適用例:**
```markdown
@/src/features/transfer/utils/split-bill.ts に割り勘計算ロジックを実装。
ファイル冒頭に以下のような仕様コメントを必ず記載：

```ts
/**
 * 割り勘計算ユーティリティ
 * - 金額を人数で均等分割
 * - 端数は主催者が負担
 * - 最小単位は1円
 */
````

````

### 3. In Source Testing

```markdown
vitest で実装と同じファイルにユニットテストを書く。
出力例
```ts
export function distance(a: Point, b: Point): number {...}
if (import.meta.vitest) {
  const {test, expect} = import.meta.vitest;
  test("ユークリッド距離を計算する", () => {
    const result = distance({x: 0, y: 0}, {x: 3, y: 4});
    expect(result).toBe(5);
  });
}
````

````

**メリット:**
- コメント/実装/テストは三位一体
- 欠点: ファイルが肥大化しやすい（800~1000行あたりが限界）

**Eco Wallet適用例:**
```markdown
@/src/features/donation/utils/impact-calculator.ts に環境貢献度計算を実装。
vitestのIn Source Testingを使用：

```ts
export function calculateCO2Reduction(amount: number): number {
  // 実装
}

if (import.meta.vitest) {
  const {test, expect} = import.meta.vitest;
  test("1000円の寄付で10kgのCO2削減", () => {
    expect(calculateCO2Reduction(1000)).toBe(10);
  });
}
````

````

### 4. types.ts にドメイン型を集約

```markdown
src/types.ts にアプリケーション内のドメインモデルを集約する。
その型がどのように使われるかを jsdoc スタイルのコメントで記述
```ts
/**
 * キャッシュのインターフェース抽象
 */
export type AsyncCache<T> = {
  get(): Promise<T | void>;
  has(): Promise<boolean>;
  set(value: T): Promise<void>;
}
````

````

**メリット:**
- 中規模(1000L~): 複数ファイル間の SSoT を型定義とする
- read_file 頻度が下がる。書き換え頻度が（実装と比較して）比較的少ない

**Eco Wallet適用例:**
```markdown
@/src/features/[feature-name]/types/index.ts に各featureのドメイン型を集約。

例: @/src/features/payment/types/index.ts
```ts
/**
 * 決済トランザクションの状態
 * pending: 処理中
 * completed: 完了
 * failed: 失敗
 * cancelled: キャンセル
 */
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

/**
 * 決済方法
 */
export type PaymentMethod = {
  type: 'balance' | 'campaign' | 'mixed';
  details: PaymentDetails;
};
````

````

### 5. TypeScript + 関数型ドメインモデリング

```markdown
TypeScript で関数型ドメインモデリングを行う。class を使わず関数による実装を優先する。
代数的データでドメインをモデリングする。
出力例
```ts
type FetchResult<T, E> = {
  ok: true;
  data: T
} | {
  ok: false;
  error: E
}
````

````

**メリット:**
- （好みの問題はあるが）状態の発散を抑えるのに不変データ構造が望ましい

**Eco Wallet適用例:**
```markdown
@/src/features/charge/types/charge-result.ts でチャージ結果を代数的データ型で定義：

```ts
export type ChargeResult =
  | { status: 'success'; chargeId: string; amount: number; }
  | { status: 'insufficient_funds'; required: number; available: number; }
  | { status: 'limit_exceeded'; limit: number; requested: number; }
  | { status: 'error'; code: string; message: string; };

// 使用例
export function processCharge(amount: number): ChargeResult {
  // 実装
}
````

````

### 6. ファイル配置規則を明記

```markdown
以下のモノレポの配置規則に従う。

script/
  <task-name>.ts    # タスク
packages/
  <mod-name>/
    examples/
      *.ts          # ユースケース例
    src/
      index.ts      # エントリポイント
      index.test.ts # ファイルに対応するユニットテスト
      types.ts      # 型定義
    test/
      *.test.ts     # インテグレーションテスト
````

**メリット:**

- 中規模以上: タスク毎のエージェントの推測コストを減らす

**Eco Wallet適用例:**

```markdown
Eco Walletのfeatureモジュール構造に従う：

features/[feature-name]/
├── components/ # UIコンポーネント
├── hooks/ # カスタムフック
├── store/ # 状態管理
├── types/ # 型定義（ドメインモデル集約）
├── utils/ # ユーティリティ関数（テスト含む）
├── data/ # モックデータ
├── index.ts # 公開API
└── README.md # 機能の説明
```

### 7. 詳細指示を docs/\*.md に分割

```markdown
(システムプロンプト)
docs/\*.md はこのプロジェクトで必要なドキュメントが置かれている。
ユーザーの指示に基づいて参照する。

(個別プロンプト)
@/docs/react-test-pattern.md を読んで @/src/components/Button.tsx にユニットテストを追加

(docs/react-test-pattern.md)
このドキュメントでは react を @testing-library/react でテストを書く方法を指示する。
以下テストコード例...
```

**メリット:**

- 大規模用(3000L~)
- 理由: 無関係な指示が常に存在すると、次第にすべてを無視するようになっていく
- 欠点: ドキュメントを用意/把握するのがだるい

### 8. カバレッジに基づくテストの自動生成

```markdown
テストカバレッジ100%を目指す。
`*.ts` に対して、`*.test.ts` でユニットテストを書く
.test.ts がない実装に対して、他のテストを参考にテストコードを追加

1. `npx vitest --run --coverage` を実行して、現在のカバレッジを取得
2. 今の状態から最もカバレッジが上がるテストコードを考察してから追加
3. 再度カバレッジを計測して、数値が向上していることを確認

ユーザーが満足するまで、テスト生成を繰り返す
```

**メリット:**

- [Automated Unit Test Improvement using Large Language Models at Meta](https://arxiv.org/abs/2402.09171)
- Clineなら特に工夫なく再現可能

## 個別タスク用プロンプト

### 1. 機械的なマイグレーション

```markdown
@/docs/You-Dont-Need-Lodash-Underscore.md を参考に lodash を削除する。
プロジェクト内の lodash のコードを grep で検索して、それらを置き換える。
置き換えた後に `npm test` を実施して、テストが通っていることを確認する
```

**活用例:**

- lodashの削除
- moment.js → date-fns への移行
- class-based → functional componentsへの移行

### 2. 似たAPIのライブラリに置き換える

```markdown
ライブラリAをライブラリBに置き換えて
```

**置き換え可能な例:**

- **cypress** => **playwright**
- **jest** => **vitest**
- **recoil** => **jotai**
- **Vue** => **Svelte**

90%自動化できる（最後は気合）

### 3. URLを読む能力（MCP）

```markdown
(システムプロンプト)
あなたはURLが与えられた時、以下のコマンドでそのURLの内容をmardownで取得できる
`npx -y @mizchi/readability --format=md <url>`

(個別プロンプト: 1)
https://blog.cloudflare.com/cloudflare-containers-coming-2025/ 読んで

(個別プロンプト: 2)
今読んだ内容を docs/ 以下に要約して保存しておいて
```

## Copilot連携のTIPS

### 1. 型定義ファイルを一時的にPin

- vscodeの `Open Editors` で `Pin` しておくと優先的に参照
- 特に `typescript.d.ts` のようなAPIが膨大なライブラリ

### 2. コメントから書き始める

```typescript
// ExecutionResult を prioty で並び替える関数<TAB>
```

- インラインプロンプトだと思って書く
- Open Editorsの他のタブの内容を見ているので、型定義のPinと相性がいい
- 最終的に消しがち

## アンチパターン（避けるべきこと）

### 1. 型だけで設計

````markdown
Architect モードでは、最初に型シグネチャとそのユースケースで仕様を整理する。
型とそれを使うテストコードをユーザーに提案し、同意後に実装を行う
出力例

```ts
declare function add(a: number, b: number): number;
test("add(1,2) => 3", () => {
  expect(1, 2).toBe(3);
});
```
````

````

**問題点:**
- ほぼ確実に無視される。型だけで抽象的に設計する能力はない
- 「テストと型をそのままに実装だけを修正して」も無視されがち

### 2. 非同期例外処理がヘタクソ

```typescript
async function main() {
  try {
    await init();
    try {
      await run();
    } catch (err) {
      /// ...
    }
  } catch (err) {
    console.error(err)
  }
}
````

**問題点:**

- 思考停止気味に try-catch で握り潰す（Gemini に顕著）
- 大規模で破綻する要因の一つ

### 3. 環境構築が下手

```markdown
(User)
typescript + vite + vitest でセットアップして

(Assistant)
foo.ts が実行できません。
vite-node を入れます。 ts-node を入れます、tsx を入れます。 tsconfig.json を削除してみます。
拡張子を全部 .cjs にします、package.json の `type: module` を削除します。
```

**問題点:**

- 「環境」そのものが一番強力なプロンプトで、ゼロショットは発散
- Cline: 手数が仇になって環境破壊

### 4. モジュールインターフェースが発散

````markdown
モジュール利用者の視点で使いやすくするために export を減らす

```ts
export {
  generateDetailedComplexityReport,
  generateMetricsReport,
  generateModuleComplexityReport,
} from "./core/mod.ts";
```
````

````

**現実:**
- とにかく実装次第に全部 export
- モジュール間の契約が肥大化して破綻

**暫定対応:**
- [tsr](https://github.com/line/tsr) でTreeShake相当でデッドコード検出
- `npx -y tsr src/index.ts test/**/*.ts`

### 5. チェーホフの銃の法則

- 無関係なリソースを読み込んでも、それを使うことに固執する
- 大規模コード + Clineは `ls` や `grep` で見つかること自体がノイズ

### 6. デバッグログ食いすぎ

```typescript
console.log("debug: start process")
for (const item of items) {
  console.log("debug: process item", item);
  // ...
}
console.log("debug: end process")
````

**問題点:**

- 自身が生成したプリントデバッグでコンテキストウィンドウを消費
- 書き散らしたデバッグコードを放置する（Claude 3.x 系に顕著）

## 実践的な開発フロー

### 現時点のベストプラクティス

1. **PoC/プロトタイプのコードの生成**

   - 1ファイル完結の800行以内を目安

2. **自分でリファクタしつつ組み込む**

   - 特にインターフェース設計は自分でやる

3. **失敗パターンをプロンプトに反映**

   - 盆栽

4. **成功するパターンのドキュメント化**
   - 再度参照する用に `docs/*.md` を構築

### LLMの限界を理解する

**LLMはコーディングが下手:**

- 低品質コードで設計破綻して自滅
- リファクタリング指針がない
- 不要コードを判定する能力が低い
- モジュール視点でAPI設計ができない
- ユーザー側でリファクタリングしても元の低品質なコードに書き戻す

## Eco Wallet固有の適用方法

### 1. Feature モジュール向けプロンプト例

```markdown
@/src/features/payment に新しい決済機能を追加。
バーティカルスライスアーキテクチャに従い、以下の構造で実装：

1. types/payment-types.ts に型定義を集約（関数型ドメインモデリング）
2. utils/payment-processor.ts に決済ロジック（In Source Testing使用）
3. components/PaymentForm.tsx にUIコンポーネント
4. hooks/usePayment.ts にカスタムフック
5. index.ts で公開APIを定義

各ファイル冒頭に仕様をコメントで記述。
TDDで実装し、`npm test` が常にパスすることを確認。
```

### 2. 既存コードのリファクタリング

```markdown
@/src/features/transactions のコードをリファクタリング。

1. types/index.ts にドメイン型を集約
2. 巨大なコンポーネントを分割（各ファイル800行以内）
3. classベースの実装を関数型に置き換え
4. In Source Testingでテストを追加
5. 不要なexportを削除（tsrで確認）
```

### 3. マイグレーションタスク

```markdown
@/docs/migration-guides/remove-moment.md を参考に、
プロジェクト全体のmoment.jsをdate-fnsに置き換え。

1. grep でmoment使用箇所を特定
2. 各ファイルを順次置き換え
3. テストが通ることを確認
4. 最終的に moment を package.json から削除
```

## 品質管理

### 1. Lintルールでプロンプトをルールベースに変換

例: 自作カスタムルール do-try

```typescript
// doからはじまる関数は try-catch を必須
try {
  const v = await doGetData();
} catch (_err) {}
// 例外中立: doからはじまる関数のみ try catch 免除
async function doMain() {
  await doXXX();
  await doYYY();
}
```

### 2. コード規模の管理

- ファイルは800-1000行を上限とする
- それ以上になる場合は分割を検討
- In Source Testingを使う場合は特に注意

### 3. テストカバレッジ目標

- 新規コードは100%を目指す
- 既存コードは段階的に改善
- カバレッジベースの自動テスト生成を活用

## プログラミングの変質と今後

### より重要になったスキル

- **テスト駆動開発**で開発高速化
- LLMの得意領域/発達段階を予測する技術
- プロンプトエンジニアリング

### 変わっていないこと

- プログラミングの最終的な難易度/複雑性
- 自然言語 to コードで間違いなく学びやすくなっている

### まとめ

- **今はコストと性能がトレードオフ**

  - 一旦は得意なことを任せる
  - AIが苦手なことは（自動化コストを念頭に）人間がやる

- **エンジニアとして生き残るにはコード生成にスキルを寄せる**

  - 自動化成功の見返りは10xどころではない破壊的なもの

- **自動テスト+プロンプトエンジニアリングが高コスパ**
  - [Prompt Engineering Guide](https://www.promptingguide.ai/)
  - [LLMのプロンプトエンジニアリング - O'Reilly Japan](https://www.oreilly.co.jp/books/9784814401130/)

## リソース

- [TypeScript for Cline（元記事）](https://zenn.dev/mizchi/articles/typescript-for-cline)
- [関数型ドメインモデリング](https://www.amazon.co.jp/dp/4048931164)
- [You Don't Need Lodash/Underscore](https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore)
- [@mizchi/readability](https://github.com/mizchi/readability)
- [tsr - TypeScript Remove](https://github.com/line/tsr)
