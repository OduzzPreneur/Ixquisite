"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type ComparisonImage = {
  src: string;
  alt: string;
  position?: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function BeforeAfterComparison({
  beforeImage,
  afterImage,
  beforeLabel,
  beforeSubLabel,
  afterLabel,
  afterSubLabel,
  initialPosition = 52,
  min = 18,
  max = 82,
}: {
  beforeImage: ComparisonImage;
  afterImage: ComparisonImage;
  beforeLabel: string;
  beforeSubLabel: string;
  afterLabel: string;
  afterSubLabel: string;
  initialPosition?: number;
  min?: number;
  max?: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const boundsRef = useRef<{ left: number; width: number }>({ left: 0, width: 1 });
  const targetRef = useRef(clamp(initialPosition, min, max));
  const [position, setPosition] = useState(() => clamp(initialPosition, min, max));
  const [dragging, setDragging] = useState(false);

  function flushPosition() {
    frameRef.current = null;
    setPosition(targetRef.current);
  }

  function schedulePosition(nextPosition: number) {
    targetRef.current = clamp(nextPosition, min, max);
    if (frameRef.current == null) {
      frameRef.current = window.requestAnimationFrame(flushPosition);
    }
  }

  function updateBounds() {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const rect = container.getBoundingClientRect();
    boundsRef.current = { left: rect.left, width: Math.max(rect.width, 1) };
  }

  function updateFromClientX(clientX: number) {
    const { left, width } = boundsRef.current;
    const nextPosition = ((clientX - left) / width) * 100;
    schedulePosition(nextPosition);
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    updateBounds();
    pointerIdRef.current = event.pointerId;
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
    updateFromClientX(event.clientX);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragging || pointerIdRef.current !== event.pointerId) {
      return;
    }

    event.preventDefault();
    updateFromClientX(event.clientX);
  }

  function finishPointerInteraction(event?: React.PointerEvent<HTMLDivElement>) {
    if (event && pointerIdRef.current === event.pointerId && event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    pointerIdRef.current = null;
    setDragging(false);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const step = event.shiftKey ? 10 : 2;
    let nextPosition = position;

    switch (event.key) {
      case "ArrowLeft":
        nextPosition = position - step;
        break;
      case "ArrowRight":
        nextPosition = position + step;
        break;
      case "Home":
        nextPosition = min;
        break;
      case "End":
        nextPosition = max;
        break;
      default:
        return;
    }

    event.preventDefault();
    schedulePosition(nextPosition);
  }

  useEffect(() => {
    updateBounds();
    const handleResize = () => updateBounds();
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      if (frameRef.current != null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const ariaValueText = useMemo(() => {
    const beforePercent = Math.round(position);
    const afterPercent = 100 - beforePercent;
    return `Before image ${beforePercent} percent, after image ${afterPercent} percent`;
  }, [position]);

  return (
    <div className={`comparison-spotlight${dragging ? " comparison-spotlight--dragging" : ""}`} ref={containerRef}>
      <div className="comparison-spotlight__stage">
        <div className="comparison-spotlight__pane comparison-spotlight__pane--before">
          <Image
            src={beforeImage.src}
            alt={beforeImage.alt}
            fill
            sizes="(max-width: 720px) 100vw, 1120px"
            className="comparison-spotlight__image comparison-spotlight__image--before"
            style={beforeImage.position ? { objectPosition: beforeImage.position } : undefined}
          />
          <div className="comparison-spotlight__scrim comparison-spotlight__scrim--before" />
          <div className="comparison-spotlight__label comparison-spotlight__label--before">
            <span className="comparison-spotlight__eyebrow">{beforeLabel}</span>
            <strong className="comparison-spotlight__caption">{beforeSubLabel}</strong>
          </div>
        </div>

        <div
          className="comparison-spotlight__pane comparison-spotlight__pane--after"
          style={{ clipPath: `inset(0 0 0 ${position}%)` }}
          aria-hidden="true"
        >
          <Image
            src={afterImage.src}
            alt=""
            fill
            sizes="(max-width: 720px) 100vw, 1120px"
            className="comparison-spotlight__image comparison-spotlight__image--after"
            style={afterImage.position ? { objectPosition: afterImage.position } : undefined}
          />
          <div className="comparison-spotlight__scrim comparison-spotlight__scrim--after" />
          <div className="comparison-spotlight__label comparison-spotlight__label--after">
            <span className="comparison-spotlight__eyebrow">{afterLabel}</span>
            <strong className="comparison-spotlight__caption">{afterSubLabel}</strong>
          </div>
        </div>

        <div
          className="comparison-spotlight__control"
          style={{ left: `${position}%` }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishPointerInteraction}
          onPointerCancel={finishPointerInteraction}
        >
          <div
            className="comparison-spotlight__handle-hitbox"
            role="slider"
            tabIndex={0}
            aria-label="Before and after comparison slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={Math.round(position)}
            aria-valuetext={ariaValueText}
            onKeyDown={handleKeyDown}
          >
            <span className="comparison-spotlight__divider" />
            <span className="comparison-spotlight__handle">
              <span className="comparison-spotlight__chevrons" aria-hidden="true">
                ‹ ›
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
