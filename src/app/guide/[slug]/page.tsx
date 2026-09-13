import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/AdSlot";
import { ArticleBody } from "@/components/article/ArticleBody";
import { site } from "@/config/site";
import { articles, getArticle } from "@/data/articles";
import { getCalculator } from "@/lib/calculators/registry";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return {
    title: a.seoTitle,
    description: a.description,
    keywords: a.keywords,
    alternates: { canonical: `/guide/${a.slug}` },
    openGraph: {
      title: a.seoTitle,
      description: a.description,
      type: "article",
      publishedTime: a.publishedAt,
    },
  };
}

export default async function GuideArticlePage({ params }: Params) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();

  const calculators = a.calculators.map(getCalculator).filter((c) => c !== undefined);
  const related = a.related.map(getArticle).filter((r) => r !== undefined);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: a.title,
        description: a.description,
        datePublished: a.publishedAt,
        author: { "@type": "Organization", name: site.name },
        publisher: { "@type": "Organization", name: site.name },
        mainEntityOfPage: `${site.url}/guide/${a.slug}`,
      },
      ...(a.faq?.length
        ? [
            {
              "@type": "FAQPage",
              mainEntity: a.faq.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <article className="space-y-10">
      <header>
        <nav className="text-sm text-ink-soft">
          <Link href="/guide" className="hover:text-ink">
            인테리어 가이드
          </Link>
        </nav>
        <h1 className="mt-2 flex items-start gap-2 text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
          <span aria-hidden>{a.emoji}</span>
          {a.title}
        </h1>
        <p className="mt-3 leading-relaxed text-ink-soft">{a.summary}</p>
        <p className="mt-3 text-xs text-ink-soft">
          {a.publishedAt} · {a.readingMinutes}분 분량
        </p>
      </header>

      <ArticleBody sections={a.sections} />

      {/* 관련 계산기 — 읽고 나면 바로 계산으로 이어지게 */}
      {calculators.length > 0 ? (
        <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
          <h2 className="text-lg font-bold">계산해 보세요</h2>
          <p className="mt-1 text-sm text-ink-soft">이 글과 관련된 계산기입니다.</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {calculators.map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                className="flex items-center gap-2 rounded-xl border border-line px-4 py-3 text-sm font-medium transition hover:border-ink/25 hover:bg-paper"
              >
                <span aria-hidden>{c.emoji}</span>
                {c.title}
                <span aria-hidden className="ml-auto text-ink-soft">
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <AdSlot slot={`guide-${a.slug}-mid`} />

      {a.faq?.length ? (
        <section>
          <h2 className="text-xl font-bold">자주 묻는 질문</h2>
          <div className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
            {a.faq.map((f) => (
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

      {related.length > 0 ? (
        <section>
          <h2 className="text-xl font-bold">이어서 읽기</h2>
          <div className="mt-3 space-y-2">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/guide/${r.slug}`}
                className="block rounded-xl border border-line bg-white p-4 transition hover:border-ink/25"
              >
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <span aria-hidden>{r.emoji}</span>
                  {r.title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{r.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <AdSlot slot={`guide-${a.slug}-bottom`} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </article>
  );
}
