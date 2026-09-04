import type { CalculatorAffiliate } from "./types";

/** 몰딩 계산기 제휴 매핑 (명세 §11) */
export const moldingAffiliate: CalculatorAffiliate = {
  primary: {
    default: { label: "인테리어 몰딩 찾아보기", keyword: "인테리어 몰딩" },
    adhesive: { label: "몰딩 접착제 찾아보기", keyword: "몰딩 접착제" },
    tool: { label: "몰딩 절단 도구 보기", keyword: "몰딩 절단 마이터박스" },
  },
  secondary: [
    { key: "adhesive", label: "몰딩 접착제", keyword: "몰딩 접착제" },
    { key: "silicone", label: "마감 실리콘", keyword: "인테리어 실리콘" },
    { key: "miter", label: "마이터박스", keyword: "마이터박스" },
    { key: "nail", label: "타카·핀", keyword: "몰딩 타카핀" },
  ],
};
