/**
 * Animated futuristic background using only Amit palette tokens.
 * Layers (back→front): radial nebula, drifting orbs, neon grid,
 * diagonal scan beam, faint horizontal scanlines.
 * Pointer-events disabled — purely decorative.
 */
export function FuturisticBg() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base deep navy gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 10%, oklch(0.55 0.11 235 / 45%), transparent 55%), radial-gradient(ellipse at 85% 90%, oklch(0.52 0.10 120 / 30%), transparent 60%), linear-gradient(180deg, oklch(0.18 0.05 245), oklch(0.10 0.04 248))",
        }}
      />

      {/* Neon grid */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.72 0.13 230 / 12%) 1px, transparent 1px), linear-gradient(90deg, oklch(0.72 0.13 230 / 12%) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 85%)",
        }}
      />

      {/* Perspective horizon grid (bottom) */}
      <div
        className="absolute inset-x-0 bottom-0 h-[55%] opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.82 0.18 115 / 22%) 1px, transparent 1px), linear-gradient(90deg, oklch(0.72 0.13 230 / 22%) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          transform: "perspective(600px) rotateX(60deg)",
          transformOrigin: "bottom",
          maskImage:
            "linear-gradient(to top, black 10%, transparent 90%)",
          WebkitMaskImage:
            "linear-gradient(to top, black 10%, transparent 90%)",
        }}
      />

      {/* Floating glow orbs */}
      <div
        className="absolute top-[10%] right-[8%] w-[28rem] h-[28rem] rounded-full blur-3xl opacity-50 animate-float"
        style={{
          background:
            "radial-gradient(circle, oklch(0.72 0.13 230 / 70%), transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-[12%] left-[6%] w-[32rem] h-[32rem] rounded-full blur-3xl opacity-40 animate-float"
        style={{
          background:
            "radial-gradient(circle, oklch(0.82 0.18 115 / 55%), transparent 70%)",
          animationDelay: "1.4s",
        }}
      />
      <div
        className="absolute top-[45%] left-[40%] w-[20rem] h-[20rem] rounded-full blur-3xl opacity-30 animate-float"
        style={{
          background:
            "radial-gradient(circle, oklch(0.74 0.12 150 / 60%), transparent 70%)",
          animationDelay: "2.6s",
        }}
      />

      {/* Diagonal scan beam */}
      <div
        className="absolute -inset-x-1/2 h-40 opacity-30 animate-scan-beam"
        style={{
          background:
            "linear-gradient(180deg, transparent, oklch(0.82 0.18 115 / 55%), transparent)",
          filter: "blur(10px)",
        }}
      />

      {/* CRT scanlines */}
      <div
        className="absolute inset-0 opacity-25 mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0, transparent 2px, oklch(0 0 0 / 30%) 2px, oklch(0 0 0 / 30%) 3px)",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, oklch(0.08 0.04 248 / 75%) 100%)",
        }}
      />
    </div>
  );
}
