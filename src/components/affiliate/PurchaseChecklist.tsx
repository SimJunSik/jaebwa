"use client";

/**
 * 구매 체크리스트. (명세 §13)
 * 계산으로 확정된 주자재는 체크된 상태로 고정하고, 부자재는 사용자가 직접 체크한다.
 * 쇼핑몰처럼 보이지 않게 목록 형태를 유지한다. (§12)
 */

import { useState } from "react";
import type { AffiliateProduct } from "@/lib/affiliate/links";
import { AffiliateLink } from "./AffiliateLink";

export function PurchaseChecklist({
  title,
  mainItem,
  items,
  calculator,
}: {
  title: string;
  /** 계산으로 이미 확정된 항목. 예: "페인트 10L" */
  mainItem: string;
  items: AffiliateProduct[];
  calculator: string;
}) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  if (items.length === 0) return null;

  return (
    <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
      <h3 className="text-lg font-bold">{title}</h3>
      <ul className="mt-3 space-y-1">
        <li className="flex items-center justify-between gap-3 border-b border-line py-2.5">
          <span className="flex items-center gap-2 text-sm font-medium">
            <span aria-hidden className="inline-flex size-4 items-center justify-center rounded-full bg-brand text-[10px] text-ink">
              ✓
            </span>
            {mainItem}
          </span>
          <span className="text-xs text-ink-soft">계산 완료</span>
        </li>
        {items.map((item) => (
          <li key={item.trackingId} className="flex items-center justify-between gap-3 py-2">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={Boolean(checked[item.trackingId])}
                onChange={(e) =>
                  setChecked((prev) => ({ ...prev, [item.trackingId]: e.target.checked }))
                }
                className="size-4 accent-ink"
              />
              <span className={checked[item.trackingId] ? "text-ink-soft line-through" : ""}>
                {item.title}
              </span>
            </label>
            <AffiliateLink
              href={item.affiliateUrl}
              calculator={calculator}
              placement="checklist"
              productType={item.trackingId}
              variant={item.variant}
              className="shrink-0 text-sm text-ink-soft underline underline-offset-4 hover:text-ink"
            >
              상품 보기
            </AffiliateLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
