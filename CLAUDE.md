# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # start dev server at localhost:3000
npm run build    # production build
npm run lint     # run ESLint
npm run start    # serve production build
```

No test suite is configured.

## Architecture

**StockIQ** is a single-page stock analysis app built on Next.js 16 (App Router) with React 19 and TypeScript. All data is fetched from Yahoo Finance via `yahoo-finance2`.

### Data flow

`app/page.tsx` exports `Home` which renders `HomeInner` inside `LanguageProvider`. The split exists so `HomeInner` can call `useLanguage()` inside its own provider — don't collapse them into a single component. `HomeInner` holds `selectedSymbol` and `activeView` in local state. `SearchBox` calls `/api/search` with a debounced query; selecting a result sets the symbol.

The four view components (`FinancialReports`, `FundamentalAnalysis`, `StockPrediction`, `RecentNews`) each fetch their own API route when mounted and render independently. They are rendered with `key={`${symbol}-${id}`}` so React fully unmounts and remounts (and re-fetches) whenever the symbol changes — this is intentional, not accidental.

The entire page is wrapped in `LanguageProvider` from `lib/LanguageContext.tsx`. All UI strings are accessed via `useLanguage()` → `t.<key>`, enabling EN/ZH toggle. Adding a new string requires updating the `Translations` interface and both `en` and `zh` locale objects in that file.

### API routes (`app/api/*/route.ts`)

All routes are GET handlers using `NextRequest`/`NextResponse` and instantiate `new YahooFinance()` at module scope (once per cold start, not per request). The `yahoo-finance2` typings for `historical()` are incomplete upstream, so `(yahooFinance.historical as any)` casts are expected and intentional.

| Route | Yahoo Finance call | Purpose |
|---|---|---|
| `/api/search` | `yahooFinance.search()` | Ticker/company lookup, filters to EQUITY + ETF |
| `/api/financials` | `yahooFinance.quoteSummary()` | Income statement, balance sheet, cash flow history |
| `/api/fundamentals` | `yahooFinance.quote()` + `quoteSummary()` | Valuation, profitability, health metrics |
| `/api/prediction` | `yahooFinance.historical()` | 6-month OHLCV; computes SMA, RSI, Bollinger Bands server-side |
| `/api/news` | `yahooFinance.search()` | 10 latest news items for the ticker |

Technical indicators (SMA, RSI, Bollinger Bands, momentum) are computed from scratch in `app/api/prediction/route.ts` — no indicator library is used.

### Components (`components/`)

All components are `"use client"` and follow the same pattern: fetch on mount, render loading/error/data states.

- `SearchBox` — debounced search input with dropdown
- `FinancialReports` — tabbed table view (income / balance sheet / cash flow) plus an earnings beat/miss history section below the tabs
- `FundamentalAnalysis` — metric card grid with valuation, profitability, health, trading sections
- `StockPrediction` — signal cards + Recharts `ComposedChart` (price/RSI/volume tabs)
- `RecentNews` — list of 10 latest news articles linking out to source

### Shared utilities

`lib/utils.ts`:
- `cn()` — Tailwind class merging via `clsx` + `tailwind-merge`
- `formatNumber(n)` — formats to $T/$B/$M/$K with 2 decimals; does not guard against `null`/`undefined`
- `formatPercent(n)` — multiplies by 100 and appends `%`; does not guard against `null`/`undefined`
- `formatRatio(n)` — appends `x`

Path alias `@/` maps to the project root (standard Next.js tsconfig paths).

`lib/LanguageContext.tsx` — React context providing EN/ZH translations. Exports `LanguageProvider`, `useLanguage()` hook, `Lang` type, and `Translations` interface.

### Styling

Tailwind CSS v4 (configured via `@tailwindcss/postcss`). No `tailwind.config` file — v4 uses CSS-first configuration. Component classes are written inline with Tailwind utilities.
