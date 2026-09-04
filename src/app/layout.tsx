import type { Metadata } from "next";
import Link from "next/link";
import { AffiliateDisclosure } from "@/components/affiliate/AffiliateDisclosure";
import { Logo } from "@/components/brand/Logo";
import { site } from "@/config/site";
import { calculators } from "@/lib/calculators/registry";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.seoTitle, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: { siteName: site.name, locale: "ko_KR", type: "website" },
  verification: {
    // 네이버 서치어드바이저 소유 확인. 제거하면 사이트 등록이 해제된다.
    other: { "naver-site-verification": "dfd9e0d8395c4a5ae80e073a863f49b78bcb12df" },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-paper text-ink antialiased">
        <header className="border-b border-line bg-white">
          <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3">
            <Link href="/" aria-label={`${site.name} 홈`}>
              <Logo className="text-xl" />
            </Link>
            <nav className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-ink-soft">
              {calculators.map((c) => (
                <Link key={c.slug} href={`/${c.slug}`} className="hover:text-ink">
                  {c.name}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>

        <footer className="mt-14 border-t border-line bg-white">
          <div className="mx-auto max-w-3xl space-y-3 px-4 py-8 text-sm text-ink-soft">
            <p className="font-medium text-ink">{site.slogan}</p>
            <AffiliateDisclosure variant="footer" />
            <p className="text-xs">
              계산 결과는 참고용이에요. 실제 시공 조건과 제품 사양에 따라 필요한 양이 달라질 수 있어요.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
