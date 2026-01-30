# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev          # Development server (localhost:4321)
npm run build        # Production build (includes icon generation)
npm run preview      # Preview production build locally
npm run generate-icons  # Generate PWA icons from SVG source
```

## Architecture Overview

Huginn is a static RSS feed reader built with Astro that aggregates tech articles from various sources. All RSS fetching and processing happens at **build time** - the output is static HTML with client-side filtering/search.

### Data Flow

```
RSS Feeds → RSS Parser → Tag Generation → Cache → Static HTML
                              ↓
                    1. dc:subject tags (from feed)
                    2. Keyword matching (instant)
                    3. Gemini AI (production only, fallback)
```

### Key Directories

- `src/pages/` - Astro routes (file-based routing)
- `src/lib/` - Core logic: feed-fetcher.ts, tag-generator.ts, cache.ts
- `src/data/` - Configuration: feeds.json (sources), keywords.json (tag matching)
- `src/layouts/` - Layout.astro with theme toggle, PWA setup, global styles
- `public/` - Static assets, PWA manifest, service worker
- `.cache/` - Tag cache (tags.json) persisted across builds

### Tag Generation

Hybrid approach with priority:
1. `dc:subject` from RSS feed (if present)
2. Keyword matching against `src/data/keywords.json` (29 tech keywords with aliases)
3. Google Gemini 2.0 Flash API (only in `astro build`, only if no keyword matches)

AI generation is skipped during `npm run dev` and when `GOOGLE_API_KEY` is not set.

### Client-Side Features

- Infinite scroll (20 items per load)
- Search, sort (date/bookmarks), filter (source/unread)
- Read status tracking in localStorage
- Keyboard shortcuts (vim-style: j/k navigation, o to open, / to search, ? for help)
- Dark/light theme with system preference detection

### Deployment

GitHub Actions workflow runs hourly, on push, or manual trigger. Deploys to GitHub Pages at `/huginn/` base path. Requires `GOOGLE_API_KEY` secret for AI tag generation.

### SEO

- `@astrojs/sitemap` generates sitemap at build time
- `public/robots.txt` - Crawler directives with sitemap reference
- `src/layouts/Layout.astro` - Meta tags (OGP, Twitter Card, canonical URL, JSON-LD)
- Each page passes `title` and `description` props to Layout for SEO

## Configuration

- `astro.config.mjs` - Site URL, base path (`/huginn/`), trailing slashes, sitemap
- `src/data/feeds.json` - RSS feed sources
- `src/data/keywords.json` - Keywords and aliases for tag matching
- `.env` - Optional `GOOGLE_API_KEY` for Gemini AI tagging
