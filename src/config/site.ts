export const site = {
  name: "재봐",
  nameEn: "jaebwa",
  /** 메인 슬로건 */
  slogan: "인테리어, 사기 전에 재봐.",
  /** SEO 용 홈 타이틀 */
  seoTitle: "재봐 - 인테리어 자재 계산기",
  description:
    "페인트, 벽지, 타일, 마루 등 우리 집에 필요한 자재를 간단하게 계산하세요. 필요한 양부터 실제로 몇 개를 사야 하는지까지 알려드려요.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://jaebwa.com",
  /**
   * 공개 문의 이메일. 개인정보처리방침에 표시된다.
   * 비어 있으면 문의 항목이 렌더링되지 않는다 — 애드센스 심사에는 있는 편이 유리하다.
   */
  contact: "wnstlr24.alarmcon@gmail.com",
  /** 개인정보처리방침 시행일 */
  privacyEffectiveDate: "2026년 9월 5일",
} as const;
