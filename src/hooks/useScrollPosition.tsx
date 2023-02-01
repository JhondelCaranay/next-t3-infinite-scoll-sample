import { useEffect, useState } from "react";

export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = () => {
    // const position = window.pageYOffset;
    // setScrollPosition(position);
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    const scrolled = (winScroll / height) * 100;

    setScrollPosition(scrolled);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return { scrollPosition, setScrollPosition };
}
