import { useEffect, useState } from "react";

type Props = {
  text: string;
  speed?: number; // ms per character
  className?: string;
  startDelay?: number;
  onDone?: () => void;
};

export function Typewriter({ text, speed = 28, className, startDelay = 0, onDone }: Props) {
  const [shown, setShown] = useState(0);
  const [started, setStarted] = useState(startDelay === 0);

  useEffect(() => {
    if (startDelay === 0) return;
    const t = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(t);
  }, [startDelay]);

  useEffect(() => {
    setShown(0);
  }, [text]);

  useEffect(() => {
    if (!started) return;
    if (shown >= text.length) {
      onDone?.();
      return;
    }
    const t = setTimeout(() => setShown((s) => s + 1), speed);
    return () => clearTimeout(t);
  }, [shown, text, speed, started, onDone]);

  const isDone = shown >= text.length;

  return (
    <span className={className}>
      {text.slice(0, shown)}
      {!isDone && (
        <span className="inline-block w-[0.5ch] -mb-0.5 bg-primary/80 animate-pulse">
          &nbsp;
        </span>
      )}
    </span>
  );
}
