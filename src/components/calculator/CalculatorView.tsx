"use client";

/**
 * 계산기 화면. (명세 §4, §23)
 *
 * 순서: 입력 → 계산 결과 → 이 정도 준비하면 돼요(구매량 + 상품 CTA) → 같이 준비하면 좋아요
 * 이 사이에는 광고를 넣지 않는다. 광고는 이 컴포넌트 바깥(아래)에 배치한다. (§4, §22)
 *
 * 브랜드: 화면에서 가장 큰 요소는 항상 계산 결과 숫자다. 라임은 결과 카드의 강조 바와
 * 첫 번째 CTA 에만 쓴다 — 상품 추천이 결과보다 시선을 먼저 끌면 §1 이 깨진다.
 */

import { useMemo, useRef, useState } from "react";
import { AffiliateDisclosure } from "@/components/affiliate/AffiliateDisclosure";
import { AffiliateProductList } from "@/components/affiliate/AffiliateProductList";
import { PurchaseChecklist } from "@/components/affiliate/PurchaseChecklist";
import { resolvePrimaryProducts, resolveSecondaryProducts } from "@/lib/affiliate/links";
import { trackCalculationComplete } from "@/lib/affiliate/tracking";
import { getCalculator, hasValidInput } from "@/lib/calculators/registry";

export function CalculatorView({ slug }: { slug: string }) {
  const def = getCalculator(slug);
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries((def?.fields ?? []).map((f) => [f.key, String(f.default)])),
  );
  const tracked = useRef(false);

  const valid = def ? hasValidInput(def, values) : false;
  const output = useMemo(() => (def && valid ? def.run(values) : null), [def, valid, values]);

  if (!def) return null;

  const update = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (!tracked.current) {
      tracked.current = true;
      trackCalculationComplete(def.slug);
    }
  };

  const plan = output?.plan;
  const primary = plan
    ? resolvePrimaryProducts(def.slug, plan.variants, "calculator_result", plan.value)
    : [];
  const secondary = resolveSecondaryProducts(def.slug);
  const big = output?.results.filter((r) => r.emphasis) ?? [];
  const rest = output?.results.filter((r) => !r.emphasis) ?? [];

  return (
    <div className="space-y-4">
      {/* 입력 */}
      <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {def.fields.map((field) => (
            <div key={field.key}>
              <label
                htmlFor={`${def.slug}-${field.key}`}
                className="block text-sm font-medium text-ink"
              >
                {field.label}
                {field.type === "number" && field.unit ? (
                  <span className="ml-1 font-normal text-ink-soft">({field.unit})</span>
                ) : null}
              </label>
              {field.type === "number" ? (
                <input
                  id={`${def.slug}-${field.key}`}
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step={field.step ?? 0.1}
                  value={values[field.key] ?? ""}
                  onChange={(e) => update(field.key, e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-base font-medium tabular-nums text-ink outline-none focus:border-ink focus:bg-white"
                />
              ) : (
                <select
                  id={`${def.slug}-${field.key}`}
                  value={values[field.key] ?? field.default}
                  onChange={(e) => update(field.key, e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-base text-ink outline-none focus:border-ink focus:bg-white"
                >
                  {field.options.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              )}
              {field.hint ? <p className="mt-1.5 text-xs text-ink-soft">{field.hint}</p> : null}
            </div>
          ))}
        </div>
      </section>

      {!output ? (
        <p className="rounded-2xl border border-line bg-white p-5 text-sm text-ink-soft">
          모든 값을 입력하면 결과를 바로 계산해드려요.
        </p>
      ) : (
        <>
          {/* 계산 결과 — 화면에서 가장 큰 숫자 */}
          <section className="overflow-hidden rounded-2xl border border-line bg-white">
            <div className="h-1.5 bg-brand" />
            <div className="p-5 sm:p-6">
              <p className="text-sm text-ink-soft">계산 결과</p>

              <div className={`mt-2 grid gap-5 ${big.length > 1 ? "sm:grid-cols-2" : ""}`}>
                {big.map((line) => (
                  <div key={line.label}>
                    <p className="text-sm text-ink-soft">{line.label}</p>
                    <p className="mt-0.5 text-4xl font-bold tracking-tight tabular-nums sm:text-5xl">
                      {line.value}
                    </p>
                  </div>
                ))}
              </div>

              {rest.length > 0 ? (
                <dl className="mt-6 space-y-2.5 border-t border-line pt-5">
                  {rest.map((line) => (
                    <div key={line.label}>
                      <div className="flex items-baseline justify-between gap-4">
                        <dt className="text-sm text-ink-soft">{line.label}</dt>
                        <dd className="text-base font-medium tabular-nums">{line.value}</dd>
                      </div>
                      {line.note ? (
                        <p className="mt-0.5 text-xs text-ink-soft">{line.note}</p>
                      ) : null}
                    </div>
                  ))}
                </dl>
              ) : null}

              {/* 계산 근거 — 결과를 믿을 수 있게 */}
              <div className="mt-6 rounded-xl bg-paper p-4">
                <p className="text-sm font-semibold">
                  {plan && plan.variants.length > 0
                    ? `왜 ${plan.value}인가요?`
                    : "이렇게 계산했어요"}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{output.rationale}</p>
              </div>
            </div>
          </section>

          {/* 이 정도 준비하면 돼요 — 구매량 + 상품 CTA (§4) */}
          {plan ? (
            <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
              <h2 className="text-lg font-bold">{plan.headline}</h2>
              <p className="mt-2 text-2xl font-bold tracking-tight">{plan.value}</p>
              {plan.note ? (
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{plan.note}</p>
              ) : null}

              {plan.examples.length > 0 ? (
                <ul className="mt-4 space-y-1 rounded-xl bg-paper p-4 text-sm">
                  <li className="mb-1 font-medium text-ink-soft">이렇게 사면 돼요</li>
                  {plan.examples.map((ex) => (
                    <li key={ex}>· {ex}</li>
                  ))}
                </ul>
              ) : null}

              {primary.length > 0 ? (
                <div className="mt-5 space-y-3">
                  <AffiliateProductList
                    products={primary}
                    calculator={def.slug}
                    placement="calculator_result"
                    accentFirst
                  />
                  <AffiliateDisclosure />
                </div>
              ) : null}
            </section>
          ) : null}

          {/* 부자재 cross-sell (§12, §13) */}
          {secondary.length > 0 ? (
            <PurchaseChecklist
              title="같이 준비하면 좋아요"
              mainItem={`${def.name} ${plan?.value ?? ""}`.trim()}
              items={secondary}
              calculator={def.slug}
            />
          ) : null}
        </>
      )}
    </div>
  );
}
