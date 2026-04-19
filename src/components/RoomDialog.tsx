import { useEffect, useState } from "react";
import { gameActions, useGame } from "@/lib/game-store";
import type { Room } from "@/lib/game-data";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { sfx } from "@/lib/sound";

const accentMap: Record<Room["accent"], { glow: string; text: string; bar: string }> = {
  cyan:    { glow: "shadow-neon-cyan",    text: "text-glow-cyan",    bar: "bg-primary" },
  magenta: { glow: "shadow-neon-magenta", text: "text-glow-magenta", bar: "bg-accent" },
  green:   { glow: "shadow-neon-cyan",    text: "text-glow-cyan",    bar: "bg-[oklch(0.78_0.2_155)]" },
  amber:   { glow: "shadow-neon-magenta", text: "text-glow-magenta", bar: "bg-[oklch(0.78_0.18_70)]" },
  violet:  { glow: "shadow-neon-magenta", text: "text-glow-magenta", bar: "bg-[oklch(0.65_0.25_300)]" },
  red:     { glow: "shadow-neon-magenta", text: "text-glow-magenta", bar: "bg-destructive" },
  blue:    { glow: "shadow-neon-cyan",    text: "text-glow-cyan",    bar: "bg-primary" },
};

type Feedback = {
  correctPicked: boolean;
  delta: number;
  wrongReason?: string;
  keyEarned?: boolean;
  /** auto-close timer when wrong */
  autoCloseAt?: number;
};

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
  const [viewed, setViewed] = useState<Set<number>>(new Set());
  const [closingIn, setClosingIn] = useState<number>(0);
  const [activating, setActivating] = useState<number | null>(null);

  // Reset state whenever a new room opens
  useEffect(() => {
    if (open && room) {
      setSelected(null);
      setFeedback(null);
      setOpenCard(null);
      setViewed(new Set());
      setClosingIn(0);
      setActivating(null);
      gameActions.startRoom(room.id);
    }
  }, [open, room]);

  // Auto-close countdown after wrong answer (4s)
  useEffect(() => {
    if (!feedback || feedback.correctPicked) return;
    setClosingIn(4);
    const interval = setInterval(() => {
      setClosingIn((c) => {
        if (c <= 1) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [feedback, onClose]);

  if (!room) return null;
  const a = accentMap[room.accent];
  const isSolved = !!solved[room.id];
  const allViewed = viewed.size === room.facts.length;

  function toggleCard(i: number) {
    const wasNew = !viewed.has(i);

    if (wasNew) {
      sfx.hologram();
      setViewed((prev) => {
        if (prev.has(i)) return prev;
        const next = new Set(prev);
        next.add(i);
        return next;
      });
      setActivating(i);
      window.setTimeout(() => {
        setOpenCard(i);
        setActivating(null);
      }, 650);
      return;
    }

    sfx.click();
    setOpenCard((cur) => (cur === i ? null : i));
  }

  function pick(i: number) {
    if (!room) return;
    if (!allViewed) {
      sfx.wrong();
      return;
    }

    const opt = room.options[i];
    if (feedback) return;

    sfx.click();
    setSelected(i);

    if (isSolved) {
      setFeedback({
        correctPicked: opt.correct,
        delta: 0,
        wrongReason: opt.correct ? undefined : opt.wrongReason,
      });
      if (opt.correct) sfx.correct();
      else sfx.wrong();
      return;
    }

    const result = gameActions.answer(room.id, opt.correct);
    if (opt.correct) sfx.correct();
    else sfx.wrong();
    setFeedback({
      correctPicked: opt.correct,
      delta: result.delta,
      wrongReason: opt.correct ? undefined : opt.wrongReason,
      keyEarned: result.keyEarned,
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-3xl p-0 overflow-hidden border-border bg-card/95 backdrop-blur-xl max-h-[92vh] overflow-y-auto"
        dir="rtl"
      >
        <DialogTitle className="sr-only">{room.title}</DialogTitle>
        <DialogDescription className="sr-only">
          שאלה לימודית בחדר {room.number}. צפו בכל ההולוגרמות ואז בחרו תשובה.
        </DialogDescription>
        {/* Hero image */}
        <div className="relative h-48 sm:h-60 overflow-hidden">
          <img
            src={room.image}
            alt={room.title}
            className="w-full h-full object-cover"
            width={1280}
            height={896}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
          <div className={`absolute -bottom-px left-8 right-8 h-px ${a.bar} opacity-90`} />

          <div className="absolute bottom-4 right-6 left-6 text-right">
            <div className="inline-flex items-center gap-2 text-[11px] font-display tracking-[0.3em] text-foreground/85 mb-2 px-2.5 py-0.5 rounded-full bg-background/70 backdrop-blur">
              <span>חדר</span>
              <span dir="ltr" className={`font-bold ${a.text}`}>{room.number} / 7</span>
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
          {/* Hidden hologram cards — FIRST, must view all before answering */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-display font-bold tracking-[0.3em] text-muted-foreground uppercase">
                כרטיסי הולוגרמה · לחצו על כל אחד
              </span>
              <span className="flex-1 h-px bg-border" />
              <span
                className={`text-xs font-display font-bold tracking-wider ${
                  allViewed ? "text-success" : "text-accent"
                }`}
              >
                {viewed.size}/{room.facts.length}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {room.facts.map((fact, i) => {
                const isOpen = openCard === i;
                const wasViewed = viewed.has(i);
                // Color tokens: green (viewed), cyan (not viewed)
                const ringColor = wasViewed
                  ? "oklch(0.78_0.2_155)"
                  : "oklch(0.82_0.2_195)";
                return (
                  <button
                    key={i}
                    onClick={() => toggleCard(i)}
                    className={`group relative text-right rounded-xl border overflow-hidden transition-all duration-300 ${
                      isOpen
                        ? wasViewed
                          ? "border-success bg-success/5 sm:col-span-3"
                          : "border-primary bg-primary/5 sm:col-span-3"
                        : wasViewed
                        ? "border-success/60 bg-success/5 hover:border-success"
                        : "border-border bg-background/40 hover:border-primary/60 hover:-translate-y-0.5"
                    }`}
                    style={{
                      boxShadow: isOpen
                        ? `0 0 30px ${ringColor.replace(")", "/30%)")}`
                        : undefined,
                    }}
                  >
                    {!isOpen ? (
                      // Closed state — contained hologram preview
                      <div className="relative p-3 h-44 flex flex-col items-center justify-between overflow-hidden">
                        {activating === i && (
                          <div className="absolute inset-0 z-30 pointer-events-none">
                            <div className="absolute inset-0 bg-primary/30 animate-[fade-out_0.65s_ease-out_forwards]" />
                            <div
                              className="absolute left-0 right-0 h-1/2 bg-gradient-to-b from-transparent via-primary/80 to-transparent"
                              style={{ animation: "scanBeam 0.65s linear forwards" }}
                            />
                            <div className="absolute inset-0 border-2 border-primary animate-pulse" />
                          </div>
                        )}
                        <div className="absolute top-2 left-2 text-[9px] font-mono tracking-wider z-10"
                          style={{ color: wasViewed ? "oklch(0.78 0.2 155 / 80%)" : "oklch(0.82 0.2 195 / 70%)" }}
                        >
                          HOLO_{i + 1}
                        </div>
                        {wasViewed && (
                          <div className="absolute top-2 right-2 text-[10px] font-display font-bold tracking-wider text-success z-10">
                            ✓ נצפה
                          </div>
                        )}
                        {/* Hologram image — contained */}
                        <div className="relative flex-1 w-full flex items-center justify-center pt-3 min-h-0">
                          <img
                            src={fact.image}
                            alt={fact.name}
                            loading="lazy"
                            width={512}
                            height={512}
                            className={`max-h-[88%] max-w-[80%] object-contain animate-float ${
                              wasViewed ? "" : "mix-blend-screen opacity-90"
                            }`}
                            style={{
                              filter: wasViewed
                                ? "drop-shadow(0 0 14px oklch(0.78 0.2 155 / 60%))"
                                : "drop-shadow(0 0 14px oklch(0.82 0.2 195 / 60%))",
                            }}
                          />
                          {/* Scan lines */}
                          <div
                            className="pointer-events-none absolute inset-0"
                            style={{
                              backgroundImage: wasViewed
                                ? "repeating-linear-gradient(0deg,transparent 0,transparent 3px,oklch(0.78 0.2 155 / 12%) 3px,oklch(0.78 0.2 155 / 12%) 4px)"
                                : "repeating-linear-gradient(0deg,transparent 0,transparent 3px,oklch(0.82 0.2 195 / 12%) 3px,oklch(0.82 0.2 195 / 12%) 4px)",
                            }}
                          />
                        </div>
                        {/* Holographic disc base */}
                        <div className="relative w-3/4 h-2 rounded-[50%] mt-1"
                          style={{
                            background: wasViewed
                              ? "radial-gradient(ellipse at center, oklch(0.78 0.2 155 / 70%), transparent 70%)"
                              : "radial-gradient(ellipse at center, oklch(0.82 0.2 195 / 70%), transparent 70%)",
                            filter: "blur(1px)",
                          }}
                        />
                        <div
                          className="relative mt-1 text-xs font-display font-semibold tracking-wider text-center"
                          style={{ color: wasViewed ? "oklch(0.78 0.2 155)" : "oklch(0.82 0.2 195)" }}
                        >
                          {fact.name}
                        </div>
                      </div>
                    ) : (
                      // Open state — info panel
                      <div className="p-5 animate-[fade-in_0.3s_ease-out]">
                        <div className="flex items-start gap-4">
                          <div
                            className="relative shrink-0 w-28 h-28 sm:w-36 sm:h-36 rounded-xl overflow-hidden flex items-center justify-center"
                            style={{
                              background: wasViewed
                                ? "oklch(0.78 0.2 155 / 8%)"
                                : "oklch(0.82 0.2 195 / 8%)",
                              border: wasViewed
                                ? "1px solid oklch(0.78 0.2 155 / 40%)"
                                : "1px solid oklch(0.82 0.2 195 / 40%)",
                            }}
                          >
                            <img
                              src={fact.image}
                              alt={fact.name}
                              loading="lazy"
                              width={512}
                              height={512}
                              className="w-full h-full object-contain p-2"
                              style={{
                                filter: wasViewed
                                  ? "drop-shadow(0 0 16px oklch(0.78 0.2 155 / 60%))"
                                  : "drop-shadow(0 0 16px oklch(0.82 0.2 195 / 60%))",
                              }}
                            />
                            <div
                              className="pointer-events-none absolute inset-0"
                              style={{
                                backgroundImage: wasViewed
                                  ? "repeating-linear-gradient(0deg,transparent 0,transparent 3px,oklch(0.78 0.2 155 / 14%) 3px,oklch(0.78 0.2 155 / 14%) 4px)"
                                  : "repeating-linear-gradient(0deg,transparent 0,transparent 3px,oklch(0.82 0.2 195 / 14%) 3px,oklch(0.82 0.2 195 / 14%) 4px)",
                              }}
                            />
                          </div>
                          <div className="flex-1 text-right">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div
                                  className="text-[10px] font-mono tracking-widest mb-1"
                                  style={{
                                    color: wasViewed
                                      ? "oklch(0.78 0.2 155 / 80%)"
                                      : "oklch(0.82 0.2 195 / 80%)",
                                  }}
                                >
                                  HOLO_{i + 1} · DECRYPTED
                                </div>
                                <h4
                                  className={`font-display font-bold text-lg ${
                                    wasViewed ? "text-success" : "text-primary text-glow-cyan"
                                  }`}
                                >
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

          {/* Question */}
          <h2 className="text-lg sm:text-xl font-display font-bold mb-5 leading-relaxed text-center">
            {room.question}
          </h2>

          {/* Hint when not all viewed */}
          {!allViewed && !feedback && (
            <div className="mb-4 text-center text-xs sm:text-sm text-accent font-display tracking-wider animate-pulse">
              ↑ לחצו על כל 3 ההולוגרמות כדי לחשוף את האפשרויות
            </div>
          )}

          {/* Options */}
          <div className="space-y-3">
            {room.options.map((opt, i) => {
              const isSel = selected === i;
              const showAsCorrect = feedback && opt.correct && (feedback.correctPicked || isSel);
              const showAsWrong = feedback && isSel && !opt.correct;
              const disabled = !!feedback;
              return (
                <button
                  key={i}
                  onClick={() => pick(i)}
                  disabled={disabled}
                  aria-disabled={!allViewed || disabled}
                  className={`w-full text-right px-5 py-4 rounded-xl border transition-all duration-300
                    ${
                      showAsCorrect
                        ? "border-success bg-success/15 text-success shadow-[0_0_30px_oklch(0.78_0.2_155/40%)]"
                        : showAsWrong
                        ? "border-destructive bg-destructive/15 text-destructive"
                        : !allViewed
                        ? "border-border/50 bg-secondary/30 text-muted-foreground opacity-75"
                        : "border-border bg-secondary/60 hover:border-primary hover:bg-secondary/80 hover:translate-x-[-4px] cursor-pointer"
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
                  {feedback.keyEarned && (
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[oklch(0.78_0.18_70)]/60 bg-[oklch(0.78_0.18_70)]/15 text-[oklch(0.78_0.18_70)] font-display text-sm animate-pulse-glow">
                      🗝️ רצף של 2! קיבלתם מפתח בונוס לפתיחת חדר נעול
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="font-display font-bold text-destructive text-lg mb-2">
                    תשובה שגויה · {feedback.delta} נקודות
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed mb-3">
                    {feedback.wrongReason ?? "זו אינה התשובה הנכונה."}
                  </p>
                  <div className="text-xs font-display tracking-wider text-destructive/90">
                    🔒 החדר נעול ל־2 תורות. חוזרים למסדרון בעוד {closingIn} שניות…
                  </div>
                </>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 items-stretch">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-5 rounded-xl border border-border bg-secondary/70 font-display font-semibold transition-all hover:bg-[oklch(0.85_0.18_150)]/30 hover:border-[oklch(0.85_0.20_150)] hover:text-[oklch(0.95_0.15_150)] hover:shadow-[0_0_20px_oklch(0.75_0.22_150/0.6),inset_0_0_15px_oklch(0.75_0.22_150/0.25)]"
            >
              חזרה למסדרון →
            </button>
            {feedback?.correctPicked && (
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
