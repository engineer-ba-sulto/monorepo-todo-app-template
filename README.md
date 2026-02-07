# Monorepo Todo App Template

Cloudflare Workers（Hono）、Next.js、Expo（React Native）、Drizzle ORM、Bun を使ったモノレポの Todo アプリテンプレートです。

## 技術スタック (Tech Stack)

### Core
- **Runtime & パッケージマネージャ:** [Bun](https://bun.com)（推奨: `packageManager` に記載のバージョン）
- **モノレポ:** [Bun Workspaces](https://bun.sh/docs/install/workspaces)
- **Lint / フォーマット:** [Biome](https://biomejs.dev)

### Apps

#### API (`apps/api`)
- **Platform:** [Cloudflare Workers](https://workers.cloudflare.com)
- **Framework:** [Hono](https://hono.dev)
- **Database:** [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite)
- **ORM:** Drizzle ORM（`@workspace/db`）
- **Validation:** [@hono/zod-validator](https://github.com/honojs/middleware/tree/main/packages/zod-validator) + Zod
- **静的アセット:** `wrangler.jsonc` の `assets.directory` で `./public` をバインディング

#### Frontend (`apps/frontend`)
- **Framework:** [Next.js](https://nextjs.org) (v16) App Router
- **Deployment:** Cloudflare Pages（[@opennextjs/cloudflare](https://opennext.js.org) でビルド・デプロイ）
- **UI:** React 19 / [Radix UI](https://www.radix-ui.com)（[shadcn/ui](https://ui.shadcn.com) 系・`components.json`）
- **Styling:** [Tailwind CSS](https://tailwindcss.com) (v4)
- **Icons:** [Lucide React](https://lucide.dev)
- **API 連携:** `src/lib/actions.ts` 等で API（`/api/todos`）を呼び出し

#### Mobile (`apps/mobile`)
- **Framework:** [Expo](https://expo.dev) (SDK 55) + [Expo Router](https://docs.expo.dev/router/introduction/)（ファイルベースルーティング）
- **UI:** React 19 / React Native（[Gluestack UI](https://gluestack.io) 等のコンポーネント利用可）
- **Styling:** [NativeWind](https://www.nativewind.dev) (Tailwind for React Native)
- **共有:** `@workspace/db` / `@workspace/validators` を利用
- **プラットフォーム:** iOS / Android / Web（Expo Go または開発ビルドで動作）

### Packages（共有ライブラリ）

#### Database (`packages/db`)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team)
- **マイグレーション:** Drizzle Kit（`migrations_dir` は `apps/api/wrangler.jsonc` から参照）
- **ID 生成:** nanoid
- **テスト:** Vitest（`packages/db` で `bun test` または `vitest` で実行）

#### Validators (`packages/validators`)
- **Validation:** [Zod](https://zod.dev) (v4)
- API・Frontend・Mobile で共有するバリデーションスキーマ

## プロジェクト構造 (File Structure)

```
.
├── apps/
│   ├── api/                     # Hono API（Cloudflare Workers）
│   │   ├── src/index.ts         # エントリ・ルート定義（/api/todos CRUD）
│   │   ├── public/               # 静的アセット（Assets バインディング）
│   │   ├── wrangler.jsonc       # Workers 設定（D1・migrations_dir 等）
│   │   └── worker-configuration.d.ts
│   ├── frontend/                # Next.js（Cloudflare Pages）
│   │   ├── src/app/             # App Router（layout.tsx, page.tsx）
│   │   ├── src/components/      # UI（todo-table, ui/）
│   │   ├── src/lib/             # actions.ts, utils.ts
│   │   ├── open-next.config.ts  # OpenNext for Cloudflare
│   │   ├── cloudflare-env.d.ts
│   │   └── wrangler.jsonc      # Pages デプロイ設定
│   └── mobile/                  # Expo（React Native）
│       ├── src/app/             # Expo Router（_layout.tsx, index.tsx）
│       ├── src/components/      # UI（gluestack-ui 等）
│       ├── app.json              # Expo 設定
│       ├── metro.config.js       # Metro バンドラ
│       └── tailwind.config.js
├── packages/
│   ├── db/                      # Drizzle スキーマ・マイグレーション
│   │   ├── src/schema/          # テーブル定義
│   │   └── src/migrations/      # D1 に適用する SQL
│   └── validators/              # 共有 Zod スキーマ
├── package.json                 # ルート・Workspaces 定義
├── bunfig.toml                  # Bun ランタイム・インストール設定（後述）
├── biome.json                   # Biome 設定
├── tsconfig.json                # ルート型チェック用
└── bun.lock
```

### Bun 設定 (bunfig.toml)

ルートの `bunfig.toml` で Bun のインストール挙動を指定しています。

- **`[install] linker = "isolated"`**  
  各ワークスペース（パッケージ）ごとに `node_modules` がホイストされず、パッケージ単位で依存がインストールされます。Bun の「既存プロジェクトでは `configVersion` が 0 のとき非 isolated」という判定に依存せず、常に isolated で統一するために設定しています。

詳細は公式ドキュメントを参照してください: [Bun - bunfig](https://bun.com/docs/runtime/bunfig)

## セットアップと開発 (Getting Started)

### 1. 依存関係のインストール

```bash
bun install
```

### 2. データベース（D1）の準備

- Cloudflare ダッシュボードで D1 データベースを作成するか、`wrangler d1 create monorepo-todo-db` で作成。
- `apps/api/wrangler.jsonc` の `d1_databases[].database_id` を実際の ID に合わせて変更。
- マイグレーションは `packages/db` で生成し、Workers の `wrangler.jsonc` の `migrations_dir` から参照されます。

### 3. 開発サーバーの起動

**ルートから一括起動（API と Frontend のみ）:**

`bun run dev` は各ワークスペースの `dev` スクリプトを並列実行します。`dev` を持つのは API と Frontend のみです。

```bash
bun run dev
```

- **API:** `http://localhost:8787`（Wrangler の既定）
- **Frontend:** `http://localhost:3000`（開発時は API を `http://localhost:8787` で参照）

**Mobile（Expo）の起動:**

Mobile は `dev` ではなく `start` で起動します。

```bash
bun run start
```

または `apps/mobile` で個別に:

```bash
cd apps/mobile && bun run start   # 開発サーバー起動（Expo Go / シミュレータ用）
bun run ios                       # iOS シミュレータ
bun run android                   # Android エミュレータ
bun run web                       # Web ビルド
```

**個別に起動する場合（API / Frontend）:**

```bash
# API (Backend)
cd apps/api && bun run dev

# Frontend
cd apps/frontend && bun run dev
```

- Mobile: Expo 開発サーバー起動後、Expo Go またはシミュレータで接続

### 4. データベース・マイグレーション

スキーマ変更後にマイグレーションを生成する場合:

```bash
cd packages/db
bunx drizzle-kit generate
```

生成された SQL は `packages/db/src/migrations/` に出力され、`apps/api` の D1 設定から参照されます。
ローカルに DB を作成するには、`apps/api` で以下を実行してください。

```bash
cd apps/api
npx wrangler d1 migrations apply monorepo-todo-db --local
```

本番への適用は `wrangler d1 execute` やデプロイ時の自動適用で行えます。

## API エンドポイント

| メソッド | パス             | 説明                  |
| -------- | ---------------- | --------------------- |
| GET      | `/api/todos`     | 一覧取得              |
| GET      | `/api/todos/:id` | 1件取得               |
| POST     | `/api/todos`     | 新規作成（JSON body） |
| PUT      | `/api/todos/:id` | 更新（JSON body）     |
| DELETE   | `/api/todos/:id` | 削除                  |

ベースパスは Hono の `basePath("/api")` に合わせています。

## Scripts（ルート）

| コマンド             | 説明                                                                    |
| -------------------- | ----------------------------------------------------------------------- |
| `bun run dev`        | 各ワークスペースの `dev` を並列実行（API・Frontend。Mobile は `start`） |
| `bun run start`      | Mobile（Expo）の開発サーバー起動（`apps/mobile` で `expo start -c`）    |
| `bun run check`      | Biome でチェック（`biome check .`）                                     |
| `bun run check:fix`  | Biome チェック＋自動修正                                                |
| `bun run format`     | Biome フォーマット                                                      |
| `bun run format:fix` | フォーマット＋自動修正                                                  |
| `bun run lint`       | Biome リント                                                            |
| `bun run lint:fix`   | リント＋自動修正                                                        |
| `bun run typecheck`  | ルートの TypeScript 型チェック（`tsc --noEmit`）                        |

## デプロイ

- **API:** `cd apps/api && bun run deploy`（Wrangler で Cloudflare Workers にデプロイ）
  - Cloudflare 上に DB を構築するには、`apps/api` で `npx wrangler d1 migrations apply monorepo-todo-db --remote` を実行してください。
- **Frontend:** `cd apps/frontend && bun run deploy`（OpenNext でビルド後、Cloudflare Pages にデプロイ）
  - `apps/frontend` では `bun run upload`（ビルド＋アップロード）、`bun run preview`（ビルド＋プレビュー）も利用可
- **Mobile:** Expo の [EAS Build](https://docs.expo.dev/build/introduction/) やストア向けビルドは `apps/mobile` で別途設定

### 型生成（Cloudflare バインディング）

- **API:** `cd apps/api && bun run cf-typegen`
- **Frontend:** `cd apps/frontend && bun run cf-typegen`
