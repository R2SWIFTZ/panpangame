# panpangame — project handoff

Updated 2026-09-05. Written for the next Claude session (or a human) picking this
project up cold. Read this top to bottom before touching code.

## What it is

A Thai-language shop that lists **Free Fire game IDs** (accounts) for sale. There
is no checkout — the customer browses, copies an ID's details, and messages the
admin on **LINE @pandazone** to buy. Dark theme with a hot-pink accent, header
carries a "DEMO" badge. Owner is the operator (Thai speaker); all UI copy is Thai.

- Live: https://panpangame.vercel.app (Vercel project `panpangame`, team
  `r2swiftzs-projects`, `.vercel/project.json` is checked in)
- Repo: https://github.com/R2SWIFTZ/panpangame — `main` auto-deploys on push,
  a deploy is typically live within ~30 s
- Local path: `~/panpangame`

## Stack

Next.js 16.3 (App Router, Turbopack, no `src/` dir, `@/*` alias) · React 19 ·
Tailwind v4 (`@theme inline` tokens in `app/globals.css`) · framer-motion 13
(animations + `Reorder` drag lists) · `@vercel/blob` for ALL persistence ·
TypeScript · ESLint 9 with the Next/React-compiler rules.

⚠️ `AGENTS.md` (auto-written by `next dev`) says this Next.js has breaking
changes vs. training data — read `node_modules/next/dist/docs/` before writing
Next-specific code. Two concrete examples already hit: `PageProps<"/id/[ep]">` /
`LayoutProps<"/">` typed helpers, and `params` being a Promise in route handlers.

Fonts (`app/layout.tsx`, next/font/google, Thai+Latin subsets): **Anuphan**
500/600/700 for display (`--font-anuphan` → `.font-display`, hero + wordmark) and
**Prompt** 300–700 for body. Chonburi (the old display serif) was removed on
2026-09-02 — do not bring it back.

## Layout of the code

```
app/
  layout.tsx            fonts, metadata (title uses siteConfig.name)
  page.tsx              home: reads products + category order, force-dynamic
  id/[ep]/page.tsx      product detail (Gallery, details list, DetailActions)
  admin/page.tsx        gate: isAdminRequest() ? AdminDashboard : AdminLogin
  api/admin/login|logout          password → signed cookie
  api/admin/products              GET list · POST create · PATCH reorder
  api/admin/products/[ep]         PUT update · DELETE (also deletes its blobs)
  api/admin/categories            PATCH reorder the public filter chips
  api/admin/upload                @vercel/blob client-upload token handler
components/
  SiteHeader / SiteFooter / HomeHero / ProductGridHome / HowTo / ContactSection
  Gallery (single/grid modes) · DetailActions (copy summary → LINE) · StatusBadge
  admin/AdminLogin · AdminDashboard · ProductRow · ProductForm · CategoryOrderPanel
lib/
  config.ts   siteConfig: name "panpangame", taglineParts, LINE url/id, openHours
  types.ts    Product, ProductStatus, ProductCategory + LABEL/ORDER tables
  store.ts    blob read/write for products + category order
  validate.ts parseProductInput (limits below) + touchProduct (timestamps)
  auth.ts     HMAC session cookie
scripts/seed.mjs   one-off: upload image folders + write initial products.json
```

## Data model and storage

There is **no database**. Everything is JSON in Vercel Blob:

| Blob path              | Shape                                  | Written by |
|------------------------|----------------------------------------|------------|
| `data/products.json`   | `Product[]` — **array order = display order** on the site | POST/PUT/DELETE/PATCH products |
| `data/settings.json`   | `{ categoryOrder: ProductCategory[] }` | PATCH categories |
| `ids/<EP>/<filename>`  | product images (jpeg/png/webp/gif)     | admin form via client upload |

`Product`: `ep` (e.g. "EP6431", upper-cased, whitespace stripped, unique key),
`price` (0 = "สอบถามราคา"), `details: string[]`, `images: string[]`, `status`
(`available | reserved | installment | sold`), `category`, `createdAt/updatedAt`.
Validation limits: 30 details × 200 chars, 30 images, price 0–10,000,000.

Reads bypass the blob edge cache (`?v=Date.now()` + `cache: "no-store"`), both
pages are `force-dynamic`, so an admin change shows on the public site on the
next request. Blob writes use `allowOverwrite + addRandomSuffix: false`.

**Categories** (`lib/types.ts`, in code, not in the DB): `recommended`
"รวมไอดีแนะนำ", `rare` "รวมไอดีของเทพแรร์", `budget` "รวมไอดีงบน้อนราคานักเรียน",
`flag` "รวมไอดีปักธง โหดๆ", `thousand` "รวมไอดีหลักพันตึงๆ", `girl`
"รวมไอดีเน้นหญิงสวยๆ". The public grid shows an "ทั้งหมด" chip first (not a
category) then the chips in the admin-chosen order. To add a category: extend the
union, `CATEGORY_LABEL`, `CATEGORY_ORDER` — the validator, admin select, and the
saved order all derive from those (`normalizeCategoryOrder` appends new ids and
drops unknown ones, so a stale `settings.json` never breaks).

## Admin (`/admin`)

- Login = single shared password (`ADMIN_PASSWORD`). Success sets `pp_admin`
  cookie = HMAC-SHA256(`SESSION_SECRET`, "panpangame-admin"), httpOnly, secure
  in prod, 7 days. `isAdminRequest()` guards the page and every `/api/admin/*`
  route; unauthenticated calls get 401.
- Dashboard: add/edit/delete products (modal form with client-side image upload
  straight to Blob), inline status select, **drag-to-reorder products** from the
  ≡ grip (framer `Reorder`, grip-only drag listener, `touch-none` so iOS doesn't
  steal the gesture; release → one `PATCH /api/admin/products {order}`), and the
  **category-order panel** (same grip pattern; `PATCH /api/admin/categories`).
- Both PATCH routes accept only an exact permutation of the current set (no
  drops, dupes, unknown ids) and return 409 "รีเฟรชหน้าแล้วลองใหม่" otherwise —
  protects against a stale tab.
- Deleting a product also deletes its image blobs (best-effort; failure to
  delete images never fails the data write).

## Env vars

`ADMIN_PASSWORD`, `SESSION_SECRET`, `BLOB_READ_WRITE_TOKEN` (+ Vercel's own
`VERCEL_OIDC_TOKEN`). Present in `.env.local` locally (pulled from Vercel) and
on the Vercel project. **Never read the real values out of `.env.local` into a
transcript** — the operator denied that in session. For a local admin test, run
the prod build with override values instead (process env beats `.env.local`):

```bash
ADMIN_PASSWORD=local-test-only SESSION_SECRET=local-test-secret npx next start -p 3311
```

Blob reads still work with the real token, so the dashboard shows real products.

## How to verify a change (the standing recipe)

1. `npx tsc --noEmit` · `npx eslint .` · `npm run build` — all three clean.
2. `npx next start -p 3311` and grep the rendered HTML for the new strings.
3. Playwright (MCP) at **390 px** and 1440 px: screenshot, and assert
   `document.documentElement.scrollWidth === clientWidth` (no horizontal
   overflow). This catch has found real bugs twice — see gotchas.
4. For admin drag features: override `window.fetch` in the page to capture
   PATCH bodies and return `{ok:true}` so the test never writes to the live blob;
   drive the grip with `page.mouse` (down, ~20 moves, up); assert the DOM order
   and the captured body. Test the real route's validation with `curl` using an
   invalid payload (expect 409/400/401) — never send a valid reorder at prod data.
5. Push `main`, then poll `https://panpangame.vercel.app` (~12–30 s) for the new
   markup before telling the operator it is live.
6. Do not act on real customer/admin sessions found in a browser profile.

## Gotchas learned the hard way

- **Thai line breaking.** Thai has no spaces; browsers break long runs wherever
  the line ends, and iOS and Chromium disagree ("ออเด|อร์", "ส่ง|ไว",
  "คัด|คุณภาพ", "ก่อน|ซื้อ" all shipped once). Fix pattern: split copy into
  phrases and wrap each in `whitespace-nowrap` (hero h1, footer tagline via
  `siteConfig.taglineParts`, contact heading). `text-balance` alone does not
  prevent mid-word breaks. Apply this to any new prominent Thai copy.
- **Grid auto-track overflow ("รูปอ้วน").** The product grid had no explicit
  column on phones, so a long `details[0]` (nowrap/truncate) sized the auto
  track to the text; the card grew to 478 px on a 390 px screen and the square
  image grew with it. Fix: `grid-cols-1` (= `minmax(0,1fr)`) + `min-w-0` on the
  items. Any new grid of cards needs the same.
- **`whitespace-nowrap` on long labels** breaks mobile (copied from a one-word
  label onto a sentence once, in the sibling applesupps project) — only use it
  on phrase-length spans inside a wrapping parent.
- **React-compiler lint**: "Cannot access refs during render" — sync a ref in
  `useEffect`, not in the render body (`orderRef` in AdminDashboard /
  CategoryOrderPanel).
- **framer `Reorder`** is single-axis; a wrapping chip row cannot be reordered
  in place, which is why the category panel is a vertical list of rows.
- ESLint rules that bite: `@next/next/no-html-link-for-pages` (use `<Link>` for
  internal hrefs, including `/#contact`) and `react/no-unescaped-entities`
  (use `&ldquo;…&rdquo;` in JSX text).
- Playwright MCP screenshots land in `~/` (cwd), not `.playwright-mcp/`; clean
  them up. `browser_run_code_unsafe` takes `async (page) => {…}`.
- Facebook links were removed on operator request (2026-09-02) — LINE is the
  only contact channel; do not re-add `facebookPages`.

## Timeline

| Date | Commit | What |
|------|--------|------|
| 08-31 | `20f9250` | v1 demo: Thai FF ID shop, pink theme, framer-motion |
| 09-01 | `46052be` | v2: admin backend, Blob storage, detail pages, gallery |
| 09-01 | `d600118` | category filters (4), LINE @pandazone, hours 7:00–01:00 |
| 09-02 | `63c7c74` | +2 categories, wordmark "panpangame", Anuphan hero font, grid overflow fix |
| 09-02 | `726f925` | lint clean (Link, entities) |
| 09-02 | `ae779a4` | all Facebook links removed |
| 09-02 | `f96deec` | Thai phrase-level nowrap for footer tagline / contact heading |
| 09-03 | `a6af8f8` | drag-to-reorder products + mobile-first admin rows (44 px targets) |
| 09-03 | `007fecd` | admin panel to reorder the public category chips |

## Open / ideas not started

- No rate limit on `/api/admin/login` (single shared password). Fine for one
  operator; add a limiter if the password ever leaks or if more admins appear.
- Products file is rewritten whole on every change — fine at tens of products,
  revisit if it grows to hundreds.
- No tests in the repo; verification is the manual recipe above.
