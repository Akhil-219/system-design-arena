import { useState, useCallback, useRef, useEffect } from "react";

// Generic drag-to-resize hook. `axis` is "x" (drag changes width) or
// "y" (drag changes height). For "y" we resize from the top edge of the
// panel (dragging up increases height), which is what a bottom-docked
// panel needs.
export function useResizable({ axis, initialSize, min, max }) {
  const [size, setSize] = useState(initialSize);
  const isDragging = useRef(false);
  const startPos = useRef(0);
  const startSize = useRef(initialSize);

  const onMouseDown = useCallback(
    (e) => {
      isDragging.current = true;
      startPos.current = axis === "x" ? e.clientX : e.clientY;
      startSize.current = size;
      e.preventDefault();
    },
    [axis, size]
  );

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      const currentPos = axis === "x" ? e.clientX : e.clientY;
      const delta = currentPos - startPos.current;
      // For "y" (bottom-docked panel), dragging the handle up (negative
      // delta) should grow the panel, so we invert the delta.
      const rawSize = axis === "x" ? startSize.current + delta : startSize.current - delta;
      const clamped = Math.min(max, Math.max(min, rawSize));
      setSize(clamped);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [axis, min, max]);

  return { size, onMouseDown };
}