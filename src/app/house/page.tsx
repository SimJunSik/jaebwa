import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/ads/AdSlot";
import { HouseCalculator } from "@/components/calculator/HouseCalculator";
import { getArticle } from "@/data/articles";
import { calculators } from "@/lib/calculators/registry";

export const metadata: Metadata = {
  title: "집 전체 계산기 - 방 여러 개 한 번에 자재량 계산",
  description:
    "방을 여러 개 입력하면 집 전체에 필요한 벽지, 페인트, 장판, 마루 양을 한 번에 계산합니다. 방마다 따로 계산해 합산하므로 정확합니다.",
  keywords: [
    "집 전체 자재 계산",
    "아파트 도배 자재량",
    "전체 리모델링 계산기",
    "방 여러개 벽지 계산",
    "집 전체 인테리어 계산",
  ],
  alternates: { canonical: "/house" },
};

export default function HousePage() {
  const guides = ["wallpaper-area-myth", "apartment-24", "interior-budget"]
    .map(getArticle)
    .filter((a) => a !== undefined);

  return (
    <article className="space-y-10">
      <header>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl">
          <span aria-hidden>🏡</span>
          집 전체 계산기
        </h1>
        <p className="mt-2 leading-relaxed text-ink-soft">
          방을 하나씩 계산해서 더하는 건 번거롭습니다. 방 치수를 모두 입력하면 벽지, 페인트, 장판,
          마루에 필요한 양을 한 번에 계산해드려요.
        </p>
      </header>

      <HouseCalculator />

      <AdSlot slot="house-mid" />

      <section className="space-y-6">
        <h2 className="text-xl font-bold">왜 방마다 따로 계산하나요</h2>
        <div>
          <h3 className="font-semibold">벽지는 합산 방법이 결과를 바꿉니다</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
            벽지는 롤 폭 단위로 붙이기 때문에, 벽 둘레를 롤 폭으로 나눈 뒤 반드시 올림해야 합니다.
            둘레 11.4m인 방은 1.06m 폭으로 나누면 10.75폭이지만 실제로는 11폭이 필요합니다.
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
            이 올림이 방마다 생깁니다. 방이 4개면 올림 손실만 3~4폭이 쌓입니다. 그런데 전체 둘레를
            한꺼번에 나누면 이 손실이 계산에서 사라져 실제보다 적게 나옵니다. 그래서 이 계산기는
            방별로 올림한 뒤 합산합니다.
          </p>
        </div>
        <div>
          <h3 className="font-semibold">천장고가 다른 방이 있어도 됩니다</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
            롤 하나에서 몇 폭이 나오는지는 천장고에 따라 달라집니다. 방마다 천장고를 따로 입력할 수
            있고, 각 방의 천장고로 롤당 폭 수를 계산한 뒤 합산합니다.
          </p>
        </div>
        <div>
          <h3 className="font-semibold">바닥은 면적으로 합산합니다</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
            장판과 마루는 벽지와 달리 바닥 면적을 그대로 더해 계산합니다. 다만 장판은 방 폭이 장판
            폭보다 넓으면 이음이 생기고 열마다 재단 여유가 추가로 필요하니, 이음이 많은 집은
            여유분을 15~20%로 잡으세요.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold">자재 하나만 계산하려면</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {calculators.slice(0, 6).map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-3 text-sm font-medium transition hover:border-ink/25"
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

      {guides.length > 0 ? (
        <section>
          <h2 className="text-xl font-bold">읽어두면 좋은 글</h2>
          <div className="mt-3 space-y-2">
            {guides.map((a) => (
              <Link
                key={a.slug}
                href={`/guide/${a.slug}`}
                className="block rounded-xl border border-line bg-white p-4 transition hover:border-ink/25"
              >
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <span aria-hidden>{a.emoji}</span>
                  {a.title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{a.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <AdSlot slot="house-bottom" />
    </article>
  );
}
