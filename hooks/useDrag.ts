// hooks/useDrag.ts
import { useState, useCallback, useEffect } from 'react';

export function useDrag(onDragEnd: () => void) {
  const [startX, setStartX] = useState<number | null>(null);
  const [currentX, setCurrentX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startX !== null) {
      const touchEndX = e.touches[0].clientX;
      setCurrentX(touchEndX);

      if (Math.abs(startX - touchEndX) > 36) {
        onDragEnd();
      }
    }
  };

  const handleTouchEnd = () => {
    setStartX(null);
    setCurrentX(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && startX !== null) {
      const mouseEndX = e.clientX;
      setCurrentX(mouseEndX);

      if (Math.abs(startX - mouseEndX) > 36) {
        onDragEnd();
      }
    }
  };

  const handleMouseUp = () => {
    setStartX(null);
    setCurrentX(null);
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setStartX(null);
    setCurrentX(null);
    setIsDragging(false);
  };

  const getTransformStyle = useCallback(() => {
    let transformX = 0;

    if (startX !== null && currentX !== null) {
      transformX = currentX - startX;
    }

    return `translate(-50%, -50%) translateX(${transformX}px)`;
  }, [startX, currentX]);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    getTransformStyle,
    isDragging,
  };
}
