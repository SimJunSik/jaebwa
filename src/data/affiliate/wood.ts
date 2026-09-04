import type { CalculatorAffiliate } from "./types";

/** 마루 계산기 제휴 매핑 (명세 §11) */
export const woodAffiliate: CalculatorAffiliate = {
  primary: {
    default: { label: "마루 찾아보기", keyword: "마루 바닥재" },
    강마루: { label: "강마루 찾아보기", keyword: "강마루" },
    강화마루: { label: "강화마루 찾아보기", keyword: "강화마루" },
    원목마루: { label: "원목마루 찾아보기", keyword: "원목마루" },
    underlay: { label: "마루 부자재 찾아보기", keyword: "마루 부자재 방습지" },
    tool: { label: "바닥재 시공 공구 보기", keyword: "마루 시공 공구" },
  },
  secondary: [
    { key: "underlay", label: "방습지·완충재", keyword: "마루 방습지" },
    { key: "bond", label: "마루 본드", keyword: "마루 본드" },
    { key: "molding", label: "걸레받이 몰딩", keyword: "걸레받이 몰딩" },
    { key: "saw", label: "재단 톱", keyword: "마루 재단 톱" },
  ],
};
