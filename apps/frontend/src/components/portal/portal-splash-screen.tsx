"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart } from "lucide-react";
import { soundEffects } from "@/lib/sound-effects";

interface PortalSplashScreenProps {
  onFinish: () => void;
  /** Duração em segundos (padrão: 0.8s a 1.2s conforme solicitado) */
  durationSeconds?: number;
}

export function PortalSplashScreen({
  onFinish,
  durationSeconds = 0.8,
}: PortalSplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [mascotWink, setMascotWink] = useState(false);
  const [floatingParticles, setFloatingParticles] = useState<Array<{ id: number; char: string; x: number }>>([]);
  const [statusText, setStatusText] = useState("Preparando o cantinho do acolhimento...");

  useEffect(() => {
    // Tocar batimento cardíaco ou chirp no início da splash
    soundEffects.playHeartbeat();

    const totalSteps = 40;
    const intervalMs = (durationSeconds * 1000) / totalSteps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 100 / totalSteps;
        if (next >= 45 && next < 80) {
          setStatusText("Conectando família, escola e cuidado... ✨");
        } else if (next >= 80 && next < 99) {
          setStatusText("Tudo pronto com muito amor! 🌟");
        }
        if (next >= 100) {
          clearInterval(timer);
          soundEffects.playSparkle();
          setTimeout(onFinish, 180);
          return 100;
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [durationSeconds, onFinish]);

  // Microinteração: ao tocar no coraçãozinho ele pisca, pula e solta corações
  const handleHeartTap = () => {
    soundEffects.playChirp();
    setMascotWink(true);
    setTimeout(() => setMascotWink(false), 600);

    const chars = ["💖", "💜", "✨", "🌟", "🌸"];
    const chosen = chars[Math.floor(Math.random() * chars.length)];
    const newId = Date.now();
    const randomX = (Math.random() - 0.5) * 60;

    setFloatingParticles((prev) => [...prev, { id: newId, char: chosen, x: randomX }]);
    setTimeout(() => {
      setFloatingParticles((prev) => prev.filter((p) => p.id !== newId));
    }, 900);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.3, ease: "easeInOut" } }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center select-none overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #FAF7FF 0%, #FFF5F7 50%, #F5EEFF 100%)",
      }}
    >
      {/* ─── BLOBS ORGÂNICOS DECORATIVOS COM RESPIRAÇÃO SUAVE ─── */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-[#E8DEFF]/60 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.45, 0.25] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 }}
        className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-[#FFDDE0]/50 blur-3xl pointer-events-none"
      />

      {/* ─── CONTEÚDO CENTRALIZADO ─── */}
      <div className="relative z-10 flex flex-col items-center max-w-[340px] w-full px-6">

        {/* 1. O CORAÇÃOZINHO MASCOTE INTERATIVO */}
        <div className="relative mb-3 flex items-center justify-center cursor-pointer" onClick={handleHeartTap}>
          {/* Pulso de halo ao redor do coração */}
          <motion.div
            animate={{ scale: [0.95, 1.12, 0.95], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="absolute w-36 h-36 rounded-full bg-gradient-to-tr from-[#FF8596]/30 to-[#8D5BD1]/20 blur-xl pointer-events-none"
          />

          {/* Partículas flutuantes ao tocar */}
          <AnimatePresence>
            {floatingParticles.map((p) => (
              <motion.span
                key={p.id}
                initial={{ opacity: 1, scale: 0.6, y: 0, x: p.x }}
                animate={{ opacity: 0, scale: 1.5, y: -70, x: p.x * 1.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute pointer-events-none text-2xl select-none z-30 drop-shadow-md"
              >
                {p.char}
              </motion.span>
            ))}
          </AnimatePresence>

          {/* SVG do Coraçãozinho com animação suave de respiração / batimento */}
          <motion.div
            animate={
              mascotWink
                ? { scale: [1, 1.2, 0.95, 1.1, 1], rotate: [0, -8, 8, -4, 0] }
                : { scale: [1, 1.05, 0.98, 1.04, 1] }
            }
            transition={
              mascotWink
                ? { duration: 0.5 }
                : { repeat: Infinity, duration: 1.6, ease: "easeInOut" }
            }
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-28 h-28 drop-shadow-lg relative"
            title="Toque no coraçãozinho! 💜"
          >
            <svg viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <defs>
                <linearGradient id="splashHeartGrad" x1="20" y1="10" x2="140" y2="130" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FF7A8E" />
                  <stop offset="1" stopColor="#FF4D6D" />
                </linearGradient>
              </defs>

              {/* Bracinho esquerdo dando tchau */}
              <motion.path
                animate={{ rotate: [0, 18, -18, 0] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                style={{ transformOrigin: "38px 58px" }}
                d="M28 62 C15 50 10 38 12 28 C14 20 22 20 25 28 C28 35 34 50 38 58"
                stroke="#29232F"
                strokeWidth="3.8"
                strokeLinecap="round"
              />

              {/* Bracinho direito acolhedor */}
              <path
                d="M132 62 C145 52 150 40 148 30 C146 22 138 22 135 30 C132 37 126 50 122 58"
                stroke="#29232F"
                strokeWidth="3.8"
                strokeLinecap="round"
              />

              {/* Perninhas fofas */}
              <path d="M62 118 L58 134 M98 118 L102 134" stroke="#29232F" strokeWidth="3.8" strokeLinecap="round" />

              {/* Corpinho Coração */}
              <path
                d="M80 120 C45 92 18 68 18 42 C18 22 34 10 54 10 C66 10 74 16 80 24 C86 16 94 10 106 10 C126 10 142 22 142 42 C142 68 115 92 80 120 Z"
                fill="url(#splashHeartGrad)"
              />

              {/* Florzinha delicada na orelha direita */}
              <circle cx="120" cy="18" r="6" fill="#DDD6FE" />
              <circle cx="129" cy="14" r="6" fill="#DDD6FE" />
              <circle cx="133" cy="23" r="6" fill="#DDD6FE" />
              <circle cx="125" cy="28" r="6" fill="#DDD6FE" />
              <circle cx="118" cy="25" r="6" fill="#DDD6FE" />
              <circle cx="125" cy="21" r="4.5" fill="#FDE047" />

              {/* Olho Esquerdo (Piscando se mascotWink for true) */}
              {mascotWink ? (
                <path d="M60 52 Q64 47 68 52" stroke="#29232F" strokeWidth="3.2" strokeLinecap="round" fill="none" />
              ) : (
                <>
                  <ellipse cx="64" cy="52" rx="4.8" ry="7" fill="#29232F" />
                  <circle cx="66.5" cy="49" r="2.2" fill="#FFFFFF" />
                </>
              )}

              {/* Olho Direito com brilho */}
              <ellipse cx="96" cy="52" rx="4.8" ry="7" fill="#29232F" />
              <circle cx="98.5" cy="49" r="2.2" fill="#FFFFFF" />

              {/* Cílios e Sobrancelhas fofas */}
              <path d="M58 43 Q64 39 70 42" stroke="#29232F" strokeWidth="2.4" strokeLinecap="round" fill="none" />
              <path d="M90 42 Q96 39 102 43" stroke="#29232F" strokeWidth="2.4" strokeLinecap="round" fill="none" />

              {/* Bochechinhas rosadas que pulsam */}
              <motion.circle
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ repeat: Infinity, duration: 1.6 }}
                cx="52"
                cy="62"
                r="6"
                fill="#FFAEC0"
                opacity="0.9"
              />
              <motion.circle
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ repeat: Infinity, duration: 1.6 }}
                cx="108"
                cy="62"
                r="6"
                fill="#FFAEC0"
                opacity="0.9"
              />

              {/* Sorriso acolhedor */}
              <path d="M72 63 Q80 72 88 63" stroke="#29232F" strokeWidth="3" strokeLinecap="round" fill="none" />
            </svg>
          </motion.div>
        </div>

        {/* 2. LOGOMARCA COMPLETA: 3 ÍCONES COLORIDOS + "CONECTAR" */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="flex flex-col items-center text-center space-y-1"
        >
          {/* 3 Círculos da Marca: Afeto 💜, Desenvolvimento 🌱, Aprendizagem 💡 */}
          <div className="flex items-center gap-1.5 mb-1">
            <motion.span
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 2, delay: 0 }}
              className="w-7 h-7 rounded-full bg-[#F58A7E] flex items-center justify-center text-white text-xs font-bold shadow-xs"
            >
              💜
            </motion.span>
            <motion.span
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
              className="w-7 h-7 rounded-full bg-[#8D5BD1] flex items-center justify-center text-white text-xs font-bold shadow-xs"
            >
              🌱
            </motion.span>
            <motion.span
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 2, delay: 0.6 }}
              className="w-7 h-7 rounded-full bg-[#F3A43B] flex items-center justify-center text-white text-xs font-bold shadow-xs"
            >
              💡
            </motion.span>
          </div>

          {/* Palavra CONECTAR com tipografia oficial */}
          <h1 className="text-[26px] font-black tracking-wider text-[#8D5BD1] uppercase leading-none font-sans drop-shadow-2xs">
            CONECTAR
          </h1>

          {/* Subtítulo institucional */}
          <p className="text-[10.5px] font-bold text-[#77717E] tracking-tight">
            Instituto de Desenvolvimento Infantil
          </p>
        </motion.div>

        {/* 3. BARRA DE CARREGAMENTO LÚDICA COM MICROINTERAÇÕES */}
        <div className="w-full mt-6 space-y-2">
          {/* Barra Pill com Gradiente e Estrelinha que corre */}
          <div className="h-2 w-full bg-white/80 rounded-full border border-[#EEE8FA] shadow-inner relative overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#8D5BD1] via-[#B388EB] to-[#FF8596] rounded-full relative"
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeOut" }}
            >
              {/* Efeito shimmer de luz passando */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse" />
            </motion.div>
          </div>

          {/* Status textual rotativo com micro-animação */}
          <div className="flex items-center justify-between text-[10px] text-[#77717E] font-semibold px-0.5 min-h-[18px]">
            <motion.span
              key={statusText}
              initial={{ opacity: 0, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              className="truncate pr-2 font-medium text-[#29232F]"
            >
              {statusText}
            </motion.span>
            <span className="font-extrabold text-[#8D5BD1] shrink-0">
              {Math.min(100, Math.round(progress))}%
            </span>
          </div>
        </div>

        {/* 4. DICA DE INTERAÇÃO DISCRETA */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-[9px] text-[#77717E] font-medium mt-4 cursor-pointer"
          onClick={handleHeartTap}
        >
          💡 Toque no coraçãozinho para mandar carinho
        </motion.p>
      </div>
    </motion.div>
  );
}
