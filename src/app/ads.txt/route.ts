import { ADSENSE_ENABLED, ADSENSE_PUBLISHER_ID } from "@/config/ads";

/**
 * ads.txt — 광고 인벤토리를 팔 수 있는 주체를 명시하는 IAB 표준 파일. (애드센스 승인 후 필수)
 * 퍼블리셔 ID 가 없으면 404 를 낸다. 잘못된 ads.txt 는 없는 것보다 나쁘다.
 */
export function GET() {
  if (!ADSENSE_ENABLED) {
    return new Response("Not Found", { status: 404 });
  }
  return new Response(`google.com, ${ADSENSE_PUBLISHER_ID}, DIRECT, f08c47fec0942fa0\n`, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
