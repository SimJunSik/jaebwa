/**
 * 아티클 본문 렌더러.
 *
 * 마크다운 파서를 넣지 않는다. 필요한 건 **굵게** 하나뿐이라
 * 정규식 한 줄로 끝난다. 파서를 붙이면 의존성과 XSS 표면만 늘어난다.
 */

import type { ArticleSection } from "@/data/articles";
import { WallpaperRollDiagram } from "./WallpaperRollDiagram";

/** **굵게** 만 처리한다. 그 외 마크다운 문법은 지원하지 않는다. */
function withBold(text: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-ink">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

export function ArticleBody({ sections }: { sections: ArticleSection[] }) {
  return (
    <div className="space-y-10">
      {sections.map((s) => (
        <section key={s.heading}>
          <h2 className="text-xl font-bold tracking-tight">{s.heading}</h2>

          {s.body.map((p) => (
            <p key={p} className="mt-3 leading-[1.9] text-ink-soft">
              {withBold(p)}
            </p>
          ))}

          {s.list ? (
            s.list.ordered ? (
              <ol className="mt-4 space-y-2.5">
                {s.list.items.map((item, i) => (
                  <li key={item} className="flex gap-3 leading-relaxed text-ink-soft">
                    <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-semibold text-ink">
                      {i + 1}
                    </span>
                    <span>{withBold(item)}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <ul className="mt-4 space-y-2">
                {s.list.items.map((item) => (
                  <li key={item} className="flex gap-2.5 leading-relaxed text-ink-soft">
                    <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-ink/30" />
                    <span>{withBold(item)}</span>
                  </li>
                ))}
              </ul>
            )
          ) : null}

          {s.diagram === "wallpaper-roll" ? <WallpaperRollDiagram /> : null}

          {s.table ? (
            <div className="mt-4 overflow-x-auto rounded-xl border border-line bg-white">
              <table className="w-full min-w-[28rem] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-line bg-paper">
                    {s.table.head.map((h) => (
                      <th key={h} className="px-4 py-2.5 text-left font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {s.table.rows.map((row) => (
                    <tr key={row.join("|")} className="border-b border-line last:border-0">
                      {row.map((cell, i) => (
                        <td
                          key={i}
                          className={
                            i === 0 ? "px-4 py-2.5 font-medium" : "px-4 py-2.5 text-ink-soft"
                          }
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {s.callout ? (
            <aside className="mt-4 rounded-xl border-l-4 border-brand bg-white p-4">
              <p className="font-semibold">{s.callout.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                {withBold(s.callout.body)}
              </p>
            </aside>
          ) : null}
        </section>
      ))}
    </div>
  );
}
