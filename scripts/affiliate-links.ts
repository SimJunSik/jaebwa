/**
 * 쿠팡파트너스에서 발급받아야 하는 링크 목록을 뽑는다.
 *
 *   npm run affiliate:links                    전체
 *   npm run affiliate:links -- --primary       계산 결과 직후 CTA 만 (우선순위 높음)
 *   npm run affiliate:links -- paint tile      특정 계산기만
 *   npm run affiliate:links -- --done          발급 완료된 것만 (검증용)
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

/** 계산기 순서 = 트래픽 우선순위. 위에서부터 발급하면 된다. */
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
const slugFilter = args.filter((a) => !a.startsWith("--"));

type Site = { calculator: string; kind: string; key: string; url?: string };
const byKeyword = new Map<string, { label: string; sites: Site[] }>();

for (const [calculator, affiliate] of Object.entries(data)) {
  if (slugFilter.length && !slugFilter.includes(calculator)) continue;
  const rows = [
    ...Object.entries(affiliate.primary).map(([key, t]) => ({ kind: "primary", key, ...t })),
    ...(onlyPrimary ? [] : affiliate.secondary.map((t) => ({ kind: "secondary", ...t }))),
  ];
  for (const row of rows) {
    const entry = byKeyword.get(row.keyword) ?? { label: row.label, sites: [] };
    entry.sites.push({ calculator, kind: row.kind, key: row.key, url: row.url });
    byKeyword.set(row.keyword, entry);
  }
}

/** 파트너스 링크로 보이는지. 오타·잘못된 URL 을 배포 전에 잡는다. */
function badUrl(url: string): string | null {
  if (!/^https:\/\//.test(url)) return "https:// 로 시작하지 않음";
  if (!url.includes("link.coupang.com")) return "link.coupang.com 링크가 아님 (추적 안 됨)";
  return null;
}

const all = [...byKeyword];
const shown = onlyDone
  ? all.filter(([, e]) => e.sites.some((s) => s.url))
  : all.filter(([, e]) => e.sites.some((s) => !s.url));

const problems: string[] = [];
let i = 0;
for (const [keyword, entry] of shown) {
  i += 1;
  console.log(`${String(i).padStart(2)}. ${keyword}`);
  if (!onlyDone) console.log(`    붙여넣을 원본 URL: ${coupangSearchUrl(keyword)}`);
  for (const s of entry.sites) {
    const mark = s.url ? "✓" : "·";
    console.log(`    ${mark} src/data/affiliate/${s.calculator}.ts → ${s.kind}["${s.key}"]`);
    if (s.url) {
      console.log(`        ${s.url}`);
      const problem = badUrl(s.url);
      if (problem) problems.push(`${s.calculator}.ts ${s.kind}["${s.key}"]: ${problem}`);
    }
  }
  console.log();
}

const slots = all.flatMap(([, e]) => e.sites);
const doneSlots = slots.filter((s) => s.url).length;

console.log("─".repeat(64));
console.log(`사용 위치 ${slots.length}곳 중 ${doneSlots}곳 발급 완료 (남은 링크 ${shown.length}개)`);

if (problems.length) {
  console.log(`\n⚠ 형식 문제 ${problems.length}건:`);
  for (const p of problems) console.log(`   ${p}`);
  process.exitCode = 1;
} else if (doneSlots < slots.length) {
  console.log("미발급 위치는 추적되지 않는 검색 페이지로 연결됩니다 (수수료 없음).");
}
