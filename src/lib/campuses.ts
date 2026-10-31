/**
 * Canonical registry of every Air University teaching location.
 *
 * This is the single source of truth used by the crawler (which domains belong
 * to which campus), the retriever (campus filtering), the seed corpus, the chat
 * router (alias detection) and the UI (labels, coverage stats).
 *
 * HONESTY RULE: `domains` lists only hostnames that were actually observed in
 * the official web estate. `domainConfirmed` is false when a hostname was seen
 * in an official navigation list but never successfully fetched from this
 * environment (the university's edge firewall answers automated requests with
 * HTTP 403) — the crawler still tries them, but the UI never presents such a
 * domain as verified.
 */

export type CampusId =
  | "islamabad-main"
  | "karachi"
  | "multan"
  | "kharian"
  | "kamra"
  | "bahu"
  | "university-wide"
  | "affiliated"
  | "unknown";

export type CampusRecord = {
  id: CampusId;
  label: string;
  shortLabel: string;
  city: string;
  province: string;
  /** Officially stated launch year/semester, where published. */
  established: string | null;
  domains: string[];
  domainConfirmed: boolean;
  /** Words a student might type that should route to this campus. */
  aliases: string[];
  /** Roughly how many indexed documents this campus currently has. */
  priority: number;
  notes: string;
  /** Campuses that publish their own fee schedule (vs. centrally-set rates). */
  publishesOwnFees: boolean;
};

export const CAMPUSES: CampusRecord[] = [
  {
    id: "university-wide",
    label: "University-wide (central)",
    shortLabel: "Central",
    city: "Islamabad",
    province: "Federal",
    established: "2002",
    domains: ["au.edu.pk", "www.au.edu.pk", "webdata.au.edu.pk", "portals.au.edu.pk", "admissions.au.edu.pk", "admission.au.edu.pk"],
    domainConfirmed: false,
    aliases: [
      "university wide", "university-wide", "central", "head office", "main website", "au.edu.pk",
      "central admission", "common admission", "all campuses", "poora university", "tamam campus",
    ],
    priority: 50,
    notes:
      "Central policy, university-wide admission schedule, central portal and statutes. This scope never carries campus-specific fees.",
    publishesOwnFees: false,
  },
  {
    id: "islamabad-main",
    label: "Islamabad Main Campus",
    shortLabel: "Islamabad",
    city: "Islamabad",
    province: "Federal",
    established: "2002",
    domains: ["islamabad.au.edu.pk"],
    domainConfirmed: false,
    aliases: [
      "islamabad", "islamabad main", "main campus", "islamabad campus", "e-9", "e9", "paf complex",
      "air hq", "paaf base", "islamabad wala", "asal campus",
    ],
    priority: 90,
    notes:
      "The parent campus near the Margalla foothills in sector E-9 (PAF Complex), Islamabad. Largest program portfolio including engineering, medicine and PhD programs.",
    publishesOwnFees: true,
  },
  {
    id: "karachi",
    label: "Karachi Campus",
    shortLabel: "Karachi",
    city: "Karachi",
    province: "Sindh",
    established: "Fall 2025",
    domains: ["khi.au.edu.pk", "khiportals.au.edu.pk"],
    domainConfirmed: false,
    aliases: [
      "karachi", "khi", "khi campus", "karachi campus", "sindh", "karchi", "karachi wala",
      "sixth campus", "6th campus",
    ],
    priority: 100,
    notes:
      "The sixth Air University campus, launched from the Fall 2025 semester with Computing & AI, Management and Social Sciences; engineering and basic sciences planned from Fall 2026.",
    publishesOwnFees: true,
  },
  {
    id: "multan",
    label: "Multan Campus",
    shortLabel: "Multan",
    city: "Multan",
    province: "Punjab",
    established: "2011",
    domains: ["multan.au.edu.pk", "aumc.au.edu.pk"],
    domainConfirmed: false,
    aliases: ["multan", "multan campus", "aumc", "multan wala", "southern punjab"],
    priority: 80,
    notes:
      "Established in 2011 as the second campus. Undergraduate and postgraduate programs in management sciences, accounting & finance, IT, mathematics and computer science.",
    publishesOwnFees: true,
  },
  {
    id: "kharian",
    label: "Kharian Campus",
    shortLabel: "Kharian",
    city: "Kharian",
    province: "Punjab",
    established: "Spring 2024",
    domains: ["kc.au.edu.pk"],
    domainConfirmed: false,
    aliases: ["kharian", "kharian campus", "kc au", "kc.au.edu.pk", "kharian wala"],
    priority: 85,
    notes:
      "Fully functional from the Spring 2024 semester. Publishes its own Fall intake fee table and admission schedule.",
    publishesOwnFees: true,
  },
  {
    id: "kamra",
    label: "Kamra Campus (Aerospace & Aviation)",
    shortLabel: "Kamra",
    city: "Kamra, Attock",
    province: "Punjab",
    established: null,
    domains: ["aack.au.edu.pk", "kamra.au.edu.pk"],
    domainConfirmed: false,
    aliases: [
      "kamra", "aack", "aerospace and aviation", "aerospace & aviation", "a&ac", "aviation campus",
      "paf kamra", "kamra campus",
    ],
    priority: 75,
    notes:
      "Air University Aerospace & Aviation Campus Kamra. Publishes multi-phase admission schedules (Phase I–V) for BE/BS/MS/PhD.",
    publishesOwnFees: true,
  },
  {
    id: "bahu",
    label: "Bahu Campus, Shorkot Cantt",
    shortLabel: "Bahu",
    city: "Shorkot Cantt",
    province: "Punjab",
    established: null,
    domains: ["bahu.au.edu.pk", "sk.au.edu.pk"],
    domainConfirmed: false,
    aliases: ["bahu", "shorkot", "shorkot cantt", "bahu campus", "sk.au.edu.pk"],
    priority: 60,
    notes:
      "Air University Bahu Campus at Shorkot Cantt. Appears in the official campus navigation list; its dedicated domain could not be fetched from this environment.",
    publishesOwnFees: true,
  },
  {
    id: "affiliated",
    label: "Affiliated institutes",
    shortLabel: "Affiliated",
    city: "Multiple",
    province: "Multiple",
    established: null,
    domains: [],
    domainConfirmed: false,
    aliases: [
      "affiliated", "affiliated college", "affiliated institute", "bilquis college", "fazaia college",
      "aero medical institute", "masroor", "college of education peshawar",
    ],
    priority: 30,
    notes:
      "Institutes teaching Air University programs under affiliation: Bilquis College (Nur Khan Base, Rawalpindi), Fazaia College of Education for Women (Lahore), College of Education (Peshawar) and the Aero Medical Institute (PAF Base Masroor, Karachi).",
    publishesOwnFees: false,
  },
  {
    id: "unknown",
    label: "Unscoped",
    shortLabel: "Unscoped",
    city: "—",
    province: "—",
    established: null,
    domains: [],
    domainConfirmed: false,
    aliases: [],
    priority: 0,
    notes: "Documents whose campus could not be determined from their URL or content.",
    publishesOwnFees: false,
  },
];

export const CAMPUS_BY_ID: Record<CampusId, CampusRecord> = CAMPUSES.reduce(
  (accumulator, record) => {
    accumulator[record.id] = record;
    return accumulator;
  },
  {} as Record<CampusId, CampusRecord>,
);

/** Campuses a normal applicant would choose between. */
export const TEACHING_CAMPUSES: CampusId[] = [
  "karachi",
  "islamabad-main",
  "kharian",
  "multan",
  "kamra",
  "bahu",
];

export function campusLabel(id: string): string {
  return CAMPUS_BY_ID[id as CampusId]?.label ?? id.replace(/-/g, " ");
}

export function campusShortLabel(id: string): string {
  return CAMPUS_BY_ID[id as CampusId]?.shortLabel ?? id.replace(/-/g, " ");
}

export function isCampusId(value: unknown): value is CampusId {
  return typeof value === "string" && value in CAMPUS_BY_ID;
}

/** Every hostname the crawler is permitted to touch, across all campuses. */
export function allAllowedDomains(): string[] {
  const domains = new Set<string>();
  for (const record of CAMPUSES) {
    for (const domain of record.domains) domains.add(domain);
  }
  // Bare apex domain is always allowed so navigation links resolve.
  domains.add("au.edu.pk");
  return [...domains];
}

/** Map a hostname to its owning campus (most specific subdomain wins). */
export function campusForDomain(hostname: string): CampusId {
  const host = hostname.toLowerCase().replace(/^www\./, "");
  // Longest matching domain wins so khiportals.au.edu.pk beats au.edu.pk.
  const matches = CAMPUSES.flatMap((record) =>
    record.domains.map((domain) => ({ record, domain })),
  )
    .filter((entry) => host === entry.domain || host.endsWith(`.${entry.domain}`))
    .sort((a, b) => b.domain.length - a.domain.length);
  return matches[0]?.record.id ?? "unknown";
}

export type CampusMention = { campus: CampusId; matchedTerm: string; start: number };

/**
 * Detect every campus mentioned in a question. Returns all matches so a query
 * like "compare fees of Karachi and Multan" yields two campuses.
 */
export function detectCampusMentions(query: string): CampusMention[] {
  const haystack = query.toLowerCase();
  const mentions = new Map<CampusId, CampusMention>();

  for (const record of CAMPUSES) {
    if (record.id === "unknown" || record.id === "university-wide") continue;
    for (const alias of record.aliases) {
      // \b behaves oddly with "&"; use a lookaround-style boundary instead.
      const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const pattern = new RegExp(`(?:^|[^a-z0-9])${escaped}(?:[^a-z0-9]|$)`, "i");
      const match = pattern.exec(haystack);
      if (match) {
        const start = match.index + (match[0].startsWith(" ") ? 1 : 0);
        const existing = mentions.get(record.id);
        if (!existing || alias.length > existing.matchedTerm.length) {
          mentions.set(record.id, { campus: record.id, matchedTerm: alias, start });
        }
      }
    }
  }

  // "main campus" / "main website" style phrases resolve to the parent campus.
  if (!mentions.size && /main campus|main website|parent campus/i.test(haystack)) {
    mentions.set("islamabad-main", { campus: "islamabad-main", matchedTerm: "main campus", start: 0 });
  }
  if (!mentions.size && /all campuses?|har campus|sab campuses?|compare/i.test(haystack)) {
    return [];
  }
  return [...mentions.values()].sort((a, b) => a.start - b.start);
}

/** Convenience wrapper for the common single-campus case. */
export function detectCampus(query: string): CampusId | null {
  const mentions = detectCampusMentions(query);
  if (!mentions.length) return null;
  // Longest matched alias is the most specific mention.
  return mentions.sort((a, b) => b.matchedTerm.length - a.matchedTerm.length)[0].campus;
}

/** Campuses that publish their own fee structure — used to warn about ambiguity. */
export function feePublishingCampuses(): CampusRecord[] {
  return CAMPUSES.filter((record) => record.publishesOwnFees && record.id !== "university-wide");
}

export function campusDomainList(id: CampusId): string {
  const record = CAMPUS_BY_ID[id];
  return record?.domains.join(", ") || "—";
}
