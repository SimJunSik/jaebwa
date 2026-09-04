import type { CalculatorAffiliate } from "./types";
import { areaAffiliate } from "./area";
import { flooringAffiliate } from "./flooring";
import { moldingAffiliate } from "./molding";
import { paintAffiliate } from "./paint";
import { siliconeAffiliate } from "./silicone";
import { tileAffiliate } from "./tile";
import { wallpaperAffiliate } from "./wallpaper";
import { woodAffiliate } from "./wood";

export const affiliateData: Record<string, CalculatorAffiliate> = {
  area: areaAffiliate,
  paint: paintAffiliate,
  wallpaper: wallpaperAffiliate,
  tile: tileAffiliate,
  flooring: flooringAffiliate,
  wood: woodAffiliate,
  molding: moldingAffiliate,
  silicone: siliconeAffiliate,
};

export type { AffiliateTarget, CalculatorAffiliate } from "./types";
