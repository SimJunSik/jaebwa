import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/config/site";
import { articles } from "@/data/articles";
import { calculators } from "@/lib/calculators/registry";

export const metadata: Metadata = {
  title: "재봐 소개 - 어떻게 계산하고 무엇을 하지 않는가",
  description:
    "재봐가 자재량을 어떤 기준으로 계산하는지, 어떤 정보를 일부러 제공하지 않는지, 수익은 어떻게 얻는지 밝힙니다.",
  alternates: { canonical: "/about" },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-ink-soft">{children}</div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <article className="space-y-10">
      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">재봐 소개</h1>
        <p className="mt-3 leading-relaxed text-ink-soft">
          {site.name}는 인테리어 자재가 얼마나 필요한지 계산하고, 그래서 실제로 몇 개를 사야 하는지까지
          알려주는 도구입니다. 계산기 {calculators.length}종과 가이드 {articles.length}편을 운영하고
          있습니다.
        </p>
      </header>

      <Section title="왜 만들었나">
        <p>
          &ldquo;24평 페인트 얼마나 필요해?&rdquo;를 검색하면 대부분 &ldquo;약 8L&rdquo; 같은 답이
          나옵니다. 그런데 페인트는 8L 단위로 팔지 않습니다. 1L, 4L, 10L, 18L로 팝니다. 답을 듣고도
          장바구니에서 다시 막히는 겁니다.
        </p>
        <p>
          타일은 박스로 팔리고, 마루도 박스로 팔리고, 장판은 미터로 팔립니다. 필요량과 구매 단위
          사이에는 항상 한 단계가 더 있습니다. {site.name}는 그 한 단계를 메우려고 만들었습니다.
        </p>
      </Section>

      <Section title="어떤 기준으로 계산하나">
        <p>
          계산식과 기준값은 각 계산기 페이지에 전부 공개되어 있습니다. 결과 아래에 &ldquo;왜 이
          수량인가요?&rdquo; 항목을 두어, 입력한 값으로 어떤 식을 거쳐 그 숫자가 나왔는지 문장으로
          보여줍니다. 믿고 쓰라고 하기보다 확인할 수 있게 하는 편이 맞다고 봅니다.
        </p>
        <p>
          자재마다 계산 방식이 다릅니다. 페인트는 면적으로, 벽지는 폭 단위로, 타일은 줄눈을 포함한
          단위 면적으로 계산합니다. 특히 벽지를 면적으로 나누는 흔한 방법은 실제보다 적게 나오는데,
          그 이유는{" "}
          <Link
            href="/guide/wallpaper-area-myth"
            className="underline underline-offset-4 hover:text-ink"
          >
            별도 글
          </Link>
          에서 숫자로 정리했습니다.
        </p>
        <p>
          여유분은 기본 10%를 적용하되, 필요량과 여유분 포함 값을 항상 따로 보여줍니다. 어느 숫자가
          어디서 왔는지 구분할 수 있어야 하기 때문입니다.
        </p>
      </Section>

      <Section title="일부러 하지 않는 것">
        <ul className="space-y-3">
          <li>
            <strong className="font-semibold text-ink">가격을 표시하지 않습니다.</strong> 자재 가격과
            재고는 수시로 바뀝니다. 최신 정보를 보장할 수 없는 가격을 적어두면 그건 정보가 아니라
            오정보입니다. 필요한 수량까지만 계산하고, 가격은 판매처에서 확인하도록 안내합니다.
          </li>
          <li>
            <strong className="font-semibold text-ink">
              제휴 상품에 맞춰 계산 결과를 바꾸지 않습니다.
            </strong>{" "}
            6L면 충분한 방에 10L를 권하지 않습니다. 계산 모듈과 상품 추천 모듈은 코드 수준에서
            분리되어 있어, 제휴 상품의 사정이 계산에 영향을 줄 수 있는 경로가 없습니다.
          </li>
          <li>
            <strong className="font-semibold text-ink">입력값을 수집하지 않습니다.</strong> 모든 계산은
            브라우저 안에서만 이루어집니다. 방 크기나 자재 규격은 서버로 전송되지 않고 저장되지
            않습니다. 회원가입도 없습니다.
          </li>
          <li>
            <strong className="font-semibold text-ink">&ldquo;최저가&rdquo;를 말하지 않습니다.</strong>{" "}
            검증하지 않은 가격이나 품질을 암시하는 표현은 쓰지 않습니다. 상품 링크 문구는 &ldquo;찾아보기&rdquo;,
            &ldquo;확인하기&rdquo; 수준으로 유지합니다.
          </li>
        </ul>
      </Section>

      <Section title="수익 구조">
        <p>
          {site.name}는 광고와 제휴 링크로 운영됩니다. 계산 결과에 맞는 상품을 찾아볼 수 있는 링크를
          제공하며, 이 링크를 통해 구매가 발생하면 일정액의 수수료를 받습니다. 제휴 링크가 있는 영역에는
          그 사실을 명시하고 있습니다.
        </p>
        <p>
          다만 수익이 계산 결과에 영향을 주지 않도록, 앞서 적은 대로 계산 로직과 추천 로직을 분리해
          두었습니다. 상품 추천 영역은 계산 결과 다음에 배치하며, 결과보다 먼저 노출하지 않습니다.
        </p>
      </Section>

      <Section title="정확도에 대하여">
        <p>
          계산 결과는 일반적인 시공 기준에 따른 참고용 값입니다. 실제 필요량은 시공 환경, 제품 사양,
          작업 방식에 따라 달라질 수 있습니다. 특히 벽면이 고르지 않거나, 패턴 시공을 하거나, 방 모양이
          복잡한 경우 여유분을 더 잡으셔야 합니다.
        </p>
        <p>
          계산식이나 기준값에 오류를 발견하시면 알려주세요. 근거와 함께 알려주시면 확인 후 수정하고, 그
          내용을 해당 계산기 페이지에 반영합니다.
        </p>
      </Section>

      <Section title="문의">
        <p>
          계산 오류 제보, 계산기 추가 요청, 기타 문의는{" "}
          <Link href="/contact" className="underline underline-offset-4 hover:text-ink">
            문의 페이지
          </Link>
          를 이용해 주세요.
        </p>
      </Section>

      <nav className="flex flex-wrap gap-2 border-t border-line pt-6">
        {[
          { href: "/house", label: "집 전체 계산기" },
          { href: "/guide", label: "인테리어 가이드" },
          { href: "/specs", label: "자재 규격 정리" },
          { href: "/contact", label: "문의" },
          { href: "/privacy", label: "개인정보처리방침" },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-lg border border-line bg-white px-3 py-2 text-sm transition hover:border-ink/25"
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </article>
  );
}
