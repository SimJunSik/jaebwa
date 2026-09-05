/**
 * Google Analytics 4 설정. (명세 §9, §25)
 *
 * 측정 ID 가 없으면 스크립트를 넣지 않는다. lib/affiliate/tracking.ts 의 이벤트는
 * gtag 가 없으면 조용히 무시되므로, 미설정 상태에서도 링크 동작에는 영향이 없다.
 */

/** G-XXXXXXXXXX 형태 */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

export const GA_ENABLED = GA_MEASUREMENT_ID.startsWith("G-");
