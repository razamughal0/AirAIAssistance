"use client";

import { useEffect, useState } from "react";

type CampusRow = {
  id: string;
  label: string;
  shortLabel: string;
  city: string;
  province: string;
  established: string | null;
  domains: string[];
  notes: string;
  publishesOwnFees: boolean;
  documents: number;
  activeDocuments: number;
  pageTypes: string[];
  coveredCritical: string[];
  missingCritical: string[];
  sessions: string[];
  readiness: number;
  latestUpdate: string | null;
};

type Payload = {
  campuses: CampusRow[];
  summary: {
    totalCampuses: number;
    campusesWithData: number;
    campusesReady: number;
    totalDocuments: number;
    teachingReadiness: number;
  };
};

const CRITICAL_LABELS: Record<string, string> = {
  fees: "Fees",
  admissions: "Admissions",
  eligibility: "Eligibility",
  programs: "Programs",
  documents: "Documents",
  contact: "Contact",
};

function readinessTone(readiness: number) {
  if (readiness >= 80) return { bar: "bg-emerald-500", chip: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  if (readiness >= 50) return { bar: "bg-amber-500", chip: "bg-amber-50 text-amber-800 border-amber-200" };
  return { bar: "bg-rose-500", chip: "bg-rose-50 text-rose-700 border-rose-200" };
}

export default function CampusCoverage() {
  const [data, setData] = useState<Payload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/campuses", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<Payload>;
      })
      .then(setData)
      .catch(() => setError("Campus coverage could not be loaded."));
  }, []);

  if (error) return <p className="rounded-lg bg-rose-50 px-3 py-2 text-[12px] text-rose-700">{error}</p>;
  if (!data) return <p className="text-[12px] text-slate-400">Loading campus coverage…</p>;

  return (
    <section className="mt-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="font-serif text-lg text-[#0b1f3a]">Campus coverage</h2>
          <p className="text-[12px] leading-relaxed text-slate-600">
            Air University has {data.summary.totalCampuses} teaching locations. Each is indexed and filtered separately, so a
            Karachi fee is never quoted for Multan. Readiness = share of critical applicant topics (fees, admissions,
            eligibility, programs, documents, contact) this campus can answer from official sources.
          </p>
        </div>
        <div className="flex gap-2">
          {[
            { label: "Campuses with data", value: `${data.summary.campusesWithData}/${data.summary.totalCampuses}` },
            { label: "Avg. readiness", value: `${data.summary.teachingReadiness}%` },
            { label: "Active documents", value: data.summary.totalDocuments },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-center">
              <p className="font-serif text-base text-[#0b1f3a]">{stat.value}</p>
              <p className="text-[9px] uppercase tracking-wide text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {data.campuses.map((campus) => {
          const tone = readinessTone(campus.readiness);
          return (
            <article key={campus.id} className="flex flex-col rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="truncate font-serif text-[14px] font-semibold text-[#0b1f3a]">{campus.label}</h3>
                  <p className="text-[10.5px] text-slate-500">
                    {campus.city}
                    {campus.established ? ` · since ${campus.established}` : ""}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${tone.chip}`}>
                  {campus.readiness}%
                </span>
              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div className={`h-full rounded-full ${tone.bar}`} style={{ width: `${Math.max(3, campus.readiness)}%` }} />
              </div>

              <div className="mt-2.5 flex flex-wrap gap-1">
                {campus.coveredCritical.map((type) => (
                  <span key={type} className="rounded border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[9.5px] font-medium text-emerald-700">
                    ✓ {CRITICAL_LABELS[type] ?? type}
                  </span>
                ))}
                {campus.missingCritical.map((type) => (
                  <span key={type} className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[9.5px] text-slate-400">
                    ✗ {CRITICAL_LABELS[type] ?? type}
                  </span>
                ))}
              </div>

              <p className="mt-2 flex-1 text-[11px] leading-relaxed text-slate-600">{campus.notes}</p>

              <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-slate-100 pt-2 text-[10px] text-slate-500">
                <span className="font-semibold text-[#17375f]">{campus.activeDocuments} docs</span>
                {campus.publishesOwnFees && <span className="rounded bg-[#fbf7ec] px-1.5 py-0.5 text-[#7c6425]">own fee table</span>}
                {campus.sessions.map((session) => (
                  <span key={session} className="rounded bg-[#eef2f8] px-1.5 py-0.5 text-[#17375f]">{session}</span>
                ))}
                {campus.latestUpdate && <span className="ml-auto">updated {campus.latestUpdate.slice(0, 10)}</span>}
              </div>

              {campus.domains.length > 0 && (
                <p className="mt-1.5 break-all font-mono text-[9px] leading-relaxed text-slate-400">{campus.domains.join(" · ")}</p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
