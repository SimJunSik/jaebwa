import { apartment24 } from "./apartment-24";
import { floorCompare } from "./floor-compare";
import { interiorBudget } from "./interior-budget";
import { interiorOrder } from "./interior-order";
import { materialSpare } from "./material-spare";
import { moldWall } from "./mold-wall";
import { paintColor } from "./paint-color";
import { rentalInterior } from "./rental-interior";
import { selfPainting } from "./self-painting";
import { selfWallpaper } from "./self-wallpaper";
import { siliconeReplace } from "./silicone-replace";
import { tileOverlay } from "./tile-overlay";
import type { Article } from "./types";
import { wallpaperChoice } from "./wallpaper-choice";

/** 목록 노출 순서 */
export const articles: Article[] = [
  selfWallpaper,
  selfPainting,
  interiorOrder,
  apartment24,
  materialSpare,
  interiorBudget,
  floorCompare,
  wallpaperChoice,
  paintColor,
  tileOverlay,
  siliconeReplace,
  moldWall,
  rentalInterior,
];

export const articleMap: Record<string, Article> = Object.fromEntries(
  articles.map((a) => [a.slug, a]),
);

export function getArticle(slug: string): Article | undefined {
  return articleMap[slug];
}

/** 특정 계산기와 연결된 아티클 */
export function articlesForCalculator(slug: string): Article[] {
  return articles.filter((a) => a.calculators.includes(slug));
}

export type { Article, ArticleSection } from "./types";
