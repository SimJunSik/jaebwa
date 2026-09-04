import type { CalculatorAffiliate } from "./types";

/** 타일 계산기 제휴 매핑 (명세 §11) */
export const tileAffiliate: CalculatorAffiliate = {
  primary: {
    default: { label: "비슷한 규격 타일 찾아보기", keyword: "인테리어 타일", url: "https://link.coupang.com/a/gL6lrmc5ds" },
    "300x300": { label: "300x300 타일 찾아보기", keyword: "300x300 타일", url: "https://link.coupang.com/a/gL6nkIcYnc" },
    "300x600": { label: "300x600 타일 찾아보기", keyword: "300x600 타일", url: "https://link.coupang.com/a/gL6pdob2yG" },
    "600x600": { label: "600x600 타일 찾아보기", keyword: "600x600 타일", url: "https://link.coupang.com/a/gL6rbfvdHU" },
    "600x1200": { label: "600x1200 타일 찾아보기", keyword: "600x1200 타일", url: "https://link.coupang.com/a/gL6slosfoy" },
    adhesive: { label: "타일 접착제 찾아보기", keyword: "타일 접착제", url: "https://link.coupang.com/a/gL6tKZDgIK" },
    tool: { label: "타일 공구 보기", keyword: "타일 시공 공구", url: "https://link.coupang.com/a/gL6u2nHvFI" },
  },
  secondary: [
    { key: "adhesive", label: "타일 접착제", keyword: "타일 접착제", url: "https://link.coupang.com/a/gL6tKZDgIK" },
    { key: "grout", label: "줄눈제", keyword: "타일 줄눈제" },
    { key: "spacer", label: "타일 스페이서", keyword: "타일 스페이서" },
    { key: "cutter", label: "타일 커터", keyword: "타일 커터" },
    { key: "trowel", label: "타일 흙손", keyword: "타일 흙손" },
  ],
};
