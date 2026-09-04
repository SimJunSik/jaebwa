"use client";

/**
 * 모든 제휴 링크는 이 컴포넌트를 통한다. (명세 §8)
 * 클릭 analytics, 외부 링크 처리, rel 속성을 한 곳에서 보장한다.
 */

import type { ReactNode } from "react";
import { trackAffiliateClick } from "@/lib/affiliate/tracking";

type Props = {
  href: string;
  calculator: string;
  /** calculator_result | cross_sell | checklist | footer ... */
  placement: string;
  productType: string;
  variant?: string;
  className?: string;
  children: ReactNode;
};

export function AffiliateLink({
  href,
  calculator,
  placement,
  productType,
  variant,
  className,
  children,
}: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      data-affiliate={productType}
      className={className}
      onClick={() =>
        trackAffiliateClick({ calculator, placement, product_type: productType, variant })
      }
    >
      {children}
    </a>
  );
}
