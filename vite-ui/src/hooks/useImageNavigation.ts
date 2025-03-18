import { useState, useEffect } from 'react';

export const useImageNavigation = (initialIndex: number, total: number) => {
  const [index, setIndex] = useState(initialIndex);

  const next = () => setIndex((prev) => (prev + 1) % total);
  const prev = () => setIndex((prev) => (prev - 1 + total) % total);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [total]);

  return { index, next, prev };
};
