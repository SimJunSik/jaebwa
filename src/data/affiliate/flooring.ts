import type { CalculatorAffiliate } from "./types";

/** 장판 계산기 제휴 매핑 (명세 §11) */
export const flooringAffiliate: CalculatorAffiliate = {
  primary: {
    default: { label: "장판 찾아보기", keyword: "장판" },
    "1.8m": { label: "폭 1.8m 장판 찾아보기", keyword: "장판 폭 1.8m" },
    "2m": { label: "폭 2m 장판 찾아보기", keyword: "장판 폭 2m" },
    "2.2m": { label: "폭 2.2m 장판 찾아보기", keyword: "장판 폭 2.2m" },
    bond: { label: "장판용 본드 찾아보기", keyword: "장판 본드" },
    tool: { label: "장판 시공 공구 보기", keyword: "장판 시공 공구" },
  },
  secondary: [
    { key: "bond", label: "장판용 본드", keyword: "장판 본드" },
    { key: "tape", label: "장판 조인트 테이프", keyword: "장판 조인트 테이프" },
    { key: "knife", label: "재단 칼", keyword: "장판 재단 칼" },
    { key: "silicone", label: "마감 실리콘", keyword: "인테리어 실리콘" },
  ],
};
