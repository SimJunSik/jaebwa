/**
 * 쿠팡파트너스 API 연동 자리. (명세 §15, §16, §17)
 *
 * Phase 1(현재): 호출하지 않는다. searchProducts 는 항상 null 을 돌려주고
 *                UI 는 data/affiliate 의 검색 링크로 fallback 한다. (§16)
 * Phase 3: 아래 fetch 부분만 채우면 된다. 호출부 시그니처는 바뀌지 않는다.
 *
 * API Key 는 NEXT_PUBLIC_ 접두사가 없는 서버 전용 환경변수만 사용하고,
 * 이 모듈은 클라이언트에서 실행되면 즉시 throw 해서 번들 포함을 막는다. (§15, §27-10)
 */

export type ProductQuery = {
  keyword: string;
  limit?: number;
};

export type CoupangProduct = {
  productId: string;
  productName: string;
  productImage?: string;
  productUrl: string;
};

function assertServerOnly() {
  if (typeof window !== "undefined") {
    throw new Error("coupang.ts 는 서버에서만 사용할 수 있습니다. API Secret 유출 위험.");
  }
}

export function isCoupangApiConfigured(): boolean {
  return Boolean(
    process.env.COUPANG_PARTNERS_ACCESS_KEY && process.env.COUPANG_PARTNERS_SECRET_KEY,
  );
}

/**
 * 상품 검색. 미설정·실패 시 null 을 반환한다 (throw 하지 않는다).
 * 호출부는 null 이면 검색 링크 CTA 로 대체한다 — 계산 기능은 어떤 경우에도 정상 동작한다. (§16)
 */
export async function searchProducts(_query: ProductQuery): Promise<CoupangProduct[] | null> {
  assertServerOnly();
  if (!isCoupangApiConfigured()) return null;

  // ponytail: Phase 3에서 HMAC 서명 + fetch + 캐싱(§17) 구현. 그 전까지는 fallback 유지.
  return null;
}
