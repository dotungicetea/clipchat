"use client";

import { useEffect, useState } from "react";

interface MousePosition {
  x: number | null;
  y: number | null;
}

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: null, y: null });

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent | TouchEvent) => {
      let x: number, y: number;
      if ((ev as TouchEvent).touches) {
        const touch = (ev as TouchEvent).touches[0];
        [x, y] = [touch.clientX, touch.clientY];
      } else {
        [x, y] = [(ev as MouseEvent).clientX, (ev as MouseEvent).clientY];
      }
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  return mousePosition;
};

export default useMousePosition;
