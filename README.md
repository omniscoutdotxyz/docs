# OmniScout Docs

The documentation site for [OmniScout](https://omniscout.xyz), live at
[docs.omniscout.xyz](https://docs.omniscout.xyz).

OmniScout is local-first browser control, search, and research for AI agents.
These pages cover installation, the CLI, search and automation, and the hosted
Cloud API.

- **Read the docs:** [docs.omniscout.xyz/en/docs](https://docs.omniscout.xyz/en/docs)
- **Install the CLI:** `pip install omniscout`
- **Product site:** [omniscout.xyz](https://omniscout.xyz)

## What's documented

| Section | Covers |
|---|---|
| Getting started | Installation, overview, first run |
| CLI | Commands, configuration, examples, troubleshooting |
| Search | Web search, extraction, research, memory |
| Automation | Browser control, desktop control, sessions, workflows |
| Agents | Driving OmniScout from an agent, MCP setup |
| Cloud | API overview, quickstart, authentication, endpoints, SDKs, errors, rate limits, billing |

## Run it locally

You need Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:3000/en/docs](http://localhost:3000/en/docs). The bare
`/docs` path redirects to English.

## Project layout

```
content/docs/       Documentation pages, written in MDX
  meta.json         Sidebar order
  search/           A grouped section
app/[lang]/         Routes, one tree per locale
lib/                Locale list, page loading, shared config
components/         MDX components and page actions
```

## Editing a page

Pages are MDX files in `content/docs/`. Top-level pages are flat files
(`cloud.mdx`); related pages live in a folder with their own `meta.json`
(`search/search.mdx`, `search/extraction.mdx`).

Every page starts with frontmatter:

```mdx
---
title: OmniScout CLI
description: Local-first browser control, search, and research for AI agents.
icon: BookOpen
---

Page content starts here.
```

- `title` and `description` appear in the sidebar, page header, and search results.
- `icon` is a [Lucide](https://lucide.dev/icons) icon name.
- To add a page, create the MDX file and list its slug in the nearest `meta.json`.

Use fenced code blocks with a language tag so examples are highlighted and
copyable:

````mdx
```bash
pip install omniscout
```
````

## Translations

English is the source. Other locales are stored next to it, with the locale in
the filename:

| Locale | File |
|---|---|
| English | `cloud.mdx` |
| Japanese | `cloud.ja.mdx` |
| Korean | `cloud.ko.mdx` |
| Russian | `cloud.ru.mdx` |
| Chinese (Simplified) | `cloud.zh-CN.mdx` |

When you change an English page, update its translations in the same commit so
the languages stay in step. The language switcher lists every locale in
`lib/i18n.ts`.

## Checks

```bash
npm run types:check   # TypeScript
npm run build         # Production build
```

Run both before pushing. The build also renders the search index and sitemap.

## Deploy

Hosted on Vercel and deployed from `master`. `vercel.json` pins the Next.js
preset, so no extra configuration is needed.

## For agents and scripts

The site exposes its content in formats that are easy to fetch:

| URL | Returns |
|---|---|
| `/llms.txt` | Index of every page |
| `/llms-full.txt` | All documentation in one file |
| `/<locale>/docs/<page>.md` | That page as Markdown |

Requests to a docs page with `Accept: text/markdown` also return Markdown, and
each page response advertises its Markdown version in a `Link` header.

## Feedback

Found something wrong or missing? Email
[contact@omniscout.xyz](mailto:contact@omniscout.xyz).
