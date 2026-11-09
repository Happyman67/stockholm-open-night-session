export function StaticCourt() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#07080c]" aria-hidden="true">
      <div className="absolute -left-10 top-0 h-[78%] w-40 rotate-[-8deg] bg-gradient-to-b from-amber/50 via-amber/10 to-transparent blur-2xl" />
      <div className="absolute right-[8%] top-[6%] h-[50%] w-36 rotate-6 bg-gradient-to-b from-cyan/40 to-transparent blur-2xl" />
      <svg className="absolute left-1/2 top-[7%] w-[34rem] max-w-[90vw] -translate-x-1/2" viewBox="0 0 640 220" fill="none">
        <path d="M80 200 Q320 20 560 200" stroke="#8eebff" strokeWidth="6" />
        <path d="M120 188 Q320 48 520 188" stroke="#6b4124" strokeWidth="18" opacity="0.85" />
      </svg>
      <div className="absolute inset-x-0 bottom-[6%] top-[28%] [perspective:900px]">
        <div className="absolute left-1/2 top-[8%] h-[78%] w-[min(78%,820px)] -translate-x-1/2 origin-bottom border-[3px] border-[#bff6ff] bg-[#1566e0] shadow-[0_0_80px_rgba(21,102,224,0.55)] [transform:rotateX(58deg)]">
          <div className="absolute inset-[7%] border-2 border-white/90" />
          <div className="absolute top-1/2 right-[7%] left-[7%] border-t-2 border-white" />
          <div className="absolute top-[7%] bottom-[7%] left-1/2 border-l-2 border-white/90" />
          <div className="absolute top-[30%] right-[18%] left-[18%] border-t-2 border-white/80" />
          <div className="absolute right-[18%] bottom-[30%] left-[18%] border-t-2 border-white/80" />
        </div>
      </div>
      <div className="absolute bottom-[31%] left-[57%] size-9 rounded-full bg-[#e4ee6a] shadow-[0_0_24px_rgba(227,154,69,0.85),0_14px_18px_rgba(0,0,0,0.55)]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#07080c] to-transparent" />
    </div>
  );
}
