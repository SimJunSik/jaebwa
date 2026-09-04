/**
 * 재봐 워드마크.
 * 글자 아래에 자(ruler) 눈금을 깔아 "잰다"는 인상만 남긴다.
 * 집/망치/롤러 같은 인테리어 업체 기호는 쓰지 않는다.
 */

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`relative inline-block font-bold tracking-tight ${className}`}>
      재봐
      <span
        aria-hidden
        className="ruler-ticks absolute -bottom-1 left-0 h-[5px] w-full text-ink/40"
      />
    </span>
  );
}
