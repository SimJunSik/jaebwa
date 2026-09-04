import type { CalculatorAffiliate } from "./types";

/**
 * 평수 계산기 제휴 매핑 (명세 §11)
 * 직접적인 구매 전환이 낮으므로 상품 추천을 두지 않고 관련 계산기로 유도한다.
 */
export const areaAffiliate: CalculatorAffiliate = {
  primary: {
    default: { label: "인테리어 자재 찾아보기", keyword: "인테리어 자재" },
  },
  secondary: [],
};
