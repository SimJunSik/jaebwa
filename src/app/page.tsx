import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/ads/AdSlot";
import { articles } from "@/data/articles";
import { calculators } from "@/lib/calculators/registry";

// 다른 페이지에는 모두 있는데 홈만 비어 있었다.
// www 리다이렉트와 vercel.app 배포 URL 이 별개 페이지로 취급되지 않게 명시한다.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  const featured = articles.slice(0, 4);

  return (
    <div className="space-y-14">
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
        <h2 className="text-xl font-bold">무엇을 계산할까요?</h2>

        <Link
          href="/house"
          className="group mt-4 flex items-center gap-4 rounded-2xl bg-brand p-5 transition hover:bg-brand-dark"
        >
          <span aria-hidden className="text-3xl">
            🏡
          </span>
          <span className="min-w-0">
            <span className="block font-bold text-ink">집 전체 한 번에 계산하기</span>
            <span className="mt-1 block text-sm leading-relaxed text-ink/70">
              방을 여러 개 입력하면 벽지·페인트·장판·마루 총량이 한 번에 나와요.
            </span>
          </span>
          <span
            aria-hidden
            className="ml-auto shrink-0 font-medium text-ink transition group-hover:translate-x-0.5"
          >
            →
          </span>
        </Link>

        <p className="mt-6 text-sm font-medium text-ink-soft">자재 하나만 계산하기</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
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

      {/* 계산 결과가 구매 단위로 이어지는 흐름 설명 */}
      <section>
        <h2 className="text-xl font-bold">필요량에서 끝내지 않습니다</h2>
        <p className="mt-3 leading-relaxed text-ink-soft">
          &ldquo;8.8L 필요합니다&rdquo;라는 답만으로는 아무것도 살 수 없습니다. 페인트는 1L, 4L,
          10L, 18L 단위로 팔리고, 타일은 박스로, 마루도 박스로 팔립니다. 정작 알아야 할 건 &ldquo;그래서
          몇 개를 사야 하는가&rdquo;입니다.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            { step: "1", title: "재서 입력", body: "방 가로·세로·천장고만 있으면 시작할 수 있어요." },
            { step: "2", title: "필요량 계산", body: "여유분까지 포함한 실제 필요량을 계산해요." },
            {
              step: "3",
              title: "구매 단위로 변환",
              body: "10L 1통인지, 4L 2통 + 1L 1통인지 알려드려요.",
            },
          ].map((s) => (
            <div key={s.step} className="rounded-2xl border border-line bg-white p-4">
              <span className="inline-flex size-7 items-center justify-center rounded-full bg-brand text-sm font-bold text-ink">
                {s.step}
              </span>
              <p className="mt-3 font-semibold">{s.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{s.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 leading-relaxed text-ink-soft">
          계산 결과는 판매 상품과 무관하게 실제 필요한 양만으로 산출합니다. 보유한 제휴 상품이 10L라고
          해서 6L면 충분한 방에 10L를 권하지 않습니다. 계산 로직과 상품 추천 로직은 코드 수준에서
          분리되어 있습니다.
        </p>
      </section>

      <AdSlot slot="home-mid" />

      {/* 가이드 유도 */}
      <section>
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-xl font-bold">읽어두면 좋은 것들</h2>
          <Link href="/guide" className="shrink-0 text-sm text-ink-soft hover:text-ink">
            전체 보기 →
          </Link>
        </div>
        <p className="mt-2 leading-relaxed text-ink-soft">
          계산기가 &ldquo;얼마나&rdquo;를 알려준다면, 가이드는 &ldquo;어떻게&rdquo;를 다룹니다.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {featured.map((a) => (
            <Link
              key={a.slug}
              href={`/guide/${a.slug}`}
              className="rounded-2xl border border-line bg-white p-4 transition hover:border-ink/25"
            >
              <p className="flex items-center gap-2 font-semibold">
                <span aria-hidden>{a.emoji}</span>
                {a.title}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{a.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 자주 묻는 질문 */}
      <section>
        <h2 className="text-xl font-bold">자주 묻는 질문</h2>
        <div className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
          {[
            {
              q: "가격도 알려주나요?",
              a: "아니요. 필요한 수량까지만 계산합니다. 가격과 재고는 시점에 따라 계속 바뀌어서, 검증되지 않은 가격을 표시하는 것은 오히려 잘못된 정보가 된다고 봅니다. 수량이 나오면 실제 판매처에서 확인해 주세요.",
            },
            {
              q: "입력한 값이 저장되나요?",
              a: "저장되지 않습니다. 모든 계산은 브라우저 안에서만 이루어지고 서버로 전송되지 않습니다. 회원가입도 없습니다.",
            },
            {
              q: "계산 결과가 정확한가요?",
              a: "일반적인 시공 기준에 따른 참고용 값입니다. 실제 필요량은 시공 환경과 제품 사양에 따라 달라질 수 있어요. 각 계산기에서 어떤 식으로 계산했는지 근거를 함께 보여드리니 확인해 보세요.",
            },
            {
              q: "여유분은 포함되어 있나요?",
              a: "네. 필요량과 여유분 포함 값을 따로 보여드립니다. 기본 10%이며, 재단 손실과 시공 실수를 감안한 값입니다.",
            },
          ].map((f) => (
            <details key={f.q} className="group">
              <summary className="flex cursor-pointer items-center justify-between gap-3 p-4 font-medium marker:content-none">
                {f.q}
                <span aria-hidden className="shrink-0 text-ink-soft transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="px-4 pb-4 text-sm leading-relaxed text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <AdSlot slot="home-bottom" />
    </div>
  );
}
