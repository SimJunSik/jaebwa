/**
 * 제휴 링크 클릭 analytics. (명세 §9)
 *
 * GA4(gtag) 또는 GTM(dataLayer) 중 붙어 있는 쪽으로 보낸다.
 * 둘 다 없으면 조용히 무시한다 — analytics 유무가 링크 동작에 영향을 주면 안 된다.
 */

export type AffiliateClickEvent = {
  calculator: string;
  /** calculator_result | cross_sell | checklist | footer ... */
  placement: string;
  product_type: string;
  variant?: string;
};

declare global {
  interface Window {
    gtag?: (command: string, eventName: string, params?: Record<string, unknown>) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

export const AFFILIATE_CLICK_EVENT = "affiliate_click";

export function trackAffiliateClick(event: AffiliateClickEvent): void {
  if (typeof window === "undefined") return;
  try {
    // gtag 가 있으면 그쪽만 쓴다. 둘 다 쏘면 GTM 을 붙였을 때 중복 집계된다.
    if (window.gtag) window.gtag("event", AFFILIATE_CLICK_EVENT, event);
    else window.dataLayer?.push({ event: AFFILIATE_CLICK_EVENT, ...event });
  } catch {
    // analytics 실패가 링크 이동을 막지 않게 한다.
  }
}

/** 계산 완료율(§25) 측정을 위한 이벤트. */
export function trackCalculationComplete(calculator: string): void {
  if (typeof window === "undefined") return;
  try {
    if (window.gtag) window.gtag("event", "calculation_complete", { calculator });
    else window.dataLayer?.push({ event: "calculation_complete", calculator });
  } catch {
    // noop
  }
}
