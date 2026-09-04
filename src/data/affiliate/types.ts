/** 제휴 링크 데이터 타입. UI 코드와 분리된 순수 데이터. (명세 §7, §21) */

export type AffiliateTarget = {
  /** CTA 문구. "지금 구매", "최저가" 같은 단정 표현 금지. (§24) */
  label: string;
  /** 검색 기반 링크에 사용할 키워드 (§6) */
  keyword: string;
  /** 수동 생성한 쿠팡파트너스 링크. 있으면 keyword 검색 링크보다 우선한다. */
  url?: string;
  description?: string;
  badge?: string;
};

export type CalculatorAffiliate = {
  /** 계산 결과 바로 아래에 노출되는 주력 상품. variant 키로 조회하며 default 는 필수. (§12) */
  primary: Record<string, AffiliateTarget> & { default: AffiliateTarget };
  /** "같이 준비하면 좋은 것" 부자재. 체크리스트에도 그대로 쓰인다. (§12, §13) */
  secondary: (AffiliateTarget & { key: string })[];
};
