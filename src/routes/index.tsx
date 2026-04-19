import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { rooms, type Room } from "@/lib/game-data";
import { useGame, gameActions } from "@/lib/game-store";
import { ScoreHud } from "@/components/ScoreHud";
import { BootScreen } from "@/components/BootScreen";
import { RoomDialog } from "@/components/RoomDialog";
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

const SEEN_KEY = "lab-x23-seen-briefing";

function Index() {
  const { score, solved } = useGame();
  const solvedCount = Object.values(solved).filter(Boolean).length;
  const allDone = solvedCount === rooms.length;

  const [bootOpen, setBootOpen] = useState(false);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = localStorage.getItem(SEEN_KEY);
    if (!seen) {
      setBootOpen(true);
      localStorage.setItem(SEEN_KEY, "1");
    }
  }, []);

  return (
    <>
      <ScoreHud onOpenBriefing={() => setBootOpen(true)} />

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
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/40 to-background" />
        </div>

        <div className="relative max-w-3xl mx-auto px-6 text-center pt-6 pb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-destructive/50 bg-destructive/15 text-destructive text-xs font-display tracking-[0.3em] mb-5 animate-flicker backdrop-blur">
            <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            אזעקת חירום · מעבדה X23
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-black mb-4 leading-tight drop-shadow-[0_4px_30px_rgba(0,0,0,0.7)]">
            <span className="text-glow-cyan">הצילו את </span>
            <span className="text-accent text-glow-magenta">היצור הסודי</span>
          </h1>

          <p className="text-foreground/90 text-base sm:text-lg max-w-xl mx-auto mb-6">
            פתחו דלת אחר דלת ופתרו את החידות כדי לשחזר את צרכי הקיום של היצור.
          </p>

          <img
            src={creatureImg}
            alt="היצור הסודי"
            className="mx-auto w-32 sm:w-40 animate-float drop-shadow-[0_0_50px_oklch(0.7_0.27_330/70%)]"
            width={1024}
            height={1024}
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-8">
            <p className="text-xs font-display tracking-[0.3em] text-primary mb-1">
              מסדרון המעבדה
            </p>
            <h2 className="text-2xl sm:text-3xl font-display font-black">בחרו דלת</h2>
            <div className="mt-3 h-px w-32 mx-auto bg-gradient-neon" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rooms.map((room) => {
              const isSolved = !!solved[room.id];
              return (
                <button
                  key={room.id}
                  onClick={() => setActiveRoom(room)}
                  className="group relative rounded-2xl overflow-hidden border border-border bg-card/40 backdrop-blur-sm transition-all duration-500 hover:scale-[1.03] hover:border-primary/60 hover:shadow-neon-cyan text-right"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={room.image}
                      alt={room.title}
                      loading="lazy"
                      width={1280}
                      height={896}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />

                    <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-full bg-background/85 backdrop-blur text-xs font-display">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isSolved ? "bg-success animate-pulse-glow" : accentDot[room.accent]
                        }`}
                      />
                      <span className={isSolved ? "text-success" : "text-foreground/85"}>
                        {isSolved ? "פתור" : "פתוח"}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 font-display font-black text-3xl text-foreground drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                      0{room.number}
                    </div>
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
                        {isSolved ? "צפו שוב בחדר" : "לחצו לפתיחת הדלת"}
                      </span>
                      <span className="font-display text-primary group-hover:translate-x-[-4px] transition-transform">
                        ←
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {allDone && (
            <div className="mt-16 max-w-2xl mx-auto text-center p-8 rounded-2xl border border-success/40 bg-success/5 shadow-neon-cyan">
              <h3 className="text-3xl font-display font-black text-success mb-3">
                היצור הסודי ניצל
              </h3>
              <p className="text-muted-foreground mb-2">
                ניקוד סופי:{" "}
                <span className="font-display font-black text-3xl text-accent text-glow-magenta">
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
        </div>
      </section>
    </>
  );
}
