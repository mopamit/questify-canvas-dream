import { useEffect, useState } from "react";
import { gameActions, useGame } from "@/lib/game-store";
import type { Room } from "@/lib/game-data";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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

type Props = {
  room: Room | null;
  open: boolean;
  onClose: () => void;
};

export function RoomDialog({ room, open, onClose }: Props) {
  const { solved } = useGame();
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [openCard, setOpenCard] = useState<number | null>(null);

  // Reset state whenever a new room opens
  useEffect(() => {
    if (open && room) {
      setSelected(null);
      setFeedback(null);
      setOpenCard(null);
      gameActions.startRoom(room.id);
    }
  }, [open, room]);

  if (!room) return null;
  const a = accentMap[room.accent];
  const isSolved = !!solved[room.id];

  function pick(i: number) {
    if (!room) return;
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

  function tryAgain() {
    setSelected(null);
    setFeedback(null);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-3xl p-0 overflow-hidden border-border bg-card/95 backdrop-blur-xl max-h-[92vh] overflow-y-auto"
        dir="rtl"
      >
        {/* Hero image */}
        <div className="relative h-48 sm:h-60 overflow-hidden">
          <img
            src={room.image}
            alt={room.title}
            className="w-full h-full object-cover"
            width={1280}
            height={896}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
          <div className={`absolute -bottom-px left-8 right-8 h-px ${a.bar} opacity-90`} />

          <div className="absolute bottom-4 right-6 left-6 text-right">
            <div className="inline-flex items-center gap-2 text-[11px] font-display tracking-[0.3em] text-foreground/85 mb-2 px-2.5 py-0.5 rounded-full bg-background/70 backdrop-blur">
              <span>חדר</span>
              <span className={`font-bold ${a.text}`}>0{room.number}</span>
              <span>/ 07</span>
            </div>
            <h1 className={`text-2xl sm:text-4xl font-display font-black ${a.text} drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]`}>
              {room.title}
            </h1>
            <p className="text-xs text-foreground/85 mt-1 tracking-widest uppercase font-semibold">
              {room.subtitle}
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {/* Question */}
          <h2 className="text-lg sm:text-xl font-display font-bold mb-5 leading-relaxed text-center">
            {room.question}
          </h2>

          {/* Options */}
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
                  <span className="font-display text-base sm:text-lg font-semibold">
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {feedback && (
            <div
              className={`mt-5 p-5 rounded-xl border animate-[fade-in_0.3s_ease-out] ${
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
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {room.explanation}
                  </p>
                </>
              ) : (
                <>
                  <div className="font-display font-bold text-destructive text-lg mb-2">
                    תשובה שגויה · {feedback.delta} נקודות
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {feedback.wrongReason ?? "זו אינה התשובה הנכונה."}
                  </p>
                  <button
                    onClick={tryAgain}
                    className="mt-3 px-4 py-2 rounded-lg border border-destructive/40 bg-destructive/10 hover:bg-destructive/20 text-destructive text-sm font-display font-semibold transition-colors"
                  >
                    נסו שוב ←
                  </button>
                </>
              )}
            </div>
          )}

          {/* Hidden hologram cards */}
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-display font-bold tracking-[0.3em] text-muted-foreground uppercase">
                כרטיסי הולוגרמה · לחצו לחשיפה
              </span>
              <span className="flex-1 h-px bg-border" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {room.facts.map((fact, i) => {
                const isOpen = openCard === i;
                return (
                  <button
                    key={i}
                    onClick={() => setOpenCard(isOpen ? null : i)}
                    className={`group relative text-right rounded-xl border overflow-hidden transition-all duration-300 ${
                      isOpen
                        ? "border-primary bg-primary/5 shadow-neon-cyan sm:col-span-3"
                        : "border-border bg-background/40 hover:border-primary/60 hover:-translate-y-0.5"
                    }`}
                  >
                    {!isOpen ? (
                      // Hologram closed state — animal hologram preview
                      <div className="relative p-3 h-44 flex flex-col items-center justify-end overflow-hidden">
                        {/* Holographic disc */}
                        <div className="absolute inset-x-4 bottom-10 h-3 rounded-[50%] bg-[radial-gradient(ellipse_at_center,oklch(0.82_0.2_195/60%),transparent_70%)] blur-[1px]" />
                        {/* Hologram image */}
                        <div className="relative flex-1 w-full flex items-center justify-center">
                          <img
                            src={fact.image}
                            alt={fact.name}
                            loading="lazy"
                            width={512}
                            height={512}
                            className="max-h-full max-w-full object-contain drop-shadow-[0_0_18px_oklch(0.82_0.2_195/60%)] opacity-90 mix-blend-screen animate-float"
                          />
                          {/* Scan-line overlay */}
                          <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0,transparent_3px,oklch(0.82_0.2_195/12%)_3px,oklch(0.82_0.2_195/12%)_4px)]" />
                        </div>
                        <div className="relative mt-1 text-xs font-display font-semibold text-primary/95 tracking-wider text-center">
                          {fact.name}
                        </div>
                        <div className="absolute top-2 left-2 text-[9px] font-mono text-primary/60 tracking-wider">
                          HOLO_{i + 1}
                        </div>
                      </div>
                    ) : (
                      // Open state — full hologram + info
                      <div className="p-5 animate-[fade-in_0.3s_ease-out]">
                        <div className="flex items-start gap-4">
                          <div className="relative shrink-0 w-28 h-28 sm:w-36 sm:h-36 rounded-xl bg-primary/5 border border-primary/30 overflow-hidden flex items-center justify-center">
                            <img
                              src={fact.image}
                              alt={fact.name}
                              loading="lazy"
                              width={512}
                              height={512}
                              className="w-full h-full object-contain drop-shadow-[0_0_20px_oklch(0.82_0.2_195/70%)] mix-blend-screen"
                            />
                            <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0,transparent_3px,oklch(0.82_0.2_195/15%)_3px,oklch(0.82_0.2_195/15%)_4px)]" />
                          </div>
                          <div className="flex-1 text-right">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div className="text-[10px] font-mono text-primary/70 tracking-widest mb-1">
                                  HOLO_{i + 1} · DECRYPTED
                                </div>
                                <h4 className="font-display font-bold text-lg text-primary text-glow-cyan">
                                  {fact.name}
                                </h4>
                              </div>
                              <span className="text-xs text-muted-foreground">[סגרו ✕]</span>
                            </div>
                            <p className="text-sm text-foreground/90 leading-relaxed">
                              {fact.fact}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer — back to corridor (always available) */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 items-stretch">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-5 rounded-xl border border-border bg-secondary/70 hover:bg-secondary font-display font-semibold transition-colors"
            >
              חזרה למסדרון →
            </button>
            {(feedback?.correctPicked || isSolved) && (
              <div className="flex-1 py-3 px-5 rounded-xl bg-gradient-neon font-display font-bold text-background text-center tracking-wider">
                ✓ החדר נפתר
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
