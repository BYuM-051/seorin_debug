/*
Read me!!!----
this code was generated with chatGPT

how to use :
import useIsMobile from "../hooks/useIsMobile";

function Header() {
const isMobile = useIsMobile();

return (
    <>
    {isMobile ? <MobileNav /> : <DesktopNav />}
    </>
);
}
*/

import { useEffect, useState } from "react";

export default function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth <= breakpoint;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= breakpoint);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
}