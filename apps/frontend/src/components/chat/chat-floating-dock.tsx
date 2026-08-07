"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  Search,
  User,
  Building2,
  Check,
  CheckCheck,
  Bell,
  Sparkles,
  Zap,
  Minimize2,
  Maximize2,
  Circle,
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { io, Socket } from "socket.io-client";

interface Contato {
  id: string;
  nome: string;
  email: string;
  foto?: string | null;
  perfil: string;
  isRecepcao: boolean;
  isProfissional: boolean;
  especialidade?: string | null;
  salaNome?: string | null;
  corAgenda?: string;
  naoLidas: number;
  online: boolean;
}

interface Mensagem {
  id: string;
  remetenteId: string;
  destinatarioId: string;
  conteudo: string;
  lida: boolean;
  lidaEm?: string | null;
  criadoEm: string;
  remetente?: {
    id: string;
    nome: string;
    perfil: string;
  };
}

export function ChatFloatingDock() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [contatoSelecionado, setContatoSelecionado] = useState<Contato | null>(null);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<"TODOS" | "RECEPCAO" | "SALAS">("TODOS");
  const [usuarioIdLogado, setUsuarioIdLogado] = useState<string | null>(null);
  const [loadingContatos, setLoadingContatos] = useState(false);
  const [loadingMensagens, setLoadingMensagens] = useState(false);
  const [digitandoOutro, setDigitandoOutro] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Frases de envio rápido pré-formatadas para a Recepção ↔ Salas
  const frasesRapidas = [
    "⚡ O paciente acabou de chegar na recepção.",
    "⚡ Próximo paciente aguardando na sala de espera.",
    "⚡ A consulta anterior atrasará aproximadamente 5 minutos.",
    "⚡ Por favor, favor vir à recepção assim que possível.",
    "⚡ Ficha do paciente e guia do convênio liberadas.",
  ];

  // Identificar usuário logado
  useEffect(() => {
    if (typeof window !== "undefined") {
      api
        .get("/auth/me")
        .then((res) => {
          if (res.data?.id) {
            setUsuarioIdLogado(res.data.id);
          }
        })
        .catch(() => {
          // Fallback se token estiver guardado no localStorage
          const localId = localStorage.getItem("userId");
          if (localId) setUsuarioIdLogado(localId);
        });
    }
  }, []);

  // Inicializar WebSocket e carregar contatos
  useEffect(() => {
    if (!usuarioIdLogado) return;

    // Carregar contatos via REST API
    carregarContatos();

    // Conectar WebSocket
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8001";
    const socket = io(wsUrl, {
      query: { usuarioId: usuarioIdLogado },
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("chat:join", { usuarioId: usuarioIdLogado });
    });

    // Recebimento de mensagens em tempo real
    socket.on("chat:recebida", (msg: Mensagem) => {
      if (contatoSelecionado && msg.remetenteId === contatoSelecionado.id) {
        setMensagens((prev) => [...prev, msg]);
        // Marcar como lida
        socket.emit("chat:marcar_lida", {
          usuarioLogadoId: usuarioIdLogado,
          remetenteId: msg.remetenteId,
        });
      } else {
        // Tocar sinal sonoro e atualizar contador
        tocarSinalNotificacao();
        toast.info(`Nova mensagem de ${msg.remetente?.nome || "um colega"}`);
        carregarContatos();
      }
    });

    // Atualização de mensagens enviadas
    socket.on("chat:enviada", (msg: Mensagem) => {
      if (contatoSelecionado && msg.destinatarioId === contatoSelecionado.id) {
        setMensagens((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      }
    });

    // Indicador de digitação
    socket.on("chat:digitando", (payload: { remetenteId: string; digitando: boolean }) => {
      if (contatoSelecionado && payload.remetenteId === contatoSelecionado.id) {
        setDigitandoOutro(payload.digitando);
      }
    });

    // Presença dos usuários
    socket.on("chat:presenca", () => {
      carregarContatos();
    });

    return () => {
      socket.disconnect();
    };
  }, [usuarioIdLogado, contatoSelecionado]);

  // Carregar contatos
  const carregarContatos = async () => {
    try {
      setLoadingContatos(true);
      const res = await api.get("/chat/contatos");
      setContatos(res.data || []);
    } catch (err) {
      console.warn("Não foi possível carregar contatos do chat", err);
    } finally {
      setLoadingContatos(false);
    }
  };

  // Carregar histórico quando seleciona um contato
  useEffect(() => {
    if (!contatoSelecionado || !usuarioIdLogado) return;

    const carregarHistorico = async () => {
      try {
        setLoadingMensagens(true);
        const res = await api.get(`/chat/mensagens/${contatoSelecionado.id}`);
        setMensagens(res.data || []);
        // Atualizar lista de contatos para zerar badge de não lidas
        carregarContatos();
      } catch (err) {
        console.error("Erro ao carregar mensagens:", err);
      } finally {
        setLoadingMensagens(false);
      }
    };

    carregarHistorico();
  }, [contatoSelecionado, usuarioIdLogado]);

  // Auto-scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens, digitandoOutro]);

  // Emitir som suave de notificação
  const tocarSinalNotificacao = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      // Ignorar erros de áudio se bloqueado pelo navegador
    }
  };

  // Enviar mensagem
  const handleEnviarMensagem = async (texto?: string) => {
    const conteudoFinal = texto || novaMensagem;
    if (!conteudoFinal.trim() || !contatoSelecionado || !usuarioIdLogado) return;

    const temporariaId = "temp-" + Date.now();
    const mensagemOtimista: Mensagem = {
      id: temporariaId,
      remetenteId: usuarioIdLogado,
      destinatarioId: contatoSelecionado.id,
      conteudo: conteudoFinal.trim(),
      lida: false,
      criadoEm: new Date().toISOString(),
    };

    setMensagens((prev) => [...prev, mensagemOtimista]);
    if (!texto) setNovaMensagem("");

    try {
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit("chat:send", {
          remetenteId: usuarioIdLogado,
          destinatarioId: contatoSelecionado.id,
          conteudo: conteudoFinal.trim(),
        });
      } else {
        // Fallback REST
        const res = await api.post("/chat/mensagens", {
          destinatarioId: contatoSelecionado.id,
          conteudo: conteudoFinal.trim(),
        });
        setMensagens((prev) =>
          prev.map((m) => (m.id === temporariaId ? res.data : m))
        );
      }
    } catch (err) {
      toast.error("Falha ao enviar mensagem.");
      setMensagens((prev) => prev.filter((m) => m.id !== temporariaId));
    }
  };

  const totalNaoLidas = contatos.reduce((acc, c) => acc + (c.naoLidas || 0), 0);

  // Filtragem de contatos
  const contatosFiltrados = contatos.filter((c) => {
    const matchBusca =
      c.nome.toLowerCase().includes(busca.toLowerCase()) ||
      c.perfil.toLowerCase().includes(busca.toLowerCase()) ||
      (c.salaNome && c.salaNome.toLowerCase().includes(busca.toLowerCase()));

    if (!matchBusca) return false;
    if (filtro === "RECEPCAO") return c.isRecepcao;
    if (filtro === "SALAS") return c.isProfissional || !!c.salaNome;
    return true;
  });

  return (
    <>
      {/* Botão Flutuante (Floating Dock Trigger) */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsOpen(true);
                setIsMinimized(false);
              }}
              className="relative flex items-center gap-2.5 px-4 py-3.5 rounded-full text-white shadow-2xl gradient-primary cursor-pointer border border-white/20"
              id="btn-chat-flutuante"
            >
              <MessageSquare className="h-5 w-5" />
              <span className="font-semibold text-xs tracking-wide">Chat Interno</span>

              {totalNaoLidas > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-pink-500 text-[11px] font-extrabold text-white shadow-md border-2 border-white animate-bounce">
                  {totalNaoLidas}
                </span>
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Janela Principal do Chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? "56px" : "600px",
            }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-full max-w-[850px] sm:w-[850px] bg-card rounded-2xl border shadow-2xl overflow-hidden flex flex-col glass"
            style={{
              borderColor: "hsl(var(--border))",
              background: "hsl(var(--card))",
            }}
          >
            {/* Header da Janela de Chat */}
            <div
              className="h-14 px-4 flex items-center justify-between shrink-0 border-b cursor-pointer select-none"
              style={{
                background: "hsl(var(--muted)/0.5)",
                borderColor: "hsl(var(--border))",
              }}
            >
              <div
                className="flex items-center gap-2.5"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-foreground">
                      Chat Interno 1:1 — Recepção & Salas
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      Direto
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Comunicação rápida e em tempo real sem papel e sem ruídos
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                  title={isMinimized ? "Expandir" : "Minimizar"}
                >
                  {isMinimized ? (
                    <Maximize2 className="h-4 w-4" />
                  ) : (
                    <Minimize2 className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  title="Fechar"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Conteúdo da Janela (Oculto se minimizado) */}
            {!isMinimized && (
              <div className="flex-1 flex overflow-hidden">
                {/* Painel Esquerdo: Lista de Contatos */}
                <div
                  className="w-72 shrink-0 border-r flex flex-col bg-muted/20"
                  style={{ borderColor: "hsl(var(--border))" }}
                >
                  {/* Busca de Contatos */}
                  <div className="p-3 border-b space-y-2" style={{ borderColor: "hsl(var(--border))" }}>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Buscar contato ou sala..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-muted border border-border outline-none focus:border-purple-500 transition-all text-foreground placeholder:text-muted-foreground"
                      />
                    </div>

                    {/* Filtros de Categoria */}
                    <div className="flex items-center gap-1">
                      {(["TODOS", "RECEPCAO", "SALAS"] as const).map((f) => (
                        <button
                          key={f}
                          onClick={() => setFiltro(f)}
                          className={`flex-1 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                            filtro === f
                              ? "gradient-primary text-white shadow-xs"
                              : "bg-muted text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {f === "TODOS" ? "Todos" : f === "RECEPCAO" ? "Recepção" : "Salas"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Lista de Usuários */}
                  <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {loadingContatos ? (
                      <div className="p-4 text-center text-xs text-muted-foreground">
                        Carregando contatos...
                      </div>
                    ) : contatosFiltrados.length === 0 ? (
                      <div className="p-4 text-center text-xs text-muted-foreground">
                        Nenhum contato encontrado.
                      </div>
                    ) : (
                      contatosFiltrados.map((contato) => {
                        const isSelected = contatoSelecionado?.id === contato.id;
                        return (
                          <button
                            key={contato.id}
                            onClick={() => setContatoSelecionado(contato)}
                            className={`w-full p-2.5 rounded-xl text-left flex items-center gap-3 transition-all cursor-pointer border ${
                              isSelected
                                ? "bg-purple-500/15 border-purple-500/30 text-foreground shadow-xs"
                                : "hover:bg-muted/50 border-transparent text-muted-foreground"
                            }`}
                          >
                            <div className="relative shrink-0">
                              <div className="w-9 h-9 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                                {contato.nome.charAt(0).toUpperCase()}
                              </div>
                              <span
                                className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-card ${
                                  contato.online ? "bg-emerald-500" : "bg-gray-400"
                                }`}
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-xs font-bold text-foreground truncate">
                                  {contato.nome}
                                </p>
                                {contato.naoLidas > 0 && (
                                  <span className="px-1.5 py-0.5 rounded-full bg-pink-500 text-white text-[9px] font-extrabold">
                                    {contato.naoLidas}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-1 mt-0.5">
                                {contato.isRecepcao ? (
                                  <span className="text-[10px] font-semibold text-amber-400 flex items-center gap-1">
                                    <User className="h-3 w-3" /> Recepção
                                  </span>
                                ) : contato.salaNome ? (
                                  <span className="text-[10px] font-medium text-purple-400 flex items-center gap-1 truncate">
                                    <Building2 className="h-3 w-3 shrink-0" /> {contato.salaNome}
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-muted-foreground truncate">
                                    {contato.perfil.replace("_", " ")}
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Painel Direito: Chat 1:1 Direct Thread */}
                <div className="flex-1 flex flex-col bg-card">
                  {contatoSelecionado ? (
                    <>
                      {/* Header do Contato Selecionado */}
                      <div
                        className="p-3 border-b flex items-center justify-between shrink-0 bg-muted/10"
                        style={{ borderColor: "hsl(var(--border))" }}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                            {contatoSelecionado.nome.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-foreground">
                              {contatoSelecionado.nome}
                            </p>
                            <p className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  contatoSelecionado.online ? "bg-emerald-500" : "bg-gray-400"
                                }`}
                              />
                              {contatoSelecionado.online ? "Online agora" : "Ausente"}
                              {contatoSelecionado.salaNome && (
                                <span className="text-purple-400 font-semibold ml-1">
                                  • {contatoSelecionado.salaNome}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                          Mensagem Direta 1:1
                        </span>
                      </div>

                      {/* Histórico de Mensagens */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {loadingMensagens ? (
                          <div className="text-center py-10 text-xs text-muted-foreground">
                            Carregando conversa...
                          </div>
                        ) : mensagens.length === 0 ? (
                          <div className="text-center py-12 space-y-2">
                            <Zap className="h-8 w-8 text-purple-400/50 mx-auto" />
                            <p className="text-xs font-medium text-muted-foreground">
                              Inicie uma conversa direta 1:1 com {contatoSelecionado.nome}
                            </p>
                            <p className="text-[10px] text-muted-foreground/70">
                              Use os botões de envio rápido abaixo para notificar a recepção ou sala instantaneamente.
                            </p>
                          </div>
                        ) : (
                          mensagens.map((msg) => {
                            const isMine = msg.remetenteId === usuarioIdLogado;
                            return (
                              <div
                                key={msg.id}
                                className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
                              >
                                <div
                                  className={`max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed ${
                                    isMine
                                      ? "gradient-primary text-white rounded-br-none shadow-md"
                                      : "bg-muted text-foreground rounded-bl-none border border-border"
                                  }`}
                                >
                                  <p className="whitespace-pre-wrap">{msg.conteudo}</p>
                                  <div
                                    className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                                      isMine ? "text-white/70" : "text-muted-foreground"
                                    }`}
                                  >
                                    <span>
                                      {new Date(msg.criadoEm).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                    {isMine && (
                                      msg.lida ? (
                                        <CheckCheck className="h-3 w-3 text-cyan-200" />
                                      ) : (
                                        <Check className="h-3 w-3" />
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}

                        {digitandoOutro && (
                          <div className="flex items-center gap-1.5 text-xs text-purple-400 italic">
                            <span className="animate-pulse">●</span> {contatoSelecionado.nome} está digitando...
                          </div>
                        )}

                        <div ref={messagesEndRef} />
                      </div>

                      {/* Barra de Frases Rápidas (Atalhos da Recepção / Sala) */}
                      <div
                        className="px-3 py-2 border-t flex items-center gap-1.5 overflow-x-auto bg-muted/10 no-scrollbar shrink-0"
                        style={{ borderColor: "hsl(var(--border))" }}
                      >
                        {frasesRapidas.map((frase, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleEnviarMensagem(frase)}
                            className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 hover:text-purple-200 border border-purple-500/20 whitespace-nowrap cursor-pointer transition-all shrink-0"
                          >
                            {frase}
                          </button>
                        ))}
                      </div>

                      {/* Caixa de Entrada de Texto */}
                      <div
                        className="p-3 border-t shrink-0 flex items-center gap-2 bg-card"
                        style={{ borderColor: "hsl(var(--border))" }}
                      >
                        <input
                          type="text"
                          placeholder={`Mensagem para ${contatoSelecionado.nome}...`}
                          value={novaMensagem}
                          onChange={(e) => setNovaMensagem(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleEnviarMensagem();
                            }
                          }}
                          className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-muted border border-border outline-none focus:border-purple-500 text-foreground placeholder:text-muted-foreground"
                        />

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEnviarMensagem()}
                          disabled={!novaMensagem.trim()}
                          className="p-2.5 rounded-xl gradient-primary text-white disabled:opacity-50 cursor-pointer shadow-md"
                        >
                          <Send className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
                      <div className="w-16 h-16 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center">
                        <MessageSquare className="h-8 w-8" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground">
                          Selecione um contato ao lado
                        </h4>
                        <p className="text-xs text-muted-foreground max-w-xs mt-1">
                          Conecte-se diretamente com a Recepção, salas de atendimento e profissionais da clínica.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
