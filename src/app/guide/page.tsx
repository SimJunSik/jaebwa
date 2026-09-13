import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/ads/AdSlot";
import { site } from "@/config/site";
import { articles } from "@/data/articles";

export const metadata: Metadata = {
  title: "인테리어 가이드",
  description:
    "셀프 도배와 페인팅부터 자재 고르는 법, 시공 순서, 예산 짜기까지. 직접 해보기 전에 알아두면 좋은 것들을 정리했습니다.",
  alternates: { canonical: "/guide" },
};

export default function GuideIndexPage() {
  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">인테리어 가이드</h1>
        <p className="mt-2 leading-relaxed text-ink-soft">
          계산기가 &ldquo;얼마나&rdquo;를 알려준다면, 가이드는 &ldquo;어떻게&rdquo;를 다룹니다. 셀프
          시공 순서, 자재 고르는 기준, 예산 짜는 법까지 {site.name}이 정리했습니다.
        </p>
      </header>

      <div className="space-y-3">
        {articles.map((a) => (
          <Link
            key={a.slug}
            href={`/guide/${a.slug}`}
            className="group block rounded-2xl border border-line bg-white p-5 transition hover:border-ink/25"
          >
            <p className="flex items-center gap-2 font-semibold">
              <span aria-hidden className="text-lg">
                {a.emoji}
              </span>
              {a.title}
              <span
                aria-hidden
                className="ml-auto shrink-0 text-ink-soft transition group-hover:translate-x-0.5 group-hover:text-ink"
              >
                →
              </span>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{a.summary}</p>
            <p className="mt-2 text-xs text-ink-soft">{a.readingMinutes}분 분량</p>
          </Link>
        ))}
      </div>

      <AdSlot slot="guide-index-bottom" />
    </div>
  );
}
