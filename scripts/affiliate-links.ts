/**
 * 쿠팡파트너스에서 발급받아야 하는 링크 목록을 뽑는다.
 *
 *   npm run affiliate:links                    전체
 *   npm run affiliate:links -- --primary       계산 결과 직후 CTA 만 (우선순위 높음)
 *   npm run affiliate:links -- paint tile      특정 계산기만
 *   npm run affiliate:links -- --done          발급 완료된 것만 (검증용)
 *   npm run affiliate:links -- --id 4          특정 번호만
 *
 * 번호는 필터와 무관하게 고정이다. 어떤 옵션으로 실행해도 같은 키워드는 같은 번호다.
 *
 * 출력된 "원본 URL" 을 파트너스 콘솔 링크 생성기에 넣고, 받은 link.coupang.com 링크를
 * 표시된 위치의 `url` 에 채우면 된다. 같은 키워드가 여러 곳에 쓰이면 한 번만 발급하면 된다.
 */

import { coupangSearchUrl } from "../src/config/affiliate.ts";
import { areaAffiliate } from "../src/data/affiliate/area.ts";
import { flooringAffiliate } from "../src/data/affiliate/flooring.ts";
import { moldingAffiliate } from "../src/data/affiliate/molding.ts";
import { paintAffiliate } from "../src/data/affiliate/paint.ts";
import { siliconeAffiliate } from "../src/data/affiliate/silicone.ts";
import { tileAffiliate } from "../src/data/affiliate/tile.ts";
import { wallpaperAffiliate } from "../src/data/affiliate/wallpaper.ts";
import { woodAffiliate } from "../src/data/affiliate/wood.ts";

/**
 * 이 순서가 번호를 결정한다. 번호는 발급 작업의 식별자이므로
 * 계산기를 추가할 때는 **뒤에만** 붙인다. 중간에 끼워넣으면 번호가 밀린다.
 */
const data = {
  paint: paintAffiliate,
  tile: tileAffiliate,
  wallpaper: wallpaperAffiliate,
  flooring: flooringAffiliate,
  wood: woodAffiliate,
  silicone: siliconeAffiliate,
  molding: moldingAffiliate,
  area: areaAffiliate,
};

const args = process.argv.slice(2);
const onlyPrimary = args.includes("--primary");
const onlyDone = args.includes("--done");
const idFlag = args.indexOf("--id");
const wantedIds = idFlag >= 0 ? args.slice(idFlag + 1).filter((a) => /^\d+$/.test(a)) : [];
const slugFilter = args.filter((a) => !a.startsWith("--") && !/^\d+$/.test(a));

type Site = { calculator: string; kind: string; key: string; url?: string };
type Entry = { id: number; keyword: string; label: string; sites: Site[] };

// 번호를 고정하기 위해 항상 전체 데이터로 목록을 만든 뒤, 표시 단계에서만 걸러낸다.
const byKeyword = new Map<string, Entry>();
for (const [calculator, affiliate] of Object.entries(data)) {
  const rows = [
    ...Object.entries(affiliate.primary).map(([key, t]) => ({ kind: "primary", key, ...t })),
    ...affiliate.secondary.map((t) => ({ kind: "secondary", ...t })),
  ];
  for (const row of rows) {
    const entry =
      byKeyword.get(row.keyword) ??
      ({ id: byKeyword.size + 1, keyword: row.keyword, label: row.label, sites: [] } as Entry);
    entry.sites.push({ calculator, kind: row.kind, key: row.key, url: row.url });
    byKeyword.set(row.keyword, entry);
  }
}
const all = [...byKeyword.values()];

/** 파트너스 링크로 보이는지. 오타·잘못된 URL 을 배포 전에 잡는다. */
function badUrl(url: string): string | null {
  if (!/^https:\/\//.test(url)) return "https:// 로 시작하지 않음";
  if (!url.includes("link.coupang.com")) return "link.coupang.com 링크가 아님 (추적 안 됨)";
  return null;
}

const shown = all.filter((e) => {
  if (wantedIds.length) return wantedIds.includes(String(e.id));
  const sites = e.sites.filter(
    (s) =>
      (!slugFilter.length || slugFilter.includes(s.calculator)) &&
      (!onlyPrimary || s.kind === "primary"),
  );
  if (!sites.length) return false;
  return onlyDone ? sites.some((s) => s.url) : sites.some((s) => !s.url);
});

const problems: string[] = [];
for (const e of shown) {
  console.log(`#${String(e.id).padStart(2, "0")}  ${e.keyword}`);
  if (!e.sites.every((s) => s.url)) {
    console.log(`      붙여넣을 원본 URL: ${coupangSearchUrl(e.keyword)}`);
  }
  for (const s of e.sites) {
    console.log(`      ${s.url ? "✓" : "·"} src/data/affiliate/${s.calculator}.ts → ${s.kind}["${s.key}"]`);
    if (s.url) {
      console.log(`          ${s.url}`);
      const problem = badUrl(s.url);
      if (problem) problems.push(`#${e.id} ${s.calculator}.ts ${s.kind}["${s.key}"]: ${problem}`);
    }
  }
  console.log();
}

const slots = all.flatMap((e) => e.sites);
const doneSlots = slots.filter((s) => s.url).length;

console.log("─".repeat(64));
console.log(
  `링크 ${all.length}개 / 사용 위치 ${slots.length}곳 중 ${doneSlots}곳 발급 완료 · 이 목록 ${shown.length}개`,
);

if (problems.length) {
  console.log(`\n⚠ 형식 문제 ${problems.length}건:`);
  for (const p of problems) console.log(`   ${p}`);
  process.exitCode = 1;
} else if (doneSlots < slots.length) {
  console.log("미발급 위치는 추적되지 않는 검색 페이지로 연결됩니다 (수수료 없음).");
}
