"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
export default function HeroVisual() {
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const [pulse, setPulse] = useState(0);
  const [active, setActive] = useState(false);
  useEffect(() => { if (!active) return; const timer = setTimeout(() => setActive(false), 1800); return () => clearTimeout(timer); }, [active, pulse]);
  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  const greet = () => { setPulse(value=>value+1); setActive(true); };
  function move(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => { root.current?.style.setProperty("--scene-x", `${x * -8}px`); root.current?.style.setProperty("--scene-y", `${y * -8}px`); root.current?.style.setProperty("--note-rotate", `${x * 2}deg`); });
  }
  function reset() { cancelAnimationFrame(frame.current); root.current?.style.setProperty("--scene-x", "0px"); root.current?.style.setProperty("--scene-y", "0px"); root.current?.style.setProperty("--note-rotate", "0deg"); }
  return <div ref={root} className="hero-visual interactive-scene" onPointerMove={move} onPointerLeave={reset} onPointerDown={event=>{ if (!(event.target as HTMLElement).closest("button")) greet(); }}>
    <Image className="scene-image" src="/media/recepcao.webp" alt="Recepção do Instituto Conectar, um ambiente acolhedor com os personagens da marca" fill priority sizes="(max-width:760px) 100vw, 58vw" />
    <span className="scene-light" aria-hidden="true" />
    <button type="button" className="hero-message" onClick={greet} aria-label="Receber carinho dos personagens do Conectar">Conectar pessoas,<br/>histórias e<br/>potencialidades.</button>
    {active && <span key={pulse} className="scene-affection" aria-hidden="true"><span>💜</span><span>✨</span><span>💚</span></span>}
    <span className="scene-greeting" role="status">{active ? "Cada conexão faz a diferença!" : ""}</span>
  </div>;
}
