import { useEffect } from "react";

type Props = {
  show: boolean;
  onDone: () => void;
};

export function KeyAward({ show, onDone }: Props) {
  useEffect(() => {
    if (!show) return;
    const t = window.setTimeout(onDone, 2400);
    return () => window.clearTimeout(t);
  }, [show, onDone]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fade-in_0.3s_ease-out]" />

      {/* Radiating rings */}
      <div className="absolute">
        <div className="w-72 h-72 rounded-full border-2 border-[oklch(0.78_0.18_70)]/60 animate-ping" />
      </div>
      <div className="absolute">
        <div
          className="w-96 h-96 rounded-full border-2 border-accent/40 animate-ping"
          style={{ animationDelay: "0.2s" }}
        />
      </div>

      <div className="relative text-center animate-[scale-in_0.4s_ease-out]">
        <div
          className="text-8xl sm:text-9xl mb-4 animate-float drop-shadow-[0_0_40px_oklch(0.78_0.18_70/90%)]"
          style={{ filter: "drop-shadow(0 0 30px oklch(0.78 0.18 70 / 0.9))" }}
        >
          🗝️
        </div>
        <div className="text-xs font-display tracking-[0.4em] text-[oklch(0.78_0.18_70)] mb-2">
          BONUS UNLOCKED
        </div>
        <h2
          className="font-display font-black text-4xl sm:text-6xl text-[oklch(0.88_0.18_85)]"
          style={{
            textShadow:
              "0 0 24px oklch(0.78 0.18 70 / 90%), 0 0 48px oklch(0.78 0.18 70 / 50%)",
          }}
        >
          מפתח חדש!
        </h2>
        <p className="mt-3 text-foreground/90 text-sm sm:text-base">
          השתמשו בו לפתיחת חדר נעול
        </p>
      </div>
    </div>
  );
}
