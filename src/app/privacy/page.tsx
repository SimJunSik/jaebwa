import type { Metadata } from "next";
import { AFFILIATE_DISCLOSURE } from "@/config/affiliate";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: `${site.name}의 개인정보처리방침입니다. 수집하는 정보, 쿠키 사용, 제휴 링크와 광고에 관한 내용을 안내합니다.`,
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed text-ink-soft">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <article className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">개인정보처리방침</h1>
        <p className="mt-2 text-sm text-ink-soft">시행일: {site.privacyEffectiveDate}</p>
      </header>

      <Section title="1. 계산기 입력값은 저장되지 않습니다">
        <p>
          {site.name}의 모든 계산은 이용자의 브라우저 안에서만 이루어집니다. 방 크기, 면적, 자재
          규격 등 계산기에 입력한 값은 서버로 전송되지 않으며, 어디에도 저장되지 않습니다.
        </p>
        <p>
          페이지를 새로 고치면 입력값은 사라집니다. 계산 기록을 남기거나 이용자를 식별하는 기능은
          제공하지 않습니다.
        </p>
      </Section>

      <Section title="2. 회원 정보를 수집하지 않습니다">
        <p>
          {site.name}은 회원가입, 로그인 기능을 제공하지 않습니다. 이름, 연락처, 주소 등 개인을
          식별할 수 있는 정보를 직접 수집하지 않습니다.
        </p>
      </Section>

      <Section title="3. 쿠키와 광고">
        <p>
          본 사이트는 Google AdSense를 통해 광고를 게재합니다. Google을 포함한 제3자 광고 사업자는
          쿠키를 사용하여 이용자의 이전 방문 기록을 바탕으로 광고를 게재할 수 있습니다.
        </p>
        <p>
          이용자는{" "}
          <a
            href="https://myadcenter.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-ink"
          >
            Google 광고 설정
          </a>
          에서 개인 맞춤 광고를 해제할 수 있습니다. 제3자 광고 사업자의 쿠키 사용을 개별적으로
          거부하려면{" "}
          <a
            href="https://www.aboutads.info/choices/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-ink"
          >
            aboutads.info
          </a>
          를 참고하세요.
        </p>
        <p>
          브라우저 설정에서 쿠키를 차단할 수도 있습니다. 쿠키를 차단해도 계산기 기능은 정상적으로
          동작합니다.
        </p>
      </Section>

      <Section title="4. 방문 통계">
        <p>
          서비스 개선을 위해 Google Analytics를 사용합니다. 페이지 조회, 계산 완료, 링크 클릭 같은
          이용 통계가 익명으로 수집되며, 어떤 계산기가 많이 쓰이는지와 같은 통계 목적에만
          사용됩니다.
        </p>
      </Section>

      <Section title="5. 제휴 링크">
        <p>{AFFILIATE_DISCLOSURE.footer}</p>
        <p>
          제휴 링크를 클릭하면 쿠팡으로 이동하며, 이후의 개인정보 처리는 쿠팡의 개인정보처리방침을
          따릅니다. {site.name}은 이용자의 구매 내역이나 결제 정보를 받지 않으며, 어떤 상품이
          얼마나 판매되었는지에 대한 집계 정보만 제휴 사업자로부터 제공받습니다.
        </p>
      </Section>

      <Section title="6. 제3자 서비스">
        <p>본 사이트는 다음 외부 서비스를 이용합니다.</p>
        <ul className="ml-4 list-disc space-y-1">
          <li>Google AdSense — 광고 게재</li>
          <li>Google Analytics — 방문 통계</li>
          <li>쿠팡파트너스 — 제휴 링크</li>
          <li>Vercel — 웹사이트 호스팅</li>
        </ul>
        <p>각 서비스의 개인정보 처리에 관한 사항은 해당 사업자의 방침을 따릅니다.</p>
      </Section>

      <Section title="7. 계산 결과의 책임 범위">
        <p>
          {site.name}이 제공하는 계산 결과는 일반적인 시공 기준에 따른 참고용 값입니다. 실제 필요한
          자재량은 시공 환경, 제품 사양, 작업 방식에 따라 달라질 수 있습니다.
        </p>
        <p>
          계산 결과에 근거한 구매 및 시공의 결과에 대해 {site.name}은 책임을 지지 않습니다. 중요한
          시공은 반드시 제품 사양서와 시공 전문가의 확인을 함께 받으시기를 권합니다.
        </p>
      </Section>

      <Section title="8. 방침 변경">
        <p>
          본 방침이 변경되는 경우 이 페이지를 통해 공지합니다. 중요한 변경이 있을 때는 시행일을
          갱신합니다.
        </p>
      </Section>

      {site.contact ? (
        <Section title="9. 문의">
          <p>
            개인정보 처리에 관한 문의는{" "}
            <a
              href={`mailto:${site.contact}`}
              className="underline underline-offset-4 hover:text-ink"
            >
              {site.contact}
            </a>
            로 보내주세요.
          </p>
        </Section>
      ) : null}
    </article>
  );
}
