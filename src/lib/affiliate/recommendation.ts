/**
 * 구매 추천 모듈.
 *
 * 계산 결과(필요량)를 "실제로 사야 하는 단위"로 변환한다. (명세 §2, §20)
 * 계산 로직에 절대 영향을 주지 않는다 — 입력은 이미 확정된 계산 결과뿐이다. (§19)
 * URL 은 여기서 다루지 않는다. variant 키만 내보내고 해석은 lib/affiliate/links.ts 가 한다.
 */

export type PurchasePlan = {
  /** "권장 구매량" 등 라벨 */
  headline: string;
  /** 사람이 읽는 권장 구매량 */
  value: string;
  note?: string;
  /** 구매 예시 (조합) */
  examples: string[];
  /** data/affiliate 의 primary 키 목록 — CTA 순서대로 */
  variants: string[];
  /** 추후 쿠팡파트너스 API 검색어로 사용 (§15) */
  keywords: string[];
};

/** 큰 규격부터 채우는 그리디 조합. 예: 9L, [1,4,10,18] → "4L 2통 + 1L 1통" */
export function packUnits(amount: number, sizes: number[], unit: string): string {
  const desc = [...sizes].sort((a, b) => b - a);
  let rest = amount;
  const parts: string[] = [];
  for (const size of desc) {
    if (rest <= 0) break;
    const count = size === desc[desc.length - 1] ? Math.ceil(rest / size) : Math.floor(rest / size);
    if (count > 0) {
      parts.push(`${size}${unit} ${count}개`);
      rest -= size * count;
    }
  }
  return parts.join(" + ");
}

/** 한 규격만으로 채웠을 때. 예: 9L, [1,4,10,18] → { size: 10, count: 1 } */
function singleSize(amount: number, sizes: number[]) {
  const fit = [...sizes].sort((a, b) => a - b).find((s) => s >= amount);
  const max = Math.max(...sizes);
  return fit ? { size: fit, count: 1 } : { size: max, count: Math.ceil(amount / max) };
}

/* ── 페인트 ───────────────────────────────────────────── */

export const PAINT_CAN_SIZES = [1, 4, 10, 18];

export function getPaintPurchaseRecommendation(recommendedLiters: number): PurchasePlan & {
  minimumPurchaseAmount: number;
  suggestedSizes: number[];
} {
  const minimumPurchaseAmount = Math.ceil(recommendedLiters);
  const single = singleSize(minimumPurchaseAmount, PAINT_CAN_SIZES);
  const mixed = packUnits(minimumPurchaseAmount, PAINT_CAN_SIZES, "L");

  const variant = single.size >= 18 || single.count > 1 ? "large" : `${single.size}l`;
  const examples = [`${single.size}L ${single.count}통`];
  if (mixed && mixed !== `${single.size}L ${single.count}개`) examples.push(mixed.replaceAll("개", "통"));

  return {
    headline: "이 정도 준비하면 돼요",
    value: `${minimumPurchaseAmount}L 이상`,
    note: "여유분 10%가 포함된 값이에요. 색상 보정이나 재도장까지 생각하면 넉넉한 쪽이 안전해요.",
    examples,
    variants: [variant, "tool"],
    keywords: [`실내용 수성 페인트 ${single.size}L`, "페인트 롤러 세트"],
    minimumPurchaseAmount,
    suggestedSizes: [single.size],
  };
}

/* ── 벽지 ─────────────────────────────────────────────── */

export function getWallpaperPurchaseRecommendation(
  recommendedRolls: number,
  kind: "silk" | "hapji",
): PurchasePlan {
  return {
    headline: "이 정도 준비하면 돼요",
    value: `${recommendedRolls}롤`,
    note: "무늬 맞춤과 재단 손실을 고려한 수량이에요. 색이 미세하게 다를 수 있어서 한 번에 사는 편이 안전해요.",
    examples: [`${kind === "silk" ? "실크벽지" : "합지벽지"} ${recommendedRolls}롤`],
    variants: [kind, "paste", "tool"],
    keywords: [kind === "silk" ? "실크벽지" : "합지벽지", "벽지 풀", "도배 도구 세트"],
  };
}

/* ── 타일 ─────────────────────────────────────────────── */

export const TILE_KNOWN_SPECS = ["300x300", "300x600", "600x600", "600x1200"];

export function getTilePurchaseRecommendation(
  recommendedTiles: number,
  tileWidth: number,
  tileHeight: number,
  perBox: number,
): PurchasePlan & { boxes: number } {
  const boxes = perBox > 0 ? Math.ceil(recommendedTiles / perBox) : 0;
  const spec = `${tileWidth}x${tileHeight}`;
  const variant = TILE_KNOWN_SPECS.includes(spec) ? spec : "default";
  return {
    headline: "이 정도 준비하면 돼요",
    value: perBox > 0 ? `${boxes}박스 (${perBox}장 x ${boxes})` : `${recommendedTiles}장`,
    note: `여유분 10%를 더한 ${recommendedTiles}장 기준이에요. 재단 손실과 파손, 나중에 깨졌을 때 교체용까지 생각한 값이에요.`,
    examples: [`${spec} 타일 ${boxes}박스`],
    variants: [variant, "adhesive", "tool"],
    keywords: [`${spec} 타일`, "타일 접착제", "줄눈제"],
    boxes,
  };
}

/* ── 장판 ─────────────────────────────────────────────── */

export function getFlooringPurchaseRecommendation(
  recommendedLength: number,
  rollWidth: number,
): PurchasePlan {
  return {
    headline: "이 정도 준비하면 돼요",
    value: `폭 ${rollWidth}m x 길이 ${recommendedLength}m`,
    note: "재단 손실을 고려한 길이예요. 이음이 적을수록 마감이 깔끔해요.",
    examples: [`${rollWidth}m 폭 장판 ${recommendedLength}m`],
    variants: [`${rollWidth}m`, "bond", "tool"],
    keywords: [`장판 폭 ${rollWidth}m`, "장판 본드", "장판 시공 공구"],
  };
}

/* ── 마루 ─────────────────────────────────────────────── */

export function getWoodPurchaseRecommendation(
  recommendedBoxes: number,
  kind: string,
): PurchasePlan {
  return {
    headline: "이 정도 준비하면 돼요",
    value: `${recommendedBoxes}박스`,
    note: "재단 손실 10%를 포함한 수량이에요. 같은 생산 로트로 한 번에 사면 색차가 적어요.",
    examples: [`${kind} ${recommendedBoxes}박스`],
    variants: [kind, "underlay", "tool"],
    keywords: [kind, "마루 부자재", "바닥재 시공 공구"],
  };
}

/* ── 몰딩 ─────────────────────────────────────────────── */

export function getMoldingPurchaseRecommendation(
  recommendedBars: number,
  barLength: number,
): PurchasePlan {
  return {
    headline: "이 정도 준비하면 돼요",
    value: `${barLength}m x ${recommendedBars}본`,
    note: "코너를 45도로 잘라 맞출 때 생기는 손실을 고려한 수량이에요.",
    examples: [`${barLength}m 몰딩 ${recommendedBars}본`],
    variants: ["default", "adhesive", "tool"],
    keywords: ["인테리어 몰딩", "몰딩 접착제", "몰딩 절단 공구"],
  };
}

/* ── 실리콘 ───────────────────────────────────────────── */

export function getSiliconePurchaseRecommendation(
  recommendedTubes: number,
  tubeVolume: number,
): PurchasePlan {
  return {
    headline: "이 정도 준비하면 돼요",
    value: `${tubeVolume}mL x ${recommendedTubes}통`,
    note: "초기 토출 손실과 재시공을 고려한 수량이에요.",
    examples: [`${tubeVolume}mL 실리콘 ${recommendedTubes}통`],
    variants: ["default", "gun", "tool"],
    keywords: [`인테리어 실리콘 ${tubeVolume}ml`, "실리콘 건", "실리콘 헤라"],
  };
}

/* ── 평수 ─────────────────────────────────────────────── */

/** 평수 계산기는 구매 전환이 낮으므로 상품 추천을 최소화한다. (§11) */
export function getAreaPurchaseRecommendation(pyeong: number): PurchasePlan {
  return {
    headline: "다음은 이걸 재봐요",
    value: `${pyeong}평 기준으로 자재량을 계산해 보세요`,
    note: "면적만으로는 필요한 자재량이 정해지지 않아요. 아래 계산기에서 자재별로 이어서 계산할 수 있어요.",
    examples: [],
    variants: [],
    keywords: [],
  };
}
