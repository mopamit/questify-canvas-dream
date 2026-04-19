import { Link } from "@tanstack/react-router";
import { useGame } from "@/lib/game-store";
import { rooms } from "@/lib/game-data";

export function ScoreHud() {
  const { score, solved } = useGame();
  const solvedCount = Object.values(solved).filter(Boolean).length;

  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 font-display font-black tracking-widest text-sm sm:text-base text-glow-cyan"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
          LAB X23
        </Link>
        <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">חדרים</span>
            <span className="font-display font-bold text-primary text-glow-cyan">
              {solvedCount}/{rooms.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">ניקוד</span>
            <span className="font-display font-bold text-accent text-glow-magenta text-base sm:text-lg">
              {score}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
