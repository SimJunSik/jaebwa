/**
 * 제휴 관계 고지. (명세 §18)
 * 문구는 config/affiliate.ts 한 곳에서만 관리한다.
 */

import { AFFILIATE_DISCLOSURE } from "@/config/affiliate";

export function AffiliateDisclosure({ variant = "inline" }: { variant?: "inline" | "footer" }) {
  return (
    <p className={"text-xs text-ink-soft"}>
      {AFFILIATE_DISCLOSURE[variant]}
    </p>
  );
}
