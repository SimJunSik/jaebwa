/**
 * 순수 계산 모듈.
 *
 * 이 파일은 제휴/상품 관련 코드를 절대 import 하지 않는다. (명세 §19)
 * 계산 결과는 판매 가능한 제품 규격과 무관하게 "실제 필요량"만 반환한다.
 * 구매 단위 변환은 lib/affiliate/recommendation.ts 가 담당한다.
 */

export const PYEONG_M2 = 3.305785;

/** 여유분 기본 비율 (재단 손실·재도장 대비) */
export const DEFAULT_SPARE = 0.1;

const round = (n: number, digits = 1) => {
  const f = 10 ** digits;
  return Math.round(n * f) / f;
};

/* ── 평수 ─────────────────────────────────────────────── */

export type AreaInput = { width: number; depth: number; height: number };

export function calculateArea({ width, depth, height }: AreaInput) {
  const floorArea = width * depth;
  const perimeter = 2 * (width + depth);
  return {
    floorArea: round(floorArea, 2),
    pyeong: round(floorArea / PYEONG_M2, 2),
    perimeter: round(perimeter, 2),
    wallArea: round(perimeter * height, 2),
  };
}

/* ── 페인트 ───────────────────────────────────────────── */

export type PaintInput = {
  /** 도장 대상 면적 (m²) */
  wallArea: number;
  /** 창문·문 등 제외 면적 (m²) */
  openingArea: number;
  /** 도장 횟수 */
  coats: number;
  /** 도포 면적 (m²/L, 1회 기준) */
  spreadRate: number;
};

export function calculatePaint({ wallArea, openingArea, coats, spreadRate }: PaintInput) {
  const paintableArea = Math.max(0, wallArea - openingArea);
  const requiredLiters = (paintableArea * coats) / spreadRate;
  return {
    paintableArea: round(paintableArea, 2),
    requiredLiters: round(requiredLiters, 1),
    recommendedLiters: round(requiredLiters * (1 + DEFAULT_SPARE), 1),
  };
}

/* ── 벽지 ─────────────────────────────────────────────── */

export type WallpaperInput = {
  /** 벽 둘레 (m) */
  perimeter: number;
  /** 천장고 (m) */
  height: number;
  /** 롤 폭 (m) */
  rollWidth: number;
  /** 롤 길이 (m) */
  rollLength: number;
  /** 무늬 반복 길이 (m) */
  patternRepeat: number;
};

export function calculateWallpaper({
  perimeter,
  height,
  rollWidth,
  rollLength,
  patternRepeat,
}: WallpaperInput) {
  // 폭당 재단 길이 = 천장고 + 무늬 맞춤 + 상하 재단 여유 5cm
  const stripLength = height + patternRepeat + 0.05;
  const stripsPerRoll = Math.floor(rollLength / stripLength);
  const stripsNeeded = Math.ceil(perimeter / rollWidth);
  const requiredRolls = stripsPerRoll > 0 ? stripsNeeded / stripsPerRoll : Infinity;
  return {
    stripsNeeded,
    stripsPerRoll,
    requiredRolls: round(requiredRolls, 1),
    recommendedRolls: Number.isFinite(requiredRolls)
      ? Math.ceil(requiredRolls * (1 + DEFAULT_SPARE))
      : 0,
  };
}

/* ── 타일 ─────────────────────────────────────────────── */

export type TileInput = {
  /** 시공 면적 (m²) */
  area: number;
  /** 타일 가로 (mm) */
  tileWidth: number;
  /** 타일 세로 (mm) */
  tileHeight: number;
  /** 줄눈 두께 (mm) */
  joint: number;
};

export function calculateTile({ area, tileWidth, tileHeight, joint }: TileInput) {
  const unitArea = ((tileWidth + joint) / 1000) * ((tileHeight + joint) / 1000);
  const requiredTiles = unitArea > 0 ? Math.ceil(area / unitArea) : 0;
  return {
    unitArea: round(unitArea, 3),
    requiredTiles,
    recommendedTiles: Math.ceil(requiredTiles * (1 + DEFAULT_SPARE)),
  };
}

/* ── 장판 ─────────────────────────────────────────────── */

export type FlooringInput = {
  /** 바닥 면적 (m²) */
  area: number;
  /** 장판 폭 (m) */
  rollWidth: number;
};

export function calculateFlooring({ area, rollWidth }: FlooringInput) {
  const requiredLength = rollWidth > 0 ? area / rollWidth : 0;
  return {
    requiredLength: round(requiredLength, 1),
    recommendedLength: round(Math.ceil(requiredLength * (1 + DEFAULT_SPARE) * 10) / 10, 1),
  };
}

/* ── 마루 ─────────────────────────────────────────────── */

export type WoodInput = {
  /** 바닥 면적 (m²) */
  area: number;
  /** 1박스 시공 면적 (m²) */
  boxCoverage: number;
};

export function calculateWood({ area, boxCoverage }: WoodInput) {
  const requiredBoxes = boxCoverage > 0 ? area / boxCoverage : 0;
  return {
    requiredBoxes: round(requiredBoxes, 1),
    recommendedBoxes: Math.ceil(requiredBoxes * (1 + DEFAULT_SPARE)),
  };
}

/* ── 몰딩 ─────────────────────────────────────────────── */

export type MoldingInput = {
  /** 시공 둘레 (m) */
  perimeter: number;
  /** 1본 길이 (m) */
  barLength: number;
};

export function calculateMolding({ perimeter, barLength }: MoldingInput) {
  const requiredBars = barLength > 0 ? perimeter / barLength : 0;
  return {
    requiredBars: round(requiredBars, 1),
    recommendedBars: Math.ceil(requiredBars * (1 + DEFAULT_SPARE)),
  };
}

/* ── 실리콘 ───────────────────────────────────────────── */

export type SiliconeInput = {
  /** 시공 길이 (m) */
  jointLength: number;
  /** 시공 폭 (mm) */
  jointWidth: number;
  /** 시공 깊이 (mm) */
  jointDepth: number;
  /** 1통 용량 (mL) */
  tubeVolume: number;
};

export function calculateSilicone({
  jointLength,
  jointWidth,
  jointDepth,
  tubeVolume,
}: SiliconeInput) {
  // 길이(m→mm) × 폭 × 깊이 = mm³, 1mL = 1000mm³ → m 단위 길이 그대로 곱하면 mL
  const volumeMl = jointLength * jointWidth * jointDepth;
  const requiredTubes = tubeVolume > 0 ? volumeMl / tubeVolume : 0;
  return {
    volumeMl: round(volumeMl, 0),
    requiredTubes: round(requiredTubes, 1),
    recommendedTubes: Math.ceil(requiredTubes * (1 + DEFAULT_SPARE)),
  };
}
