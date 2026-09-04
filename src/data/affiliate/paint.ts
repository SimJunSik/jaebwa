import type { CalculatorAffiliate } from "./types";

/** 페인트 계산기 제휴 매핑 (명세 §11) */
export const paintAffiliate: CalculatorAffiliate = {
  primary: {
    default: { label: "실내용 수성 페인트 찾아보기", keyword: "실내용 수성 페인트", url: "https://link.coupang.com/a/gL55Rw5dC0" },
    "1l": {
      label: "1L 페인트 찾아보기",
      keyword: "실내용 수성 페인트 1L",
      url: "https://link.coupang.com/a/gL6eCbYVIi",
      description: "좁은 면적이나 부분 보수에 쓰는 용량입니다.",
    },
    "4l": {
      label: "4L 페인트 찾아보기",
      keyword: "실내용 수성 페인트 4L",
      url: "https://link.coupang.com/a/gL6fYd52tM",
      description: "방 한 칸 정도 도장에 흔히 쓰는 용량입니다.",
    },
    "10l": {
      label: "10L 페인트 찾아보기",
      keyword: "실내용 수성 페인트 10L",
      url: "https://link.coupang.com/a/gL6hmkwdtQ",
      description: "거실·다수의 방을 한 번에 도장할 때 쓰는 용량입니다.",
    },
    large: {
      label: "대용량 페인트 찾아보기",
      keyword: "실내용 수성 페인트 18L",
      url: "https://link.coupang.com/a/gL6i2nwMXQ",
      description: "18L 이상 대용량 규격입니다.",
    },
    tool: { label: "페인트 도구 세트 보기", keyword: "페인트 롤러 트레이 세트", url: "https://link.coupang.com/a/gL6ke3QAou" },
  },
  secondary: [
    { key: "roller", label: "페인트 롤러", keyword: "페인트 롤러" },
    { key: "brush", label: "붓", keyword: "페인트 붓" },
    { key: "tray", label: "트레이", keyword: "페인트 트레이" },
    { key: "masking", label: "마스킹 테이프", keyword: "마스킹 테이프" },
    { key: "covering", label: "커버링 테이프", keyword: "커버링 테이프 비닐" },
    { key: "primer", label: "프라이머", keyword: "수성 프라이머" },
  ],
};
