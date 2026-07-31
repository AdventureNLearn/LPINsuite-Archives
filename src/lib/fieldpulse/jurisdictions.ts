/**
 * United States jurisdiction starters — freeform templates, not live city APIs.
 * Other countries ship as separate product builds later.
 */

export interface UsJurisdictionTemplate {
  id: string;
  label: string;
  stateCode: string;
  cityState: string;
  locationHint: string;
  permittingOffice: string;
  permitNumberHint: string;
  commonInspections: string[];
}

export const US_JURISDICTION_TEMPLATES: UsJurisdictionTemplate[] = [
  {
    id: "us-custom",
    label: "Custom US city / county",
    stateCode: "",
    cityState: "",
    locationHint: "City, ST — address or site name",
    permittingOffice: "City / County Building Department",
    permitNumberHint: "BP-YYYY-#####",
    commonInspections: [
      "Foundation / slab",
      "Framing",
      "Rough-in (MEP)",
      "Insulation",
      "Final",
    ],
  },
  {
    id: "us-austin-tx",
    label: "Austin, TX",
    stateCode: "TX",
    cityState: "Austin, TX",
    locationHint: "Austin, Texas",
    permittingOffice: "City of Austin Development Services",
    permitNumberHint: "BP-2026-#####",
    commonInspections: [
      "Stormwater / site drainage walk",
      "Foundation / slab",
      "Framing",
      "Rough-in (plumbing, electrical, and HVAC)",
      "Final building",
    ],
  },
  {
    id: "us-miami-fl",
    label: "Miami-Dade, FL",
    stateCode: "FL",
    cityState: "Miami, FL",
    locationHint: "Miami-Dade County, Florida",
    permittingOffice: "Miami-Dade County Building Department",
    permitNumberHint: "B-YYYY-#####",
    commonInspections: [
      "Foundation",
      "Structural framing",
      "Roof dry-in",
      "Rough electrical / plumbing / mechanical",
      "Final",
    ],
  },
  {
    id: "us-denver-co",
    label: "Denver, CO",
    stateCode: "CO",
    cityState: "Denver, CO",
    locationHint: "Denver, Colorado",
    permittingOffice: "City and County of Denver Community Planning and Development",
    permitNumberHint: "BLD-YYYY-#####",
    commonInspections: [
      "Footing / foundation",
      "Framing",
      "Rough-in (MEP)",
      "Insulation",
      "Final",
    ],
  },
  {
    id: "us-phoenix-az",
    label: "Phoenix, AZ",
    stateCode: "AZ",
    cityState: "Phoenix, AZ",
    locationHint: "Phoenix, Arizona",
    permittingOffice: "City of Phoenix Planning & Development",
    permitNumberHint: "B-YYYY-#####",
    commonInspections: [
      "Foundation",
      "Framing",
      "Rough plumbing / electrical / mechanical",
      "Lath / drywall",
      "Final",
    ],
  },
  {
    id: "us-seattle-wa",
    label: "Seattle, WA",
    stateCode: "WA",
    cityState: "Seattle, WA",
    locationHint: "Seattle, Washington",
    permittingOffice: "Seattle Department of Construction & Inspections (SDCI)",
    permitNumberHint: "YYYY-#####-BL",
    commonInspections: [
      "Foundation",
      "Shear / framing",
      "Rough-in (MEP)",
      "Insulation",
      "Final",
    ],
  },
  {
    id: "us-nyc-ny",
    label: "New York City, NY",
    stateCode: "NY",
    cityState: "New York, NY",
    locationHint: "New York City, New York",
    permittingOffice: "NYC Department of Buildings",
    permitNumberHint: "Job / permit number",
    commonInspections: [
      "Footings / foundation",
      "Framing / structural",
      "Plumbing rough",
      "Electrical rough",
      "Final / certificate of occupancy path",
    ],
  },
  {
    id: "us-chicago-il",
    label: "Chicago, IL",
    stateCode: "IL",
    cityState: "Chicago, IL",
    locationHint: "Chicago, Illinois",
    permittingOffice: "City of Chicago Department of Buildings",
    permitNumberHint: "B-YYYY-#####",
    commonInspections: [
      "Foundation",
      "Framing",
      "Rough plumbing / electrical / HVAC",
      "Insulation",
      "Final",
    ],
  },
];

export const US_PRODUCT_NOTICE = {
  region: "United States only (this build)",
  notCityPortal:
    "This is your team’s board — not a login to any city or county system. Copy, email, or print packets for real offices.",
  openSource:
    "Open format project packs (.lpin-jobsite.json). Your data stays on this device until you export it.",
  later:
    "Other countries will ship as separate versions later.",
} as const;
