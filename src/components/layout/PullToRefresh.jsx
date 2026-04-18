import React, { useRef, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";

const THRESHOLD = 70; // px to pull before triggering

export default function PullToRefresh({ children, onRefresh }) {
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(null);
  const containerRef = useRef(null);

  const handleTouchStart = useCallback((e) => {
    if (containerRef.current?.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
    }
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (startY.current === null || refreshing) return;
    const delta = e.touches[0].clientY - startY.current;
    if (delta > 0 && containerRef.current?.scrollTop === 0) {
      e.preventDefault();
      setPullDistance(Math.min(delta * 0.5, THRESHOLD + 20));
    }
  }, [refreshing]);

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance >= THRESHOLD && !refreshing) {
      setRefreshing(true);
      setPullDistance(THRESHOLD);
      await onRefresh?.();
      setRefreshing(false);
    }
    setPullDistance(0);
    startY.current = null;
  }, [pullDistance, refreshing, onRefresh]);

  const progress = Math.min(pullDistance / THRESHOLD, 1);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-auto relative"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div
        className="flex items-center justify-center overflow-hidden transition-all duration-200 ease-out"
        style={{ height: `${pullDistance}px` }}
      >
        {(pullDistance > 10 || refreshing) && (
          <div className="flex items-center gap-2 text-purple-600 text-sm font-medium">
            <Loader2
              className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
              style={{ transform: `rotate(${progress * 360}deg)`, transition: refreshing ? "" : "none" }}
            />
            {refreshing ? "Refreshing..." : progress >= 1 ? "Release to refresh" : "Pull to refresh"}
          </div>
        )}
      </div>
      <div className="pb-20 lg:pb-0">
        {children}
      </div>
    </div>
  );
}