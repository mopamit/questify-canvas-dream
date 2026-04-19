import { createFileRoute, Link } from "@tanstack/react-router";
import { rooms } from "@/lib/game-data";
import { useGame, gameActions } from "@/lib/game-store";
import { ScoreHud } from "@/components/ScoreHud";
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

  return (
    <>
      <ScoreHud />

      {/* Hero corridor */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden pt-24 pb-12">
        <div className="absolute inset-0 -z-10">
          <img
            src={corridorBg}
            alt="מסדרון מעבדה"
            className="w-full h-full object-cover opacity-70"
            width={1920}
            height={1088}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
          <div className="absolute inset-0 bg-grid opacity-40" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-destructive/40 bg-destructive/10 text-destructive text-xs font-display tracking-[0.3em] mb-6 animate-flicker">
            <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            אזעקת חירום · מעבדה X23
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black mb-4 text-glow-cyan leading-tight">
            הצילו את <span className="text-accent text-glow-magenta">היצור הסודי</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed mb-2">
            קפסולת ניסוי קרסה. יצור נדיר נמצא לכוד בתא אטום — ללא מים, מזון, חמצן,
            טמפרטורה מתאימה, אור, מצע או הגנה.
          </p>
          <p className="text-sm text-primary text-glow-cyan mb-10 tracking-wider">
            🎯 פתחי 7 חדרים, פתרי את החידות, שחזרי את צרכי הקיום
          </p>

          <img
            src={creatureImg}
            alt="היצור הסודי"
            className="mx-auto w-44 sm:w-56 animate-float drop-shadow-[0_0_40px_oklch(0.7_0.27_330/60%)]"
            width={1024}
            height={1024}
          />

          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mt-8 text-xs">
            <div className="p-3 rounded-lg border border-border bg-card/50 backdrop-blur">
              <div className="text-success font-display font-bold">+100</div>
              <div className="text-muted-foreground">מהיר ונכון</div>
            </div>
            <div className="p-3 rounded-lg border border-border bg-card/50 backdrop-blur">
              <div className="text-primary font-display font-bold">+20</div>
              <div className="text-muted-foreground">איטי ונכון</div>
            </div>
            <div className="p-3 rounded-lg border border-border bg-card/50 backdrop-blur">
              <div className="text-destructive font-display font-bold">−15</div>
              <div className="text-muted-foreground">טעות</div>
            </div>
          </div>
        </div>
      </section>

      {/* Rooms grid — corridor doors */}
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
            {rooms.map((room, i) => {
              const isSolved = !!solved[room.id];
              return (
                <Link
                  key={room.id}
                  to="/room/$roomId"
                  params={{ roomId: room.id }}
                  className="group relative rounded-2xl overflow-hidden border border-border bg-card/40 backdrop-blur-sm transition-all duration-500 hover:scale-[1.03] hover:border-primary/60 hover:shadow-neon-cyan"
                  style={{ animationDelay: `${i * 80}ms` }}
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
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                    {/* Status indicator */}
                    <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur text-xs font-display">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isSolved ? "bg-success animate-pulse-glow" : accentDot[room.accent]
                        }`}
                      />
                      <span className={isSolved ? "text-success" : "text-muted-foreground"}>
                        {isSolved ? "פתור" : "נעול"}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 font-display font-black text-2xl text-foreground/90">
                      0{room.number}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="relative p-5">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-2xl">{room.icon}</span>
                      <div>
                        <h3 className="font-display font-bold text-lg leading-tight">
                          {room.title}
                        </h3>
                        <p className="text-xs text-muted-foreground tracking-widest uppercase">
                          {room.subtitle}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">לחצי לפתיחה</span>
                      <span className="font-display text-primary group-hover:translate-x-[-4px] transition-transform">
                        ←
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* End state */}
          {allDone && (
            <div className="mt-16 max-w-2xl mx-auto text-center p-8 rounded-2xl border border-success/40 bg-success/5 shadow-neon-cyan">
              <div className="text-5xl mb-3">🎉</div>
              <h3 className="text-2xl font-display font-black text-success mb-2">
                היצור הסודי ניצל!
              </h3>
              <p className="text-muted-foreground mb-2">
                ניקוד סופי:{" "}
                <span className="font-display font-black text-2xl text-accent text-glow-magenta">
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
