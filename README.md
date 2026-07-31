# LPIN Suite

**Light · Proof · Integrity · Navigation**

Open-source tools for the jobsite and the claims desk. Built first for **United States** work and for **education** — trade schools, community colleges, journalism and civic classes, and anyone learning how to document a project or score a public claim without fake certainty.

Data stays on the device until you export a pack. No accounts required for core use. MIT licensed.

| App | Route | One-line job |
| --- | --- | --- |
| **Claims** | `/claims` | Paste a public post → split into claims → score Supported / Unproven / Disputed → share clean only when open disputes are gone |
| **Jobsite** | `/jobsite` | Run a project board: field reports, building-department lane, inspections, industry schedules, materials, open packs |

---

## Why education

Most field and claims tools are closed products. LPIN Suite is the opposite: you can clone it, run it offline-friendly in the browser, export a project pack, and hand that pack in as homework or keep it as a portfolio piece.

Students practice the same habits the product enforces in the field:

- Prefer an honest “we do not know yet” over a polished false complete picture
- Separate evidence from inference and assumption
- Keep original records above second-hand commentary
- Block “clean” / “all clear” while open gaps remain
- Own the final call as a person, not as software theater

Instructors get free software, no seat licenses, and portable JSON packs they can collect, review, and re-import.

---

## Classroom use cases (simulated)

These are realistic ways programs can use the suite today. Each ends in an **open pack** or a **print/PDF packet** a student can submit.

### 1. Trade school — single-family residential mock job

**Class:** Construction management / superintendent track  
**Setup:** Instructor loads the **SFR industry schedule + materials** template. Each student starts a blank jobsite named for a fictional lot (e.g. “Lot 14 — Oak Ridge”).

**Student work:**
1. Set project identity (owner, address, AHJ city)
2. Apply the SFR schedule and materials list
3. File three field reports with photos (one of them a stop-now / P0 safety note)
4. Send a short message in the building-department lane about the open item
5. Schedule a mock inspection only after the P0 is addressed
6. Export `.lpin-jobsite.json` + print the readiness packet

**What they learn:** Schedule discipline, materials tracking, why a stop-now blocks “all clear,” and how field notes become an inspection trail.

### 2. Journalism / media literacy — viral claim lab

**Class:** Media literacy, civic reporting, or composition  
**Setup:** Instructor posts 3–5 public posts (news threads, campaign claims, viral screenshots). Students work in **Claims** only.

**Student work:**
1. Paste or pull one post into Claims
2. Split it into atomic claims (one idea per card)
3. Score each claim Supported / Unproven / Disputed
4. Tag basis: Evidence, Inference, or Assumption
5. Attempt clean share — it stays blocked while any Disputed item is open
6. Resolve or document the dispute, then export a clean card

**What they learn:** Claims are not vibes. Clean public language requires closed disputes and primary support, not confidence theater.

### 3. Capstone / portfolio — own a full project pack

**Class:** Capstone, independent study, or apprenticeship portfolio  
**Setup:** Student picks a real or realistic project type (renovation, commercial TI, civil site package).

**Student work:**
1. Build the jobsite over several weeks (schedule, materials, daily logs, punch list, change orders)
2. Keep the readiness gate honest — no “all clear” while stop-now items exist
3. Export the final `.lpin-jobsite.json` as the portfolio artifact
4. Optional: print the PDF packet for a review board

**What they learn:** Continuity. A project is a living record, not a one-night spreadsheet.

### 4. Instructor demo — show the integrity gates live

**Class:** Any intro session (15–20 minutes)  
**Setup:** Instructor shares screen on Jobsite and Claims.

**Demo arc:**
1. Jobsite: file a P0, show “all clear” blocked, clear the P0, show the gate open
2. Claims: score one claim Disputed, show clean share blocked, resolve it, show clean share allowed
3. Export a pack and open it on a second browser to prove portability

**What the room sees:** The product’s rules are mechanical and fair — not slogans.

---

## Assignment starters (copy/paste for instructors)

**Jobsite — Week 1**  
> Start a blank US jobsite. Apply one industry schedule. Add five materials with unit cost and quantity. File two field reports. Export your pack. Submit the `.lpin-jobsite.json` file.

**Jobsite — Week 3**  
> Introduce one stop-now (P0) condition. Attempt readiness. Document why it fails. Resolve the P0, schedule a mock inspection, and print the readiness packet.

**Claims — Single post**  
> Take one public post. Produce at least five atomic claims. Score each with a basis kind. Submit a screenshot of the board while clean share is still blocked, then a second screenshot after you clear disputes.

**Claims — Compare sources**  
> Same claim, two different posts or outlets. Score both boards. Write a half-page note on which board has stronger primary support and why.

---

## Quick start

```bash
git clone https://github.com/AdventureNLearn/lpin-suite.git
cd lpin-suite
npm install
npm run dev
```

Open the app (default: `http://127.0.0.1:8080`).

```bash
npm run build      # production build
npm run typecheck
npm run lint
```

---

## Jobsite — US project board

Designed for **The United States of America** first. Other country packs can come later.

1. Open **LPIN Suite → Jobsite**
2. **Start blank jobsite** (or pick a city starter)
3. Choose **construction industry** (SFR, multi-family, commercial, industrial, civil, renovation, hospitality, healthcare, education)
4. **Load industry schedule + materials**
5. Review **AHJ & code pack** for your location (guidance only — not legal advice)
6. File reports with **photos**; wire notes to the building-department lane and inspections
7. Track **materials pricing / short qty** against the list
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

---

## Claims — score without fake certainty

1. Paste text or pull a public post
2. Split into atomic claims
3. Score Supported / Unproven / Disputed
4. Mark basis: Evidence / Inference / Assumption
5. Clean share stays blocked while any Disputed item is open

---

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

---

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
