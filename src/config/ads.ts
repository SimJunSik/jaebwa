/**
 * Google AdSense 설정. (명세 §22)
 *
 * 퍼블리셔 ID 가 없으면 스크립트도, 광고 자리도 렌더링하지 않는다.
 * 심사 전에 빈 광고 박스가 레이아웃을 흔들거나 정책 위반이 되는 걸 막는다.
 */

/** ca-pub-0000000000000000 형태 */
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "";

export const ADSENSE_ENABLED = ADSENSE_CLIENT.startsWith("ca-pub-");

/** ads.txt 에는 ca- 접두어를 뗀 pub-... 형태를 쓴다. */
export const ADSENSE_PUBLISHER_ID = ADSENSE_CLIENT.replace(/^ca-/, "");
