import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { rooms } from "@/lib/game-data";
import { useGame, gameActions } from "@/lib/game-store";
import { ScoreHud } from "@/components/ScoreHud";
import { Typewriter } from "@/components/Typewriter";
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
  const { score, solved } = useGame();
  const solvedCount = Object.values(solved).filter(Boolean).length;
  const allDone = solvedCount === rooms.length;

  // Sequential typewriter intro
  const [step, setStep] = useState(0);

  return (
    <>
      <ScoreHud />

      {/* Hero corridor */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-24 pb-12">
        <div className="absolute inset-0 -z-10">
          <img
            src={corridorBg}
            alt="מסדרון מעבדה"
            className="w-full h-full object-cover"
            width={1920}
            height={1088}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/35 via-background/45 to-background" />
        </div>

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-destructive/50 bg-destructive/15 text-destructive text-xs font-display tracking-[0.3em] mb-6 animate-flicker backdrop-blur">
            <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            אזעקת חירום · מעבדה X23
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black mb-6 leading-tight drop-shadow-[0_4px_30px_rgba(0,0,0,0.7)]">
            <span className="text-glow-cyan">הצילו את </span>
            <span className="text-accent text-glow-magenta">היצור הסודי</span>
          </h1>

          {/* Typewriter intro */}
          <div className="max-w-2xl mx-auto min-h-[10rem] sm:min-h-[8rem] text-base sm:text-lg leading-relaxed mb-8 px-4 py-5 rounded-2xl bg-background/60 backdrop-blur-md border border-border text-right">
            {step >= 0 && (
              <p className="text-foreground/95">
                <Typewriter
                  text="קפסולת ניסוי קרסה. יצור נדיר נמצא לכוד בתא אטום — ללא מים, מזון, חמצן, טמפרטורה מתאימה, אור, מצע או הגנה."
                  speed={22}
                  onDone={() => setStep((s) => Math.max(s, 1))}
                />
              </p>
            )}
            {step >= 1 && (
              <p className="mt-3 text-primary text-glow-cyan font-semibold">
                <Typewriter
                  text="פתחי 7 חדרים, פתרי את החידות, שחזרי את צרכי הקיום."
                  speed={26}
                  startDelay={300}
                />
              </p>
            )}
          </div>

          <img
            src={creatureImg}
            alt="היצור הסודי"
            className="mx-auto w-44 sm:w-52 animate-float drop-shadow-[0_0_50px_oklch(0.7_0.27_330/70%)]"
            width={1024}
            height={1024}
          />

          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mt-8 text-xs">
            <div className="p-3 rounded-lg border border-border bg-card/70 backdrop-blur">
              <div className="text-success font-display font-bold text-lg">+100</div>
              <div className="text-muted-foreground">מהיר ונכון</div>
            </div>
            <div className="p-3 rounded-lg border border-border bg-card/70 backdrop-blur">
              <div className="text-primary font-display font-bold text-lg">+20</div>
              <div className="text-muted-foreground">איטי ונכון</div>
            </div>
            <div className="p-3 rounded-lg border border-border bg-card/70 backdrop-blur">
              <div className="text-destructive font-display font-bold text-lg">−15</div>
              <div className="text-muted-foreground">טעות</div>
            </div>
          </div>

          <a
            href="#rooms"
            className="inline-block mt-10 px-8 py-3 rounded-full bg-gradient-neon font-display font-bold text-background tracking-wider hover:scale-105 transition-transform shadow-neon-cyan"
          >
            התחילי במשימה ↓
          </a>
        </div>
      </section>

      {/* Rooms grid */}
      <section id="rooms" className="relative py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-display tracking-[0.3em] text-primary mb-2">
              מסדרון המעבדה
            </p>
            <h2 className="text-3xl sm:text-4xl font-display font-black">בחרי חדר</h2>
            <div className="mt-4 h-px w-32 mx-auto bg-gradient-neon" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rooms.map((room) => {
              const isSolved = !!solved[room.id];
              return (
                <Link
                  key={room.id}
                  to="/room/$roomId"
                  params={{ roomId: room.id }}
                  className="group relative rounded-2xl overflow-hidden border border-border bg-card/40 backdrop-blur-sm transition-all duration-500 hover:scale-[1.03] hover:border-primary/60 hover:shadow-neon-cyan"
                >
                  {/* Door image */}
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
                    {/* Status indicator */}
                    <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-full bg-background/85 backdrop-blur text-xs font-display">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isSolved ? "bg-success animate-pulse-glow" : accentDot[room.accent]
                        }`}
                      />
                      <span className={isSolved ? "text-success" : "text-foreground/85"}>
                        {isSolved ? "פתור" : "נעול"}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 font-display font-black text-3xl text-foreground drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                      0{room.number}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="relative p-5">
                    <h3 className="font-display font-bold text-xl leading-tight mb-1">
                      {room.title}
                    </h3>
                    <p className="text-xs text-muted-foreground tracking-widest uppercase">
                      {room.subtitle}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">לחצי לפתיחת החדר</span>
                      <span className="font-display text-primary group-hover:translate-x-[-4px] transition-transform">
                        ←
                      </span>
                    </div>
                  </div>
                </Link>
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
                שחקי שוב
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
