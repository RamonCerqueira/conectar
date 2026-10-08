"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
export default function InteractiveBrandLogo({ footer = false }: { footer?: boolean }) {
  const [pulse, setPulse] = useState(0);
  const [active, setActive] = useState(false);
  useEffect(() => { if (!active) return; const timer = setTimeout(() => setActive(false), 1400); return () => clearTimeout(timer); }, [active, pulse]);
  const greet = () => { setPulse(value => value + 1); setActive(true); };
  return <a href="#inicio" aria-label="Instituto Conectar — início" className={`brand-interactive-logo ${footer ? "brand-footer" : "brand-header"}`} onPointerEnter={greet} onFocus={greet} onClick={greet}>
    <Image src="/brand/conectar.png" alt="Instituto Conectar" fill sizes={footer ? "240px" : "270px"} priority={!footer} className="brand-wordmark" />
    <span key={pulse} className={`brand-character-group ${active ? "brand-greeting" : ""}`} aria-hidden="true"><Image src="/brand/conectar.png" alt="" fill sizes={footer ? "240px" : "270px"} /></span>
    {active && <span className="brand-affection" aria-hidden="true"><span>✦</span><span>♡</span><span>✧</span></span>}
  </a>;
}
