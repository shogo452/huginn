# Huginn

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Built with Astro](https://img.shields.io/badge/Built%20with-Astro-FF5D01.svg?logo=astro)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Powered by Gemini](https://img.shields.io/badge/Powered%20by-Gemini%20AI-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)

> Intelligent RSS Feed Aggregator with AI-powered Tagging

<p align="center">
  <img src="public/og-image.png" alt="Huginn - RSS Feed Reader" width="600">
</p>

<p align="center">
  <a href="https://shogo452.github.io/huginn/"><strong>Live Demo</strong></a> ·
  <a href="#features">Features</a> ·
  <a href="#getting-started">Getting Started</a> ·
  <a href="#deployment">Deploy</a>
</p>

---

## About

**Huginn** is a modern, static RSS feed reader and aggregator built with Astro. It collects tech articles from multiple sources, automatically tags them using AI (Google Gemini) and keyword matching, and provides a fast, searchable PWA interface with keyboard shortcuts.

### Name Origin

| Name | Origin | Image |
|------|--------|-------|
| Huginn | Norse Mythology - Odin's Raven "Thought" | Gathers information from around the world and delivers it to its master |

---

## Features

- **Multi-Source RSS Aggregation**
  - Fetch articles from multiple RSS feeds simultaneously

- **Intelligent Auto-Tagging**
  - Hybrid approach: keyword matching + AI (Google Gemini)

- **Rich User Interface**
  - Full-text search, sorting, filtering
  - Keyboard shortcuts (Vim-like)

- **Progressive Web App (PWA)**
  - Installable on desktop and mobile
  - Offline support with service worker

- **Read Status Tracking**
  - Track read articles with localStorage

- **Dark Mode**
  - Light/Dark theme switching with system preference detection

- **Per-Keyword RSS Feeds**
  - Generate RSS feeds for each registered keyword
  - Access at `/rss/{keyword}.xml`

- **SEO Optimized**
  - Auto-generated sitemap
  - Open Graph & Twitter Card meta tags
  - JSON-LD structured data

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [Astro](https://astro.build/) | Static Site Generator |
| [React](https://react.dev/) | UI Components |
| [TypeScript](https://www.typescriptlang.org/) | Type Safety |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |
| [Google Gemini API](https://ai.google.dev/) | AI Tag Generation |
| [rss-parser](https://github.com/rbren/rss-parser) | RSS Feed Parsing |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Google API Key (for AI tagging)

### Fork & Clone

```bash
# Fork this repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/huginn.git
cd huginn
```

### Installation

```bash
npm install
```

### Environment Setup

Create `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your Google API Key:

```
GOOGLE_API_KEY=your_google_api_key_here
```

> **Note**: You can get a Google API Key from [Google AI Studio](https://aistudio.google.com/apikey)

### Development

```bash
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) in your browser.

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

---

## Configuration

### Adding/Editing RSS Feeds

Edit `src/data/feeds.json`:

```json
[
  {
    "name": "Feed Name",
    "url": "https://example.com/feed.xml",
    "icon": "https://example.com/favicon.ico"
  }
]
```

### Adding Keywords for Tag Matching

Edit `src/data/keywords.json`:

```json
{
  "NewTag": ["keyword1", "keyword2", "keyword3"]
}
```

### RSS Feeds

RSS feeds are automatically generated for each keyword defined in `keywords.json`.

**Access Pattern:**
```
/rss/{keyword}.xml
```

**Examples:**
- `/rss/AWS.xml` - Articles tagged with AWS
- `/rss/Docker.xml` - Articles tagged with Docker
- `/rss/Kubernetes.xml` - Articles tagged with Kubernetes

> **Note**: RSS feeds are generated at build time and won't work in development mode (`npm run dev`). Use `npm run build && npm run preview` to test RSS feeds locally.

---

## Deployment

### GitHub Pages

This project is configured for GitHub Pages deployment.

1. Go to your repository Settings > Pages

2. Set Source to "GitHub Actions"

3. Add `GOOGLE_API_KEY` to repository secrets (Settings > Secrets and variables > Actions)

4. Push to main branch to trigger deployment

> **Note**: Update `base` in `astro.config.mjs` if your repository name is different.

### Other Platforms

Astro supports various deployment targets:

- [Vercel](https://docs.astro.build/en/guides/deploy/vercel/)
- [Netlify](https://docs.astro.build/en/guides/deploy/netlify/)
- [Cloudflare Pages](https://docs.astro.build/en/guides/deploy/cloudflare/)

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `j` / `↓` | Next article |
| `k` / `↑` | Previous article |
| `o` / `Enter` | Open article |
| `/` | Search |
| `?` | Help |
| `g h` | Go home |

---

## Project Structure

```
huginn/
├── src/
│   ├── pages/           # Page components
│   ├── layouts/         # Layout components
│   ├── components/      # React components
│   ├── lib/             # Utilities
│   │   ├── feed-fetcher.ts   # RSS fetching
│   │   ├── tag-generator.ts  # Tag generation
│   │   └── cache.ts          # Tag caching
│   └── data/            # Configuration
│       ├── feeds.json        # Feed sources
│       └── keywords.json     # Tag keywords
├── public/              # Static assets
├── scripts/             # Build scripts
└── astro.config.mjs     # Astro configuration
```

---

## Customization

### Changing the Site Title

Edit `src/layouts/Layout.astro` and update the `<title>` tag.

### Changing the Base Path

Edit `astro.config.mjs`:

```javascript
export default defineConfig({
  site: 'https://YOUR_USERNAME.github.io',
  base: '/YOUR_REPO_NAME',
});
```

---

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Acknowledgements

- Inspired by Norse mythology and Odin's ravens
- Built with [Astro](https://astro.build/)
- AI tagging powered by [Google Gemini](https://ai.google.dev/)
