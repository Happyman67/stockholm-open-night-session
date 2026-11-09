export function StaticCourt() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#05070d]" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_38%,#1a2740_0%,#05070d_62%)]" />
      <div className="absolute inset-x-[6%] top-[4%] h-[42%] rounded-[50%] border border-white/5 bg-[radial-gradient(ellipse_at_50%_80%,rgba(22,34,54,0.9),transparent_70%)]" />
      <div className="absolute inset-x-[18%] top-[14%] h-24 opacity-70">
        {Array.from({ length: 18 }).map((_, index) => (
          <span
            key={index}
            className="absolute h-1.5 w-3 rounded-sm bg-[#243044]"
            style={{
              left: `${(index % 9) * 11}%`,
              top: `${Math.floor(index / 9) * 18}px`,
            }}
          />
        ))}
      </div>
      <span className="absolute top-[8%] left-[16%] h-2 w-10 rounded-full bg-[#bff6ff] shadow-[0_0_24px_#7ee7ff]" />
      <span className="absolute top-[10%] left-[46%] h-2 w-8 rounded-full bg-[#f4fbff] shadow-[0_0_18px_#d7f4ff]" />
      <span className="absolute top-[7%] right-[18%] h-2 w-10 rounded-full bg-[#ffb15e] shadow-[0_0_24px_#e39a45]" />
      <span className="absolute top-[16%] right-[8%] h-1.5 w-6 rounded-full bg-[#9a8cff] shadow-[0_0_16px_#9a8cff]" />
      <div className="light-beam pointer-events-none absolute top-[-8%] left-[10%] h-[88%] w-[24%] bg-[linear-gradient(to_bottom,rgba(142,235,255,0.72),rgba(70,170,255,0.16)_48%,transparent_78%)] blur-xl [--beam-rot:-16deg]" />
      <div className="light-beam pointer-events-none absolute top-[-6%] left-[40%] h-[80%] w-[14%] bg-[linear-gradient(to_bottom,rgba(255,255,255,0.42),rgba(120,190,255,0.08)_46%,transparent_72%)] blur-xl [--beam-rot:4deg]" />
      <div className="light-beam pointer-events-none absolute top-[-8%] right-[12%] h-[90%] w-[26%] bg-[linear-gradient(to_bottom,rgba(255,177,94,0.7),rgba(227,154,69,0.14)_50%,transparent_78%)] blur-xl [--beam-rot:15deg]" />
      <div className="light-beam pointer-events-none absolute top-[2%] right-[2%] h-[48%] w-[10%] bg-[linear-gradient(to_bottom,rgba(154,140,255,0.45),transparent_70%)] blur-xl [--beam-rot:-8deg]" />
      <div className="absolute inset-x-[-8%] top-[26%] bottom-[-18%] [perspective:680px]">
        <div className="absolute top-[4%] left-1/2 h-[96%] w-[min(108%,1040px)] origin-bottom -translate-x-1/2 bg-[#0a2f72] shadow-[0_0_120px_rgba(60,150,255,0.35)] [transform:rotateX(66deg)]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(142,235,255,0.28),transparent_42%),radial-gradient(ellipse_at_70%_55%,rgba(255,177,94,0.22),transparent_40%)]" />
          <div className="absolute inset-[6%] border-2 border-[#d9f7ff] shadow-[0_0_18px_#8eebff]" />
          <div className="absolute inset-x-[6%] top-1/2 h-[3px] -translate-y-1/2 bg-[#f4fbff] shadow-[0_0_16px_#ffffff]" />
          <div className="absolute inset-y-[6%] left-1/2 w-[2px] -translate-x-1/2 bg-[#d9f7ff]/90" />
          <div className="absolute inset-x-[18%] top-[30%] h-[2px] bg-[#d9f7ff]/85" />
          <div className="absolute inset-x-[18%] bottom-[30%] h-[2px] bg-[#d9f7ff]/85" />
          <div className="absolute inset-y-[30%] left-[18%] w-[2px] bg-[#d9f7ff]/80" />
          <div className="absolute inset-y-[30%] right-[18%] w-[2px] bg-[#d9f7ff]/80" />
          <div className="absolute inset-x-[7%] top-1/2 h-3 -translate-y-1/2 bg-[repeating-linear-gradient(90deg,rgba(244,251,255,0.9)_0_2px,transparent_2px_9px)]" />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#05070d] to-transparent" />
    </div>
  );
}
