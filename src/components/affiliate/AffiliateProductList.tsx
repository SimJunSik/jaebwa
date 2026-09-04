/** 계산 결과 직후에 놓이는 주력 상품 CTA 묶음. (명세 §4, §12) */

import type { AffiliateProduct } from "@/lib/affiliate/links";
import { AffiliateProductCard } from "./AffiliateProductCard";

export function AffiliateProductList({
  products,
  calculator,
  placement,
  heading,
  /** 첫 번째 카드만 라임으로 강조 */
  accentFirst = false,
}: {
  products: AffiliateProduct[];
  calculator: string;
  placement: string;
  heading?: string;
  accentFirst?: boolean;
}) {
  if (products.length === 0) return null;
  return (
    <div>
      {heading ? <h3 className="mb-2 text-sm font-medium text-ink-soft">{heading}</h3> : null}
      <div className="grid gap-2">
        {products.map((p, i) => (
          <AffiliateProductCard
            key={p.trackingId}
            product={p}
            calculator={calculator}
            placement={placement}
            accent={accentFirst && i === 0}
          />
        ))}
      </div>
    </div>
  );
}
