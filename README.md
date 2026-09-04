# 인테리어 자재 계산기

필요량 계산 → 실제 구매 단위 변환 → 관련 상품 CTA 로 이어지는 계산기 사이트.

```bash
npm run dev     # 개발 서버
npm test        # 계산/구매추천 로직 검증
npm run build   # 정적 빌드 (계산기 페이지는 전부 SSG)
```

## 구조

| 위치 | 역할 |
| --- | --- |
| `src/lib/calculators/core.ts` | 순수 계산. 제휴 코드를 import 하지 않는다. |
| `src/lib/affiliate/recommendation.ts` | 계산 결과 → 구매 단위 변환 + variant 키 |
| `src/lib/affiliate/links.ts` | variant 키 → 실제 제휴 URL |
| `src/lib/affiliate/tracking.ts` | `affiliate_click` 이벤트 |
| `src/lib/affiliate/coupang.ts` | Phase 3 API 자리 (서버 전용) |
| `src/data/affiliate/*.ts` | 계산기별 제휴 링크 데이터 |
| `src/config/affiliate.ts` | 파트너 태그, 검색 URL 규칙, 고지 문구 |
| `src/lib/calculators/registry.ts` | 계산기 정의 (필드·결과·가이드) |

계산 로직과 상품 추천 로직은 서로를 모른다. 제휴 상품 사정이 계산 결과를 바꾸는 일은 구조적으로 불가능하다.

## 제휴 링크 바꾸기

UI 코드는 건드리지 않는다. `src/data/affiliate/<계산기>.ts` 만 수정한다.

```ts
"10l": {
  label: "10L 페인트 찾아보기",
  keyword: "실내용 수성 페인트 10L",
  url: "https://link.coupang.com/a/XXXXX",  // 넣으면 검색 링크 대신 이 링크를 쓴다
}
```

`url` 이 없으면 `keyword` 로 쿠팡 검색 링크를 만든다 (MVP 기본값).

## 계산기 추가

`src/lib/calculators/core.ts` 에 계산 함수, `recommendation.ts` 에 구매 추천 함수,
`data/affiliate/` 에 링크 데이터, `registry.ts` 에 정의를 추가하면 라우트·사이트맵·내비게이션이 따라온다.

## 환경변수

`.env.example` 참고. `COUPANG_PARTNERS_*` 는 서버 전용이며 `NEXT_PUBLIC_` 을 붙이지 않는다.
