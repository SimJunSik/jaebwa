/**
 * 쿠팡파트너스에서 발급받아야 하는 링크 목록을 뽑는다.
 *
 * 실행: npm run affiliate:links
 *
 * 출력된 "원본 URL" 을 파트너스 콘솔의 링크 생성기에 넣고, 받은 link.coupang.com 링크를
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

type Site = { calculator: string; kind: string; key: string; hasUrl: boolean };
const byKeyword = new Map<string, { label: string; sites: Site[] }>();

for (const [calculator, affiliate] of Object.entries(data)) {
  const rows = [
    ...Object.entries(affiliate.primary).map(([key, t]) => ({ kind: "primary", key, ...t })),
    ...affiliate.secondary.map((t) => ({ kind: "secondary", ...t })),
  ];
  for (const row of rows) {
    const entry = byKeyword.get(row.keyword) ?? { label: row.label, sites: [] };
    entry.sites.push({ calculator, kind: row.kind, key: row.key, hasUrl: Boolean(row.url) });
    byKeyword.set(row.keyword, entry);
  }
}

const pending = [...byKeyword].filter(([, e]) => e.sites.some((s) => !s.hasUrl));
const slots = [...byKeyword].flatMap(([, e]) => e.sites);

console.log(`발급 필요한 링크 ${pending.length}개 (사용 위치 ${slots.length}곳)\n`);

let i = 0;
for (const [keyword, entry] of pending) {
  i += 1;
  console.log(`${String(i).padStart(2)}. ${keyword}`);
  console.log(`    ${coupangSearchUrl(keyword)}`);
  console.log(
    `    → ${entry.sites
      .map((s) => `${s.calculator}.ts ${s.kind}["${s.key}"]${s.hasUrl ? " (완료)" : ""}`)
      .join(", ")}`,
  );
  console.log();
}

const doneSlots = slots.filter((s) => s.hasUrl).length;
console.log("─".repeat(60));
console.log(`사용 위치 ${slots.length}곳 중 ${doneSlots}곳 발급 완료`);
if (doneSlots < slots.length) {
  console.log("미발급 위치는 추적되지 않는 검색 페이지로 연결됩니다 (수수료 없음).");
}
