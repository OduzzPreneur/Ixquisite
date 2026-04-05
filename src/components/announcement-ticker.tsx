"use client";

import { useEffect, useRef, useState } from "react";

type AnnouncementTickerProps = {
  items: readonly string[];
  intervalMs?: number;
};

export function AnnouncementTicker({ items, intervalMs = 4200 }: AnnouncementTickerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [stage, setStage] = useState<"idle" | "exit" | "enter">("idle");
  const exitTimeoutRef = useRef<number | null>(null);
  const enterTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (items.length < 2) {
      return;
    }

    const clearAnimationTimers = () => {
      if (exitTimeoutRef.current !== null) {
        window.clearTimeout(exitTimeoutRef.current);
        exitTimeoutRef.current = null;
      }

      if (enterTimeoutRef.current !== null) {
        window.clearTimeout(enterTimeoutRef.current);
        enterTimeoutRef.current = null;
      }
    };

    const advance = () => {
      clearAnimationTimers();
      setStage("exit");

      exitTimeoutRef.current = window.setTimeout(() => {
        setActiveIndex((currentIndex) => (currentIndex + 1) % items.length);
        setStage("enter");

        enterTimeoutRef.current = window.setTimeout(() => {
          setStage("idle");
        }, 40);
      }, 360);
    };

    const intervalId = window.setInterval(() => {
      advance();
    }, intervalMs);

    return () => {
      window.clearInterval(intervalId);
      clearAnimationTimers();
    };
  }, [intervalMs, items.length]);

  return (
    <div className="announcement-bar__inner">
      <div className="announcement-bar__viewport" aria-live="polite">
        <p className={`announcement-bar__message announcement-bar__message--${stage}`}>{items[activeIndex]}</p>
      </div>
    </div>
  );
}
