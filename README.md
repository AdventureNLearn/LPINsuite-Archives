# LPIN Suite

**Light · Proof · Integrity · Navigation**

Open tools for the jobsite and the claims desk. **United States first.** Data stays on this device until you export a pack. More apps will join this suite over time.

| App | Route | What it does |
| --- | --- | --- |
| **Claims** | `/claims` | Paste a public post → split into claims → score Supported / Unproven / Disputed → share clean only when open disputes are gone |
| **Jobsite** | `/jobsite` | Field reports · building-department team lane · inspections · industry schedules · materials · open project packs |

## Quick start

```bash
git clone https://github.com/AdventureNLearn/lpin-suite.git
cd lpin-suite
npm install
npm run dev
```

Open the app (default Vite host: `http://127.0.0.1:8080`).

```bash
npm run build      # production build (Vercel/Nitro)
npm run typecheck  # TypeScript
npm run lint
```

## Jobsite — ready for a real US jobsite

Designed for **The United States of America** first. Separate country builds later.

1. Open **LPIN Suite → Jobsite**
2. **Start blank jobsite** (or pick a city starter)
3. Choose **construction industry** (SFR, multi-family, commercial, industrial, civil, renovation, hospitality, healthcare, education)
4. **Save & load industry schedule + materials**
5. Review **AHJ & code pack** for your location (guidance only — not legal advice)
6. File reports with **photos**; wire to building-department lane and inspections
7. Track **materials pricing / short qty** against contract specs
8. **Export pack** (`.lpin-jobsite.json`) or **Print / PDF** readiness packet

### Open project packs

```json
{
  "format": "lpin-jobsite-pack",
  "version": 1,
  "app": "lpin-jobsite",
  "productRegion": "US",
  "jobsite": { }
}
```

Legacy `.fieldpulse.json` / `fieldpulse-pack` files still import.

## Claims

Score public claims without fake certainty. Clean share is blocked while open disputes remain.

## Integrity rules (public surface)

See [PUBLIC_SURFACE_CONTRACT.md](./PUBLIC_SURFACE_CONTRACT.md).

- Prefer honest unknown over false complete
- Original records beat second-hand commentary
- A person makes the final call
- Open gaps block “clean” / “all clear”
- Not legal advice · not a city portal · US build · open packs

| Token | Meaning |
| --- | --- |
| **LPIN** | Light · Proof · Integrity · Navigation |

## Stack

- React 19 · TypeScript · Vite 8 · TanStack Start / Router / Query
- Tailwind CSS v4 · Radix / shadcn-style UI · Zustand · Zod
- Device-local data (localStorage + optional JSON packs)
- PWA shell (`public/manifest.webmanifest` + `public/sw.js`)

## Project layout

```text
src/
  components/     # Claims, Jobsite, shell, integrity UI
  lib/            # domain, stores, packs, integrity kernel
  routes/         # /  /claims  /jobsite  (+ legacy redirects)
public/lpin/      # brand marks & banners
migrations/       # optional auth DB (PGlite)
scripts/          # migrate, browser smoke, QA helpers
```

## License

MIT — see [LICENSE](./LICENSE).

## Owner

[AdventureNLearn](https://github.com/AdventureNLearn)
