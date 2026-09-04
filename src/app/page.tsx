import Link from "next/link";
import { AdSlot } from "@/components/ads/AdSlot";
import { calculators } from "@/lib/calculators/registry";

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero — 인테리어 사진 대신 바로 계산으로 보낸다 */}
      <section className="pt-4">
        <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          얼마나 필요한지
          <br />
          사기 전에{" "}
          <span className="relative inline-block">
            재봐.
            <span
              aria-hidden
              className="ruler-ticks absolute -bottom-1 left-0 h-[6px] w-full text-ink/40"
            />
          </span>
        </h1>
        <p className="mt-5 leading-relaxed text-ink-soft">
          페인트, 벽지, 타일, 마루 등
          <br className="sm:hidden" /> 우리 집에 필요한 자재를 간단하게 계산하세요.
        </p>
        <a
          href="#calculators"
          className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-brand px-5 py-3 font-semibold text-ink transition hover:bg-brand-dark"
        >
          계산기 골라보기
          <span aria-hidden>↓</span>
        </a>
      </section>

      <section id="calculators" className="scroll-mt-6">
        <h2 className="text-lg font-bold">무엇을 계산할까요?</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {calculators.map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              className="group rounded-2xl border border-line bg-white p-4 transition hover:border-ink/25"
            >
              <p className="flex items-center gap-2 font-semibold">
                <span aria-hidden className="text-xl">
                  {c.emoji}
                </span>
                {c.title}
                <span
                  aria-hidden
                  className="ml-auto text-ink-soft transition group-hover:translate-x-0.5 group-hover:text-ink"
                >
                  →
                </span>
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{c.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <AdSlot slot="home-bottom" />

      <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
        <h2 className="text-lg font-bold">필요한 만큼만, 재봐.</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          &ldquo;얼마나 필요하지?&rdquo;에서 끝내지 않아요. 필요한 양을 계산한 다음, 그래서 몇 L짜리를
          몇 통 사야 하는지, 몇 박스를 사야 하는지까지 구매 단위로 알려드려요. 계산 결과는 판매 상품과
          무관하게 실제 필요한 양만으로 계산해요.
        </p>
      </section>
    </div>
  );
}
