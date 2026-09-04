import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/AdSlot";
import { CalculatorView } from "@/components/calculator/CalculatorView";
import { calculators, getCalculator } from "@/lib/calculators/registry";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return calculators.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const def = getCalculator(slug);
  if (!def) return {};
  // 브랜드명은 layout 의 title.template 가 뒤에 붙인다. ("... | 재봐")
  return {
    title: def.seoTitle,
    description: def.description,
    keywords: def.keywords,
    alternates: { canonical: `/${def.slug}` },
    openGraph: { title: def.seoTitle, description: def.description, type: "website" },
  };
}

export default async function CalculatorPage({ params }: Params) {
  const { slug } = await params;
  const def = getCalculator(slug);
  if (!def) notFound();

  const related = def.related.map(getCalculator).filter((c) => c !== undefined);

  return (
    <article className="space-y-10">
      <header>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl">
          <span aria-hidden>{def.emoji}</span>
          {def.title}
        </h1>
        <p className="mt-2 leading-relaxed text-ink-soft">{def.intro}</p>
      </header>

      {/* 계산기 → 결과 → 구매량 → 상품 CTA (§4) */}
      <CalculatorView slug={def.slug} />

      {/* 광고는 상품 추천 다음 (§22) */}
      <AdSlot slot={`${def.slug}-mid`} />

      {/* 계산 방법 / 가이드 */}
      <section className="space-y-6">
        <h2 className="text-lg font-bold">계산 방법과 참고사항</h2>
        {def.guide.map((g) => (
          <div key={g.heading}>
            <h3 className="font-semibold">{g.heading}</h3>
            {g.body.map((p) => (
              <p key={p} className="mt-1 text-sm leading-relaxed text-ink-soft">
                {p}
              </p>
            ))}
          </div>
        ))}
      </section>

      {/* 관련 계산기 */}
      {related.length > 0 ? (
        <section>
          <h2 className="text-lg font-bold">이것도 재봐요</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {related.map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                className="rounded-xl border border-line bg-white p-3.5 text-sm transition hover:border-ink/25"
              >
                <span className="flex items-center gap-2 font-semibold">
                  <span aria-hidden>{c.emoji}</span>
                  {c.title}
                </span>
                <span className="mt-1 block leading-relaxed text-ink-soft">{c.intro}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <AdSlot slot={`${def.slug}-bottom`} />
    </article>
  );
}
