# Monorepo Todo App Template

Cloudflare Workers (Hono), Next.js, Drizzle ORM, Bun を使用した最新のモダンな Todo アプリケーションのモノレポテンプレートです。

## 技術スタック (Tech Stack)

### Core
- **Runtime & Package Manager:** [Bun](https://bun.com)
- **Monorepo Management:** Bun Workspaces
- **Linter & Formatter:** [Biome](https://biomejs.dev)

### Apps

#### API (`apps/api`)
- **Platform:** [Cloudflare Workers](https://workers.cloudflare.com)
- **Framework:** [Hono](https://hono.dev)
- **Database:** [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite)
- **ORM:** Drizzle ORM (via `@workspace/db`)

#### Frontend (`apps/frontend`)
- **Framework:** [Next.js](https://nextjs.org) (v15)
- **Deployment:** Cloudflare Pages (via [@opennextjs/cloudflare](https://opennext.js.org))
- **UI Library:** React 19
- **Styling:** [Tailwind CSS](https://tailwindcss.com) (v4)
- **Icons:** [Lucide React](https://lucide.dev)

### Packages (Shared Libraries)

#### Database (`packages/db`)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team)
- **Migration:** Drizzle Kit
- **Utils:** `nanoid` (ID Generation)
- **Testing:** Vitest

#### Validators (`packages/validators`)
- **Validation:** [Zod](https://zod.dev)
- APIとFrontend間で共有されるバリデーションスキーマ

## プロジェクト構造 (File Structure)

```
.
├── apps/
│   ├── api/            # Hono API Backend (Cloudflare Workers)
│   └── frontend/       # Next.js Frontend (Cloudflare Pages)
├── packages/
│   ├── db/             # Drizzle ORM Schema, Migrations, DB Config
│   └── validators/     # Shared Zod Schemas
├── package.json        # Root config & Workspaces definition
├── biome.json          # Biome configuration (Lint/Format)
└── bun.lock            # Lock file
```

## セットアップと開発 (Getting Started)

### 1. 依存関係のインストール

```bash
bun install
```

### 2. 環境変数の設定

Cloudflare D1 やその他の環境変数の設定が必要な場合があります。`wrangler.jsonc` や `.env` ファイルを確認してください。

### 3. 開発サーバーの起動

**API (Backend):**
```bash
cd apps/api
bun run dev
```

**Frontend:**
```bash
cd apps/frontend
bun run dev
```

### 4. データベース管理

Drizzle Kit を使用してマイグレーションを管理します。

```bash
cd packages/db
# マイグレーションの生成 (schema変更時)
bun drizzle-kit generate

# ローカルDBへの適用など (設定による)
# ...
```

## Scripts (Root)

ルートディレクトリから実行可能なコマンド:

- `bun run check`: Biomeによるコードチェック
- `bun run format`: コードフォーマット
- `bun run lint`: リントチェック