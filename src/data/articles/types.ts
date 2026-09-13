/** 가이드 아티클 타입. 계산기와 별개의 읽을거리다. */

export type ArticleSection = {
  heading: string;
  body: string[];
  /** 표: 첫 행이 헤더 */
  table?: { head: string[]; rows: string[][] };
  /** 체크리스트나 순서 목록 */
  list?: { ordered?: boolean; items: string[] };
  /** 강조 박스 — 주의사항이나 요약 */
  callout?: { title: string; body: string };
};

export type Article = {
  slug: string;
  title: string;
  /** 검색 결과 제목 */
  seoTitle: string;
  description: string;
  keywords: string[];
  emoji: string;
  /** ISO 날짜 */
  publishedAt: string;
  /** 한 줄 요약 — 목록과 본문 상단에 쓰인다 */
  summary: string;
  /** 읽는 데 걸리는 시간 (분) */
  readingMinutes: number;
  sections: ArticleSection[];
  faq?: { q: string; a: string }[];
  /** 관련 계산기 slug */
  calculators: string[];
  /** 관련 아티클 slug */
  related: string[];
};
