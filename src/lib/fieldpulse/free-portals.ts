/**
 * Free public building-department / code resource links.
 * Information only — not logins, not official forms, not endorsements.
 */

export interface FreeResourceLink {
  id: string;
  label: string;
  url: string;
  note: string;
}

/** National free references anyone can open without a paid subscription. */
export const NATIONAL_FREE_RESOURCES: FreeResourceLink[] = [
  {
    id: "osha",
    label: "OSHA construction standards (public)",
    url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1926",
    note: "Federal construction safety standards — free to read.",
  },
  {
    id: "ada",
    label: "ADA Standards (public)",
    url: "https://www.access-board.gov/ada/",
    note: "Accessibility standards published by the U.S. Access Board.",
  },
  {
    id: "icc-codes",
    label: "ICC public access portal",
    url: "https://codes.iccsafe.org/",
    note: "Read-only model codes as published by ICC (free public access view).",
  },
  {
    id: "nfpa-list",
    label: "NFPA free access list",
    url: "https://www.nfpa.org/for-professionals/codes-and-standards/list-of-codes-and-standards",
    note: "Index of NFPA documents; free access terms set by NFPA.",
  },
  {
    id: "epa-swppp",
    label: "EPA construction stormwater (CGP)",
    url: "https://www.epa.gov/npdes/stormwater-discharges-construction-activities",
    note: "Federal construction stormwater overview — check your state CGP.",
  },
];

/** Public city/county info pages (not authenticated portals). */
export const JURISDICTION_PUBLIC_LINKS: Record<string, FreeResourceLink[]> = {
  TX: [
    {
      id: "austin-dsd",
      label: "Austin Development Services (public site)",
      url: "https://www.austintexas.gov/department/development-services",
      note: "City public site — not a login from this app.",
    },
  ],
  FL: [
    {
      id: "miami-dade-build",
      label: "Miami-Dade Building (public site)",
      url: "https://www.miamidade.gov/global/economy/building/home.page",
      note: "County public site — verify HVHZ product rules there.",
    },
  ],
  CO: [
    {
      id: "denver-cpd",
      label: "Denver CPD (public site)",
      url: "https://www.denvergov.org/Government/Agencies-Departments-Offices/Agencies-Departments-Offices-Directory/Community-Planning-and-Development",
      note: "City public site for permits and inspections info.",
    },
  ],
  AZ: [
    {
      id: "phoenix-pdd",
      label: "Phoenix Planning & Development (public site)",
      url: "https://www.phoenix.gov/pdd",
      note: "City public site.",
    },
  ],
  WA: [
    {
      id: "seattle-sdci",
      label: "Seattle SDCI (public site)",
      url: "https://www.seattle.gov/sdci",
      note: "City public site for construction permits.",
    },
  ],
  NY: [
    {
      id: "nyc-dob",
      label: "NYC Department of Buildings (public site)",
      url: "https://www.nyc.gov/site/buildings/index.page",
      note: "City public site — DOB filings are separate systems.",
    },
  ],
  IL: [
    {
      id: "chicago-dob",
      label: "Chicago Department of Buildings (public site)",
      url: "https://www.chicago.gov/city/en/depts/bldgs.html",
      note: "City public site.",
    },
  ],
};

export function freeLinksForState(stateCode?: string): FreeResourceLink[] {
  const st = (stateCode || "").toUpperCase();
  const local = st ? JURISDICTION_PUBLIC_LINKS[st] ?? [] : [];
  return [...local, ...NATIONAL_FREE_RESOURCES];
}
