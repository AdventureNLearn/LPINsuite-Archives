/**
 * US AHJ / model code reference packs by location.
 * Guidance only — not a live code library or legal advice.
 * Field teams still verify with the local building department.
 */

export interface CodeRequirement {
  id: string;
  title: string;
  summary: string;
  /** Typical hold points / inspections */
  holdPoints: string[];
}

export interface AhjCodePack {
  id: string;
  label: string;
  stateCode: string;
  ahjName: string;
  modelCodes: string[];
  notes: string[];
  requirements: CodeRequirement[];
  /** Common permit types this AHJ issues */
  commonPermits: string[];
}

const BASE_IBC: CodeRequirement[] = [
  {
    id: "struct",
    title: "Structural / foundation",
    summary: "Footings, slabs, and framing must match approved drawings before cover.",
    holdPoints: ["Footing", "Foundation / slab", "Framing / shear"],
  },
  {
    id: "mep",
    title: "MEP rough-in",
    summary: "Mechanical, electrical, and plumbing rough inspected before concealment.",
    holdPoints: ["Rough plumbing", "Rough electrical", "Rough mechanical / HVAC"],
  },
  {
    id: "fire",
    title: "Fire / life safety",
    summary: "Egress, alarms, and suppression systems per approved life-safety drawings.",
    holdPoints: ["Fire sprinkler rough", "Fire alarm", "Life safety final"],
  },
  {
    id: "energy",
    title: "Energy / envelope",
    summary: "Insulation, air barrier, and fenestration per energy code path on the permit.",
    holdPoints: ["Insulation", "Envelope / window"],
  },
  {
    id: "final",
    title: "Final / occupancy",
    summary: "Final building inspection and certificate of occupancy (or TCO) path.",
    holdPoints: ["Final building", "CO / TCO"],
  },
];

function pack(
  partial: Omit<AhjCodePack, "requirements"> & { extraReqs?: CodeRequirement[] },
): AhjCodePack {
  return {
    id: partial.id,
    label: partial.label,
    stateCode: partial.stateCode,
    ahjName: partial.ahjName,
    modelCodes: partial.modelCodes,
    notes: partial.notes,
    commonPermits: partial.commonPermits,
    requirements: [...BASE_IBC, ...(partial.extraReqs ?? [])],
  };
}

/** Synthesize a usable baseline pack for any state that lacks a dedicated entry. */
function synthesizeStatePack(stateCode: string): AhjCodePack {
  const st = stateCode.toUpperCase();
  return pack({
    id: `us-${st.toLowerCase()}-synth`,
    label: `${st} (baseline guidance)`,
    stateCode: st,
    ahjName: "Local city / county building department",
    modelCodes: [
      "IBC / IRC as adopted by the state or locality",
      "NEC (electrical)",
      "IPC / IMC / IFC as adopted",
    ],
    notes: [
      `No dedicated detailed pack is shipped for ${st} yet — this is a conservative baseline.`,
      "Confirm the adopted edition year and any state or local amendments with the AHJ.",
      "Local amendments always override model code text.",
      "This board is a team copy — not a portal login.",
    ],
    commonPermits: ["Building", "Electrical", "Plumbing", "Mechanical", "Fire"],
  });
}

export const AHJ_CODE_PACKS: AhjCodePack[] = [
  pack({
    id: "us-generic",
    label: "Generic US (verify locally)",
    stateCode: "",
    ahjName: "City / County Building Department",
    modelCodes: [
      "IBC (commercial / multi-family)",
      "IRC (one- and two-family)",
      "NEC (electrical)",
      "IPC / IMC / IFC as adopted",
    ],
    notes: [
      "Confirm the edition year adopted by your city or county.",
      "Local amendments always override model code text.",
      "This board is a team copy — not a portal login.",
    ],
    commonPermits: [
      "Building",
      "Electrical",
      "Plumbing",
      "Mechanical",
      "Fire",
    ],
  }),
  pack({
    id: "us-tx",
    label: "Texas (state baseline)",
    stateCode: "TX",
    ahjName: "Local municipal or county AHJ",
    modelCodes: [
      "IBC / IRC as adopted locally",
      "NEC",
      "IPC / IMC",
      "IFC / NFPA as adopted",
      "Texas Accessibility Standards (where applicable)",
    ],
    notes: [
      "Texas does not use a single statewide building code for all cities — check the municipal adoption.",
      "Wind, flood, and energy paths vary by region (coastal vs inland).",
    ],
    commonPermits: ["Building", "Electrical", "Plumbing", "Mechanical", "Fire", "Sign"],
    extraReqs: [
      {
        id: "swq-tx",
        title: "Stormwater / site drainage",
        summary: "Many Texas cities require SWQ / erosion controls before and during work.",
        holdPoints: ["SWPPP / erosion", "Storm inlet protection", "Final drainage"],
      },
    ],
  }),
  pack({
    id: "us-austin-tx",
    label: "Austin, TX",
    stateCode: "TX",
    ahjName: "City of Austin Development Services",
    modelCodes: [
      "Austin-adopted IBC / IRC editions",
      "NEC",
      "Local amendments + environmental criteria",
    ],
    notes: [
      "Development Services handles building permits and many inspections.",
      "Site / stormwater reviews often run parallel to building.",
      "Always confirm current fee schedules and inspection booking rules with the city.",
    ],
    commonPermits: [
      "Building",
      "Electrical",
      "Plumbing",
      "Mechanical",
      "Site / stormwater",
    ],
    extraReqs: [
      {
        id: "austin-swq",
        title: "Stormwater quality (SWQ)",
        summary: "Inlets and BMPs must be maintained — failed SWQ walks delay related inspections.",
        holdPoints: ["Erosion control", "SWQ inlet walk", "Final site"],
      },
    ],
  }),
  pack({
    id: "us-fl",
    label: "Florida (state baseline)",
    stateCode: "FL",
    ahjName: "Local building department (Florida Building Code)",
    modelCodes: [
      "Florida Building Code (FBC) — Building",
      "FBC Residential",
      "FBC Existing Building",
      "NEC as adopted in FBC",
      "Florida Fire Prevention Code",
    ],
    notes: [
      "Florida uses a statewide Florida Building Code with local admin.",
      "High-velocity hurricane zones (e.g. Miami-Dade / Broward) add product approval rules.",
      "Roof and opening protection are frequent hold points.",
    ],
    commonPermits: ["Building", "Roofing", "Electrical", "Plumbing", "Mechanical", "Fire"],
    extraReqs: [
      {
        id: "fl-wind",
        title: "Wind / HVHZ product approval",
        summary: "Openings and roof systems often need Florida product approvals / NOAs in HVHZ.",
        holdPoints: ["Roof dry-in", "Window / door install", "Final envelope"],
      },
    ],
  }),
  pack({
    id: "us-miami-fl",
    label: "Miami-Dade, FL",
    stateCode: "FL",
    ahjName: "Miami-Dade County Building Department",
    modelCodes: [
      "Florida Building Code + HVHZ",
      "Miami-Dade product control (NOA)",
      "Florida Fire Prevention Code",
    ],
    notes: [
      "HVHZ rules are stricter than general Florida coastal.",
      "Product approvals (NOA) are commonly required for envelope components.",
    ],
    commonPermits: ["Building", "Roofing", "Electrical", "Plumbing", "Mechanical", "Fire"],
    extraReqs: [
      {
        id: "md-noa",
        title: "NOA / product control",
        summary: "Use approved products for roof, windows, doors, and shutters as required.",
        holdPoints: ["Roof", "Openings", "Shutters / protection"],
      },
    ],
  }),
  pack({
    id: "us-ca",
    label: "California (state baseline)",
    stateCode: "CA",
    ahjName: "Local building department (Title 24 / CBC)",
    modelCodes: [
      "California Building Code (CBC) — based on IBC",
      "California Residential Code",
      "California Electrical Code (based on NEC)",
      "California Energy Code (Title 24, Part 6)",
      "California Fire Code",
    ],
    notes: [
      "Statewide Title 24 with local administration and amendments.",
      "Energy (Part 6) and accessibility (Ch 11A/11B) paths are frequently material.",
      "Confirm current edition and any local amendments with the AHJ.",
    ],
    commonPermits: ["Building", "Electrical", "Plumbing", "Mechanical", "Fire", "Energy"],
  }),
  pack({
    id: "us-va",
    label: "Virginia (state baseline)",
    stateCode: "VA",
    ahjName: "Local building department (USBC)",
    modelCodes: [
      "Virginia Uniform Statewide Building Code (USBC)",
      "NEC as adopted",
      "Virginia Statewide Fire Prevention Code",
    ],
    notes: [
      "Statewide USBC with local enforcement.",
      "Confirm the current USBC edition with the locality.",
    ],
    commonPermits: ["Building", "Electrical", "Plumbing", "Mechanical", "Fire"],
  }),
  pack({
    id: "us-ga",
    label: "Georgia (state baseline)",
    stateCode: "GA",
    ahjName: "Local building department",
    modelCodes: [
      "Georgia State Minimum Standard Codes (based on I-Codes)",
      "NEC as adopted",
      "Georgia Fire codes as applicable",
    ],
    notes: [
      "State minimum standard codes with local administration and amendments.",
      "Confirm adopted edition and local amendments with the AHJ.",
    ],
    commonPermits: ["Building", "Electrical", "Plumbing", "Mechanical", "Fire"],
  }),
  pack({
    id: "us-pa",
    label: "Pennsylvania (state baseline)",
    stateCode: "PA",
    ahjName: "Local code official (UCC)",
    modelCodes: [
      "Pennsylvania Uniform Construction Code (UCC)",
      "NEC as adopted under UCC",
      "Local fire rules as applicable",
    ],
    notes: [
      "UCC is the statewide framework; some municipalities have limited opt-outs or amendments.",
      "Confirm enforcement status and edition with the local code official.",
    ],
    commonPermits: ["Building", "Electrical", "Plumbing", "Mechanical", "Fire"],
  }),
  pack({
    id: "us-oh",
    label: "Ohio (state baseline)",
    stateCode: "OH",
    ahjName: "Local building department",
    modelCodes: [
      "Ohio Building Code",
      "Ohio Residential Code",
      "NEC as adopted",
    ],
    notes: [
      "Statewide building and residential codes with local administration.",
      "Confirm current editions and any local amendments.",
    ],
    commonPermits: ["Building", "Electrical", "Plumbing", "Mechanical", "Fire"],
  }),
  pack({
    id: "us-nc",
    label: "North Carolina (state baseline)",
    stateCode: "NC",
    ahjName: "Local building department",
    modelCodes: [
      "North Carolina Building Code (based on I-Codes)",
      "North Carolina Residential Code",
      "NEC as adopted",
    ],
    notes: [
      "Statewide codes with local enforcement; residential review cycles have lengthened in recent years.",
      "Confirm the current edition with the local department.",
    ],
    commonPermits: ["Building", "Electrical", "Plumbing", "Mechanical", "Fire"],
  }),
  pack({
    id: "us-sc",
    label: "South Carolina (state baseline)",
    stateCode: "SC",
    ahjName: "Local building department",
    modelCodes: [
      "South Carolina Building Codes (based on I-Codes)",
      "NEC as adopted",
    ],
    notes: [
      "State-adopted codes with local administration.",
      "Coastal and flood provisions are frequently material on the coast.",
    ],
    commonPermits: ["Building", "Electrical", "Plumbing", "Mechanical", "Fire"],
  }),
  pack({
    id: "us-ma",
    label: "Massachusetts (state baseline)",
    stateCode: "MA",
    ahjName: "Local building department",
    modelCodes: [
      "Massachusetts State Building Code (based on I-Codes)",
      "Massachusetts Electrical Code (based on NEC)",
      "Stretch energy code where adopted",
    ],
    notes: [
      "Statewide code with local enforcement; some municipalities adopt stretch energy provisions.",
      "Confirm current edition and any stretch path with the AHJ.",
    ],
    commonPermits: ["Building", "Electrical", "Plumbing", "Mechanical", "Fire"],
  }),
  pack({
    id: "us-nj",
    label: "New Jersey (state baseline)",
    stateCode: "NJ",
    ahjName: "Local construction official",
    modelCodes: [
      "New Jersey Uniform Construction Code",
      "NEC as adopted",
    ],
    notes: [
      "Statewide UCC with local construction officials.",
      "Confirm current adopted editions with the municipality.",
    ],
    commonPermits: ["Building", "Electrical", "Plumbing", "Mechanical", "Fire"],
  }),
  pack({
    id: "us-md",
    label: "Maryland (state baseline)",
    stateCode: "MD",
    ahjName: "Local building department",
    modelCodes: [
      "Maryland Building Performance Standards (based on I-Codes)",
      "NEC as adopted",
    ],
    notes: [
      "Statewide standards with local administration and amendments.",
      "Confirm adopted edition and local amendments with the AHJ.",
    ],
    commonPermits: ["Building", "Electrical", "Plumbing", "Mechanical", "Fire"],
  }),
  pack({
    id: "us-co",
    label: "Colorado (state baseline)",
    stateCode: "CO",
    ahjName: "Local municipal AHJ",
    modelCodes: ["IBC / IRC as adopted", "NEC", "IMC / IPC", "IECC energy"],
    notes: [
      "Snow load and energy code paths vary by elevation and jurisdiction.",
      "Denver and other cities publish local amendments.",
    ],
    commonPermits: ["Building", "Electrical", "Plumbing", "Mechanical", "Fire"],
  }),
  pack({
    id: "us-denver-co",
    label: "Denver, CO",
    stateCode: "CO",
    ahjName: "City and County of Denver CPD",
    modelCodes: ["Denver-adopted IBC / IRC", "NEC", "Local amendments"],
    notes: ["Confirm inspection scheduling through Denver CPD processes."],
    commonPermits: ["Building", "Electrical", "Plumbing", "Mechanical", "Fire"],
  }),
  pack({
    id: "us-az",
    label: "Arizona (state baseline)",
    stateCode: "AZ",
    ahjName: "Local municipal AHJ",
    modelCodes: ["IBC / IRC as adopted", "NEC", "IMC / IPC"],
    notes: ["Heat, dust, and monsoon season affect site and envelope sequencing."],
    commonPermits: ["Building", "Electrical", "Plumbing", "Mechanical", "Fire"],
  }),
  pack({
    id: "us-phoenix-az",
    label: "Phoenix, AZ",
    stateCode: "AZ",
    ahjName: "City of Phoenix Planning & Development",
    modelCodes: ["Phoenix-adopted codes", "NEC"],
    notes: ["Verify current Phoenix amendments and inspection booking."],
    commonPermits: ["Building", "Electrical", "Plumbing", "Mechanical", "Fire"],
  }),
  pack({
    id: "us-wa",
    label: "Washington (state baseline)",
    stateCode: "WA",
    ahjName: "Local AHJ under Washington State Building Code",
    modelCodes: [
      "Washington State Building Code (based on IBC/IRC)",
      "NEC",
      "Washington energy code",
    ],
    notes: ["State code with local administration — confirm city amendments."],
    commonPermits: ["Building", "Electrical", "Plumbing", "Mechanical", "Fire"],
  }),
  pack({
    id: "us-seattle-wa",
    label: "Seattle, WA",
    stateCode: "WA",
    ahjName: "Seattle SDCI",
    modelCodes: ["Seattle Building Code", "Seattle Energy Code", "NEC"],
    notes: ["SDCI handles construction permits and inspections for Seattle."],
    commonPermits: ["Building", "Electrical", "Plumbing", "Mechanical", "Fire", "Side sewer"],
  }),
  pack({
    id: "us-ny",
    label: "New York State (outside NYC)",
    stateCode: "NY",
    ahjName: "Local code enforcement",
    modelCodes: ["Uniform Code (NYS)", "Energy Code", "NEC as adopted"],
    notes: ["NYC is separate — use the NYC pack for the five boroughs."],
    commonPermits: ["Building", "Electrical", "Plumbing", "Mechanical", "Fire"],
  }),
  pack({
    id: "us-nyc-ny",
    label: "New York City, NY",
    stateCode: "NY",
    ahjName: "NYC Department of Buildings",
    modelCodes: [
      "NYC Construction Codes",
      "NYC Electrical Code",
      "FDNY rules as applicable",
    ],
    notes: [
      "NYC DOB processes differ substantially from upstate NY.",
      "Special inspections and DOB filings are common on larger work.",
    ],
    commonPermits: ["NB / Alteration", "Electrical", "Plumbing", "Mechanical", "Fire"],
    extraReqs: [
      {
        id: "nyc-special",
        title: "Special inspections",
        summary: "Many projects require registered special inspectors for structural and other scopes.",
        holdPoints: ["Special inspection reports", "TR forms as required", "Final sign-off path"],
      },
    ],
  }),
  pack({
    id: "us-il",
    label: "Illinois (state baseline)",
    stateCode: "IL",
    ahjName: "Local municipal AHJ",
    modelCodes: ["IBC / IRC as adopted", "NEC", "Illinois Plumbing Code (where applicable)"],
    notes: ["Chicago has its own code path — use Chicago pack in the city."],
    commonPermits: ["Building", "Electrical", "Plumbing", "Mechanical", "Fire"],
  }),
  pack({
    id: "us-chicago-il",
    label: "Chicago, IL",
    stateCode: "IL",
    ahjName: "City of Chicago Department of Buildings",
    modelCodes: ["Chicago Building Code", "Chicago Electrical Code", "Local fire rules"],
    notes: ["Chicago code is distinct from suburban Illinois adoptions."],
    commonPermits: ["Building", "Electrical", "Plumbing", "Mechanical", "Fire"],
  }),
];

/** Resolve best AHJ pack for a jobsite location. */
export function resolveAhjCodePack(input: {
  stateCode?: string;
  cityState?: string;
  permittingOffice?: string;
  jurisdictionTemplateId?: string;
}): AhjCodePack {
  const city = (input.cityState || "").toLowerCase();
  const office = (input.permittingOffice || "").toLowerCase();
  const st = (input.stateCode || "").toUpperCase();

  const cityHits: [string, string][] = [
    ["austin", "us-austin-tx"],
    ["miami", "us-miami-fl"],
    ["denver", "us-denver-co"],
    ["phoenix", "us-phoenix-az"],
    ["seattle", "us-seattle-wa"],
    ["new york", "us-nyc-ny"],
    ["nyc", "us-nyc-ny"],
    ["chicago", "us-chicago-il"],
  ];
  for (const [needle, id] of cityHits) {
    if (city.includes(needle) || office.includes(needle)) {
      const found = AHJ_CODE_PACKS.find((p) => p.id === id);
      if (found) return found;
    }
  }

  if (st) {
    // Prefer exact state baseline id (us-xx)
    const statePack = AHJ_CODE_PACKS.find(
      (p) => p.stateCode === st && p.id === `us-${st.toLowerCase()}`,
    );
    if (statePack) return statePack;

    // Any dedicated pack for this state
    const anyState = AHJ_CODE_PACKS.find((p) => p.stateCode === st);
    if (anyState) return anyState;

    // Synthesize a usable baseline so every selected state has guidance
    return synthesizeStatePack(st);
  }

  return AHJ_CODE_PACKS.find((p) => p.id === "us-generic")!;
}

export const CODE_DISCLAIMER =
  "Code packs are field guidance only — not legal advice and not a substitute for the adopted code text or the local building official.";
