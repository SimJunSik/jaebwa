import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "문의",
  description: `${site.name}에 계산 오류 제보, 계산기 추가 요청, 제휴 문의를 보내는 방법을 안내합니다.`,
  alternates: { canonical: "/contact" },
};

const TOPICS = [
  {
    title: "계산 오류 제보",
    body: "계산식이나 기준값이 실제와 다르다고 판단되면 알려주세요. 어떤 계산기에서, 어떤 값을 넣었을 때, 어떤 결과가 나왔고 무엇이 맞다고 보시는지 함께 적어주시면 확인이 빠릅니다.",
  },
  {
    title: "계산기 추가 요청",
    body: "필요한데 없는 계산기가 있다면 알려주세요. 어떤 자재인지, 어떤 단위로 판매되는지, 어떤 값을 알고 있는 상태에서 계산하고 싶은지 적어주시면 검토합니다.",
  },
  {
    title: "규격 정보 수정",
    body: "자재 규격 정리 페이지의 값이 최신과 다르거나 빠진 규격이 있으면 알려주세요. 제품 상세 페이지 같은 근거를 함께 주시면 반영이 수월합니다.",
  },
  {
    title: "제휴 및 기타",
    body: "협업, 인용, 기타 문의도 같은 주소로 보내주세요.",
  },
];

export default function ContactPage() {
  return (
    <article className="space-y-10">
      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">문의</h1>
        <p className="mt-3 leading-relaxed text-ink-soft">
          {site.name}는 1인이 운영하는 작은 도구입니다. 답변이 며칠 걸릴 수 있지만 모든 메일을
          확인합니다.
        </p>
      </header>

      {site.contact ? (
        <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
          <p className="text-sm text-ink-soft">이메일</p>
          <a
            href={`mailto:${site.contact}`}
            className="mt-1 block break-all text-xl font-bold underline underline-offset-4 hover:text-ink-soft"
          >
            {site.contact}
          </a>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            별도의 문의 양식은 두지 않았습니다. 양식을 운영하려면 입력 내용을 서버에 저장해야 하는데,
            {site.name}는 어떤 개인정보도 수집하지 않는다는 원칙을 지키고 있어서 메일로만 받습니다.
          </p>
        </section>
      ) : null}

      <section>
        <h2 className="text-xl font-bold">이런 내용을 보내주세요</h2>
        <div className="mt-4 space-y-3">
          {TOPICS.map((t) => (
            <div key={t.title} className="rounded-2xl border border-line bg-white p-5">
              <p className="font-semibold">{t.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{t.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold">먼저 확인해 보시면 좋은 것</h2>
        <div className="mt-3 space-y-2 text-sm leading-relaxed text-ink-soft">
          <p>
            <strong className="font-semibold text-ink">가격을 알고 싶다면</strong> — {site.name}는
            수량만 계산하고 가격은 제공하지 않습니다. 이유는{" "}
            <Link href="/about" className="underline underline-offset-4 hover:text-ink">
              소개 페이지
            </Link>
            에 적어두었습니다.
          </p>
          <p>
            <strong className="font-semibold text-ink">계산 결과가 이상하다면</strong> — 각 계산기
            결과 아래 &ldquo;왜 이 수량인가요?&rdquo; 항목에 계산 과정이 나옵니다. 입력값이 의도한
            것과 맞는지 먼저 확인해 보세요.
          </p>
          <p>
            <strong className="font-semibold text-ink">시공 방법이 궁금하다면</strong> —{" "}
            <Link href="/guide" className="underline underline-offset-4 hover:text-ink">
              인테리어 가이드
            </Link>
            에 자재별 시공 순서와 주의점을 정리해 두었습니다.
          </p>
        </div>
      </section>
    </article>
  );
}
