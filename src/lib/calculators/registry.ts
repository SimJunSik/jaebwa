/**
 * 계산기 정의. 계산 모듈(core.ts)과 추천 모듈(affiliate/recommendation.ts)을
 * 화면에 필요한 형태로 이어붙이기만 한다. 두 모듈은 서로를 모른다. (명세 §19, §20)
 */

import {
  calculateArea,
  calculateFlooring,
  calculateMolding,
  calculatePaint,
  calculateSilicone,
  calculateTile,
  calculateWallpaper,
  calculateWood,
} from "./core";
import {
  getAreaPurchaseRecommendation,
  getFlooringPurchaseRecommendation,
  getMoldingPurchaseRecommendation,
  getPaintPurchaseRecommendation,
  getSiliconePurchaseRecommendation,
  getTilePurchaseRecommendation,
  getWallpaperPurchaseRecommendation,
  getWoodPurchaseRecommendation,
  type PurchasePlan,
} from "@/lib/affiliate/recommendation";

export type Field =
  | {
      key: string;
      label: string;
      type: "number";
      unit?: string;
      default: number;
      step?: number;
      hint?: string;
      /** 0 도 유효한 입력인 필드 (예: 창문 없음, 무늬 없음) */
      allowZero?: boolean;
    }
  | {
      key: string;
      label: string;
      type: "select";
      default: string;
      options: { value: string; label: string }[];
      hint?: string;
    };

export type ResultLine = {
  label: string;
  value: string;
  /** 화면에서 가장 크게 보여줄 숫자 */
  emphasis?: boolean;
  note?: string;
};

export type CalculatorOutput = {
  results: ResultLine[];
  plan: PurchasePlan;
  /** 결과를 신뢰할 수 있도록 실제 입력값으로 설명하는 문장 */
  rationale: string;
};

export type CalculatorDef = {
  slug: string;
  /** 페인트 */
  name: string;
  /** 페인트 계산기 */
  title: string;
  /** 검색 결과에 노출되는 제목 */
  seoTitle: string;
  emoji: string;
  description: string;
  keywords: string[];
  intro: string;
  fields: Field[];
  run: (values: Record<string, string>) => CalculatorOutput;
  guide: { heading: string; body: string[] }[];
  related: string[];
  phase: 1 | 2;
};

type Values = Record<string, string>;
const n = (v: Values, key: string) => {
  const parsed = Number.parseFloat(v[key]);
  return Number.isFinite(parsed) ? parsed : 0;
};

const WALLPAPER_KINDS = {
  silk: { label: "실크벽지 (폭 106cm / 길이 15.6m)", rollWidth: 1.06, rollLength: 15.6 },
  hapji: { label: "합지벽지 (폭 93cm / 길이 17.75m)", rollWidth: 0.93, rollLength: 17.75 },
} as const;

export const calculators: CalculatorDef[] = [
  /* ── 평수 ───────────────────────────────────────────── */
  {
    slug: "area",
    name: "평수",
    title: "평수 계산기",
    seoTitle: "평수 계산기 - m²와 평 변환, 벽 면적 계산",
    emoji: "📏",
    description:
      "가로·세로 길이로 m²와 평수를 계산해요. 벽 둘레와 벽 면적까지 같이 구해서 자재 계산으로 바로 이어져요.",
    keywords: ["평수 계산기", "제곱미터 평 변환", "방 평수 계산", "벽 면적 계산"],
    intro: "방의 가로·세로·천장고를 입력하면 면적과 평수, 도배·페인트에 필요한 벽 면적까지 계산해드려요.",
    phase: 1,
    fields: [
      { key: "width", label: "가로", type: "number", unit: "m", default: 3.5, step: 0.1 },
      { key: "depth", label: "세로", type: "number", unit: "m", default: 4, step: 0.1 },
      {
        key: "height",
        label: "천장고",
        type: "number",
        unit: "m",
        default: 2.3,
        step: 0.1,
        hint: "국내 아파트는 보통 2.3~2.4m예요.",
      },
    ],
    run: (v) => {
      const width = n(v, "width");
      const depth = n(v, "depth");
      const height = n(v, "height");
      const r = calculateArea({ width, depth, height });
      return {
        results: [
          { label: "바닥 면적", value: `${r.floorArea} m²`, emphasis: true },
          { label: "평수", value: `${r.pyeong} 평`, emphasis: true },
          { label: "벽 둘레", value: `${r.perimeter} m` },
          {
            label: "벽 면적 (개구부 제외 전)",
            value: `${r.wallArea} m²`,
            note: "창문·문 면적은 각 자재 계산기에서 빼주세요.",
          },
        ],
        plan: getAreaPurchaseRecommendation(r.pyeong),
        rationale: `가로 ${width}m × 세로 ${depth}m로 바닥 면적 ${r.floorArea}m²를 구하고, 1평은 3.3058m²이므로 ${r.pyeong}평이 나왔어요. 벽 면적은 둘레 ${r.perimeter}m에 천장고 ${height}m를 곱한 값이에요.`,
      };
    },
    guide: [
      {
        heading: "평과 m²의 관계",
        body: [
          "1평은 약 3.3058m²입니다. m²를 3.3058로 나누면 평수가 나옵니다.",
          "분양 면적(공급 면적)과 실제 방 면적은 다릅니다. 이 계산기는 실제로 재서 입력한 치수 기준입니다.",
        ],
      },
      {
        heading: "벽 면적은 왜 따로 보나요",
        body: [
          "도배·페인트는 바닥이 아니라 벽 면적으로 자재량이 정해집니다.",
          "벽 면적 = 벽 둘레 x 천장고이며, 여기서 창문과 문 면적을 빼면 실제 시공 면적이 됩니다.",
        ],
      },
    ],
    related: ["paint", "wallpaper", "tile", "flooring"],
  },

  /* ── 벽지 ───────────────────────────────────────────── */
  {
    slug: "wallpaper",
    name: "벽지",
    title: "벽지 계산기",
    seoTitle: "벽지 계산기 - 필요한 벽지 롤 수 계산",
    emoji: "🧻",
    description:
      "벽 둘레와 천장고로 필요한 벽지 롤 수를 계산해요. 실크·합지 규격과 무늬 반복까지 반영해요.",
    keywords: ["벽지 계산기", "도배 롤수 계산", "실크벽지 롤 계산", "합지 벽지 계산"],
    intro: "벽 둘레와 천장고를 입력하면 필요한 폭 수와 롤 수를 계산해드려요.",
    phase: 1,
    fields: [
      {
        key: "perimeter",
        label: "벽 둘레",
        type: "number",
        unit: "m",
        default: 15,
        step: 0.1,
        hint: "둘레를 모르면 평수 계산기에서 먼저 구할 수 있어요.",
      },
      { key: "height", label: "천장고", type: "number", unit: "m", default: 2.3, step: 0.1 },
      {
        key: "kind",
        label: "벽지 종류",
        type: "select",
        default: "silk",
        options: Object.entries(WALLPAPER_KINDS).map(([value, k]) => ({ value, label: k.label })),
      },
      {
        key: "patternRepeat",
        label: "무늬 반복 길이",
        type: "number",
        unit: "m",
        default: 0,
        step: 0.1,
        allowZero: true,
        hint: "무늬 없는 벽지는 0으로 두세요.",
      },
    ],
    run: (v) => {
      const kind = (v.kind === "hapji" ? "hapji" : "silk") as keyof typeof WALLPAPER_KINDS;
      const spec = WALLPAPER_KINDS[kind];
      const perimeter = n(v, "perimeter");
      const r = calculateWallpaper({
        perimeter,
        height: n(v, "height"),
        rollWidth: spec.rollWidth,
        rollLength: spec.rollLength,
        patternRepeat: n(v, "patternRepeat"),
      });
      return {
        results: [
          { label: "필요한 벽지", value: `${r.requiredRolls} 롤`, emphasis: true },
          { label: "필요한 폭 수", value: `${r.stripsNeeded} 폭` },
          { label: "1롤에서 나오는 폭 수", value: `${r.stripsPerRoll} 폭` },
        ],
        plan: getWallpaperPurchaseRecommendation(r.recommendedRolls, kind),
        rationale: `벽 둘레 ${perimeter}m를 롤 폭 ${spec.rollWidth}m로 나눠 ${r.stripsNeeded}폭이 필요하고, 롤 하나에서 ${r.stripsPerRoll}폭이 나와서 ${r.requiredRolls}롤이 필요해요. 여기에 무늬 맞춤과 재단 손실을 고려해 여유분 10%를 더했어요.`,
      };
    },
    guide: [
      {
        heading: "벽지는 왜 면적이 아니라 폭으로 세나요",
        body: [
          "벽지는 롤 폭 단위로 세로로 붙이기 때문에, 면적을 그대로 나누면 실제보다 적게 나옵니다.",
          "벽 둘레를 롤 폭으로 나눠 필요한 폭 수를 먼저 구하고, 롤 하나에서 몇 폭이 나오는지로 롤 수를 계산해야 정확합니다.",
        ],
      },
      {
        heading: "무늬 벽지는 여유가 더 필요합니다",
        body: [
          "무늬가 있는 벽지는 옆 폭과 무늬를 맞춰야 해서 폭마다 무늬 반복 길이만큼 손실이 생깁니다.",
          "무늬 반복 길이를 입력하면 이 손실이 자동으로 반영됩니다.",
        ],
      },
    ],
    related: ["area", "paint", "molding"],
  },

  /* ── 페인트 ─────────────────────────────────────────── */
  {
    slug: "paint",
    name: "페인트",
    title: "페인트 계산기",
    seoTitle: "페인트 계산기 - 필요한 페인트 양 계산",
    emoji: "🎨",
    description:
      "도장 면적과 횟수로 필요한 페인트 용량을 계산하고, 몇 L짜리를 몇 통 사야 하는지까지 알려드려요.",
    keywords: ["페인트 계산기", "페인트 양 계산", "수성페인트 용량", "방 페인트 몇 리터"],
    intro: "도장할 면적과 횟수를 입력하면 필요한 페인트 양과 실제 구매 조합을 계산해드려요.",
    phase: 1,
    fields: [
      {
        key: "wallArea",
        label: "도장 면적",
        type: "number",
        unit: "m²",
        default: 40,
        step: 0.1,
        hint: "벽 면적을 모르면 평수 계산기에서 먼저 구할 수 있어요.",
      },
      {
        key: "openingArea",
        label: "창문·문 면적",
        type: "number",
        unit: "m²",
        default: 4,
        step: 0.1,
        allowZero: true,
        hint: "칠하지 않는 부분의 면적이에요. 없으면 0으로 두세요.",
      },
      { key: "coats", label: "도장 횟수", type: "number", unit: "회", default: 2, step: 1 },
      {
        key: "spreadRate",
        label: "도포 면적",
        type: "number",
        unit: "m²/L",
        default: 10,
        step: 0.5,
        hint: "제품 뒷면에 적힌 1회 도포 기준값이에요. 보통 8~12m²/L.",
      },
    ],
    run: (v) => {
      const coats = n(v, "coats");
      const spreadRate = n(v, "spreadRate");
      const r = calculatePaint({
        wallArea: n(v, "wallArea"),
        openingArea: n(v, "openingArea"),
        coats,
        spreadRate,
      });
      return {
        results: [
          { label: "필요한 페인트", value: `${r.requiredLiters} L`, emphasis: true },
          { label: "실제 도장 면적", value: `${r.paintableArea} m²` },
          { label: "여유분 포함", value: `${r.recommendedLiters} L` },
        ],
        plan: getPaintPurchaseRecommendation(r.recommendedLiters),
        rationale: `벽 면적 ${r.paintableArea}m² × ${coats}회 도장 ÷ ${spreadRate}m²/L 기준으로 약 ${r.requiredLiters}L가 필요하고, 작업 중 롤러·트레이에 남는 양과 재도장을 고려해 여유분 10%를 더했어요.`,
      };
    },
    guide: [
      {
        heading: "페인트 양은 이렇게 계산합니다",
        body: [
          "필요량(L) = 도장 면적(m²) x 도장 횟수 ÷ 도포 면적(m²/L)",
          "도포 면적은 제품마다 다릅니다. 실내용 수성 페인트는 보통 1L로 8~12m²를 1회 도장할 수 있습니다.",
        ],
      },
      {
        heading: "왜 2회 도장을 기본으로 하나요",
        body: [
          "1회만 칠하면 아래 색이 비쳐 얼룩이 남기 쉽습니다. 특히 진한 색 위에 밝은 색을 칠할 때 그렇습니다.",
          "색상 차이가 크면 프라이머를 먼저 바르고 2회 도장하는 편이 결과적으로 페인트를 덜 씁니다.",
        ],
      },
    ],
    related: ["area", "wallpaper", "silicone"],
  },

  /* ── 타일 ───────────────────────────────────────────── */
  {
    slug: "tile",
    name: "타일",
    title: "타일 계산기",
    seoTitle: "타일 계산기 - 필요한 타일 수량 계산",
    emoji: "🧱",
    description: "시공 면적과 타일 규격·줄눈 두께로 필요한 타일 장수와 박스 수를 계산해요.",
    keywords: ["타일 계산기", "타일 장수 계산", "600x600 타일 몇 장", "욕실 타일 계산"],
    intro: "면적과 타일 규격을 입력하면 필요한 장수와 실제로 살 박스 수를 계산해드려요.",
    phase: 1,
    fields: [
      { key: "area", label: "시공 면적", type: "number", unit: "m²", default: 25, step: 0.1 },
      { key: "tileWidth", label: "타일 가로", type: "number", unit: "mm", default: 600, step: 10 },
      { key: "tileHeight", label: "타일 세로", type: "number", unit: "mm", default: 600, step: 10 },
      {
        key: "joint",
        label: "줄눈 두께",
        type: "number",
        unit: "mm",
        default: 2,
        step: 0.5,
        hint: "줄눈이 넓을수록 필요한 타일이 줄어들어요.",
      },
      {
        key: "perBox",
        label: "1박스 장수",
        type: "number",
        unit: "장",
        default: 12,
        step: 1,
        hint: "사려는 상품 상세에 적힌 값을 넣어주세요.",
      },
    ],
    run: (v) => {
      const area = n(v, "area");
      const tileWidth = n(v, "tileWidth");
      const tileHeight = n(v, "tileHeight");
      const joint = n(v, "joint");
      const perBox = n(v, "perBox");
      const r = calculateTile({ area, tileWidth, tileHeight, joint });
      return {
        results: [
          { label: "필요한 타일", value: `${r.requiredTiles} 장`, emphasis: true },
          { label: "여유분 포함 권장량", value: `${r.recommendedTiles} 장` },
          { label: "타일 1장 차지 면적", value: `${r.unitArea} m²` },
          { label: "입력한 상품 기준", value: `1박스 = ${perBox} 장` },
        ],
        plan: getTilePurchaseRecommendation(r.recommendedTiles, tileWidth, tileHeight, perBox),
        rationale: `타일 1장이 줄눈 ${joint}mm를 포함해 ${r.unitArea}m²를 차지해서, ${area}m²에는 ${r.requiredTiles}장이 필요해요. 여기에 재단 손실과 파손을 고려해 여유분 10%를 더한 ${r.recommendedTiles}장을 1박스 ${perBox}장으로 나눴어요.`,
      };
    },
    guide: [
      {
        heading: "줄눈 두께를 왜 넣나요",
        body: [
          "타일은 줄눈 간격을 두고 붙이기 때문에 실제로 타일 1장이 차지하는 면적은 (가로+줄눈) x (세로+줄눈)입니다.",
          "줄눈을 빼고 계산하면 필요한 장수가 실제보다 많게 나옵니다.",
        ],
      },
      {
        heading: "여유분은 얼마나 잡아야 하나요",
        body: [
          "모서리 재단, 시공 중 파손, 나중에 깨졌을 때 교체용까지 감안해 보통 10% 정도를 더 준비합니다.",
          "패턴 시공이나 대각선 시공은 재단 손실이 커지므로 15% 이상 잡는 편이 안전합니다.",
        ],
      },
    ],
    related: ["area", "silicone", "flooring"],
  },

  /* ── 장판 ───────────────────────────────────────────── */
  {
    slug: "flooring",
    name: "장판",
    title: "장판 계산기",
    seoTitle: "장판 계산기 - 필요한 장판 길이 계산",
    emoji: "🏠",
    description: "바닥 면적과 장판 폭으로 필요한 장판 길이를 계산해요.",
    keywords: ["장판 계산기", "장판 길이 계산", "장판 폭 1.8m", "방 장판 몇 미터"],
    intro: "바닥 면적과 장판 폭을 입력하면 사야 할 길이를 계산해드려요.",
    phase: 1,
    fields: [
      { key: "area", label: "바닥 면적", type: "number", unit: "m²", default: 20, step: 0.1 },
      {
        key: "rollWidth",
        label: "장판 폭",
        type: "select",
        default: "1.8",
        options: [
          { value: "1.8", label: "1.8m (가장 흔한 규격)" },
          { value: "2", label: "2m" },
          { value: "2.2", label: "2.2m" },
        ],
      },
    ],
    run: (v) => {
      const area = n(v, "area");
      const rollWidth = n(v, "rollWidth") || 1.8;
      const r = calculateFlooring({ area, rollWidth });
      return {
        results: [
          { label: "필요한 장판", value: `${r.requiredLength} m`, emphasis: true },
          { label: "여유분 포함", value: `${r.recommendedLength} m` },
        ],
        plan: getFlooringPurchaseRecommendation(r.recommendedLength, rollWidth),
        rationale: `바닥 면적 ${area}m²를 장판 폭 ${rollWidth}m로 나눠 ${r.requiredLength}m가 필요하고, 재단 손실을 고려해 여유분 10%를 더했어요.`,
      };
    },
    guide: [
      {
        heading: "장판은 길이로 삽니다",
        body: [
          "장판은 정해진 폭의 롤로 판매되므로, 면적을 폭으로 나눈 길이를 구매합니다.",
          "방 폭보다 장판 폭이 넓으면 이음 없이 한 장으로 깔 수 있어 마감이 깔끔합니다.",
        ],
      },
      {
        heading: "이음이 생길 때",
        body: [
          "방 폭이 장판 폭보다 넓으면 이음이 생깁니다. 이 경우 각 열마다 재단 여유가 따로 필요합니다.",
          "이음 위치가 출입구나 가구 아래에 오도록 배치하면 눈에 덜 띕니다.",
        ],
      },
    ],
    related: ["area", "wood", "molding"],
  },

  /* ── 마루 ───────────────────────────────────────────── */
  {
    slug: "wood",
    name: "마루",
    title: "마루 계산기",
    seoTitle: "마루 계산기 - 필요한 마루 박스 수 계산",
    emoji: "🪵",
    description: "바닥 면적과 박스당 시공 면적으로 필요한 마루 박스 수를 계산해요.",
    keywords: ["마루 계산기", "강마루 박스 계산", "마루 몇 박스", "바닥재 계산"],
    intro: "바닥 면적과 마루 종류를 입력하면 필요한 박스 수를 계산해드려요.",
    phase: 1,
    fields: [
      { key: "area", label: "바닥 면적", type: "number", unit: "m²", default: 20, step: 0.1 },
      {
        key: "kind",
        label: "마루 종류",
        type: "select",
        default: "강마루",
        options: [
          { value: "강마루", label: "강마루" },
          { value: "강화마루", label: "강화마루" },
          { value: "원목마루", label: "원목마루" },
        ],
      },
      {
        key: "boxCoverage",
        label: "1박스 시공 면적",
        type: "number",
        unit: "m²",
        default: 2.4,
        step: 0.1,
        hint: "상품 상세에 적힌 값을 넣어주세요. 보통 2~3m²예요.",
      },
    ],
    run: (v) => {
      const area = n(v, "area");
      const kind = v.kind || "강마루";
      const boxCoverage = n(v, "boxCoverage");
      const r = calculateWood({ area, boxCoverage });
      return {
        results: [
          { label: "필요한 마루", value: `${r.requiredBoxes} 박스`, emphasis: true },
          { label: "여유분 포함", value: `${r.recommendedBoxes} 박스` },
        ],
        plan: getWoodPurchaseRecommendation(r.recommendedBoxes, kind),
        rationale: `바닥 면적 ${area}m²를 1박스 시공 면적 ${boxCoverage}m²로 나눠 ${r.requiredBoxes}박스가 필요하고, 재단 손실을 고려해 여유분 10%를 더한 뒤 박스 단위로 올림했어요.`,
      };
    },
    guide: [
      {
        heading: "박스 단위로 계산하는 이유",
        body: [
          "마루는 박스 단위로 판매되고, 박스마다 시공 가능한 면적이 표기되어 있습니다.",
          "필요 면적을 박스당 시공 면적으로 나눈 뒤 올림하면 구매 박스 수가 나옵니다.",
        ],
      },
      {
        heading: "생산 로트를 맞추세요",
        body: [
          "같은 제품이라도 생산 시기에 따라 색상이 미세하게 다를 수 있습니다.",
          "나중에 추가 구매하면 색차가 보일 수 있으므로 필요한 수량을 한 번에 구매하는 편이 안전합니다.",
        ],
      },
    ],
    related: ["area", "flooring", "molding"],
  },

  /* ── 몰딩 ───────────────────────────────────────────── */
  {
    slug: "molding",
    name: "몰딩",
    title: "몰딩 계산기",
    seoTitle: "몰딩 계산기 - 필요한 몰딩 개수 계산",
    emoji: "📐",
    description: "시공 둘레와 1본 길이로 필요한 몰딩 개수를 계산해요.",
    keywords: ["몰딩 계산기", "걸레받이 계산", "천장 몰딩 개수", "몰딩 몇 본"],
    intro: "시공할 둘레와 몰딩 1본 길이를 입력하면 필요한 본 수를 계산해드려요.",
    phase: 2,
    fields: [
      { key: "perimeter", label: "시공 둘레", type: "number", unit: "m", default: 15, step: 0.1 },
      {
        key: "barLength",
        label: "1본 길이",
        type: "number",
        unit: "m",
        default: 2.4,
        step: 0.1,
        hint: "국내 유통 몰딩은 보통 2.4m예요.",
      },
    ],
    run: (v) => {
      const perimeter = n(v, "perimeter");
      const barLength = n(v, "barLength");
      const r = calculateMolding({ perimeter, barLength });
      return {
        results: [
          { label: "필요한 몰딩", value: `${r.requiredBars} 본`, emphasis: true },
          { label: "여유분 포함", value: `${r.recommendedBars} 본` },
        ],
        plan: getMoldingPurchaseRecommendation(r.recommendedBars, barLength),
        rationale: `시공 둘레 ${perimeter}m를 1본 길이 ${barLength}m로 나눠 ${r.requiredBars}본이 필요하고, 코너를 45도로 잘라 맞출 때 생기는 손실을 고려해 여유분 10%를 더했어요.`,
      };
    },
    guide: [
      {
        heading: "코너 손실을 감안하세요",
        body: [
          "몰딩은 코너에서 45도로 잘라 맞추기 때문에 자투리가 남습니다.",
          "코너가 많은 공간일수록 여유분을 넉넉히 잡아야 중간에 모자라지 않습니다.",
        ],
      },
    ],
    related: ["area", "wallpaper", "silicone"],
  },

  /* ── 실리콘 ─────────────────────────────────────────── */
  {
    slug: "silicone",
    name: "실리콘",
    title: "실리콘 계산기",
    seoTitle: "실리콘 계산기 - 필요한 실리콘 통 수 계산",
    emoji: "🧴",
    description: "시공 길이와 줄눈 단면으로 필요한 실리콘 통 수를 계산해요.",
    keywords: ["실리콘 계산기", "실리콘 몇 통", "실리콘 용량 계산", "욕실 실리콘"],
    intro: "시공 길이와 줄눈 폭·깊이를 입력하면 필요한 실리콘 통 수를 계산해드려요.",
    phase: 2,
    fields: [
      { key: "jointLength", label: "시공 길이", type: "number", unit: "m", default: 20, step: 0.1 },
      { key: "jointWidth", label: "줄눈 폭", type: "number", unit: "mm", default: 8, step: 1 },
      { key: "jointDepth", label: "줄눈 깊이", type: "number", unit: "mm", default: 8, step: 1 },
      {
        key: "tubeVolume",
        label: "1통 용량",
        type: "number",
        unit: "mL",
        default: 300,
        step: 10,
        hint: "일반적인 카트리지형 실리콘은 300mL예요.",
      },
    ],
    run: (v) => {
      const jointLength = n(v, "jointLength");
      const jointWidth = n(v, "jointWidth");
      const jointDepth = n(v, "jointDepth");
      const tubeVolume = n(v, "tubeVolume");
      const r = calculateSilicone({ jointLength, jointWidth, jointDepth, tubeVolume });
      return {
        results: [
          { label: "필요한 실리콘", value: `${r.requiredTubes} 통`, emphasis: true },
          { label: "여유분 포함", value: `${r.recommendedTubes} 통` },
          { label: "예상 사용 부피", value: `${r.volumeMl} mL` },
        ],
        plan: getSiliconePurchaseRecommendation(r.recommendedTubes, tubeVolume),
        rationale: `시공 길이 ${jointLength}m × 폭 ${jointWidth}mm × 깊이 ${jointDepth}mm로 약 ${r.volumeMl}mL가 필요하고, ${tubeVolume}mL 통 기준 ${r.requiredTubes}통이에요. 초기 토출 손실과 재시공을 고려해 여유분 10%를 더했어요.`,
      };
    },
    guide: [
      {
        heading: "실리콘 사용량 계산식",
        body: [
          "사용량(mL) = 시공 길이(m) x 줄눈 폭(mm) x 줄눈 깊이(mm)",
          "줄눈 폭과 깊이는 보통 비슷하게 잡습니다. 폭이 넓을수록 사용량이 빠르게 늘어납니다.",
        ],
      },
      {
        heading: "기존 실리콘 제거를 잊지 마세요",
        body: [
          "기존 실리콘 위에 덧바르면 잘 붙지 않고 곰팡이가 그대로 남습니다.",
          "제거제와 헤라로 완전히 걷어낸 뒤 건조시키고 시공해야 오래갑니다.",
        ],
      },
    ],
    related: ["tile", "molding", "paint"],
  },
];

export const calculatorMap: Record<string, CalculatorDef> = Object.fromEntries(
  calculators.map((c) => [c.slug, c]),
);

export function getCalculator(slug: string): CalculatorDef | undefined {
  return calculatorMap[slug];
}

/** 필수 숫자 입력이 모두 채워졌는지. 계산기는 값이 유효할 때만 결과를 보여준다. */
export function hasValidInput(def: CalculatorDef, values: Record<string, string>): boolean {
  return def.fields.every((f) => {
    if (f.type !== "number") return true;
    const parsed = Number.parseFloat(values[f.key]);
    if (!Number.isFinite(parsed) || parsed < 0) return false;
    return f.allowZero === true || parsed > 0;
  });
}
