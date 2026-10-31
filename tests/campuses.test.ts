import { describe, expect, it } from "vitest";
import {
  campusForDomain,
  detectCampus,
  detectCampusMentions,
  allAllowedDomains,
  campusLabel,
  CAMPUS_BY_ID,
  TEACHING_CAMPUSES,
} from "../src/lib/campuses";
import { CAMPUS_LABELS } from "../src/lib/config";
import { CAMPUSES as CAMPUS_RECORDS } from "../src/lib/campuses";

describe("campus registry integrity", () => {
  it("covers every Air University teaching location", () => {
    expect(TEACHING_CAMPUSES).toEqual(
      expect.arrayContaining(["karachi", "islamabad-main", "multan", "kharian", "kamra", "bahu"]),
    );
    expect(TEACHING_CAMPUSES).toHaveLength(6);
    expect(CAMPUS_BY_ID["affiliated"]).toBeDefined();
    expect(CAMPUS_BY_ID["university-wide"]).toBeDefined();
  });

  it("gives every campus a label, aliases and notes", () => {
    for (const record of CAMPUS_RECORDS) {
      expect(campusLabel(record.id), `label missing for ${record.id}`).not.toBe(record.id.replace(/-/g, " "));
      expect(CAMPUS_LABELS[record.id]).toBeTruthy();
      expect(record.notes.length).toBeGreaterThan(20);
      if (record.id !== "unknown" && record.id !== "affiliated") {
        expect(record.aliases.length).toBeGreaterThan(2);
      }
    }
  });

  it("never lets two campuses claim the same domain", () => {
    const seen = new Map<string, string>();
    for (const record of CAMPUS_RECORDS) {
      for (const domain of record.domains) {
        const owner = seen.get(domain);
        expect(owner, `domain ${domain} claimed by both ${owner} and ${record.id}`).toBeUndefined();
        seen.set(domain, record.id);
      }
    }
  });

  it("derives the crawler allowlist from the registry", () => {
    const domains = allAllowedDomains();
    expect(domains).toContain("au.edu.pk");
    expect(domains).toContain("khi.au.edu.pk");
    expect(domains).toContain("multan.au.edu.pk");
    expect(domains).toContain("aack.au.edu.pk");
    expect(domains).toContain("bahu.au.edu.pk");
    expect(new Set(domains).size).toBe(domains.length);
  });
});

describe("hostname → campus routing", () => {
  it("routes every official subdomain to the right campus", () => {
    expect(campusForDomain("khi.au.edu.pk")).toBe("karachi");
    expect(campusForDomain("khiportals.au.edu.pk")).toBe("karachi");
    expect(campusForDomain("multan.au.edu.pk")).toBe("multan");
    expect(campusForDomain("aumc.au.edu.pk")).toBe("multan");
    expect(campusForDomain("aack.au.edu.pk")).toBe("kamra");
    expect(campusForDomain("kc.au.edu.pk")).toBe("kharian");
    expect(campusForDomain("bahu.au.edu.pk")).toBe("bahu");
    expect(campusForDomain("islamabad.au.edu.pk")).toBe("islamabad-main");
  });

  it("prefers the most specific subdomain", () => {
    // khiportals is longer than the bare apex, so it must win.
    expect(campusForDomain("khiportals.au.edu.pk")).not.toBe("university-wide");
    expect(campusForDomain("portals.au.edu.pk")).toBe("university-wide");
    expect(campusForDomain("webdata.au.edu.pk")).toBe("university-wide");
  });

  it("strips www and falls back to unknown for foreign hosts", () => {
    expect(campusForDomain("www.khi.au.edu.pk")).toBe("karachi");
    expect(campusForDomain("example.com")).toBe("unknown");
    expect(campusForDomain("au.edu.pk.evil.com")).toBe("unknown");
  });
});

describe("natural-language campus detection", () => {
  it("detects each campus by its aliases", () => {
    expect(detectCampus("What is the fee at Karachi campus?")).toBe("karachi");
    expect(detectCampus("KHI ki eligibility kya hai?")).toBe("karachi");
    expect(detectCampus("Multan campus admission schedule")).toBe("multan");
    expect(detectCampus("Kharian ka deadline")).toBe("kharian");
    expect(detectCampus("Aerospace and Aviation Campus Kamra fees")).toBe("kamra");
    expect(detectCampus("aack admission phases")).toBe("kamra");
    expect(detectCampus("Bahu campus Shorkot Cantt programs")).toBe("bahu");
    expect(detectCampus("Islamabad main campus E-9")).toBe("islamabad-main");
  });

  it("is case-insensitive and tolerant of punctuation", () => {
    expect(detectCampus("KARACHI CAMPUS FEE?")).toBe("karachi");
    expect(detectCampus("multan, fees?")).toBe("multan");
    expect(detectCampus("(kharian)")).toBe("kharian");
  });

  it("must not confuse similar-looking campus names", () => {
    expect(detectCampus("Karachi fee structure")).toBe("karachi");
    expect(detectCampus("Multan fee structure")).not.toBe("karachi");
    expect(detectCampus("Kharian fee structure")).not.toBe("karachi");
  });

  it("detects MULTIPLE campuses for comparison questions", () => {
    const mentions = detectCampusMentions("Compare fees of Karachi and Multan campus");
    const ids = mentions.map((mention) => mention.campus);
    expect(ids).toContain("karachi");
    expect(ids).toContain("multan");
    expect(mentions).toHaveLength(2);
  });

  it("returns no campus for generic questions", () => {
    expect(detectCampus("How do I apply for admission?")).toBeNull();
    expect(detectCampus("Which documents are required?")).toBeNull();
    expect(detectCampusMentions("all campuses fees")).toEqual([]);
  });

  it("does not match campus names inside larger words", () => {
    // "Khariani" or "Karachified" must not trigger a match.
    expect(detectCampus("the Khariani district")).toBeNull();
    expect(detectCampus("university-wide policy")).toBeNull();
  });

  it("supports Roman Urdu phrasing", () => {
    expect(detectCampus("Multan wala campus kaisa hai?")).toBe("multan");
    expect(detectCampus("karachi wala campus")).toBe("karachi");
  });
});
