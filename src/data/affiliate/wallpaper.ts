import type { CalculatorAffiliate } from "./types";

/** 벽지 계산기 제휴 매핑 (명세 §11) */
export const wallpaperAffiliate: CalculatorAffiliate = {
  primary: {
    default: { label: "벽지 찾아보기", keyword: "벽지", url: "https://link.coupang.com/a/gL6wcJjGfI" },
    silk: {
      label: "실크벽지 찾아보기",
      keyword: "실크벽지",
      url: "https://link.coupang.com/a/gL6xsbOZXg",
      description: "폭 106cm 기준 규격입니다.",
    },
    hapji: {
      label: "합지벽지 찾아보기",
      keyword: "합지벽지",
      url: "https://link.coupang.com/a/gL6yrEEE8W",
      description: "폭 93cm 소폭 합지 기준 규격입니다.",
    },
    paste: { label: "벽지 풀 찾아보기", keyword: "벽지 풀", url: "https://link.coupang.com/a/gL6AVgWpEa" },
    tool: { label: "도배 도구 세트 보기", keyword: "도배 도구 세트", url: "https://link.coupang.com/a/gL6Cak817I" },
  },
  secondary: [
    { key: "paste", label: "벽지 풀", keyword: "벽지 풀", url: "https://link.coupang.com/a/gL6AVgWpEa" },
    { key: "roller", label: "도배 롤러", keyword: "도배 롤러" },
    { key: "knife", label: "도배 칼", keyword: "도배 칼" },
    { key: "brush", label: "도배 솔", keyword: "도배 솔" },
    { key: "set", label: "도배 세트", keyword: "도배 세트" },
  ],
};
