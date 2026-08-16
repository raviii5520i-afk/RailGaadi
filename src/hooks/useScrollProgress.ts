"use client";

import { useEffect, useState, useRef } from "react";

export function useScrollProgress(containerRef: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };
    mediaQuery.addEventListener("change", handleMediaChange);

    let currentProgress = 0;
    let targetProgress = 0;

    const updateScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollableHeight = rect.height - window.innerHeight;

      if (totalScrollableHeight <= 0) {
        targetProgress = 0;
      } else {
        const scrolled = -rect.top;
        targetProgress = Math.max(0, Math.min(1, scrolled / totalScrollableHeight));
      }

      // Smooth lerp interpolation for 60fps/120fps physics
      currentProgress += (targetProgress - currentProgress) * 0.15;
      if (Math.abs(targetProgress - currentProgress) < 0.0005) {
        currentProgress = targetProgress;
      }

      setProgress(currentProgress);

      animFrameRef.current = requestAnimationFrame(updateScroll);
    };

    animFrameRef.current = requestAnimationFrame(updateScroll);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, [containerRef]);

  return { progress, isReducedMotion };
}
