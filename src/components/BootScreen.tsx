import { useEffect, useState } from "react";
import { Typewriter } from "./Typewriter";

type Props = {
  open: boolean;
  onClose: () => void;
};

const lines = [
  "> מערכת LAB-X23 :: התחברות מאובטחת",
  "> סטטוס: 🔴 קריטי",
  "> אזעקת חירום במעבדה",
];

const briefing =
  "קפסולת ניסוי קרסה. יצור נדיר נמצא לכוד בתא אטום — ללא מים, מזון, חמצן, טמפרטורה מתאימה, אור, מצע או הגנה.";
const mission =
  "פתחו 7 חדרים, פתרו את החידות, ושחזרו את צרכי הקיום של היצור.";

export function BootScreen({ open, onClose }: Props) {
  const [step, setStep] = useState(0);

  // Reset typewriter sequence each time the screen opens
  useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/85 backdrop-blur-sm animate-[fade-in_0.3s_ease-out]">
      {/* Computer monitor frame */}
      <div className="relative w-full max-w-3xl">
        {/* Outer bezel */}
        <div className="rounded-[2rem] bg-gradient-to-b from-zinc-700 to-zinc-900 p-3 sm:p-4 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]">
          {/* Inner bezel */}
          <div className="rounded-[1.5rem] bg-zinc-950 p-2 sm:p-3">
            {/* Screen */}
            <div className="relative rounded-2xl overflow-hidden bg-[oklch(0.13_0.06_180)] border border-primary/30 scanline">
              {/* CRT glow */}
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,oklch(0_0_0/60%)_100%)]" />

              {/* Top bar */}
              <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-primary/30">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-destructive/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[oklch(0.78_0.18_70)]/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-success/80" />
                </div>
                <div className="font-display text-[10px] sm:text-xs tracking-[0.3em] text-primary/80">
                  TERMINAL · X23
                </div>
                <div className="font-display text-[10px] text-primary/60">
                  {new Date().toLocaleDateString("he-IL")}
                </div>
              </div>

              {/* Content */}
              <div
                className="p-6 sm:p-10 min-h-[420px] sm:min-h-[460px] text-right"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {/* Boot lines */}
                <div className="space-y-1 text-primary text-glow-cyan font-mono text-sm sm:text-base mb-6">
                  {lines.map((l, i) => (
                    <p key={i} className="opacity-90">
                      <Typewriter
                        text={l}
                        speed={18}
                        startDelay={i * 600}
                        onDone={() =>
                          i === lines.length - 1 && setStep((s) => Math.max(s, 1))
                        }
                      />
                    </p>
                  ))}
                </div>

                {/* Briefing */}
                {step >= 1 && (
                  <div className="mb-5">
                    <div className="text-xs font-display tracking-[0.3em] text-accent text-glow-magenta mb-2">
                      // בריפינג
                    </div>
                    <p className="text-foreground/95 text-base sm:text-lg leading-relaxed">
                      <Typewriter
                        text={briefing}
                        speed={22}
                        onDone={() => setStep((s) => Math.max(s, 2))}
                      />
                    </p>
                  </div>
                )}

                {step >= 2 && (
                  <div className="mb-8">
                    <div className="text-xs font-display tracking-[0.3em] text-accent text-glow-magenta mb-2">
                      // משימה
                    </div>
                    <p className="text-primary text-glow-cyan text-base sm:text-lg leading-relaxed font-semibold">
                      <Typewriter
                        text={mission}
                        speed={24}
                        onDone={() => setStep((s) => Math.max(s, 3))}
                      />
                    </p>
                  </div>
                )}

                {/* Confirm button */}
                {step >= 3 && (
                  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between animate-[fade-in_0.4s_ease-out]">
                    <button
                      onClick={() => setStep(99)}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      [דלג על האנימציה]
                    </button>
                    <button
                      onClick={onClose}
                      className="px-8 py-3 rounded-lg bg-gradient-neon font-display font-bold text-background tracking-widest hover:scale-105 transition-transform shadow-neon-cyan"
                    >
                      כניסה למסדרון ←
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Stand */}
          <div className="mx-auto mt-2 h-3 w-32 rounded-b-2xl bg-gradient-to-b from-zinc-800 to-zinc-950" />
        </div>
      </div>
    </div>
  );
}
