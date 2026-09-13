/**
 * 집 전체 계산. (여러 방을 한 번에)
 *
 * 방 하나씩 계산하는 기존 계산기와 달리, 방별 결과를 올바르게 합산한다.
 * 특히 벽지는 **방마다 필요 폭 수를 올림한 뒤 합산**해야 한다.
 * 전체 둘레를 한꺼번에 롤 폭으로 나누면 방별 올림 손실이 빠져 실제보다 적게 나온다.
 *
 * core.ts 의 순수 함수만 조합한다. 제휴 코드는 여기서도 import 하지 않는다. (명세 §19)
 */

import {
  calculateArea,
  calculateFlooring,
  calculatePaint,
  calculateWallpaper,
  calculateWood,
  DEFAULT_SPARE,
} from "./core.ts";

export type Room = {
  id: string;
  name: string;
  width: number;
  depth: number;
  height: number;
};

export type HouseInput = {
  rooms: Room[];
  wallpaper: { rollWidth: number; rollLength: number; patternRepeat: number };
  /** 벽 면적 대비 창문·문 비율 (0~1) */
  openingRatio: number;
  paint: { coats: number; spreadRate: number };
  flooring: { rollWidth: number };
  wood: { boxCoverage: number };
};

export type RoomResult = {
  id: string;
  name: string;
  floorArea: number;
  pyeong: number;
  perimeter: number;
  wallArea: number;
  /** 벽지 필요 폭 수 (이미 올림됨) */
  strips: number;
  /** 이 방 기준 롤당 폭 수 */
  stripsPerRoll: number;
  /** 소수점 롤 — 합산용 */
  rolls: number;
};

export type HouseResult = {
  rooms: RoomResult[];
  totals: {
    floorArea: number;
    pyeong: number;
    perimeter: number;
    wallArea: number;
    /** 개구부를 뺀 도장 가능 면적 */
    paintableWallArea: number;
    strips: number;
  };
  wallpaper: { requiredRolls: number; recommendedRolls: number };
  paint: { requiredLiters: number; recommendedLiters: number };
  flooring: { requiredLength: number; recommendedLength: number };
  wood: { requiredBoxes: number; recommendedBoxes: number };
};

const round = (n: number, d = 1) => {
  const f = 10 ** d;
  return Math.round(n * f) / f;
};

export function calculateHouse(input: HouseInput): HouseResult {
  const rooms: RoomResult[] = input.rooms.map((room) => {
    const a = calculateArea({ width: room.width, depth: room.depth, height: room.height });
    const w = calculateWallpaper({
      perimeter: a.perimeter,
      height: room.height,
      rollWidth: input.wallpaper.rollWidth,
      rollLength: input.wallpaper.rollLength,
      patternRepeat: input.wallpaper.patternRepeat,
    });
    return {
      id: room.id,
      name: room.name,
      floorArea: a.floorArea,
      pyeong: a.pyeong,
      perimeter: a.perimeter,
      wallArea: a.wallArea,
      strips: w.stripsNeeded,
      stripsPerRoll: w.stripsPerRoll,
      rolls: Number.isFinite(w.requiredRolls) ? w.requiredRolls : 0,
    };
  });

  const sum = (pick: (r: RoomResult) => number) => rooms.reduce((acc, r) => acc + pick(r), 0);

  const floorArea = round(sum((r) => r.floorArea), 2);
  const wallArea = round(sum((r) => r.wallArea), 2);
  const paintableWallArea = round(wallArea * (1 - input.openingRatio), 2);

  // 벽지: 방별 롤(소수)을 합산한 뒤 마지막에 올림한다.
  // 방마다 올림하면 실제로 사는 양보다 과하게 나온다 — 구매는 전체 합계로 하기 때문이다.
  const requiredRolls = round(sum((r) => r.rolls), 1);

  const paint = calculatePaint({
    wallArea: paintableWallArea,
    openingArea: 0,
    coats: input.paint.coats,
    spreadRate: input.paint.spreadRate,
  });
  const flooring = calculateFlooring({ area: floorArea, rollWidth: input.flooring.rollWidth });
  const wood = calculateWood({ area: floorArea, boxCoverage: input.wood.boxCoverage });

  return {
    rooms,
    totals: {
      floorArea,
      pyeong: round(sum((r) => r.pyeong), 2),
      perimeter: round(sum((r) => r.perimeter), 2),
      wallArea,
      paintableWallArea,
      strips: sum((r) => r.strips),
    },
    wallpaper: {
      requiredRolls,
      recommendedRolls: Math.ceil(requiredRolls * (1 + DEFAULT_SPARE)),
    },
    paint: { requiredLiters: paint.requiredLiters, recommendedLiters: paint.recommendedLiters },
    flooring,
    wood,
  };
}
