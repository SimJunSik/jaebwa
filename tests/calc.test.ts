/**
 * 계산 + 구매 추천 로직 자체 점검.
 * 실행: npm test
 *
 * 명세 §2 / §20 에 나온 예시 숫자를 그대로 검증한다.
 */

import assert from "node:assert/strict";
import test from "node:test";
import {
  calculatePaint,
  calculateSilicone,
  calculateTile,
  calculateWallpaper,
} from "../src/lib/calculators/core.ts";
import {
  getPaintPurchaseRecommendation,
  getTilePurchaseRecommendation,
  packUnits,
} from "../src/lib/affiliate/recommendation.ts";

test("페인트: 필요량 8L → 여유 포함 8.8L → 9L 이상 권장 (명세 §2, §20)", () => {
  // 40m² 2회 도장, 10m²/L → 8L
  const r = calculatePaint({ wallArea: 40, openingArea: 0, coats: 2, spreadRate: 10 });
  assert.equal(r.requiredLiters, 8);
  assert.equal(r.recommendedLiters, 8.8);

  const plan = getPaintPurchaseRecommendation(r.recommendedLiters);
  assert.equal(plan.minimumPurchaseAmount, 9);
  assert.equal(plan.value, "9L 이상");
  assert.deepEqual(plan.examples, ["10L 1통", "4L 2통 + 1L 1통"]);
  assert.ok(plan.variants.includes("10l"));
});

test("페인트: 계산값에 따라 CTA variant 가 달라진다 (명세 §10)", () => {
  assert.ok(getPaintPurchaseRecommendation(2.8).variants.includes("4l"));
  assert.ok(getPaintPurchaseRecommendation(8.8).variants.includes("10l"));
  assert.ok(getPaintPurchaseRecommendation(18).variants.includes("large"));
});

test("packUnits: 큰 규격부터 채우고 마지막 규격으로 올림한다", () => {
  assert.equal(packUnits(9, [1, 4, 10, 18], "L"), "4L 2개 + 1L 1개");
  assert.equal(packUnits(40, [1, 4, 10, 18], "L"), "18L 2개 + 4L 1개");
});

test("타일: 최소 84장 → 권장 93장 → 1박스 12장이면 8박스 (명세 §2)", () => {
  // 600x600 + 줄눈 2mm → 1장당 0.362404m², 84장이 나오도록 면적을 잡는다
  const r = calculateTile({ area: 30.3, tileWidth: 600, tileHeight: 600, joint: 2 });
  assert.equal(r.requiredTiles, 84);
  assert.equal(r.recommendedTiles, 93);

  const plan = getTilePurchaseRecommendation(r.recommendedTiles, 600, 600, 12);
  assert.equal(plan.boxes, 8);
  assert.ok(plan.variants.includes("600x600"));
});

test("타일: 줄눈이 넓을수록 필요한 장수가 줄어든다", () => {
  const tight = calculateTile({ area: 30, tileWidth: 600, tileHeight: 600, joint: 0 });
  const wide = calculateTile({ area: 30, tileWidth: 600, tileHeight: 600, joint: 5 });
  assert.ok(wide.requiredTiles < tight.requiredTiles);
});

test("벽지: 면적이 아니라 폭 단위로 센다", () => {
  // 둘레 15m, 천장고 2.3m, 실크(폭 1.06m / 길이 15.6m), 무늬 없음
  const r = calculateWallpaper({
    perimeter: 15,
    height: 2.3,
    rollWidth: 1.06,
    rollLength: 15.6,
    patternRepeat: 0,
  });
  assert.equal(r.stripsNeeded, 15); // ceil(15 / 1.06)
  assert.equal(r.stripsPerRoll, 6); // floor(15.6 / 2.35)
  assert.equal(r.requiredRolls, 2.5);
  assert.equal(r.recommendedRolls, 3);
});

test("벽지: 무늬 반복이 있으면 필요 롤이 늘어난다", () => {
  const base = { perimeter: 15, height: 2.3, rollWidth: 1.06, rollLength: 15.6 };
  const plain = calculateWallpaper({ ...base, patternRepeat: 0 });
  const patterned = calculateWallpaper({ ...base, patternRepeat: 0.5 });
  assert.ok(patterned.recommendedRolls > plain.recommendedRolls);
});

test("실리콘: 예상 4.2통 → 권장 5통 (명세 §2)", () => {
  // 20m x 8mm x 8mm = 1280mL, 300mL 통 → 4.27통
  const r = calculateSilicone({
    jointLength: 20,
    jointWidth: 8,
    jointDepth: 8,
    tubeVolume: 300,
  });
  assert.equal(r.volumeMl, 1280);
  assert.equal(r.requiredTubes, 4.3);
  assert.equal(r.recommendedTubes, 5);
});

test("계산 결과는 판매 규격에 맞춰 변형되지 않는다 (명세 §19)", () => {
  // 6L 필요 → 계산 모듈은 6.6L 를 그대로 반환하고, 10L 로 올리지 않는다.
  const r = calculatePaint({ wallArea: 30, openingArea: 0, coats: 2, spreadRate: 10 });
  assert.equal(r.requiredLiters, 6);
  assert.equal(r.recommendedLiters, 6.6);
  // 구매 추천 단계에서만 판매 단위로 변환된다.
  assert.equal(getPaintPurchaseRecommendation(6.6).minimumPurchaseAmount, 7);
});

/* ── 집 전체 계산 ─────────────────────────────────────── */

import { calculateHouse } from "../src/lib/calculators/house.ts";

const SILK = { rollWidth: 1.06, rollLength: 15.6, patternRepeat: 0 };
const HOUSE_DEFAULTS = {
  wallpaper: SILK,
  openingRatio: 0,
  paint: { coats: 2, spreadRate: 10 },
  flooring: { rollWidth: 1.8 },
  wood: { boxCoverage: 2.4 },
};

test("집 전체: 방별로 올림한 폭 수를 합산한다", () => {
  // 둘레 11.4m 인 방은 11.4/1.06 = 10.75 → 11폭 으로 올림되어야 한다
  const r = calculateHouse({
    ...HOUSE_DEFAULTS,
    rooms: [{ id: "a", name: "방", width: 3.0, depth: 2.7, height: 2.3 }],
  });
  assert.equal(r.rooms[0].perimeter, 11.4);
  assert.equal(r.rooms[0].strips, 11);
});

test("집 전체: 전체 둘레를 한 번에 나누는 것보다 많이 나온다 (명세대로)", () => {
  const rooms = [
    { id: "a", name: "거실", width: 4.5, depth: 3.6, height: 2.3 },
    { id: "b", name: "안방", width: 3.6, depth: 3.3, height: 2.3 },
    { id: "c", name: "작은방", width: 3.0, depth: 2.7, height: 2.3 },
  ];
  const r = calculateHouse({ ...HOUSE_DEFAULTS, rooms });

  // 방별 올림: ceil(16.2/1.06)=16, ceil(13.8/1.06)=14, ceil(11.4/1.06)=11 → 41폭
  assert.equal(r.totals.strips, 41);

  // 전체 둘레를 한 번에 나누면 ceil(41.4/1.06)=40폭 — 1폭 적다
  const naive = Math.ceil(r.totals.perimeter / 1.06);
  assert.equal(naive, 40);
  assert.ok(r.totals.strips > naive, "방별 올림이 전체 나누기보다 커야 한다");
});

test("집 전체: 바닥 면적은 단순 합산", () => {
  const r = calculateHouse({
    ...HOUSE_DEFAULTS,
    rooms: [
      { id: "a", name: "1", width: 4, depth: 3, height: 2.3 },
      { id: "b", name: "2", width: 2, depth: 3, height: 2.3 },
    ],
  });
  assert.equal(r.totals.floorArea, 18); // 12 + 6
  assert.equal(r.flooring.requiredLength, 10); // 18 / 1.8
});

test("집 전체: 개구부 비율이 페인트 양에 반영된다", () => {
  const rooms = [{ id: "a", name: "방", width: 4, depth: 3, height: 2.5 }];
  const full = calculateHouse({ ...HOUSE_DEFAULTS, rooms });
  const withOpenings = calculateHouse({ ...HOUSE_DEFAULTS, openingRatio: 0.2, rooms });
  assert.ok(withOpenings.paint.requiredLiters < full.paint.requiredLiters);
  // 벽 면적 35m² 의 80% = 28m², 2회 도장 / 10 = 5.6L
  assert.equal(withOpenings.paint.requiredLiters, 5.6);
});

test("집 전체: 천장고가 다른 방도 각자 롤당 폭 수로 계산된다", () => {
  const r = calculateHouse({
    ...HOUSE_DEFAULTS,
    rooms: [
      { id: "a", name: "낮은방", width: 3, depth: 3, height: 2.5 },
      { id: "b", name: "높은방", width: 3, depth: 3, height: 2.6 },
    ],
  });
  // 2.5m → floor(15.6/2.55)=6폭, 2.6m → floor(15.6/2.65)=5폭
  assert.equal(r.rooms[0].stripsPerRoll, 6);
  assert.equal(r.rooms[1].stripsPerRoll, 5);
});
