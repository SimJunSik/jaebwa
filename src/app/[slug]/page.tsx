import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/AdSlot";
import { CalculatorView } from "@/components/calculator/CalculatorView";
import { guides } from "@/data/guides";
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

  const content = guides[def.slug];
  const related = def.related.map(getCalculator).filter((c) => c !== undefined);

  // FAQ 구조화 데이터 — 검색 결과에 질문이 함께 노출될 수 있다.
  const faqSchema = content?.faq.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: content.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

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
      {content ? (
        <section className="space-y-7">
          <h2 className="text-xl font-bold">{def.name} 계산 방법과 참고사항</h2>
          {content.guide.map((g) => (
            <div key={g.heading}>
              <h3 className="font-semibold">{g.heading}</h3>
              {g.body.map((p) => (
                <p key={p} className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                  {p}
                </p>
              ))}
            </div>
          ))}
        </section>
      ) : null}

      {/* 자주 묻는 질문 */}
      {content?.faq.length ? (
        <section>
          <h2 className="text-xl font-bold">자주 묻는 질문</h2>
          <div className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
            {content.faq.map((f) => (
              <details key={f.q} className="group">
                <summary className="flex cursor-pointer items-center justify-between gap-3 p-4 font-medium marker:content-none">
                  {f.q}
                  <span
                    aria-hidden
                    className="shrink-0 text-ink-soft transition group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="px-4 pb-4 text-sm leading-relaxed text-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      ) : null}

      {/* 관련 계산기 */}
      {related.length > 0 ? (
        <section>
          <h2 className="text-xl font-bold">이것도 재봐요</h2>
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

      {faqSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      ) : null}
    </article>
  );
}
