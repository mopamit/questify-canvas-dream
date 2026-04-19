import { useEffect, useState } from "react";
import { gameActions } from "@/lib/game-store";
import { sfx } from "@/lib/sound";

type Props = {
  open: boolean;
  onComplete: (name: string) => void;
};

export function NameScanner({ open, onComplete }: Props) {
  const [name, setName] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    if (!open) {
      setName("");
      setScanning(false);
      setScanProgress(0);
    }
  }, [open]);

  useEffect(() => {
    if (!scanning) return;
    let p = 0;
    const id = window.setInterval(() => {
      p += 4 + Math.random() * 6;
      if (p >= 100) {
        p = 100;
        window.clearInterval(id);
        sfx.correct();
        window.setTimeout(() => {
          gameActions.setPlayerName(name.trim());
          onComplete(name.trim());
        }, 500);
      } else {
        if (Math.random() > 0.7) sfx.tick();
      }
      setScanProgress(p);
    }, 120);
    return () => window.clearInterval(id);
  }, [scanning, name, onComplete]);

  if (!open) return null;

  const trimmed = name.trim();
  const canScan = trimmed.length >= 2 && trimmed.length <= 20;

  function startScan() {
    if (!canScan || scanning) return;
    sfx.doorOpen();
    setScanning(true);
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-md animate-[fade-in_0.3s_ease-out]">
      <div className="relative w-full max-w-2xl">
        {/* Outer bezel */}
        <div className="rounded-[2rem] bg-gradient-to-b from-zinc-700 to-zinc-900 p-3 sm:p-4 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]">
          <div className="rounded-[1.5rem] bg-zinc-950 p-2 sm:p-3">
            {/* Screen */}
            <div className="relative rounded-2xl overflow-hidden bg-[oklch(0.13_0.06_180)] border border-primary/40 scanline">
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,oklch(0_0_0/60%)_100%)]" />

              {/* Top bar */}
              <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-primary/30">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-destructive/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[oklch(0.78_0.18_70)]/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-success/80" />
                </div>
                <div className="font-display text-[10px] sm:text-xs tracking-[0.3em] text-primary/80">
                  BIO-ID SCANNER · X23
                </div>
                <div className="font-display text-[10px] text-primary/60 tracking-[0.2em]">
                  AUTH GATE
                </div>
              </div>

              <div className="p-6 sm:p-10 text-right" dir="rtl">
                <div className="text-xs font-display tracking-[0.3em] text-accent text-glow-magenta mb-3">
                  // הרשאת כניסה
                </div>
                <h2 className="font-display font-black text-xl sm:text-3xl text-primary text-glow-cyan leading-snug mb-2">
                  תודה שהתנדבתם למשימה!
                </h2>
                <p className="text-foreground/90 text-sm sm:text-base mb-6">
                  הקלידו את שמכם כדי להיכנס למעבדה.
                </p>

                {/* Digital display */}
                <div className="relative rounded-xl border-2 border-primary/40 bg-black/60 p-4 sm:p-5 mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[10px] font-mono tracking-widest text-primary/70">
                      NAME_INPUT
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-wider">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          scanning
                            ? "bg-[oklch(0.78_0.18_70)] animate-pulse"
                            : canScan
                            ? "bg-success animate-pulse-glow"
                            : "bg-destructive/70"
                        }`}
                      />
                      <span
                        className={
                          scanning
                            ? "text-[oklch(0.78_0.18_70)]"
                            : canScan
                            ? "text-success"
                            : "text-destructive/80"
                        }
                      >
                        {scanning ? "SCANNING…" : canScan ? "READY" : "AWAITING"}
                      </span>
                    </div>
                  </div>

                  <div
                    dir="ltr"
                    className="min-h-[64px] sm:min-h-[80px] flex items-center justify-center text-center"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    <div
                      className="text-3xl sm:text-5xl font-black tracking-[0.15em] text-primary text-glow-cyan break-all px-2"
                      style={{
                        textShadow:
                          "0 0 18px oklch(0.82 0.2 195 / 70%), 0 0 36px oklch(0.82 0.2 195 / 35%)",
                      }}
                    >
                      {trimmed || <span className="opacity-40">— — — —</span>}
                      {!scanning && (
                        <span className="inline-block w-[0.4em] animate-pulse">_</span>
                      )}
                    </div>
                  </div>

                  {/* Scan beam */}
                  {scanning && (
                    <div className="absolute inset-x-0 bottom-0 top-12 overflow-hidden pointer-events-none">
                      <div
                        className="absolute left-0 right-0 h-1.5 bg-gradient-to-b from-transparent via-success/80 to-transparent shadow-[0_0_20px_oklch(0.78_0.2_155/80%)]"
                        style={{ top: `${scanProgress}%`, transition: "top 120ms linear" }}
                      />
                    </div>
                  )}

                  {scanning && (
                    <div className="mt-3">
                      <div className="h-1.5 rounded-full bg-primary/15 overflow-hidden">
                        <div
                          className="h-full bg-gradient-neon"
                          style={{ width: `${scanProgress}%`, transition: "width 120ms linear" }}
                        />
                      </div>
                      <div className="mt-1.5 text-[10px] font-mono tracking-widest text-success text-center">
                        BIO-MATCH · {Math.round(scanProgress)}%
                      </div>
                    </div>
                  )}
                </div>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 20))}
                  onKeyDown={(e) => e.key === "Enter" && startScan()}
                  disabled={scanning}
                  placeholder="הקלידו את שמכם…"
                  maxLength={20}
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl bg-background/80 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground font-display text-lg placeholder:text-muted-foreground/60 disabled:opacity-50"
                />

                <button
                  onClick={startScan}
                  disabled={!canScan || scanning}
                  className="mt-5 w-full px-8 py-3 rounded-xl bg-gradient-neon font-display font-bold text-background tracking-widest hover:scale-[1.02] active:scale-95 transition-transform shadow-neon-cyan disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {scanning ? "סורק…" : "סרוק שם והיכנס ←"}
                </button>
              </div>
            </div>
          </div>
          <div className="mx-auto mt-2 h-3 w-32 rounded-b-2xl bg-gradient-to-b from-zinc-800 to-zinc-950" />
        </div>
      </div>
    </div>
  );
}
