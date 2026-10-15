# panpangame — project handoff

Updated 2026-10-15. Written for the next Claude session (or a human) picking this
project up cold. Read this top to bottom before touching code.

## What it is

A Thai-language shop that lists **Free Fire game IDs** (accounts) for sale. There
is no checkout — the customer browses, copies an ID's details, and messages the
admin on **LINE @pandazone** to buy. Dark theme with a hot-pink accent. Owner is
the operator (Thai speaker); all UI copy is Thai. **Production, real customers**
since 2026-09-13 (the DEMO badge and demo footer note were removed then).

- Live: **https://panpangame.com** (custom domain since 2026-09-13; the old
  https://panpangame.vercel.app still serves and is what Vercel calls the
  project — `panpangame`, team `r2swiftzs-projects`, `.vercel/project.json`
  is checked in). `www.panpangame.com` → 308 → apex; http → 308 → https.
- Repo: https://github.com/R2SWIFTZ/panpangame — `main` auto-deploys on push,
  a deploy is typically live within ~30 s. ⚠️ The GitHub→Vercel hook has
  silently NOT fired once (2026-09-07): if `vercel ls panpangame` shows no new
  deployment a minute after the push, run `vercel --prod --yes` from the repo
  (`.vercel/project.json` links it) — same result, no config change needed.
- Local path: `~/panpangame`

## Domain / DNS (Cloudflare → Vercel)

Registrar + DNS = **Cloudflare**, zone `panpangame.com` (zone id
`f9be57a574c8216da39e376670fbb34e`, account `325346038d298bee7af0a29ee7323a1f`,
NS amos/fiona.ns.cloudflare.com). Hosting stays on Vercel. Records:

| Type  | Name | Content                 | Proxy    |
|-------|------|-------------------------|----------|
| A     | @    | 76.76.21.21             | DNS only |
| CNAME | www  | cname.vercel-dns.com    | DNS only |

Zone settings: SSL mode **Full**, Always Use HTTPS **on**. Records are
deliberately **DNS only (grey cloud)** so Vercel terminates TLS and issues the
cert itself; turning the orange proxy on would double-proxy and can break
Vercel's cert renewal — leave it off unless there is a specific reason. The
www→apex redirect lives on the Vercel side (project domain `redirect` field,
308), not in Cloudflare rules.

How Claude talks to Cloudflare: the official plugin (`claude plugin install
cloudflare@cloudflare`) exposes an `execute` tool that calls the Cloudflare API
with the operator's OAuth grant — that is how the records above were created.
If the tool set shows only `authenticate`, run it, hand the operator the link,
and paste the callback URL into `complete_authentication` (the localhost
redirect page never loads; the URL in the address bar is what matters).
`wrangler` is also installed and logged in, but its OAuth token cannot edit
DNS (zone:read only) — use the plugin for DNS.

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
  layout.tsx            fonts, metadata: title "panpangame - ซื้อขายรหัส Free Fire",
                        metadataBase = siteConfig.url, og:image + twitter card → /og.jpg
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
  CategoryChips  the "ทั้งหมด + categories" filter row — ONE component shared by
                 ProductGridHome (storefront) and AdminDashboard, so they never drift
  Gallery (single/grid modes) · DetailActions (copy summary → LINE) · StatusBadge
  admin/AdminLogin · AdminDashboard · ProductRow · ProductForm · CategoryOrderPanel
lib/
  config.ts   siteConfig: name "panpangame", url, taglineParts, LINE url/id, openHours
  types.ts    Product, ProductStatus, ProductCategory + LABEL/ORDER tables
  store.ts    blob read/write for products + category order
  validate.ts parseProductInput (limits below) + touchProduct (timestamps)
  auth.ts     HMAC session cookie
scripts/seed.mjs   one-off: upload image folders + write initial products.json
public/og.jpg      link-preview image — the Panda Zone artwork on white, 1200x1200,
                   ~175 KB (replaced the pink poster on 2026-09-18)
app/favicon.ico · app/icon.png (192) · app/apple-icon.png (180)
                   same artwork, Next app-icon file conventions (auto <link> tags)
```

## Data model and storage

There is **no database**. Everything is JSON in Vercel Blob:

| Blob path              | Shape                                  | Written by |
|------------------------|----------------------------------------|------------|
| `data/products.json`   | `Product[]` — **array order = display order** on the site | POST/PUT/DELETE/PATCH products |
| `data/settings.json`   | `{ categoryOrder: ProductCategory[] }` | PATCH categories |
| `ids/<EP>/<filename>`  | product images (jpeg/png/webp/gif)     | admin form via client upload |

`Product`: `ep` (e.g. "EP6431", upper-cased, whitespace stripped, unique key),
`price` (0 = "สอบถามราคา"), `installmentPrice` ("ราคาเปิดผ่อนเล่น", 0 = not
offered → hidden everywhere; added 2026-10-13, `readProducts` defaults missing
values to 0 so old rows never surface `undefined`), `details: string[]`,
`images: string[]`, `status` (`available | reserved | installment | sold`),
`category`, `createdAt/updatedAt`. Validation limits: 30 details × 200 chars,
30 images, price and installmentPrice 0–10,000,000 (installmentPrice may be
omitted → 0). The label lives once in `INSTALLMENT_LABEL` (`lib/types.ts`);
customer-side it shows under the main price on the grid card, the detail page,
and in the copied LINE summary — only when > 0.

Reads bypass the blob edge cache (`?v=Date.now()` + `cache: "no-store"`), both
pages are `force-dynamic`, so an admin change shows on the public site on the
next request. Blob writes use `allowOverwrite + addRandomSuffix: false`.

**Categories** (`lib/types.ts`, in code, not in the DB): `recommended`
"รวมไอดีแนะนำ", `rare` "รวมไอดีของเทพแรร์", `budget` "รวมไอดีงบน้อนราคานักเรียน",
`flag` "รวมไอดีปักธง โหดๆ", `thousand` "รวมไอดีหลักพันตึงๆ", `girl`
"รวมไอดีเน้นหญิงสวยๆ", `prime8` "ไอดี Prime 8" (added 2026-09-18 — note the label
has no "รวม" prefix, that is what the operator asked for). The public grid shows an
"ทั้งหมด" chip first (not a category) then the chips in the admin-chosen order. To
add a category: extend the union, `CATEGORY_LABEL`, `CATEGORY_ORDER` — the
validator, admin select, and the saved order all derive from those
(`normalizeCategoryOrder` appends new ids and drops unknown ones, so a stale
`settings.json` never breaks). A new category lands LAST in the chip row until the
operator drags it into place in the admin panel — tell them that when adding one.

## Admin (`/admin`)

- Login = single shared password (`ADMIN_PASSWORD`). Success sets `pp_admin`
  cookie = HMAC-SHA256(`SESSION_SECRET`, "panpangame-admin"), httpOnly, secure
  in prod, 7 days. `isAdminRequest()` guards the page and every `/api/admin/*`
  route; unauthenticated calls get 401.
- **EP search** (2026-10-13) above the category chips: live filter on the EP
  string, normalised like the validator (upper-case, whitespace stripped) so
  "ep 64" matches EP6431; combines with the category chip. The "ค้นหา" button
  only submits the form (prevented) — it exists so phone keyboards get a
  search key; "ล้าง" clears. Dragging while a search is active reorders the
  matched subset within its existing slots (same `reorderShown` path as a
  category filter).
- Dashboard: add/edit/delete products (modal form with client-side image upload
  straight to Blob, incl. the "ราคาเปิดผ่อนเล่น" field), inline status select, **drag-to-reorder products** from the
  ≡ grip (framer `Reorder`, grip-only drag listener, `touch-none` so iOS doesn't
  steal the gesture; release → one `PATCH /api/admin/products {order}`), and the
  **category-order panel** (same grip pattern; `PATCH /api/admin/categories`).
- **Category filter chips** (2026-09-18) above the product list — the same
  `CategoryChips` row as the storefront. Pick a category and the list shows only
  its products, in the exact order a customer sees after tapping the same chip.
  Dragging in a filtered view reorders **within that category only**: the moved
  subset refills the slots the category already occupies in the full array
  (`reorderShown` in AdminDashboard), other categories keep their positions, and
  the PATCH still sends the full EP list. `reorderShown` skips a hover-swap whose
  subset no longer matches the list (a delete resolving mid-drag) instead of
  dropping a product. framer's `Reorder.Group` prunes its layout map against
  `values` on every render, so switching the filter needs no remount. "＋
  เพิ่มรหัสใหม่" while filtered preselects that category in the form
  (`defaultCategory`). The
  chip order state lives in AdminDashboard and `CategoryOrderPanel` is controlled
  (`order`/`onOrderChange`), so the chips follow a panel drag immediately.
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
  image grew with it. Fix: an explicit `grid-cols-N` (= `minmax(0,1fr)`) +
  `min-w-0` on the items. Any new grid of cards needs the same. Since
  2026-10-15 the home grid is `grid-cols-2` on phones (two cards per row, as
  the operator asked, matching competitor shops) and `lg:grid-cols-3`; the card
  footer stacks EP/details above the price below `sm` so both fit at half
  width.
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
- **Link previews.** Without an explicit `og:image` chat apps scraped the first
  product photo. `public/og.jpg` + `metadataBase` fixed it (2026-09-07). LINE /
  Messenger / Instagram cache previews for hours–days; to force a refresh share
  the URL with a throwaway query (`/?v=2`). To change the preview image,
  replace `public/og.jpg` (keep it square, ≤ ~300 KB) — nothing else to edit.
  2026-09-18: swapped to the Panda Zone artwork; the icons were regenerated from
  the same source with Pillow (trim near-white margins, pad to square on white).
- **favicon.ico under Turbopack.** `next build` decodes `app/favicon.ico` and
  rejects an ICO whose frames are PNG-compressed RGB ("Processing image failed
  … The PNG is not in RGBA format!"). Save it from an RGBA image with
  `bitmap_format="bmp"` (32-bit BMP frames, sizes 16/32/48) and it builds.
- The operator once asked to change "games" → "game"; no such string exists
  anywhere (code, prod HTML, repo description, Vercel). Assume a stale chat
  preview unless they show where it appears.

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
| 09-05 | `2df641c` | this handoff |
| 09-07 | `bba493a` | og.jpg link-preview image, share title "panpangame - ซื้อขายรหัส Free Fire" (deployed via CLI — GitHub hook did not fire) |
| 09-13 | `78089ec` | custom domain panpangame.com live (Cloudflare DNS → Vercel, www + http redirects), canonical URL switched |
| 09-13 | `931802e` | DEMO badge + demo footer note removed — site is live for real |
| 09-18 | `da0c16a` | "ไอดี Prime 8" category; shared CategoryChips; admin category filter chips + in-category drag reorder |
| 09-18 | `dbf5a27` | link-preview image + favicon/icon/apple-icon → Panda Zone artwork |
| 10-13 | `97aabe9` | admin EP search; "ราคาเปิดผ่อนเล่น" second price (admin form/row, storefront card, detail page, LINE summary) |
| 10-15 | `93ab459` | home grid two cards per row on phones; card footer stacks on small screens |

## Open / ideas not started

- No rate limit on `/api/admin/login` (single shared password). Fine for one
  operator; add a limiter if the password ever leaks or if more admins appear.
- Products file is rewritten whole on every change — fine at tens of products,
  revisit if it grows to hundreds.
- No tests in the repo; verification is the manual recipe above.
