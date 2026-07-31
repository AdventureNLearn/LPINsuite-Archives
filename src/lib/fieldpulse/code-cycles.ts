/**
 * State building-code adoption cycle metadata.
 * Guidance only — not a live adoption tracker or legal advice.
 * Used to surface honest staleness signals without requiring a full app update.
 */

export interface StateCodeCycleMeta {
  stateCode: string;
  /** Typical review cadence in years; null = pure home-rule / variable local only */
  typicalCycleYears: number | null;
  /** Last known effective edition label (guidance) */
  modelBase?: string;
  /** ISO date or year string of last known statewide effective date */
  lastKnownEffective?: string;
  /** Human window for the next expected cycle (or pause note) */
  nextExpectedWindow?: string;
  packVersion: string;
  notes: string[];
  sourceHint?: string;
}

/**
 * Initial cycle map for key states. Expand over time via open packs / manifest refresh.
 * Edition years move; the process patterns below are relatively stable.
 */
export const STATE_CODE_CYCLES: Record<string, StateCodeCycleMeta> = {
  FL: {
    stateCode: "FL",
    typicalCycleYears: 3,
    modelBase: "Florida Building Code (FBC) — 8th Edition (2023) based on 2021 I-Codes",
    lastKnownEffective: "2023-12-31",
    nextExpectedWindow: "9th Edition (2026) effective target ~2026-12-31",
    packVersion: "1.0.0",
    notes: [
      "Florida updates the statewide FBC on an approximately three-year cycle.",
      "Local building departments administer the FBC; HVHZ rules add product approvals.",
      "Confirm the current edition and local admin process with the AHJ before permit work.",
    ],
    sourceHint: "Florida Building Commission update process",
  },
  CA: {
    stateCode: "CA",
    typicalCycleYears: 3,
    modelBase: "California Building Standards Code (Title 24) — 2025 edition",
    lastKnownEffective: "2026-01-01",
    nextExpectedWindow: "Residential code changes largely paused through ~June 2031 (except emergencies / wildfire mitigation); intervening supplements possible",
    packVersion: "1.0.1",
    notes: [
      "California uses statewide Title 24 with local administration and amendments.",
      "Triennial cycles are the historical pattern; recent legislation paused most residential code changes through approximately June 2031.",
      "Always verify current Title 24 parts and local amendments with the AHJ.",
    ],
    sourceHint: "California Building Standards Commission / recent residential freeze legislation",
  },
  TX: {
    stateCode: "TX",
    typicalCycleYears: null,
    modelBase: "Local adoption of IBC / IRC / NEC (no single statewide building code for all cities)",
    nextExpectedWindow: "Local only — varies by municipality",
    packVersion: "1.0.0",
    notes: [
      "Texas does not impose one statewide building code on all cities.",
      "Municipal and county adoptions and amendment calendars differ.",
      "Treat any state-level note as a pointer — confirm the local adopted edition.",
    ],
    sourceHint: "Local municipal / county building department",
  },
  NY: {
    stateCode: "NY",
    typicalCycleYears: 3,
    modelBase: "NYS Uniform Code (outside NYC)",
    nextExpectedWindow: "State update cycle; NYC has a separate path",
    packVersion: "1.0.0",
    notes: [
      "Outside NYC, the Uniform Code is statewide with local enforcement.",
      "New York City uses its own Construction Codes — use the NYC pack there.",
    ],
    sourceHint: "NYS Department of State / local code enforcement",
  },
  WA: {
    stateCode: "WA",
    typicalCycleYears: 3,
    modelBase: "Washington State Building Code (based on IBC/IRC)",
    nextExpectedWindow: "State code cycle with local amendments",
    packVersion: "1.0.0",
    notes: [
      "Statewide code with local administration — confirm city amendments.",
      "Washington energy code paths are frequently material to the project.",
    ],
    sourceHint: "Washington State Building Code Council / local AHJ",
  },
  AZ: {
    stateCode: "AZ",
    typicalCycleYears: null,
    modelBase: "Local adoption of model codes",
    nextExpectedWindow: "Local only — varies by municipality",
    packVersion: "1.0.0",
    notes: [
      "Arizona is primarily local adoption for private construction.",
      "Confirm the city or county adopted edition and amendments.",
    ],
  },
  IL: {
    stateCode: "IL",
    typicalCycleYears: null,
    modelBase: "Local adoption; Chicago has a distinct path",
    nextExpectedWindow: "Local only — Chicago separate",
    packVersion: "1.0.0",
    notes: [
      "Most of Illinois is local adoption; Chicago maintains its own code path.",
    ],
  },
  CO: {
    stateCode: "CO",
    typicalCycleYears: null,
    modelBase: "Local adoption with state influence on some occupancies",
    nextExpectedWindow: "Local only — varies by municipality",
    packVersion: "1.0.0",
    notes: [
      "Colorado is largely local AHJ adoption; snow load and energy vary by elevation.",
    ],
  },
  VA: {
    stateCode: "VA",
    typicalCycleYears: 3,
    modelBase: "Virginia Uniform Statewide Building Code (USBC)",
    nextExpectedWindow: "Statewide USBC cycle with local enforcement",
    packVersion: "1.0.0",
    notes: [
      "Virginia uses a statewide USBC with local building departments.",
      "Confirm the current USBC edition with the locality.",
    ],
  },
  GA: {
    stateCode: "GA",
    typicalCycleYears: 3,
    modelBase: "Georgia State Minimum Standard Codes (based on I-Codes)",
    nextExpectedWindow: "State minimum codes with local admin",
    packVersion: "1.0.0",
    notes: [
      "Georgia publishes state minimum standard codes; locals administer and may amend.",
    ],
  },
  PA: {
    stateCode: "PA",
    typicalCycleYears: 3,
    modelBase: "Pennsylvania Uniform Construction Code (UCC)",
    nextExpectedWindow: "UCC cycle; some municipalities opt out or amend",
    packVersion: "1.0.0",
    notes: [
      "UCC is the statewide framework; local enforcement and limited opt-outs exist.",
    ],
  },
  OH: {
    stateCode: "OH",
    typicalCycleYears: 3,
    modelBase: "Ohio Building Code / Residential Code",
    nextExpectedWindow: "Statewide code cycle with local administration",
    packVersion: "1.0.0",
    notes: [
      "Ohio maintains statewide building and residential codes with local admin.",
    ],
  },
};

/** Resolve cycle metadata for a state; returns a conservative default when unknown. */
export function resolveStateCodeCycle(stateCode?: string): StateCodeCycleMeta | null {
  const st = (stateCode || "").toUpperCase();
  if (!st) return null;
  if (STATE_CODE_CYCLES[st]) return STATE_CODE_CYCLES[st];
  return {
    stateCode: st,
    typicalCycleYears: null,
    modelBase: "IBC / IRC / NEC as adopted locally or by the state",
    nextExpectedWindow: "Confirm adopted edition and amendment calendar with the AHJ",
    packVersion: "1.0.0",
    notes: [
      "No detailed cycle profile is shipped for this state yet.",
      "Model codes typically update on a three-year publication cycle; state adoption lag varies.",
      "Always verify the current adopted edition with the local building official.",
    ],
  };
}

/**
 * Soft staleness signal for UI — guidance only.
 * Quieter policy: only surface a banner when we have a dedicated cycle profile
 * (or an explicit nextExpectedWindow worth calling out). Generic fallbacks stay silent.
 */
export function cycleStalenessMessage(
  meta: StateCodeCycleMeta | null,
  opts?: { dedicated?: boolean },
): string | null {
  if (!meta) return null;
  const dedicated = opts?.dedicated ?? false;
  // Dedicated home-rule / variable profiles still get a short honest note.
  if (meta.typicalCycleYears === null) {
    return dedicated
      ? "Local or variable adoption — confirm the current edition with the AHJ."
      : null;
  }
  if (dedicated && meta.nextExpectedWindow) {
    return `Guidance cycle note: ${meta.nextExpectedWindow}. Verify with the local building department.`;
  }
  return null;
}

/** True when a state has a curated cycle row (not the generic fallback). */
export function hasDedicatedCycleProfile(stateCode?: string): boolean {
  const st = (stateCode || "").toUpperCase();
  return Boolean(st && STATE_CODE_CYCLES[st]);
}
