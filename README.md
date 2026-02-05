# Monorepo Todo App Template

Cloudflare Workers（Hono）、Next.js、Drizzle ORM、Bun を使ったモノレポの Todo アプリテンプレートです。

## 技術スタック (Tech Stack)

### Core
- **Runtime & パッケージマネージャ:** [Bun](https://bun.com)
- **モノレポ:** Bun Workspaces
- **Lint / フォーマット:** [Biome](https://biomejs.dev)

### Apps

#### API (`apps/api`)
- **Platform:** [Cloudflare Workers](https://workers.cloudflare.com)
- **Framework:** [Hono](https://hono.dev)
- **Database:** [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite)
- **ORM:** Drizzle ORM（`@workspace/db`）
- **Validation:** [@hono/zod-validator](https://github.com/honojs/middleware/tree/main/packages/zod-validator) + Zod

#### Frontend (`apps/frontend`)
- **Framework:** [Next.js](https://nextjs.org) (v16)
- **Deployment:** Cloudflare Pages (via [@opennextjs/cloudflare](https://opennext.js.org))
- **UI:** React 19 / [Radix UI](https://www.radix-ui.com)（shadcn/ui 系）
- **Styling:** [Tailwind CSS](https://tailwindcss.com) (v4)
- **Icons:** [Lucide React](https://lucide.dev)

### Packages（共有ライブラリ）

#### Database (`packages/db`)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team)
- **マイグレーション:** Drizzle Kit
- **ID 生成:** nanoid
- **テスト:** Vitest

#### Validators (`packages/validators`)
- **Validation:** [Zod](https://zod.dev) (v4)
- API と Frontend で共有するバリデーションスキーマ

## プロジェクト構造 (File Structure)

```
.
├── apps/
│   ├── api/                 # Hono API（Cloudflare Workers）
│   │   ├── src/index.ts     # エントリ・ルート定義
│   │   ├── public/          # 静的アセット（Assets バインディング）
│   │   └── wrangler.jsonc   # Workers 設定（D1 バインディング等）
│   └── frontend/            # Next.js（Cloudflare Pages）
│       ├── src/app/         # App Router
│       ├── src/components/ # UI コンポーネント
│       └── wrangler.jsonc   # Pages デプロイ設定
├── packages/
│   ├── db/                  # Drizzle スキーマ・マイグレーション
│   │   └── src/migrations/   # D1 に適用する SQL
│   └── validators/          # 共有 Zod スキーマ
├── package.json             # ルート・Workspaces 定義
├── biome.json               # Biome 設定
└── bun.lock
```

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

**ルートから一括起動（全ワークスペースの dev）:**

```bash
bun run dev
```

**個別に起動する場合:**

```bash
# API (Backend)
cd apps/api && bun run dev

# Frontend
cd apps/frontend && bun run dev
```

- API: 通常は `http://localhost:8787`（wrangler の既定）
- Frontend: `http://localhost:3000`

### 4. データベース・マイグレーション

スキーマ変更後にマイグレーションを生成する場合:

```bash
cd packages/db
bunx drizzle-kit generate
```

生成された SQL は `packages/db/src/migrations/` に出力され、`apps/api` の D1 設定から参照されます。ローカルや本番への適用は `wrangler d1 execute` やデプロイ時の自動適用で行えます。

## API エンドポイント

| メソッド | パス | 説明 |
|----------|------|------|
| GET | `/api/todos` | 一覧取得 |
| GET | `/api/todos/:id` | 1件取得 |
| POST | `/api/todos` | 新規作成（JSON body） |
| PUT | `/api/todos/:id` | 更新（JSON body） |
| DELETE | `/api/todos/:id` | 削除 |

ベースパスは Hono の `basePath("/api")` に合わせています。

## Scripts（ルート）

| コマンド | 説明 |
|----------|------|
| `bun run dev` | 全ワークスペースの `dev` を並列実行 |
| `bun run check` | Biome でチェック |
| `bun run check:fix` | チェック＋自動修正 |
| `bun run format` | フォーマット |
| `bun run format:fix` | フォーマット＋自動修正 |
| `bun run lint` | リント |
| `bun run lint:fix` | リント＋自動修正 |
| `bun run typecheck` | TypeScript 型チェック（`tsc --noEmit`） |

## デプロイ

- **API:** `cd apps/api && bun run deploy`（Wrangler で Workers にデプロイ）
- **Frontend:** `cd apps/frontend && bun run deploy`（OpenNext で Cloudflare Pages にデプロイ）

型生成（Cloudflare バインディング）:

- API: `cd apps/api && bun run cf-typegen`
- Frontend: `cd apps/frontend && bun run cf-typegen`