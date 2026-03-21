import { useEffect, useState } from "react";

export const MOBILE_BREAKPOINT = 768;

function getWindowWidth() {
  if (typeof window === "undefined") {
    return MOBILE_BREAKPOINT;
  }
  return window.innerWidth;
}

export function useWindowSize() {
  const [width, setWidth] = useState(getWindowWidth);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return { width, isMobile: width < MOBILE_BREAKPOINT };
}
