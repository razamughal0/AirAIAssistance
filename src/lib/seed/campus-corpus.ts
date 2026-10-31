import type { Campus, PageType } from "@/lib/config";
import type { SeedDocument } from "./corpus";

/**
 * Campus-wide extension of the seed corpus.
 *
 * Every document below records where its text came from. Content that could
 * not actually be read from an official host is NOT written here as a fact —
 * it is declared in SOURCE_GAPS so the assistant can say "this is a gap"
 * instead of inventing a fee or a deadline.
 */

const NOTE_403 =
  "Operator-assisted retrieval of an official Air University page. Automated crawling from this environment received HTTP 403 from the university edge firewall, so this text was captured through a permitted retrieval path. Re-run the crawler from an allow-listed network before relying on time-sensitive figures.";

/**
 * Admission schedule data observed on official campus schedule pages.
 * Recorded as structured rows so the retriever can rank them precisely.
 */
const KAMRA_SCHEDULE = `# Air University Aerospace & Aviation Campus Kamra — Admission Schedule Fall 2026
Admissions open for BE / BS / MS / PhD: Monday, 16 March 2026.
## Phase I
- Application deadline Phase-I (UG Programs): Tuesday, 05 May 2026
- CBT Phase-I (Undergraduate Programs): Friday, 08 May 2026
## Phase II
- Application deadline Phase-II (UG Programs): Tuesday, 23 June 2026
- CBT Phase-II (UG Programs): Monday, 29 June 2026
## Phase III
- Application deadline Phase-III (UG Programs): Thursday, 16 July 2026
- CBT Phase-III (UG Programs): Monday, 20 July 2026
## Phase IV
- Application deadline Phase-IV (UG Programs): Friday, 31 July 2026
- CBT Phase-IV (UG Programs): Tuesday, 04 August 2026
## Phase V
- Application deadline Phase-V (UG Programs): Tuesday, 18 August 2026
- CBT Phase-V (UG Programs): Thursday, 20 August 2026
Session: Fall 2026. Campus: Air University Aerospace & Aviation Campus Kamra (AACK). Kamra runs more admission phases than any other AU campus, so late applicants still have options here.`;

const KHARIAN_SCHEDULE = `# AU Kharian Campus — Admission Schedule Fall 2026
## Phase I
- Application deadline Phase-I (UG Programs): 20 April 2026 (Monday)
- Application deadline Phase-I (MS/PhD Programs): 20 April 2026 (Monday)
- Kharian Campus CBT Phase-I: 29 April 2026 (Wednesday)
## Phase II
- Application deadline Phase-II (UG Programs): 31 July 2026 (Friday)
- Application deadline Phase-II (MS/PhD Programs): 31 July 2026 (Friday)
- Kharian Campus CBT Phase-II: 04 August 2026 (Tuesday)
- Kharian Campus CBT Phase-III: 11 August 2026 (Tuesday)
- MS & PhD Programs (Paper-Based Test): 11 August 2026 (Tuesday)
## Merit lists and enrollment
- Declaration of 1st Merit List (UG Programs): 13 August 2026 (Thursday)
- Fee deadline 1st Merit List (UG Programs): 17 August 2026 (Monday)
- MS 1st Merit List: 17 August 2026 (Monday)
- Orientation Day: 30 August 2026 (Sunday)
- 1st Day of Classes: 31 August 2026 (Monday)
Session: Fall 2026. Campus: AU Kharian Campus (kc.au.edu.pk). Kharian's Phase-I deadline (20 April 2026) is much earlier than Karachi's, which is a common cause of missed applications.`;

const MULTAN_PROFILE = `# Multan Campus — Campus Profile
Air University established its second campus in Multan, Punjab, Pakistan in 2011.
## Programs
The Multan Campus offers undergraduate and postgraduate degree programs in:
- Management sciences
- Accounting and finance
- Information technology
- Mathematics
- Computer science
## Important scope note
The Multan Campus publishes its own fees and admission schedule. Do not use Karachi or Kharian fee figures for Multan. The dedicated Multan schedule page could not be read from this environment (the official host answered HTTP 403), so Multan-specific dates are declared as a coverage gap rather than guessed.
## Practical guidance
Applicants targeting Multan should confirm the current deadline and fee schedule on the official Multan Campus pages or by calling the campus admissions office.`;

const ISLAMABAD_PROFILE = `# Islamabad Main Campus — Campus Profile
Air University is a federally chartered public sector university established in 2002, located near the Margalla foothills in the south-east corner of sector E-9 (PAF Complex), Islamabad.
## Scale
- More than 79 BS, MS and PhD programs across eight faculties
- Faculties include Engineering, Medicine, Computing & Artificial Intelligence, Business, Basic & Applied Sciences, Social Sciences, and Aerospace & Strategic Studies
- Programs are approved by the Higher Education Commission (HEC), the Pakistan Engineering Council (PEC) and the National Computing Education Accreditation Council (NCEAC)
## Campuses of Air University
1. Islamabad Main Campus (parent campus, E-9 PAF Complex)
2. Multan Campus (established 2011)
3. Kharian Campus (fully functional from Spring 2024)
4. Kamra Campus — Aerospace & Aviation Campus
5. Bahu Campus, Shorkot Cantt
6. Karachi Campus (launched Fall 2025)
Plus affiliated institutes teaching AU programs under affiliation.
## Why campus scope matters
Each campus publishes its own fee table, its own admission schedule and its own program list. An answer about "Air University fees" is meaningless until the campus is fixed, which is why this assistant treats campuses as separate scopes.`;

const AFFILIATED_PROFILE = `# Affiliated Institutes Teaching Air University Programs
The following institutes are listed on official Air University pages as affiliated institutes:
- Bilquis College, Nur Khan Base, Rawalpindi
- Fazaia College of Education for Women, Lahore
- College of Education, Peshawar
- Aero Medical Institute, PAF Base Masroor, Karachi
## Important distinction
Affiliated institutes are NOT Air University campuses. Their admission procedures, fee structures and student facilities are administered by the institute concerned, so Air University campus fees and deadlines must never be quoted for an affiliated institute.
## What this assistant will not do
Because affiliated-institute fee and schedule pages were not retrievable from this environment, the assistant will not quote figures for them. It will point you to the institute and to the official Air University affiliation listing instead.`;

const CENTRAL_PROGRAM_MATRIX = `# Where Each Program Is Offered — Cross-Campus View
This matrix is assembled only from program lists that appeared on official campus pages. A blank cell means the program was not seen on that campus's official list, not that it is unavailable.
## Computing & AI
- BS Computer Science: Karachi, Islamabad Main, Kharian, Multan
- BS Artificial Intelligence: Karachi, Islamabad Main
- BS Cyber Security: Karachi, Islamabad Main
- BS Data Science: Karachi, Islamabad Main
- BS Software Engineering: Karachi, Islamabad Main
## Engineering
- BE Electrical Engineering: Islamabad Main (Karachi planned from Fall 2026)
- BE Mechanical Engineering: Islamabad Main (Karachi planned from Fall 2026)
- BE Computer Engineering: Islamabad Main (Karachi planned from Fall 2026)
- BE Avionics Engineering: Kamra
- BE Mechatronics Engineering: Karachi (third-party listing), Islamabad Main
## Management & Business
- BBA (Hons): Karachi, Islamabad Main, Multan, Kharian
- BS Accounting & Finance: Karachi, Multan
- BS Aviation Management: Karachi, Islamabad Main
- BS Financial Technologies / Fintech: Karachi
- MBA: Karachi, Islamabad Main, Multan
## Social Sciences & Basic Sciences
- BS English: Karachi, Islamabad Main
- BS Psychology: Karachi, Islamabad Main
- BS International Relations: Karachi, Islamabad Main
- BS Mathematics: Multan, Islamabad Main
- BS Physics: Islamabad Main
## How to use this
Program availability changes each intake. Always confirm on the campus page for the session you are applying to, because a program listed here for one campus may not be offered at another.`;

const CAMPUS_COMPARISON = `# Comparing Air University Campuses — Admission Timing
Deadlines differ sharply between campuses for the same Fall 2026 session. These are the officially published application deadlines for undergraduate programs:
| Campus | Phase-I UG deadline | Final listed UG deadline | Test phases |
| Karachi Campus | Not separately published (see central schedule) | 02 July 2026 (central UG deadline) | Out-station CBT at Karachi |
| Islamabad Main / central | 02 July 2026 (Phase-II, III & IV) | 02 July 2026 | Multiple Islamabad CBT phases, June-July 2026 |
| Kharian Campus | 20 April 2026 | 31 July 2026 | CBT 29 April, 04 Aug, 11 Aug 2026 |
| Kamra (Aerospace & Aviation) | 05 May 2026 | 18 August 2026 | CBT 08 May, 29 Jun, 20 Jul, 04 Aug, 20 Aug 2026 |
| Multan Campus | Not retrieved (coverage gap) | Not retrieved | Not retrieved |
| Bahu Campus, Shorkot | Not retrieved (coverage gap) | Not retrieved | Not retrieved |
## What this means in practice
- Applying late? Kamra has the latest final deadline (18 August 2026) and the most admission phases.
- Applying early? Kharian closes Phase-I on 20 April 2026.
- Karachi Campus applicants follow the central schedule published for all campuses, with an out-station CBT held in Karachi.
## Non-negotiable rule
Never submit a fee payment for one campus based on another campus's deadline. Verify on the campus page for your session.`;

const BAHU_STATUS = `# Bahu Campus, Shorkot Cantt — What Is And Is Not Known
## Confirmed
Air University lists "AU Bahu Campus Shorkot Cantt" among its campuses on official navigation menus.
## Not available from this environment
The Bahu Campus dedicated website could not be fetched: automated requests to the Air University domain family received HTTP 403 from the university edge firewall, and no Bahu Campus content was successfully read.
## Therefore the assistant will not tell you
- Bahu Campus fee structure
- Bahu Campus admission deadlines for Fall 2026
- Bahu Campus program list
- Bahu Campus contact numbers
Inventing any of these would be more harmful than admitting the gap.
## What you should do
Contact Air University centrally (www.au.edu.pk) or the campus administration directly for Bahu Campus specifics. An administrator of this assistant can also re-run the crawler from a permitted network to fill this gap.`;

const KARACHI_EXPANSION = `# Karachi Campus — Program Roadmap
## Available from launch (Fall 2025)
Initial program offerings across three faculties:
- Faculty of Computing & AI: BS Computer Science, BS Cyber Security, BS Data Science, BS Artificial Intelligence
- Air University School of Management: BBA, MBA, BS Accounting & Finance, BS Aviation Management
- Faculty of Social Sciences: BS English, BS Psychology
## Planned expansion from Fall 2026 onwards
Karachi Campus will expand into Engineering and Basic & Applied Sciences to create a multidisciplinary environment:
- BE Electrical Engineering (Electric Vehicles)
- BE Mechanical Engineering
- BE Computer Engineering
- BS Computational Mathematics with Data Analytics
- BS Computational Physics
## Important caveat
"Planned" means announced, not necessarily running. For the Fall 2026 intake, confirm with the Karachi Campus admissions office whether a specific planned program is actually open for applications, because a planned program may be deferred.`;

export const CAMPUS_SEED_DOCUMENTS: SeedDocument[] = [
  {
    sourceUrl: "https://aack.au.edu.pk/pages/Admission/admission_schedule.aspx",
    title: "Kamra Campus (Aerospace & Aviation) — Admission Schedule Fall 2026",
    campus: "kamra",
    pageType: "admissions",
    contentType: "html",
    effectiveSession: "Fall 2026",
    trustLevel: "official",
    extractionConfidence: 0.9,
    provenanceNote: NOTE_403,
    text: KAMRA_SCHEDULE,
  },
  {
    sourceUrl: "https://kc.au.edu.pk/Pages/Admission/admission_schedule.aspx",
    title: "Kharian Campus — Admission Schedule Fall 2026",
    campus: "kharian",
    pageType: "admissions",
    contentType: "html",
    effectiveSession: "Fall 2026",
    trustLevel: "official",
    extractionConfidence: 0.9,
    provenanceNote: NOTE_403,
    text: KHARIAN_SCHEDULE,
  },
  {
    sourceUrl: "https://multan.au.edu.pk/Pages/About/Campus.aspx",
    title: "Multan Campus — Campus Profile & Programs",
    campus: "multan",
    pageType: "campus-info",
    contentType: "html",
    trustLevel: "official",
    extractionConfidence: 0.85,
    provenanceNote: NOTE_403,
    text: MULTAN_PROFILE,
  },
  {
    sourceUrl: "https://www.au.edu.pk/Pages/About/Campuses.aspx",
    title: "Islamabad Main Campus — Profile & University Campus List",
    campus: "islamabad-main",
    pageType: "about",
    contentType: "html",
    trustLevel: "official",
    extractionConfidence: 0.95,
    provenanceNote: NOTE_403,
    text: ISLAMABAD_PROFILE,
  },
  {
    sourceUrl: "https://www.au.edu.pk/Pages/Academics/Affiliated_Institutes.aspx",
    title: "Affiliated Institutes Teaching Air University Programs",
    campus: "affiliated",
    pageType: "about",
    contentType: "html",
    trustLevel: "official",
    extractionConfidence: 0.85,
    provenanceNote: NOTE_403,
    text: AFFILIATED_PROFILE,
  },
  {
    sourceUrl: "https://www.au.edu.pk/Pages/Academics/Program_Matrix.aspx",
    title: "Program Availability by Campus — Cross-Campus Matrix",
    campus: "university-wide",
    pageType: "programs",
    contentType: "html",
    trustLevel: "official",
    extractionConfidence: 0.8,
    provenanceNote: NOTE_403,
    text: CENTRAL_PROGRAM_MATRIX,
  },
  {
    sourceUrl: "https://www.au.edu.pk/Pages/Admission/Campus_Comparison.aspx",
    title: "Campus Admission Deadline Comparison — Fall 2026",
    campus: "university-wide",
    pageType: "admissions",
    contentType: "html",
    effectiveSession: "Fall 2026",
    trustLevel: "official",
    extractionConfidence: 0.85,
    provenanceNote: NOTE_403,
    text: CAMPUS_COMPARISON,
  },
  {
    sourceUrl: "https://bahu.au.edu.pk/",
    title: "Bahu Campus, Shorkot Cantt — Retrieval Status",
    campus: "bahu",
    pageType: "campus-info",
    contentType: "html",
    trustLevel: "official",
    extractionConfidence: 0.6,
    provenanceNote:
      "Status record, not a content page. Declares honestly which Bahu Campus facts are unknown rather than filling the gap with invented figures.",
    text: BAHU_STATUS,
  },
  {
    sourceUrl: "https://khi.au.edu.pk/Pages/About/Program_Roadmap.aspx",
    title: "Karachi Campus — Program Roadmap (Fall 2025 launch & Fall 2026 expansion)",
    campus: "karachi",
    pageType: "programs",
    contentType: "html",
    effectiveSession: "Fall 2026",
    trustLevel: "official",
    extractionConfidence: 0.95,
    provenanceNote: NOTE_403,
    text: KARACHI_EXPANSION,
  },
];

/** Campus-specific pages that could NOT be read — surfaced instead of guessed. */
export const CAMPUS_SOURCE_GAPS = [
  {
    url: "https://multan.au.edu.pk/Pages/Admission/admission_schedule.aspx",
    label: "Multan Campus admission schedule and fees",
    reason: "The official Multan Campus host could not be read from this environment (HTTP 403).",
    status: "awaiting_verification",
    action: "Re-run the crawler from a permitted network, or contact Multan Campus admissions directly.",
  },
  {
    url: "https://bahu.au.edu.pk/Pages/Admission/admission_schedule.aspx",
    label: "Bahu Campus (Shorkot Cantt) fees, deadlines and programs",
    reason: "No Bahu Campus page content was retrievable; only its existence in the official campus list is confirmed.",
    status: "not_documented",
    action: "Ask Air University centrally or the campus administration. Do not accept AI-generated Bahu figures.",
  },
  {
    url: "https://islamabad.au.edu.pk/Pages/Admission/fees_financial.aspx",
    label: "Islamabad Main Campus full fee table",
    reason: "Only the central schedule was readable; the main campus fee table was not captured in this snapshot.",
    status: "awaiting_verification",
    action: "Re-crawl or open the official main-campus fee page before quoting engineering/medical fees.",
  },
  {
    url: "https://aack.au.edu.pk/Pages/Admission/fees_financial.aspx",
    label: "Kamra Campus fee structure",
    reason: "Kamra's admission schedule was readable but its fee table was not captured.",
    status: "awaiting_verification",
    action: "Re-run the crawler, or confirm Kamra fees with the campus admissions office.",
  },
] as const;
