import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { gameActions, useGame } from "@/lib/game-store";
import type { Room } from "@/lib/game-data";

const accentMap: Record<Room["accent"], { glow: string; text: string; ring: string; bar: string }> = {
  cyan:    { glow: "shadow-neon-cyan",    text: "text-glow-cyan",    ring: "ring-primary",                          bar: "bg-primary" },
  magenta: { glow: "shadow-neon-magenta", text: "text-glow-magenta", ring: "ring-accent",                           bar: "bg-accent" },
  green:   { glow: "shadow-neon-cyan",    text: "text-glow-cyan",    ring: "ring-[oklch(0.78_0.2_155)]",            bar: "bg-[oklch(0.78_0.2_155)]" },
  amber:   { glow: "shadow-neon-magenta", text: "text-glow-magenta", ring: "ring-[oklch(0.78_0.18_70)]",            bar: "bg-[oklch(0.78_0.18_70)]" },
  violet:  { glow: "shadow-neon-magenta", text: "text-glow-magenta", ring: "ring-[oklch(0.65_0.25_300)]",           bar: "bg-[oklch(0.65_0.25_300)]" },
  red:     { glow: "shadow-neon-magenta", text: "text-glow-magenta", ring: "ring-destructive",                      bar: "bg-destructive" },
  blue:    { glow: "shadow-neon-cyan",    text: "text-glow-cyan",    ring: "ring-primary",                          bar: "bg-primary" },
};

export function RoomView({ room }: { room: Room }) {
  const navigate = useNavigate();
  const { solved } = useGame();
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ correct: boolean; delta: number } | null>(null);
  const a = accentMap[room.accent];
  const isSolved = !!solved[room.id];

  useEffect(() => {
    gameActions.startRoom(room.id);
  }, [room.id]);

  function pick(i: number, correct: boolean) {
    if (feedback?.correct || isSolved) return;
    setSelected(i);
    const delta = gameActions.answer(room.id, correct);
    setFeedback({ correct, delta });
  }

  return (
    <div className="relative min-h-screen pt-20 pb-12 px-4 sm:px-6">
      {/* Background image */}
      <div className="fixed inset-0 -z-10">
        <img
          src={room.image}
          alt=""
          className="w-full h-full object-cover opacity-50"
          width={1280}
          height={896}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        <div className="absolute inset-0 bg-grid opacity-30" />
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-display tracking-[0.3em] text-muted-foreground mb-3">
            <span>חדר</span>
            <span className={`font-bold ${a.text}`}>0{room.number}</span>
            <span>/</span>
            <span>07</span>
          </div>
          <div className="text-5xl sm:text-6xl mb-2 animate-float">{room.icon}</div>
          <h1 className={`text-3xl sm:text-4xl font-display font-black ${a.text}`}>
            {room.title}
          </h1>
          <p className="text-sm text-muted-foreground mt-2 tracking-widest uppercase">
            {room.subtitle}
          </p>
        </div>

        {/* Question card */}
        <div
          className={`relative scanline rounded-2xl border border-border bg-card/80 backdrop-blur-xl p-6 sm:p-10 ${a.glow}`}
        >
          <div className={`absolute -top-px left-8 right-8 h-px ${a.bar} opacity-80`} />

          <h2 className="text-xl sm:text-2xl font-display font-bold mb-6 leading-relaxed text-center">
            {room.question}
          </h2>

          <div className="space-y-3">
            {room.options.map((opt, i) => {
              const isSel = selected === i;
              const showState = feedback && isSel;
              const reveal = feedback?.correct;
              return (
                <button
                  key={i}
                  onClick={() => pick(i, opt.correct)}
                  disabled={!!feedback?.correct || isSolved}
                  className={`w-full text-right group relative px-5 py-4 rounded-xl border transition-all duration-300
                    ${
                      reveal && opt.correct
                        ? "border-success bg-success/10 text-success shadow-[0_0_30px_oklch(0.78_0.2_155/40%)]"
                        : showState && !opt.correct
                        ? "border-destructive bg-destructive/10 text-destructive"
                        : "border-border bg-secondary/40 hover:border-primary hover:bg-secondary/60 hover:translate-x-[-4px]"
                    }
                    disabled:cursor-not-allowed`}
                >
                  <span className="font-display text-lg">{opt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {feedback && (
            <div className="mt-6 p-5 rounded-xl border border-border bg-background/60">
              {feedback.correct ? (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">✅</span>
                    <span className="font-display font-bold text-success text-lg">
                      תשובה נכונה! +{feedback.delta} נקודות
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {room.explanation}
                  </p>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚠️</span>
                  <span className="font-display font-bold text-destructive">
                    טעות. {feedback.delta} נקודות. נסי שוב.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Continue */}
          {(feedback?.correct || isSolved) && (
            <button
              onClick={() => navigate({ to: "/" })}
              className="mt-6 w-full py-4 rounded-xl bg-gradient-neon font-display font-bold text-background tracking-wider hover:scale-[1.02] transition-transform"
            >
              חזרה למסדרון →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
