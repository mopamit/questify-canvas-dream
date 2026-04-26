import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { rooms, type Room } from "@/lib/game-data";
import { useGame, gameActions } from "@/lib/game-store";
import { ScoreHud } from "@/components/ScoreHud";
import { BootScreen } from "@/components/BootScreen";
import { RoomDialog } from "@/components/RoomDialog";
import { NameScanner } from "@/components/NameScanner";
import { KeyAward } from "@/components/KeyAward";
import { FuturisticBg } from "@/components/FuturisticBg";
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
  const { solved, score, playerName, keys, gameFinishedAt, timeBonus } = useGame();
  const solvedCount = Object.values(solved).filter(Boolean).length;
  const allDone = solvedCount === rooms.length;

  // Three-stage intro: boot (opening) → scanner → game.
  // If the player already has a name (returning user), skip both.
  const [bootOpen, setBootOpen] = useState(true);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [showKeyAward, setShowKeyAward] = useState(false);

  // If returning user already has a name, skip the intro entirely.
  useEffect(() => {
    if (playerName && bootOpen && !scannerOpen) {
      setBootOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerName]);

  // Watch keys count — trigger animation when it goes up.
  const [prevKeys, setPrevKeys] = useState(keys);
  useEffect(() => {
    if (keys > prevKeys) {
      setShowKeyAward(true);
      sfx.keyAward();
    }
    setPrevKeys(keys);
  }, [keys, prevKeys]);

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

  function handleKeyDrop(e: React.DragEvent, room: Room) {
    e.preventDefault();
    document.body.classList.remove("dragging-key");
    if (e.dataTransfer.getData("text/plain") !== "bonus-key") return;
    if (!gameActions.isLocked(room.id)) return;
    if (gameActions.useKey(room.id)) {
      sfx.doorOpen();
      setActiveRoom(room);
    }
  }

  function handleReset() {
    if (!window.confirm("לאפס את המשחק לגמרי? כל ההתקדמות תימחק.")) return;
    gameActions.reset();
    setActiveRoom(null);
    setScannerOpen(false);
    setBootOpen(true);
  }

  return (
    <>
      <FuturisticBg />
      <ScoreHud
        onOpenBriefing={() => setBootOpen(true)}
        onReset={handleReset}
        totalSeconds={1800}
      />

      <BootScreen
        open={bootOpen}
        onClose={() => {
          setBootOpen(false);
          // Only ask for the name if we don't have one yet
          if (!playerName) setScannerOpen(true);
        }}
      />

      <NameScanner
        open={scannerOpen}
        onComplete={() => {
          setScannerOpen(false);
        }}
      />

      <KeyAward show={showKeyAward} onDone={() => setShowKeyAward(false)} />

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

            {/* Digital name display */}
            {playerName && (
              <div className="mx-auto max-w-md mb-6 rounded-xl border-2 border-success/50 bg-black/70 px-4 py-3 shadow-[0_0_30px_oklch(0.78_0.2_155/40%)]">
                <div className="text-[10px] font-mono tracking-[0.3em] text-success/70 mb-1 text-center">
                  AGENT · CONFIRMED
                </div>
                <div
                  dir="ltr"
                  className="text-center text-2xl sm:text-4xl font-display font-black tracking-[0.15em] text-success"
                  style={{
                    textShadow:
                      "0 0 18px oklch(0.78 0.2 155 / 80%), 0 0 36px oklch(0.78 0.2 155 / 40%)",
                  }}
                >
                  {playerName}
                </div>
              </div>
            )}

            <div className="relative inline-block mb-6">
              <img
                src={creatureImg}
                alt="היצור הסודי"
                className="mx-auto w-40 sm:w-48 animate-float drop-shadow-[0_0_60px_oklch(0.78_0.2_155/80%)]"
                width={1024}
                height={1024}
              />
              <div className="absolute inset-0 rounded-full border-2 border-success/60 animate-ping" />
            </div>

            <h2 className="text-xl sm:text-2xl font-display font-bold text-success mb-2">
              כל הכבוד{playerName ? `, ${playerName}` : ""}! 🎉
            </h2>
            <p className="text-foreground/90 max-w-lg mx-auto mb-4">
              עזרתם לפתור את התעלומה והצלתם את היצור שהיה לכוד במעבדה.
              בזכותכם הוא חזר לחיות בבטחה.
            </p>

            {/* Elapsed time + score breakdown */}
            {(() => {
              const elapsed = gameActions.elapsedSeconds();
              const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
              const ss = String(elapsed % 60).padStart(2, "0");
              const baseScore = score - (gameFinishedAt ? timeBonus : 0);
              return (
                <div className="mx-auto max-w-md mb-4 rounded-xl border border-primary/40 bg-black/50 px-5 py-4 text-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-foreground/80">זמן השלמה</span>
                    <span dir="ltr" className="font-mono font-bold text-primary text-glow-cyan text-lg">
                      {mm}:{ss}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-foreground/70 mb-1">
                    <span>נקודות מפתרון חידות</span>
                    <span className="font-display font-bold">{baseScore - timeBonus + timeBonus /* readable */}{""}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-foreground/70 mb-1">
                    <span>בונוס מהירות</span>
                    <span className={`font-display font-bold ${timeBonus > 0 ? "text-success" : "text-muted-foreground"}`}>
                      +{timeBonus}
                    </span>
                  </div>
                  <div className="h-px bg-border my-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-foreground/85">ניקוד סופי</span>
                    <span className="font-display font-black text-3xl text-accent text-glow-magenta">
                      {score}
                    </span>
                  </div>
                </div>
              );
            })()}
            <button
              onClick={handleReset}
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
              <span className="text-glow-cyan">חדר</span>
            </h2>
            <p className="text-xs sm:text-sm font-display tracking-[0.3em] text-white mt-3 uppercase">
              מסדרון המעבדה · {solvedCount}/{rooms.length} פתורים
            </p>
            <div className="mt-3 h-px w-32 mx-auto bg-gradient-neon" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rooms.map((room) => {
              const isSolved = !!solved[room.id];
              const isLocked = gameActions.isLocked(room.id);
              const secondsLeft = gameActions.secondsUntilUnlock(room.id);
              const lockMm = String(Math.floor(secondsLeft / 60)).padStart(1, "0");
              const lockSs = String(secondsLeft % 60).padStart(2, "0");
              const lockLabel = `${lockMm}:${lockSs}`;
              return (
                <button
                  key={room.id}
                  onClick={() => tryOpenRoom(room)}
                  disabled={isLocked && keys === 0}
                  onDragOver={(e) => {
                    if (isLocked && keys > 0) {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = "move";
                    }
                  }}
                  onDrop={(e) => handleKeyDrop(e, room)}
                  className={`group relative rounded-2xl overflow-hidden border bg-card/40 backdrop-blur-sm transition-all duration-500 text-right ${
                    isLocked
                      ? keys > 0
                        ? "border-[oklch(0.78_0.18_70)]/60 cursor-pointer drop-target-key"
                        : "border-destructive/40 cursor-not-allowed opacity-70"
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
                        {isSolved ? "פתור" : isLocked ? `נעול · ${lockLabel}` : "פתוח"}
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
                          <div className="text-5xl mb-2 lock-icon">🔒</div>
                          <div className="text-xs font-display tracking-wider text-destructive">
                            נפתח בעוד {lockLabel}
                          </div>
                          {keys > 0 && (
                            <div className="mt-2 text-[10px] font-display tracking-[0.2em] text-[oklch(0.78_0.18_70)] animate-pulse">
                              גררו לכאן 🗝️ כדי לפתוח
                            </div>
                          )}
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
