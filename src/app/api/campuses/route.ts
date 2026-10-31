import { db } from "@/db";
import { documents } from "@/db/schema";
import { ensureSeeded } from "@/lib/seed/seed";
import { CAMPUSES, CAMPUS_BY_ID, TEACHING_CAMPUSES, campusForDomain } from "@/lib/campuses";

export const dynamic = "force-dynamic";

/** The page types that matter most to an applicant, per campus. */
const CRITICAL_PAGE_TYPES = ["fees", "admissions", "eligibility", "programs", "documents", "contact"] as const;

export async function GET() {
  try {
    await ensureSeeded();
  } catch {
    /* covered below by the empty-coverage path */
  }

  const rows = await db
    .select({
      campus: documents.campus,
      pageType: documents.pageType,
      active: documents.active,
      session: documents.effectiveSession,
      crawlTimestamp: documents.crawlTimestamp,
    })
    .from(documents);

  const campuses = CAMPUSES.map((record) => {
    const owned = rows.filter((row) => row.campus === record.id);
    const activeOwned = owned.filter((row) => row.active);
    const pageTypes = new Set(activeOwned.map((row) => row.pageType));
    const coveredCritical = CRITICAL_PAGE_TYPES.filter((type) => pageTypes.has(type));
    const sessions = Array.from(new Set(activeOwned.map((row) => row.session).filter(Boolean)));

    const latest = activeOwned.reduce<string | null>((latestSoFar, row) => {
      if (!row.crawlTimestamp) return latestSoFar;
      const value = new Date(row.crawlTimestamp).toISOString();
      return !latestSoFar || value > latestSoFar ? value : latestSoFar;
    }, null);

    const missingCritical = CRITICAL_PAGE_TYPES.filter((type) => !pageTypes.has(type));
    // Readiness = share of critical applicant questions this campus can answer.
    const readiness = Math.round((coveredCritical.length / CRITICAL_PAGE_TYPES.length) * 100);

    return {
      id: record.id,
      label: record.label,
      shortLabel: record.shortLabel,
      city: record.city,
      province: record.province,
      established: record.established,
      domains: record.domains,
      notes: record.notes,
      publishesOwnFees: record.publishesOwnFees,
      documents: owned.length,
      activeDocuments: activeOwned.length,
      pageTypes: Array.from(pageTypes).sort(),
      coveredCritical,
      missingCritical,
      sessions,
      readiness,
      latestUpdate: latest,
      isTeachingCampus: TEACHING_CAMPUSES.includes(record.id as (typeof TEACHING_CAMPUSES)[number]),
    };
  }).sort((a, b) => b.activeDocuments - a.activeDocuments);

  const teaching = campuses.filter((campus) => campus.isTeachingCampus);
  const ready = teaching.filter((campus) => campus.readiness >= 60).length;

  return Response.json({
    campuses,
    summary: {
      totalCampuses: TEACHING_CAMPUSES.length + 1, // six campuses + affiliated institutes
      campusesWithData: teaching.filter((campus) => campus.activeDocuments > 0).length,
      campusesReady: ready,
      totalDocuments: rows.filter((row) => row.active).length,
      teachingReadiness: teaching.length
        ? Math.round(teaching.reduce((sum, campus) => sum + campus.readiness, 0) / teaching.length)
        : 0,
    },
    /** Which campus owns each configured domain — helps validate crawler scope. */
    domainMap: Array.from(new Set(CAMPUSES.flatMap((record) => record.domains))).map((domain) => ({
      domain,
      campus: campusForDomain(domain),
      label: CAMPUS_BY_ID[campusForDomain(domain)]?.shortLabel ?? domain,
    })),
  });
}
