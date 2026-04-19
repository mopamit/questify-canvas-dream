import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { gameActions, useGame } from "@/lib/game-store";
import type { Room } from "@/lib/game-data";

const accentMap: Record<Room["accent"], { glow: string; text: string; bar: string }> = {
  cyan:    { glow: "shadow-neon-cyan",    text: "text-glow-cyan",    bar: "bg-primary" },
  magenta: { glow: "shadow-neon-magenta", text: "text-glow-magenta", bar: "bg-accent" },
  green:   { glow: "shadow-neon-cyan",    text: "text-glow-cyan",    bar: "bg-[oklch(0.78_0.2_155)]" },
  amber:   { glow: "shadow-neon-magenta", text: "text-glow-magenta", bar: "bg-[oklch(0.78_0.18_70)]" },
  violet:  { glow: "shadow-neon-magenta", text: "text-glow-magenta", bar: "bg-[oklch(0.65_0.25_300)]" },
  red:     { glow: "shadow-neon-magenta", text: "text-glow-magenta", bar: "bg-destructive" },
  blue:    { glow: "shadow-neon-cyan",    text: "text-glow-cyan",    bar: "bg-primary" },
};

type Feedback = { correctPicked: boolean; delta: number; wrongReason?: string };

export function RoomView({ room }: { room: Room }) {
  const navigate = useNavigate();
  const { solved } = useGame();
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [openFact, setOpenFact] = useState<number | null>(null);
  const a = accentMap[room.accent];
  const isSolved = !!solved[room.id];

  useEffect(() => {
    gameActions.startRoom(room.id);
  }, [room.id]);

  function pick(i: number) {
    const opt = room.options[i];
    if (feedback?.correctPicked || isSolved) return;
    setSelected(i);
    const delta = gameActions.answer(room.id, opt.correct);
    setFeedback({
      correctPicked: opt.correct,
      delta,
      wrongReason: opt.correct ? undefined : opt.wrongReason,
    });
  }

  return (
    <div className="relative min-h-screen pt-20 pb-12 px-4 sm:px-6">
      {/* Background image — Pixar bright, much more visible */}
      <div className="fixed inset-0 -z-10">
        <img
          src={room.image}
          alt=""
          className="w-full h-full object-cover"
          width={1280}
          height={896}
        />
        {/* Lighter overlay so the bright Pixar art shines through */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/45 to-background/85" />
      </div>

      <div className="max-w-3xl mx-auto animate-[fade-in_0.5s_ease-out]">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-display tracking-[0.3em] text-foreground/80 mb-3 px-3 py-1 rounded-full bg-background/60 backdrop-blur">
            <span>חדר</span>
            <span className={`font-bold ${a.text}`}>0{room.number}</span>
            <span>/ 07</span>
          </div>
          <h1 className={`text-3xl sm:text-5xl font-display font-black ${a.text} drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]`}>
            {room.title}
          </h1>
          <p className="text-sm text-foreground/80 mt-2 tracking-widest uppercase font-semibold">
            {room.subtitle}
          </p>
        </div>

        {/* Question card */}
        <div
          className={`relative rounded-2xl border border-border bg-card/85 backdrop-blur-xl p-6 sm:p-10 ${a.glow}`}
        >
          <div className={`absolute -top-px left-8 right-8 h-px ${a.bar} opacity-80`} />

          <h2 className="text-xl sm:text-2xl font-display font-bold mb-6 leading-relaxed text-center">
            {room.question}
          </h2>

          <div className="space-y-3">
            {room.options.map((opt, i) => {
              const isSel = selected === i;
              const showAsCorrect = feedback && opt.correct && (feedback.correctPicked || isSel);
              const showAsWrong = feedback && isSel && !opt.correct;
              return (
                <button
                  key={i}
                  onClick={() => pick(i)}
                  disabled={!!feedback?.correctPicked || isSolved}
                  className={`w-full text-right px-5 py-4 rounded-xl border transition-all duration-300
                    ${
                      showAsCorrect
                        ? "border-success bg-success/15 text-success shadow-[0_0_30px_oklch(0.78_0.2_155/40%)]"
                        : showAsWrong
                        ? "border-destructive bg-destructive/15 text-destructive"
                        : "border-border bg-secondary/60 hover:border-primary hover:bg-secondary/80 hover:translate-x-[-4px]"
                    }
                    disabled:cursor-not-allowed`}
                >
                  <span className="font-display text-lg font-semibold">{opt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {feedback && (
            <div
              className={`mt-6 p-5 rounded-xl border animate-[fade-in_0.3s_ease-out] ${
                feedback.correctPicked
                  ? "border-success/40 bg-success/5"
                  : "border-destructive/40 bg-destructive/5"
              }`}
            >
              {feedback.correctPicked ? (
                <>
                  <div className="font-display font-bold text-success text-lg mb-2">
                    תשובה נכונה · +{feedback.delta} נקודות
                  </div>
                  <p className="text-sm text-foreground/85 leading-relaxed">{room.explanation}</p>
                </>
              ) : (
                <>
                  <div className="font-display font-bold text-destructive text-lg mb-2">
                    תשובה שגויה · {feedback.delta} נקודות
                  </div>
                  <p className="text-sm text-foreground/85 leading-relaxed">
                    {feedback.wrongReason ?? "זו אינה התשובה הנכונה. נסי שוב."}
                  </p>
                  <p className="text-xs text-muted-foreground mt-3">
                    בחרי שוב — הניקוד יוסיף עוד הפסד אם תטעי.
                  </p>
                </>
              )}
            </div>
          )}

          {/* Animal facts — accordion */}
          <div className="mt-8">
            <h3 className="text-sm font-display font-bold tracking-widest text-muted-foreground mb-3 uppercase">
              מידע נוסף · לחצי לקריאה
            </h3>
            <div className="space-y-2">
              {room.facts.map((fact, i) => {
                const isOpen = openFact === i;
                return (
                  <div
                    key={i}
                    className="rounded-xl border border-border bg-background/40 overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setOpenFact(isOpen ? null : i)}
                      className="w-full text-right px-4 py-3 flex items-center justify-between hover:bg-background/70 transition-colors"
                    >
                      <span className="font-display font-semibold text-foreground">
                        {fact.name}
                      </span>
                      <span
                        className={`text-primary transition-transform duration-300 ${
                          isOpen ? "rotate-90" : ""
                        }`}
                      >
                        ←
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-sm text-foreground/80 leading-relaxed animate-[fade-in_0.25s_ease-out]">
                        {fact.fact}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Continue */}
          {(feedback?.correctPicked || isSolved) && (
            <button
              onClick={() => navigate({ to: "/" })}
              className="mt-8 w-full py-4 rounded-xl bg-gradient-neon font-display font-bold text-background tracking-wider hover:scale-[1.02] transition-transform"
            >
              חזרה למסדרון ←
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
