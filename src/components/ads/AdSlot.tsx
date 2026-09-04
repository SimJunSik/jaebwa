/**
 * AdSense 자리. (명세 §22, §28 Phase 1 "AdSlot placeholder")
 *
 * 계산 결과와 상품 추천 사이에는 절대 넣지 않는다. (§4)
 * NEXT_PUBLIC_ADSENSE_CLIENT 가 없으면 아무것도 렌더링하지 않는다 —
 * 빈 광고 박스가 레이아웃을 흔들지 않게 한다.
 */

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "";

export function AdSlot({ slot, label = "광고" }: { slot: string; label?: string }) {
  if (!ADSENSE_CLIENT) {
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
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
