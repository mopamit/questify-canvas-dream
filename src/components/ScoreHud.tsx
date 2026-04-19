import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { gameActions, useGame } from "@/lib/game-store";
import { rooms } from "@/lib/game-data";
import { sfx } from "@/lib/sound";

type Props = {
  onOpenBriefing?: () => void;
  onReset?: () => void;
  /** Total mission seconds (default 10 min) */
  totalSeconds?: number;
};

export function ScoreHud({ onOpenBriefing, onReset, totalSeconds = 600 }: Props) {
  const { score, solved, keys, streak } = useGame();
  const solvedCount = Object.values(solved).filter(Boolean).length;
  const allDone = solvedCount === rooms.length;

  const [remaining, setRemaining] = useState(totalSeconds);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (allDone) return;
    const id = setInterval(() => {
      setRemaining((r) => (r > 0 ? r - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [allDone]);

  useEffect(() => {
    if (!allDone && remaining > 0 && remaining <= 10) sfx.tick();
  }, [remaining, allDone]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const danger = remaining <= 60;

  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <Link
          to="/"
          className="flex items-center gap-2 font-display font-black tracking-widest text-sm sm:text-base text-glow-cyan shrink-0"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
          LAB X23
        </Link>

        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
          {/* Mission timer */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-mono font-bold tracking-wider ${
              danger
                ? "border-destructive/60 bg-destructive/15 text-destructive animate-pulse"
                : "border-primary/40 bg-primary/10 text-primary"
            }`}
            title="זמן שנותר למשימה"
          >
            <span>⏱</span>
            <span>{mm}:{ss}</span>
          </div>

          <button
            onClick={() => {
              const next = !muted;
              setMuted(next);
              sfx.setMuted(next);
              if (!next) sfx.click();
            }}
            className="px-2 py-1.5 rounded-full border border-border bg-secondary/60 hover:bg-secondary text-foreground/80 transition-colors"
            title={muted ? "הפעל סאונד" : "השתק"}
          >
            {muted ? "🔇" : "🔊"}
          </button>

          {onOpenBriefing && (
            <button
              onClick={() => {
                sfx.click();
                onOpenBriefing();
              }}
              className="px-3 py-1.5 rounded-full border border-primary/40 bg-primary/10 hover:bg-primary/20 text-primary font-display tracking-wider transition-colors"
              title="פתחו שוב את הודעת הפתיחה"
            >
              ⓘ פתיחה
            </button>
          )}

          {/* Bonus keys */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-display tracking-wider ${
              keys > 0
                ? "border-[oklch(0.78_0.18_70)]/60 bg-[oklch(0.78_0.18_70)]/15 text-[oklch(0.78_0.18_70)] animate-pulse-glow"
                : "border-border bg-secondary/40 text-muted-foreground"
            }`}
            title={`מפתחות בונוס · רצף נוכחי: ${streak}/2`}
          >
            <span>🗝️</span>
            <span className="font-bold">{keys}</span>
          </div>

          {onReset && (
            <button
              onClick={() => {
                sfx.click();
                onReset();
              }}
              className="px-2.5 py-1.5 rounded-full border border-destructive/40 bg-destructive/10 hover:bg-destructive/20 text-destructive font-display tracking-wider transition-colors text-xs"
              title="אפסו את המשחק"
            >
              ⟲ איפוס
            </button>
          )}
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground hidden sm:inline">חדרים</span>
            <span className="font-display font-bold text-primary text-glow-cyan">
              {solvedCount}/{rooms.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground hidden sm:inline">ניקוד</span>
            <span className="font-display font-bold text-accent text-glow-magenta text-base sm:text-lg">
              {score}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
