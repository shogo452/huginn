# Huginn

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Built with Astro](https://img.shields.io/badge/Built%20with-Astro-FF5D01.svg?logo=astro)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Powered by Gemini](https://img.shields.io/badge/Powered%20by-Gemini%20AI-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)

> Intelligent RSS Feed Aggregator with AI-powered Tagging
> AIタグ付け機能を備えたインテリジェントRSSフィードアグリゲーター

<p align="center">
  <img src="public/og-image.png" alt="Huginn - RSS Feed Reader" width="600">
</p>

<p align="center">
  <a href="https://shogo452.github.io/huginn/"><strong>Live Demo</strong></a> ·
  <a href="#features--機能">Features</a> ·
  <a href="#getting-started--はじめに">Getting Started</a> ·
  <a href="#deployment--デプロイ">Deploy</a>
</p>

---

## About / このプロジェクトについて

**Huginn** is a modern, static RSS feed reader and aggregator built with Astro. It collects tech articles from multiple sources, automatically tags them using AI (Google Gemini) and keyword matching, and provides a fast, searchable PWA interface with keyboard shortcuts.

**Huginn**は、Astroで構築されたモダンな静的RSSフィードリーダー兼アグリゲーターです。複数のソースから技術記事を収集し、AI（Google Gemini）とキーワードマッチングを使用して自動的にタグ付けを行い、キーボードショートカット対応の高速で検索可能なPWAインターフェースを提供します。

### Name Origin / 名前の由来

| Name | Origin | Image |
|------|--------|-------|
| Huginn | Norse Mythology - Odin's Raven "Thought" | Gathers information from around the world and delivers it to its master |
| Huginn | 北欧神話・オーディンの鴉「思考」 | 世界中の情報を集めて主人に届ける |

---

## Features / 機能

- **Multi-Source RSS Aggregation / マルチソースRSS集約**
  - Fetch articles from multiple RSS feeds simultaneously
  - 複数のRSSフィードから同時に記事を取得

- **Intelligent Auto-Tagging / インテリジェント自動タグ付け**
  - Hybrid approach: keyword matching + AI (Google Gemini)
  - ハイブリッドアプローチ：キーワードマッチング + AI（Google Gemini）

- **Rich User Interface / リッチなユーザーインターフェース**
  - Full-text search, sorting, filtering
  - 全文検索、ソート、フィルタリング
  - Keyboard shortcuts (Vim-like)
  - キーボードショートカット（Vim風）

- **Progressive Web App (PWA) / プログレッシブウェブアプリ**
  - Installable on desktop and mobile
  - デスクトップとモバイルにインストール可能
  - Offline support with service worker
  - Service Workerによるオフラインサポート

- **Read Status Tracking / 既読状態の追跡**
  - Track read articles with localStorage
  - localStorageで既読記事を追跡

- **Dark Mode / ダークモード**
  - Light/Dark theme switching with system preference detection
  - システム設定検出によるライト/ダークテーマ切り替え

- **Per-Keyword RSS Feeds / キーワード別RSSフィード**
  - Generate RSS feeds for each registered keyword
  - 登録されたキーワードごとにRSSフィードを生成
  - Access at `/rss/{keyword}.xml`
  - `/rss/{キーワード}.xml` でアクセス可能

- **SEO Optimized / SEO最適化**
  - Auto-generated sitemap
  - 自動生成サイトマップ
  - Open Graph & Twitter Card meta tags
  - Open Graph & Twitterカードメタタグ
  - JSON-LD structured data
  - JSON-LD構造化データ

---

## Tech Stack / 技術スタック

| Technology | Purpose |
|------------|---------|
| [Astro](https://astro.build/) | Static Site Generator |
| [React](https://react.dev/) | UI Components |
| [TypeScript](https://www.typescriptlang.org/) | Type Safety |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |
| [Google Gemini API](https://ai.google.dev/) | AI Tag Generation |
| [rss-parser](https://github.com/rbren/rss-parser) | RSS Feed Parsing |

---

## Getting Started / はじめに

### Prerequisites / 前提条件

- Node.js 18+
- npm or yarn
- Google API Key (for AI tagging)

### Fork & Clone / フォーク & クローン

```bash
# Fork this repository on GitHub, then clone your fork
# GitHubでこのリポジトリをフォークし、フォークをクローン
git clone https://github.com/YOUR_USERNAME/huginn.git
cd huginn
```

### Installation / インストール

```bash
npm install
```

### Environment Setup / 環境設定

Create `.env` file in the project root:
プロジェクトルートに`.env`ファイルを作成：

```bash
cp .env.example .env
```

Edit `.env` and add your Google API Key:
`.env`を編集してGoogle APIキーを追加：

```
GOOGLE_API_KEY=your_google_api_key_here
```

> **Note / 注意**: You can get a Google API Key from [Google AI Studio](https://aistudio.google.com/apikey)
> Google APIキーは[Google AI Studio](https://aistudio.google.com/apikey)から取得できます

### Development / 開発

```bash
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) in your browser.
ブラウザで [http://localhost:4321](http://localhost:4321) を開きます。

### Build / ビルド

```bash
npm run build
```

### Preview / プレビュー

```bash
npm run preview
```

---

## Configuration / 設定

### Adding/Editing RSS Feeds / RSSフィードの追加・編集

Edit `src/data/feeds.json`:
`src/data/feeds.json`を編集：

```json
[
  {
    "name": "Feed Name",
    "url": "https://example.com/feed.xml",
    "icon": "https://example.com/favicon.ico"
  }
]
```

### Adding Keywords for Tag Matching / タグマッチング用キーワードの追加

Edit `src/data/keywords.json`:
`src/data/keywords.json`を編集：

```json
{
  "NewTag": ["keyword1", "keyword2", "keyword3"]
}
```

### RSS Feeds / RSSフィード

RSS feeds are automatically generated for each keyword defined in `keywords.json`.
`keywords.json`で定義された各キーワードに対してRSSフィードが自動生成されます。

**Access Pattern / アクセスパターン:**
```
/rss/{keyword}.xml
```

**Examples / 例:**
- `/rss/AWS.xml` - Articles tagged with AWS
- `/rss/Docker.xml` - Articles tagged with Docker
- `/rss/Kubernetes.xml` - Articles tagged with Kubernetes

> **Note / 注意**: RSS feeds are generated at build time and won't work in development mode (`npm run dev`). Use `npm run build && npm run preview` to test RSS feeds locally.
> RSSフィードはビルド時に生成されるため、開発モード（`npm run dev`）では動作しません。ローカルでRSSフィードをテストするには`npm run build && npm run preview`を使用してください。

---

## Deployment / デプロイ

### GitHub Pages

This project is configured for GitHub Pages deployment.
このプロジェクトはGitHub Pagesへのデプロイ用に設定されています。

1. Go to your repository Settings > Pages
   リポジトリの Settings > Pages に移動

2. Set Source to "GitHub Actions"
   Source を "GitHub Actions" に設定

3. Add `GOOGLE_API_KEY` to repository secrets (Settings > Secrets and variables > Actions)
   リポジトリのシークレットに`GOOGLE_API_KEY`を追加（Settings > Secrets and variables > Actions）

4. Push to main branch to trigger deployment
   mainブランチにプッシュしてデプロイを実行

> **Note / 注意**: Update `base` in `astro.config.mjs` if your repository name is different.
> リポジトリ名が異なる場合は`astro.config.mjs`の`base`を更新してください。

### Other Platforms / その他のプラットフォーム

Astro supports various deployment targets:
Astroは様々なデプロイ先をサポート：

- [Vercel](https://docs.astro.build/en/guides/deploy/vercel/)
- [Netlify](https://docs.astro.build/en/guides/deploy/netlify/)
- [Cloudflare Pages](https://docs.astro.build/en/guides/deploy/cloudflare/)

---

## Keyboard Shortcuts / キーボードショートカット

| Key | Action |
|-----|--------|
| `j` / `↓` | Next article / 次の記事 |
| `k` / `↑` | Previous article / 前の記事 |
| `o` / `Enter` | Open article / 記事を開く |
| `/` | Search / 検索 |
| `?` | Help / ヘルプ |
| `g h` | Go home / ホームへ |

---

## Project Structure / プロジェクト構造

```
huginn/
├── src/
│   ├── pages/           # Page components / ページコンポーネント
│   ├── layouts/         # Layout components / レイアウトコンポーネント
│   ├── components/      # React components / Reactコンポーネント
│   ├── lib/             # Utilities / ユーティリティ
│   │   ├── feed-fetcher.ts   # RSS fetching / RSS取得
│   │   ├── tag-generator.ts  # Tag generation / タグ生成
│   │   └── cache.ts          # Tag caching / タグキャッシュ
│   └── data/            # Configuration / 設定
│       ├── feeds.json        # Feed sources / フィードソース
│       └── keywords.json     # Tag keywords / タグキーワード
├── public/              # Static assets / 静的アセット
├── scripts/             # Build scripts / ビルドスクリプト
└── astro.config.mjs     # Astro configuration / Astro設定
```

---

## Customization / カスタマイズ

### Changing the Site Title / サイトタイトルの変更

Edit `src/layouts/Layout.astro` and update the `<title>` tag.
`src/layouts/Layout.astro`を編集し、`<title>`タグを更新。

### Changing the Base Path / ベースパスの変更

Edit `astro.config.mjs`:
`astro.config.mjs`を編集：

```javascript
export default defineConfig({
  site: 'https://YOUR_USERNAME.github.io',
  base: '/YOUR_REPO_NAME',
});
```

---

## Contributing / コントリビューション

Contributions are welcome! Feel free to submit issues and pull requests.
コントリビューションを歓迎します！Issueやプルリクエストをお気軽にどうぞ。

---

## License / ライセンス

MIT License - see [LICENSE](LICENSE) for details.

---

## Acknowledgements / 謝辞

- Inspired by Norse mythology and Odin's ravens
  北欧神話とオーディンの鴉からインスピレーション
- Built with [Astro](https://astro.build/)
- AI tagging powered by [Google Gemini](https://ai.google.dev/)
