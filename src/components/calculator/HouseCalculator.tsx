"use client";

/**
 * 집 전체 계산기.
 *
 * 방을 여러 개 입력받아 자재별 총량을 한 번에 낸다.
 * 경쟁 계산기는 대부분 방 하나씩만 다루는데, 실제 사용자는 집 전체를 한다.
 *
 * 순서는 단일 계산기와 같다: 입력 → 결과 → 구매량 → 상품 CTA → (광고는 바깥) (명세 §4)
 */

import { useMemo, useRef, useState } from "react";
import { AffiliateDisclosure } from "@/components/affiliate/AffiliateDisclosure";
import { AffiliateProductList } from "@/components/affiliate/AffiliateProductList";
import { resolvePrimaryProducts } from "@/lib/affiliate/links";
import {
  getFlooringPurchaseRecommendation,
  getPaintPurchaseRecommendation,
  getWallpaperPurchaseRecommendation,
  getWoodPurchaseRecommendation,
  type PurchasePlan,
} from "@/lib/affiliate/recommendation";
import { calculateHouse, type Room } from "@/lib/calculators/house";
import { trackCalculationComplete } from "@/lib/affiliate/tracking";

const WALLPAPER_KINDS = {
  silk: { label: "실크벽지 (폭 106cm / 15.6m)", rollWidth: 1.06, rollLength: 15.6 },
  hapji: { label: "합지벽지 (폭 93cm / 17.75m)", rollWidth: 0.93, rollLength: 17.75 },
} as const;

const DEFAULT_ROOMS: Room[] = [
  { id: "r1", name: "거실", width: 4.5, depth: 3.6, height: 2.3 },
  { id: "r2", name: "안방", width: 3.6, depth: 3.3, height: 2.3 },
  { id: "r3", name: "작은방", width: 3.0, depth: 2.7, height: 2.3 },
];

const num = (v: string, fallback = 0) => {
  const n = Number.parseFloat(v);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
};

export function HouseCalculator() {
  const [rooms, setRooms] = useState<Room[]>(DEFAULT_ROOMS);
  const [kind, setKind] = useState<keyof typeof WALLPAPER_KINDS>("silk");
  const [patternRepeat, setPatternRepeat] = useState("0");
  const [openingPercent, setOpeningPercent] = useState("12");
  const [coats, setCoats] = useState("2");
  const [spreadRate, setSpreadRate] = useState("10");
  const [flooringWidth, setFlooringWidth] = useState("1.8");
  const [boxCoverage, setBoxCoverage] = useState("2.4");
  const tracked = useRef(false);

  const touch = () => {
    if (!tracked.current) {
      tracked.current = true;
      trackCalculationComplete("house");
    }
  };

  const valid = rooms.length > 0 && rooms.every((r) => r.width > 0 && r.depth > 0 && r.height > 0);

  const result = useMemo(() => {
    if (!valid) return null;
    return calculateHouse({
      rooms,
      wallpaper: { ...WALLPAPER_KINDS[kind], patternRepeat: num(patternRepeat) },
      openingRatio: Math.min(0.8, num(openingPercent) / 100),
      paint: { coats: num(coats, 2), spreadRate: num(spreadRate, 10) },
      flooring: { rollWidth: num(flooringWidth, 1.8) },
      wood: { boxCoverage: num(boxCoverage, 2.4) },
    });
  }, [rooms, kind, patternRepeat, openingPercent, coats, spreadRate, flooringWidth, boxCoverage, valid]);

  const update = (id: string, field: keyof Room, value: string) => {
    touch();
    setRooms((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, [field]: field === "name" ? value : num(value) } : r,
      ),
    );
  };

  const addRoom = () => {
    touch();
    setRooms((prev) => [
      ...prev,
      {
        id: `r${Date.now()}`,
        name: `방 ${prev.length + 1}`,
        width: 3,
        depth: 3,
        height: prev[0]?.height ?? 2.3,
      },
    ]);
  };

  const removeRoom = (id: string) => {
    touch();
    setRooms((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* 방 입력 */}
      <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-bold">방 추가하기</h2>
          <span className="text-sm text-ink-soft">{rooms.length}개</span>
        </div>

        <div className="mt-4 space-y-3">
          {rooms.map((room) => (
            <div key={room.id} className="rounded-xl border border-line bg-paper p-3">
              <div className="flex items-center gap-2">
                <input
                  aria-label="공간 이름"
                  value={room.name}
                  onChange={(e) => update(room.id, "name", e.target.value)}
                  className="min-w-0 flex-1 rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium outline-none focus:border-ink"
                />
                <button
                  type="button"
                  onClick={() => removeRoom(room.id)}
                  disabled={rooms.length === 1}
                  className="shrink-0 rounded-lg px-2.5 py-2 text-sm text-ink-soft transition hover:bg-white hover:text-ink disabled:opacity-30"
                  aria-label={`${room.name} 삭제`}
                >
                  삭제
                </button>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {(
                  [
                    ["width", "가로"],
                    ["depth", "세로"],
                    ["height", "천장고"],
                  ] as const
                ).map(([field, label]) => (
                  <label key={field} className="block">
                    <span className="text-xs text-ink-soft">{label} (m)</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step={0.1}
                      value={room[field]}
                      onChange={(e) => update(room.id, field, e.target.value)}
                      className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-base tabular-nums outline-none focus:border-ink"
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addRoom}
          className="mt-3 w-full rounded-xl border border-dashed border-line py-3 text-sm font-medium text-ink-soft transition hover:border-ink/30 hover:text-ink"
        >
          + 방 추가
        </button>
      </section>

      {!result ? (
        <p className="rounded-2xl border border-line bg-white p-5 text-sm text-ink-soft">
          모든 방의 치수를 입력하면 결과를 바로 계산해드려요.
        </p>
      ) : (
        <>
          {/* 합계 */}
          <section className="overflow-hidden rounded-2xl border border-line bg-white">
            <div className="h-1.5 bg-brand" />
            <div className="p-5 sm:p-6">
              <p className="text-sm text-ink-soft">집 전체 합계</p>
              <div className="mt-2 grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-ink-soft">총 바닥 면적</p>
                  <p className="mt-0.5 text-4xl font-bold tracking-tight tabular-nums sm:text-5xl">
                    {result.totals.floorArea} m²
                  </p>
                  <p className="mt-1 text-sm text-ink-soft">{result.totals.pyeong} 평</p>
                </div>
                <div>
                  <p className="text-sm text-ink-soft">총 벽 면적</p>
                  <p className="mt-0.5 text-4xl font-bold tracking-tight tabular-nums sm:text-5xl">
                    {result.totals.wallArea} m²
                  </p>
                  <p className="mt-1 text-sm text-ink-soft">
                    벽 둘레 합계 {result.totals.perimeter} m
                  </p>
                </div>
              </div>

              {/* 방별 표 */}
              <div className="mt-6 overflow-x-auto rounded-xl border border-line">
                <table className="w-full min-w-[30rem] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-line bg-paper">
                      <th className="px-3 py-2.5 text-left font-semibold">공간</th>
                      <th className="px-3 py-2.5 text-right font-semibold">바닥</th>
                      <th className="px-3 py-2.5 text-right font-semibold">벽 둘레</th>
                      <th className="px-3 py-2.5 text-right font-semibold">벽지 폭</th>
                      <th className="px-3 py-2.5 text-right font-semibold">벽지 롤</th>
                    </tr>
                  </thead>
                  <tbody className="tabular-nums">
                    {result.rooms.map((r) => (
                      <tr key={r.id} className="border-b border-line">
                        <td className="px-3 py-2.5 font-medium">{r.name}</td>
                        <td className="px-3 py-2.5 text-right text-ink-soft">{r.floorArea} m²</td>
                        <td className="px-3 py-2.5 text-right text-ink-soft">{r.perimeter} m</td>
                        <td className="px-3 py-2.5 text-right text-ink-soft">{r.strips} 폭</td>
                        <td className="px-3 py-2.5 text-right text-ink-soft">{r.rolls} 롤</td>
                      </tr>
                    ))}
                    <tr className="bg-paper font-semibold">
                      <td className="px-3 py-2.5">합계</td>
                      <td className="px-3 py-2.5 text-right">{result.totals.floorArea} m²</td>
                      <td className="px-3 py-2.5 text-right">{result.totals.perimeter} m</td>
                      <td className="px-3 py-2.5 text-right">{result.totals.strips} 폭</td>
                      <td className="px-3 py-2.5 text-right">{result.wallpaper.requiredRolls} 롤</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-5 rounded-xl bg-paper p-4">
                <p className="text-sm font-semibold">방마다 따로 계산해서 더했어요</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                  벽지는 방마다 필요한 폭 수를 올림한 뒤 합산했습니다. 전체 둘레{" "}
                  {result.totals.perimeter}m를 한 번에 롤 폭으로 나누면 방별 올림이 빠져 실제보다
                  적게 나옵니다.
                </p>
              </div>
            </div>
          </section>

          {/* 자재별 결과 + 구매 CTA */}
          <MaterialBlock
            title="벽지"
            emoji="🧻"
            calculator="wallpaper"
            required={`${result.wallpaper.requiredRolls} 롤`}
            plan={getWallpaperPurchaseRecommendation(result.wallpaper.recommendedRolls, kind)}
            options={
              <>
                <Select
                  label="벽지 종류"
                  value={kind}
                  onChange={(v) => {
                    touch();
                    setKind(v as keyof typeof WALLPAPER_KINDS);
                  }}
                  options={Object.entries(WALLPAPER_KINDS).map(([value, k]) => ({
                    value,
                    label: k.label,
                  }))}
                />
                <Field
                  label="무늬 반복"
                  unit="m"
                  value={patternRepeat}
                  onChange={(v) => {
                    touch();
                    setPatternRepeat(v);
                  }}
                />
              </>
            }
          />

          <MaterialBlock
            title="페인트"
            emoji="🎨"
            calculator="paint"
            required={`${result.paint.requiredLiters} L`}
            note={`창문·문 ${openingPercent}%를 뺀 도장 면적 ${result.totals.paintableWallArea}m² 기준`}
            plan={getPaintPurchaseRecommendation(result.paint.recommendedLiters)}
            options={
              <>
                <Field
                  label="창문·문 비율"
                  unit="%"
                  value={openingPercent}
                  onChange={(v) => {
                    touch();
                    setOpeningPercent(v);
                  }}
                />
                <Field
                  label="도장 횟수"
                  unit="회"
                  value={coats}
                  onChange={(v) => {
                    touch();
                    setCoats(v);
                  }}
                />
                <Field
                  label="도포 면적"
                  unit="m²/L"
                  value={spreadRate}
                  onChange={(v) => {
                    touch();
                    setSpreadRate(v);
                  }}
                />
              </>
            }
          />

          <MaterialBlock
            title="장판"
            emoji="🏠"
            calculator="flooring"
            required={`${result.flooring.requiredLength} m`}
            plan={getFlooringPurchaseRecommendation(
              result.flooring.recommendedLength,
              num(flooringWidth, 1.8),
            )}
            options={
              <Select
                label="장판 폭"
                value={flooringWidth}
                onChange={(v) => {
                  touch();
                  setFlooringWidth(v);
                }}
                options={[
                  { value: "1.8", label: "1.8m" },
                  { value: "2", label: "2m" },
                  { value: "2.2", label: "2.2m" },
                ]}
              />
            }
          />

          <MaterialBlock
            title="마루"
            emoji="🪵"
            calculator="wood"
            required={`${result.wood.requiredBoxes} 박스`}
            plan={getWoodPurchaseRecommendation(result.wood.recommendedBoxes, "강마루")}
            options={
              <Field
                label="1박스 시공 면적"
                unit="m²"
                value={boxCoverage}
                onChange={(v) => {
                  touch();
                  setBoxCoverage(v);
                }}
              />
            }
          />

          <p className="px-1 text-xs leading-relaxed text-ink-soft">
            장판과 마루는 둘 중 하나만 고르시면 됩니다. 같은 바닥 면적을 각각의 단위로 환산한
            결과입니다.
          </p>
        </>
      )}
    </div>
  );
}

function Field({
  label,
  unit,
  value,
  onChange,
}: {
  label: string;
  unit: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs text-ink-soft">
        {label} ({unit})
      </span>
      <input
        type="number"
        inputMode="decimal"
        min={0}
        step={0.1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-base tabular-nums outline-none focus:border-ink focus:bg-white"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="text-xs text-ink-soft">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-base outline-none focus:border-ink focus:bg-white"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function MaterialBlock({
  title,
  emoji,
  calculator,
  required,
  note,
  plan,
  options,
}: {
  title: string;
  emoji: string;
  calculator: string;
  required: string;
  note?: string;
  plan: PurchasePlan;
  options: React.ReactNode;
}) {
  const products = resolvePrimaryProducts(calculator, plan.variants, "house_result", plan.value);

  return (
    <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
      <h2 className="flex items-center gap-2 font-bold">
        <span aria-hidden>{emoji}</span>
        {title}
      </h2>

      <div className="mt-3 grid gap-2 sm:grid-cols-3">{options}</div>

      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2 border-t border-line pt-4">
        <span className="text-sm text-ink-soft">필요량</span>
        <span className="text-2xl font-bold tabular-nums">{required}</span>
      </div>
      <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-sm text-ink-soft">{plan.headline}</span>
        <span className="text-xl font-bold tabular-nums">{plan.value}</span>
      </div>
      {note ? <p className="mt-1 text-xs text-ink-soft">{note}</p> : null}

      {plan.examples.length > 0 ? (
        <ul className="mt-3 space-y-0.5 rounded-xl bg-paper p-3 text-sm">
          <li className="mb-1 text-xs font-medium text-ink-soft">이렇게 사면 돼요</li>
          {plan.examples.map((ex) => (
            <li key={ex}>· {ex}</li>
          ))}
        </ul>
      ) : null}

      {products.length > 0 ? (
        <div className="mt-4 space-y-3">
          <AffiliateDisclosure />
          <AffiliateProductList
            products={products}
            calculator={calculator}
            placement="house_result"
            accentFirst
          />
        </div>
      ) : null}
    </section>
  );
}
