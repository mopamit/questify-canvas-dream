import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { rooms, type Room } from "@/lib/game-data";
import { useGame, gameActions } from "@/lib/game-store";
import { ScoreHud } from "@/components/ScoreHud";
import { BootScreen } from "@/components/BootScreen";
import { RoomDialog } from "@/components/RoomDialog";
import { sfx } from "@/lib/sound";
import corridorBg from "@/assets/corridor.jpg";
import creatureImg from "@/assets/creature.png";

export const Route = createFileRoute("/")({
  component: Index,
});

const accentDot: Record<string, string> = {
  cyan: "bg-primary",
  magenta: "bg-accent",
  green: "bg-[oklch(0.78_0.2_155)]",
  amber: "bg-[oklch(0.78_0.18_70)]",
  violet: "bg-[oklch(0.65_0.25_300)]",
  red: "bg-destructive",
  blue: "bg-primary",
};

function Index() {
  const { solved, score } = useGame();
  const solvedCount = Object.values(solved).filter(Boolean).length;
  const allDone = solvedCount === rooms.length;

  // Boot screen always opens at game start (refresh = new session)
  const [bootOpen, setBootOpen] = useState(true);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);

  // Re-render when turn counter changes (room locks countdown)
  // Victory sound when all rooms solved
  useEffect(() => {
    if (allDone) sfx.victory();
  }, [allDone]);

  function tryOpenRoom(room: Room) {
    if (gameActions.isLocked(room.id)) {
      sfx.wrong();
      return;
    }
    sfx.doorOpen();
    setActiveRoom(room);
  }

  return (
    <>
      <ScoreHud onOpenBriefing={() => setBootOpen(true)} totalSeconds={1800} />

      <BootScreen open={bootOpen} onClose={() => setBootOpen(false)} />

      <RoomDialog
        room={activeRoom}
        open={!!activeRoom}
        onClose={() => setActiveRoom(null)}
      />

      <section className="relative min-h-screen pt-20 pb-12 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src={corridorBg}
            alt="מסדרון מעבדה"
            className="w-full h-full object-cover"
            width={1920}
            height={1088}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/50 to-background" />
        </div>

        {/* Game complete celebration */}
        {allDone && (
          <div className="relative max-w-3xl mx-auto px-6 text-center pt-6 pb-10 animate-[fade-in_0.6s_ease-out]">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-success/50 bg-success/15 text-success text-xs font-display tracking-[0.3em] mb-5 backdrop-blur">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              סריקה מלאה הושלמה · היצור ניצל
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-black mb-4 leading-tight drop-shadow-[0_4px_30px_rgba(0,0,0,0.7)]">
              <span className="text-success text-glow-cyan">היצור הסודי </span>
              <span className="text-accent text-glow-magenta">ניצל!</span>
            </h1>
            <p className="text-foreground/90 text-base sm:text-lg max-w-xl mx-auto mb-6">
              פתחתם את כל 7 המעבדות, שחזרתם את כל צרכי הקיום, וסריקה ביו-מטרית
              מלאה אישרה: היצור יציב ובטוח.
            </p>
            <div className="relative inline-block mb-6">
              <img
                src={creatureImg}
                alt="היצור הסודי"
                className="mx-auto w-40 sm:w-48 animate-float drop-shadow-[0_0_60px_oklch(0.78_0.2_155/80%)]"
                width={1024}
                height={1024}
              />
              {/* Scan ring */}
              <div className="absolute inset-0 rounded-full border-2 border-success/60 animate-ping" />
            </div>
            <p className="text-foreground/85 mb-1">
              ניקוד סופי:{" "}
              <span className="font-display font-black text-3xl text-accent text-glow-magenta align-middle">
                {score}
              </span>
            </p>
            <button
              onClick={() => gameActions.reset()}
              className="mt-4 px-6 py-3 rounded-xl border border-border bg-secondary hover:bg-secondary/70 font-display"
            >
              שחקו שוב
            </button>
          </div>
        )}

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-5xl font-display font-black drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
              <span className="text-glow-cyan">בחרו </span>
              <span className="text-accent text-glow-magenta">חדר</span>
            </h2>
            <p className="text-xs sm:text-sm font-display tracking-[0.3em] text-primary mt-3 uppercase">
              מסדרון המעבדה · {solvedCount}/{rooms.length} פתורים
            </p>
            <div className="mt-3 h-px w-32 mx-auto bg-gradient-neon" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rooms.map((room) => {
              const isSolved = !!solved[room.id];
              const isLocked = gameActions.isLocked(room.id);
              const turnsLeft = gameActions.turnsUntilUnlock(room.id);
              return (
                <button
                  key={room.id}
                  onClick={() => tryOpenRoom(room)}
                  disabled={isLocked}
                  className={`group relative rounded-2xl overflow-hidden border bg-card/40 backdrop-blur-sm transition-all duration-500 text-right ${
                    isLocked
                      ? "border-destructive/40 cursor-not-allowed opacity-70"
                      : isSolved
                      ? "border-success/70 shadow-[0_0_30px_oklch(0.78_0.2_155/30%)] hover:scale-[1.02]"
                      : "border-border hover:scale-[1.03] hover:border-primary/60 hover:shadow-neon-cyan"
                  }`}
                >
                  {isSolved && (
                    <div className="pointer-events-none absolute inset-0 z-20 bg-[oklch(0.78_0.22_155/22%)] mix-blend-screen" />
                  )}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={room.image}
                      alt={room.title}
                      loading="lazy"
                      width={1280}
                      height={896}
                      className={`w-full h-full object-cover transition-transform duration-700 ${
                        isLocked ? "grayscale" : "group-hover:scale-110"
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />

                    <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-full bg-background/85 backdrop-blur text-xs font-display">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isSolved
                            ? "bg-success animate-pulse-glow"
                            : isLocked
                            ? "bg-destructive animate-pulse"
                            : accentDot[room.accent]
                        }`}
                      />
                      <span
                        className={
                          isSolved
                            ? "text-success"
                            : isLocked
                            ? "text-destructive"
                            : "text-foreground/85"
                        }
                      >
                        {isSolved ? "פתור" : isLocked ? `נעול · ${turnsLeft}` : "פתוח"}
                      </span>
                    </div>
                    <div dir="ltr" className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-background/85 backdrop-blur font-display font-black text-base text-foreground drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                      <span className="text-glow-cyan">{room.number}</span>
                      <span className="text-foreground/60"> / 7</span>
                    </div>

                    {/* Lock overlay */}
                    {isLocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-[2px]">
                        <div className="text-center">
                          <div className="text-5xl mb-2">🔒</div>
                          <div className="text-xs font-display tracking-wider text-destructive">
                            נעול ל־{turnsLeft} {turnsLeft === 1 ? "תור" : "תורות"}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="relative p-5">
                    <h3 className="font-display font-bold text-xl leading-tight mb-1">
                      {room.title}
                    </h3>
                    <p className="text-xs text-muted-foreground tracking-widest uppercase">
                      {room.subtitle}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {isSolved
                          ? "צפו שוב בחדר"
                          : isLocked
                          ? "החדר ייפתח בקרוב"
                          : "לחצו לפתיחת הדלת"}
                      </span>
                      {!isLocked && (
                        <span className="font-display text-primary group-hover:translate-x-[-4px] transition-transform">
                          ←
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
