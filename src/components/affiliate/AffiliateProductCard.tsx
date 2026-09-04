/**
 * 제휴 상품 카드. (명세 §5, §23)
 * 광고 배너가 아니라 계산 결과의 다음 단계처럼 보이게 한다.
 * 가격은 최신값을 보장할 수 없으므로 표시하지 않는다. (§14)
 *
 * accent=true 인 카드 하나만 라임으로 채운다. 전부 채우면 상품 추천이
 * 계산 결과보다 강해져서 §1 이 깨진다.
 */

import { PRICE_NOTICE } from "@/config/affiliate";
import type { AffiliateProduct } from "@/lib/affiliate/links";
import { AffiliateLink } from "./AffiliateLink";

export function AffiliateProductCard({
  product,
  calculator,
  placement,
  accent = false,
}: {
  product: AffiliateProduct;
  calculator: string;
  placement: string;
  accent?: boolean;
}) {
  return (
    <AffiliateLink
      href={product.affiliateUrl}
      calculator={calculator}
      placement={placement}
      productType={product.trackingId}
      variant={product.variant}
      className={`group flex items-center justify-between gap-3 rounded-xl px-4 py-3.5 transition ${
        accent
          ? "bg-brand hover:bg-brand-dark"
          : "border border-line bg-white hover:border-ink/25 hover:bg-paper"
      }`}
    >
      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-ink">{product.title}</span>
          {product.badge ? (
            <span
              className={`rounded px-1.5 py-0.5 text-xs ${
                accent ? "bg-ink/10 text-ink" : "bg-paper text-ink-soft"
              }`}
            >
              {product.badge}
            </span>
          ) : null}
        </span>
        {product.quantityText ? (
          <span className={`mt-0.5 block text-sm ${accent ? "text-ink/70" : "text-ink-soft"}`}>
            {product.quantityText}
          </span>
        ) : null}
        {product.description ? (
          <span className={`mt-0.5 block text-sm ${accent ? "text-ink/70" : "text-ink-soft"}`}>
            {product.description}
          </span>
        ) : null}
        <span className={`mt-1 block text-xs ${accent ? "text-ink/60" : "text-ink-soft"}`}>
          {PRICE_NOTICE}
        </span>
      </span>
      <span
        aria-hidden
        className="shrink-0 font-medium text-ink transition group-hover:translate-x-0.5"
      >
        →
      </span>
    </AffiliateLink>
  );
}
