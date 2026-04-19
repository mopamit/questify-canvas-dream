// Lightweight WebAudio synthesizer for UI sound effects.
// No external assets — generates tones on demand.

let ctx: AudioContext | null = null;
let muted = false;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new Ctor();
    } catch {
      return null;
    }
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

type ToneOpts = {
  freq: number;
  duration?: number;
  type?: OscillatorType;
  gain?: number;
  sweepTo?: number;
  delay?: number;
};

function tone({ freq, duration = 0.18, type = "sine", gain = 0.18, sweepTo, delay = 0 }: ToneOpts) {
  const c = getCtx();
  if (!c || muted) return;
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (sweepTo !== undefined) osc.frequency.exponentialRampToValueAtTime(sweepTo, t0 + duration);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(g).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

export const sfx = {
  setMuted(v: boolean) {
    muted = v;
  },
  isMuted() {
    return muted;
  },
  click() {
    tone({ freq: 720, duration: 0.06, type: "square", gain: 0.08 });
  },
  hover() {
    tone({ freq: 480, duration: 0.04, type: "sine", gain: 0.04 });
  },
  // Dramatic hologram activation: rising sweep + shimmer
  hologram() {
    tone({ freq: 220, sweepTo: 880, duration: 0.45, type: "sawtooth", gain: 0.08 });
    tone({ freq: 1320, duration: 0.18, type: "sine", gain: 0.06, delay: 0.1 });
    tone({ freq: 1760, duration: 0.25, type: "sine", gain: 0.05, delay: 0.2 });
  },
  correct() {
    tone({ freq: 523, duration: 0.12, type: "triangle", gain: 0.12 });
    tone({ freq: 659, duration: 0.12, type: "triangle", gain: 0.12, delay: 0.1 });
    tone({ freq: 880, duration: 0.25, type: "triangle", gain: 0.14, delay: 0.2 });
  },
  wrong() {
    tone({ freq: 320, sweepTo: 110, duration: 0.4, type: "sawtooth", gain: 0.14 });
    tone({ freq: 160, duration: 0.3, type: "square", gain: 0.08, delay: 0.1 });
  },
  doorOpen() {
    tone({ freq: 180, sweepTo: 520, duration: 0.35, type: "sawtooth", gain: 0.1 });
  },
  tick() {
    tone({ freq: 1200, duration: 0.03, type: "square", gain: 0.04 });
  },
  victory() {
    [523, 659, 784, 1047].forEach((f, i) =>
      tone({ freq: f, duration: 0.22, type: "triangle", gain: 0.14, delay: i * 0.12 }),
    );
  },
};
