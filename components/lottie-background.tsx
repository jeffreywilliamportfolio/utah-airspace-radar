"use client";

import { useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export function LottieBackground() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();

    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {!reduceMotion ? (
        <DotLottieReact
          src="/lottie/clouds-loop.lottie"
          autoplay
          loop
          className="absolute inset-0 h-full w-full scale-110 opacity-20"
          renderConfig={{ autoResize: true }}
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/55 to-slate-950/85" />
    </div>
  );
}
