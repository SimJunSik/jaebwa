/**
 * 제휴 링크 설정. (명세 §7, §18)
 *
 * 제휴 URL·고지 문구를 컴포넌트에 하드코딩하지 않기 위한 단일 지점.
 * 파트너 링크가 바뀌어도 UI 코드는 수정하지 않는다.
 */

/**
 * 검색 결과 페이지 URL. **제휴 추적이 되지 않는 fallback 이다.**
 *
 * 쿠팡파트너스 수수료는 파트너스에서 발급한 link.coupang.com 링크를 통과할 때만 인정된다.
 * coupang.com URL 에 lptag 같은 파라미터를 직접 붙여도 추적되지 않으므로 붙이지 않는다.
 *
 * 이 함수는 data/affiliate 의 target 에 `url`(발급받은 파트너 링크)이 아직 없을 때만 쓰인다.
 * 링크가 없어도 사용자는 원하는 상품 목록으로 이동할 수 있어야 하기 때문이다. (§16)
 *
 * 파트너스 콘솔에 붙여넣을 원본 URL 도 이 함수로 만든다. `npm run affiliate:links` 참고.
 */
export function coupangSearchUrl(keyword: string): string {
  const url = new URL("https://www.coupang.com/np/search");
  url.searchParams.set("q", keyword);
  return url.toString();
}

/**
 * 파트너 링크에 subId 를 붙여 계산기·위치별 성과를 쿠팡 리포트에서도 구분한다. (§9, §25)
 *
 * GA 의 affiliate_click 은 "클릭"까지만 보이고, 실제 구매 전환은 쿠팡 리포트에만 있다.
 * 같은 trackingId 를 subId 로 넘겨야 두 데이터를 이어붙일 수 있다.
 *
 * link.coupang.com 링크에만 붙인다 — 추적되지 않는 검색 fallback 에 붙이면 의미가 없다.
 * 운영 시작 전 링크 하나로 파트너스 리포트에 subId 가 찍히는지 반드시 확인할 것.
 */
export function withSubId(href: string, subId: string): string {
  if (!href.includes("link.coupang.com")) return href;
  try {
    const url = new URL(href);
    url.searchParams.set("subId", subId);
    return url.toString();
  } catch {
    return href;
  }
}

/**
 * 제휴 고지 문구. (§18)
 * 운영 시작 직전 최신 쿠팡파트너스 약관 및 표시 기준을 확인해 최종 문구를 확정할 것.
 */
export const AFFILIATE_DISCLOSURE = {
  inline:
    "쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.",
  footer:
    "쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다. 일부 링크는 제휴 링크이며, 상품의 가격과 재고는 쿠팡에서 확인해 주세요.",
} as const;

/** 가격을 정적으로 표시하지 않는다. (§14) 대신 쓰는 문구. */
export const PRICE_NOTICE = "가격·재고는 쿠팡에서 확인";
