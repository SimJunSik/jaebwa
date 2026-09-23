import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/ads/AdSlot";
import { specGroups } from "@/data/specs";
import { getCalculator } from "@/lib/calculators/registry";

export const metadata: Metadata = {
  title: "인테리어 자재 규격 정리 - 벽지 롤 폭부터 타일 박스까지",
  description:
    "벽지 롤 규격, 페인트 용량, 타일 박스당 장수, 장판 폭과 두께, 마루 박스 면적 등 국내 유통 자재 규격을 한 곳에 정리했습니다.",
  keywords: [
    "벽지 롤 규격",
    "타일 박스당 장수",
    "장판 폭 규격",
    "마루 박스 면적",
    "페인트 용량 규격",
    "인테리어 자재 규격",
  ],
  alternates: { canonical: "/specs" },
};

export default function SpecsPage() {
  return (
    <article className="space-y-10">
      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">자재 규격 정리</h1>
        <p className="mt-3 leading-relaxed text-ink-soft">
          자재량 계산이 막히는 지점은 대부분 &ldquo;내가 사려는 제품의 규격이 얼마인지&rdquo;입니다.
          벽지 롤이 몇 미터인지, 타일 한 박스에 몇 장인지 모르면 계산을 시작할 수 없습니다. 계산기에
          넣을 값들을 한 곳에 모았습니다.
        </p>
      </header>

      <nav className="flex flex-wrap gap-2">
        {specGroups.map((g) => (
          <a
            key={g.slug}
            href={`#${g.slug}`}
            className="rounded-lg border border-line bg-white px-3 py-2 text-sm transition hover:border-ink/25"
          >
            <span aria-hidden className="mr-1">
              {g.emoji}
            </span>
            {g.title}
          </a>
        ))}
      </nav>

      <div className="rounded-xl border-l-4 border-brand bg-white p-4">
        <p className="font-semibold">구매 전에는 상품 상세를 확인하세요</p>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">
          아래는 국내에서 일반적으로 유통되는 규격입니다. 제조사와 제품에 따라 편차가 있으므로, 실제
          계산에는 구매하려는 상품에 표기된 값을 넣으시는 것이 정확합니다.
        </p>
      </div>

      {specGroups.map((g, i) => {
        const calc = g.calculator ? getCalculator(g.calculator) : undefined;
        return (
          <section key={g.slug} id={g.slug} className="scroll-mt-6">
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <span aria-hidden>{g.emoji}</span>
              {g.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{g.why}</p>

            <div className="mt-4 overflow-x-auto rounded-xl border border-line bg-white">
              <table className="w-full min-w-[30rem] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-line bg-paper">
                    {g.columns.map((c) => (
                      <th key={c} className="px-4 py-2.5 text-left font-semibold">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {g.rows.map((row) => (
                    <tr key={row.join("|")} className="border-b border-line last:border-0">
                      {row.map((cell, j) => (
                        <td
                          key={j}
                          className={j === 0 ? "px-4 py-2.5 font-medium" : "px-4 py-2.5 text-ink-soft"}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {g.notes?.length ? (
              <ul className="mt-3 space-y-1.5">
                {g.notes.map((n) => (
                  <li key={n} className="flex gap-2 text-sm leading-relaxed text-ink-soft">
                    <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-ink/30" />
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            {calc ? (
              <Link
                href={`/${calc.slug}`}
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-medium transition hover:border-ink/25"
              >
                <span aria-hidden>{calc.emoji}</span>
                {calc.title}로 계산하기
                <span aria-hidden className="text-ink-soft">
                  →
                </span>
              </Link>
            ) : null}

            {i === 2 ? (
              <div className="mt-8">
                <AdSlot slot="specs-mid" />
              </div>
            ) : null}
          </section>
        );
      })}

      <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
        <h2 className="text-lg font-bold">규격이 틀렸거나 빠졌다면</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          유통 규격은 시간이 지나면 바뀌고, 제조사마다 예외도 많습니다. 실제와 다른 값을 발견하시면{" "}
          <Link href="/contact" className="underline underline-offset-4 hover:text-ink">
            문의
          </Link>
          로 알려주세요. 근거와 함께 주시면 확인 후 반영합니다.
        </p>
      </section>

      <AdSlot slot="specs-bottom" />
    </article>
  );
}
