/**
 * variant 키 → 실제 제휴 링크 해석. (명세 §7)
 * 컴포넌트는 URL 을 몰라도 되고, 링크가 바뀌어도 data/affiliate 만 고치면 된다.
 */

import { coupangSearchUrl, withSubId } from "@/config/affiliate";
import { affiliateData, type AffiliateTarget } from "@/data/affiliate";

/** AffiliateProductCard 가 그대로 받는 형태 (§5) */
export type AffiliateProduct = {
  title: string;
  description?: string;
  imageUrl?: string;
  affiliateUrl: string;
  badge?: string;
  quantityText?: string;
  /** MVP 에서는 항상 undefined — 최신 가격을 보장할 수 없으면 표시하지 않는다. (§14) */
  price?: string;
  source: "coupang";
  trackingId: string;
  /** analytics 용 (§9) */
  variant: string;
};

/** 수동 생성 링크가 있으면 그것을, 없으면 검색 링크를 쓴다. (§6) */
export function affiliateHref(target: AffiliateTarget): string {
  return target.url ?? coupangSearchUrl(target.keyword);
}

export function trackingId(calculator: string, placement: string, variant: string): string {
  return `${calculator}-${placement}-${variant}`;
}

function toProduct(
  target: AffiliateTarget,
  calculator: string,
  placement: string,
  variant: string,
  quantityText?: string,
): AffiliateProduct {
  const id = trackingId(calculator, placement, variant);
  return {
    title: target.label,
    description: target.description,
    badge: target.badge,
    quantityText,
    affiliateUrl: withSubId(affiliateHref(target), id),
    source: "coupang",
    trackingId: id,
    variant,
  };
}

/**
 * 계산 결과의 variant 목록을 상품 카드로 변환한다.
 * 없는 키는 default 로 떨어지고, 중복 default 는 한 번만 남는다.
 */
export function resolvePrimaryProducts(
  calculator: string,
  variants: string[],
  placement = "calculator_result",
  quantityText?: string,
): AffiliateProduct[] {
  const data = affiliateData[calculator];
  if (!data) return [];
  const seen = new Set<string>();
  const products: AffiliateProduct[] = [];
  for (const variant of variants.length ? variants : ["default"]) {
    const target = data.primary[variant] ?? data.primary.default;
    const key = target.keyword;
    if (seen.has(key)) continue;
    seen.add(key);
    // 첫 번째 CTA 에만 계산 결과 수량을 붙인다.
    products.push(
      toProduct(target, calculator, placement, variant, products.length === 0 ? quantityText : undefined),
    );
  }
  return products;
}

/** "같이 준비하면 좋은 것" / 구매 체크리스트용 부자재 (§12, §13) */
export function resolveSecondaryProducts(
  calculator: string,
  placement = "cross_sell",
): AffiliateProduct[] {
  const data = affiliateData[calculator];
  if (!data) return [];
  return data.secondary.map((t) => toProduct(t, calculator, placement, t.key));
}
