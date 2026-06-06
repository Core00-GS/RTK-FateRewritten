/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  className?: string;
}

export default function AnimatedCounter({ value, suffix = "", className = "" }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const previousValueRef = useRef(value);

  useEffect(() => {
    const start = previousValueRef.current;
    const end = value;
    if (start === end) return;

    const duration = 800; // ms
    const startTime = performance.now();

    let animationFrameId: number;

    const updateValue = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      if (elapsedTime >= duration) {
        setDisplayValue(end);
        previousValueRef.current = end;
      } else {
        const progress = elapsedTime / duration;
        // Ease-out Quad curve for smooth deceleration
        const easeProgress = progress * (2 - progress);
        const currentVal = Math.round(start + (end - start) * easeProgress);
        setDisplayValue(currentVal);
        animationFrameId = requestAnimationFrame(updateValue);
      }
    };

    animationFrameId = requestAnimationFrame(updateValue);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [value]);

  // Handle immediate change when tab changes or initial render
  useEffect(() => {
    previousValueRef.current = value;
    setDisplayValue(value);
  }, []);

  return (
    <span className={`${className} transition-all duration-300`}>
      {displayValue.toLocaleString()}{suffix}
    </span>
  );
}
