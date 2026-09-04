"use client";

/**
 * AdSense 광고 자리. (명세 §22)
 *
 * 계산 결과와 상품 추천 사이에는 절대 넣지 않는다. (§4)
 * 퍼블리셔 ID 가 없으면 아무것도 렌더링하지 않는다 — 심사 전에 빈 박스를 노출하지 않는다.
 *
 * 실제 광고 표시는 두 가지가 모두 있어야 한다:
 *   1) layout 에서 로드하는 adsbygoogle.js  2) 슬롯마다 push({}) 한 번
 * push 를 빼먹으면 <ins> 만 남고 광고가 나오지 않는다.
 */

import { useEffect, useRef } from "react";
import { ADSENSE_CLIENT, ADSENSE_ENABLED } from "@/config/ads";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function AdSlot({ slot, label = "광고" }: { slot: string; label?: string }) {
  const pushed = useRef(false);

  useEffect(() => {
    if (!ADSENSE_ENABLED || pushed.current) return;
    // React 개발 모드의 이중 실행로 두 번 push 되면 "already have ads" 에러가 난다.
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle ?? []).push({});
    } catch {
      // 광고 로드 실패가 페이지를 깨뜨리지 않게 한다.
    }
  }, []);

  if (!ADSENSE_ENABLED) {
    if (process.env.NODE_ENV !== "development") return null;
    return (
      <div
        data-ad-slot={slot}
        className="rounded-2xl border border-dashed border-line py-8 text-center text-xs text-ink-soft"
      >
        AdSlot: {slot}
      </div>
    );
  }

  return (
    <aside aria-label={label}>
      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
