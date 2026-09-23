/**
 * 벽지 롤 재단 도해.
 *
 * 롤 하나에서 폭이 몇 개 나오고 얼마가 버려지는지 눈으로 보여준다.
 * 천장고 2.5m 와 2.6m 를 나란히 두면 10cm 차이로 폭 수가 6→5 로 떨어지는
 * 계단 구간이 한눈에 보인다. 글로 설명하기 어려운 부분이다.
 *
 * 외부 차트 라이브러리를 쓰지 않는다. 막대 몇 개라 SVG 를 직접 그리는 편이 짧다.
 */

const ROLL_LENGTH = 15.6;
const CUT_ALLOWANCE = 0.05;
const ROLL_WIDTH_M = 1.06;

function Roll({ height, x, label }: { height: number; x: number; label: string }) {
  const stripLength = height + CUT_ALLOWANCE;
  const count = Math.floor(ROLL_LENGTH / stripLength);
  const used = count * stripLength;
  const waste = ROLL_LENGTH - used;

  // 15.6m 를 300px 로 매핑
  const scale = 300 / ROLL_LENGTH;
  const barWidth = 72;
  const top = 34;

  const usableArea = count * ROLL_WIDTH_M * height;
  const lossPercent = (1 - usableArea / (ROLL_WIDTH_M * ROLL_LENGTH)) * 100;

  return (
    <g>
      <text x={x + barWidth / 2} y={16} textAnchor="middle" className="fill-ink text-[13px] font-bold">
        {label}
      </text>
      <text x={x + barWidth / 2} y={29} textAnchor="middle" className="fill-ink-soft text-[11px]">
        {count}폭 · 손실 {lossPercent.toFixed(1)}%
      </text>

      {Array.from({ length: count }, (_, i) => {
        const y = top + i * stripLength * scale;
        const h = stripLength * scale;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={h - 1.5}
              rx={2}
              className="fill-brand stroke-ink/25"
              strokeWidth={0.75}
            />
            <text
              x={x + barWidth / 2}
              y={y + h / 2 + 3}
              textAnchor="middle"
              className="fill-ink text-[10px] font-medium"
            >
              {height}m
            </text>
          </g>
        );
      })}

      {/* 버려지는 자투리 */}
      <rect
        x={x}
        y={top + used * scale}
        width={barWidth}
        height={waste * scale}
        rx={2}
        fill="url(#waste-hatch)"
        className="stroke-ink/25"
        strokeWidth={0.75}
      />
      <text
        x={x + barWidth / 2}
        y={top + used * scale + Math.max(waste * scale / 2 + 3, 11)}
        textAnchor="middle"
        className="fill-ink-soft text-[10px]"
      >
        {waste.toFixed(2)}m
      </text>
    </g>
  );
}

export function WallpaperRollDiagram() {
  return (
    <figure className="mt-5 rounded-xl border border-line bg-white p-4">
      <svg
        viewBox="0 0 320 360"
        className="mx-auto h-auto w-full max-w-[320px]"
        role="img"
        aria-label="실크벽지 1롤(15.6m)에서 천장고 2.5m일 때는 6폭이 나오고 0.30m가 남지만, 천장고 2.6m일 때는 5폭만 나오고 2.35m가 버려진다는 것을 보여주는 도해"
      >
        <defs>
          <pattern id="waste-hatch" width="6" height="6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
            <rect width="6" height="6" className="fill-paper" />
            <line x1="0" y1="0" x2="0" y2="6" className="stroke-ink/25" strokeWidth="2" />
          </pattern>
        </defs>

        {/* 롤 길이 눈금 */}
        <line x1="26" y1="34" x2="26" y2="334" className="stroke-ink/30" strokeWidth="1" />
        <text x="22" y="38" textAnchor="end" className="fill-ink-soft text-[10px]">
          0
        </text>
        <text x="22" y="337" textAnchor="end" className="fill-ink-soft text-[10px]">
          15.6m
        </text>
        <text
          x="10"
          y="190"
          textAnchor="middle"
          transform="rotate(-90 10 190)"
          className="fill-ink-soft text-[10px]"
        >
          롤 길이
        </text>

        <Roll height={2.5} x={60} label="천장고 2.5m" />
        <Roll height={2.6} x={200} label="천장고 2.6m" />

        {/* 범례 */}
        <g transform="translate(60, 348)">
          <rect width="10" height="10" y="-8" rx="2" className="fill-brand stroke-ink/25" strokeWidth={0.75} />
          <text x="15" y="0" className="fill-ink-soft text-[10px]">
            시공에 쓰는 폭
          </text>
          <rect x="105" width="10" height="10" y="-8" rx="2" fill="url(#waste-hatch)" className="stroke-ink/25" strokeWidth={0.75} />
          <text x="120" y="0" className="fill-ink-soft text-[10px]">
            버려지는 자투리
          </text>
        </g>
      </svg>
      <figcaption className="mt-3 text-sm leading-relaxed text-ink-soft">
        같은 롤인데 천장고가 10cm 높아지면 폭이 하나 통째로 사라집니다. 재단 길이 2.65m × 6 = 15.9m가
        롤 길이 15.6m를 넘어서기 때문입니다. 손실률이 3.8%에서 16.7%로 뜁니다.
      </figcaption>
    </figure>
  );
}
