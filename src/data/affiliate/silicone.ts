import type { CalculatorAffiliate } from "./types";

/** 실리콘 계산기 제휴 매핑 (명세 §11) */
export const siliconeAffiliate: CalculatorAffiliate = {
  primary: {
    default: { label: "인테리어 실리콘 찾아보기", keyword: "인테리어 실리콘" },
    gun: { label: "실리콘 건 찾아보기", keyword: "실리콘 건" },
    tool: { label: "실리콘 헤라 보기", keyword: "실리콘 헤라" },
  },
  secondary: [
    { key: "gun", label: "실리콘 건", keyword: "실리콘 건" },
    { key: "hera", label: "실리콘 헤라", keyword: "실리콘 헤라" },
    { key: "masking", label: "마스킹 테이프", keyword: "마스킹 테이프" },
    { key: "remover", label: "실리콘 제거제", keyword: "실리콘 제거제" },
  ],
};
