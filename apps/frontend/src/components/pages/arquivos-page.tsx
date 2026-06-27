"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Plus,
  X,
  Search,
  FileText,
  Video,
  Music,
  Image,
  FolderOpen,
  Upload,
  Trash2,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

// ─── DADOS MOCKADOS COMPLETOS ───────────────────────────────────────────────
const initialArquivos = [
  {
    id: "arq-1",
    pacienteNome: "Lucas Mendes da Silva",
    nome: "Exame Eletroencefalograma.pdf",
    tipo: "EXAME" as const,
    mimeType: "application/pdf",
    tamanho: 2450000, // 2.45 MB
    criadoEm: "2026-02-15",
  },
  {
    id: "arq-2",
    pacienteNome: "Lucas Mendes da Silva",
    nome: "Relatório de Avaliação Psicopedagógica.pdf",
    tipo: "DOCUMENTO" as const,
    mimeType: "application/pdf",
    tamanho: 1200000, // 1.2 MB
    criadoEm: "2026-03-20",
  },
  {
    id: "arq-3",
    pacienteNome: "Sofia Andrade Rezende",
    nome: "Video de Interação Social.mp4",
    tipo: "VIDEO" as const,
    mimeType: "video/mp4",
    tamanho: 15400000, // 15.4 MB
    criadoEm: "2026-06-12",
  },
  {
    id: "arq-4",
    pacienteNome: "Sofia Andrade Rezende",
    nome: "Audio de Fala e Pronúncia.mp3",
    tipo: "AUDIO" as const,
    mimeType: "audio/mpeg",
    tamanho: 4200000, // 4.2 MB
    criadoEm: "2026-06-25",
  },
];

export function ArquivosPage() {
  const [arquivos, setArquivos] = useState(initialArquivos);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("TODOS");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [paciente, setPaciente] = useState("");
  const [nomeArq, setNomeArq] = useState("");
  const [tipo, setTipo] = useState("DOCUMENTO");

  const handleCreateArquivo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paciente || !nomeArq) return;

    const newArq = {
      id: `arq-${Date.now()}`,
      pacienteNome: paciente,
      nome: nomeArq,
      tipo: tipo as any,
      mimeType: tipo === "VIDEO" ? "video/mp4" : tipo === "AUDIO" ? "audio/mpeg" : "application/pdf",
      tamanho: 2500000,
      criadoEm: new Date().toISOString().split("T")[0],
    };

    setArquivos([newArq, ...arquivos]);
    setIsModalOpen(false);
    setPaciente("");
    setNomeArq("");
  };

  const handleDelete = (id: string) => {
    setArquivos(arquivos.filter((a) => a.id !== id));
  };

  const getFileIcon = (tipo: typeof initialArquivos[0]["tipo"]) => {
    switch (tipo) {
      case "VIDEO":
        return <Video className="h-5 w-5 text-pink-500" />;
      case "AUDIO":
        return <Music className="h-5 w-5 text-amber-500" />;
      case "EXAME":
        return <FileText className="h-5 w-5 text-emerald-500" />;
      default:
        return <FileText className="h-5 w-5 text-purple-500" />;
    }
  };

  const formatSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const filteredArquivos = arquivos.filter((a) => {
    const matchesSearch =
      a.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.pacienteNome.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = activeCategory === "TODOS" || a.tipo === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "hsl(var(--foreground))" }}>
            Repositório de Arquivos & Exames
          </h1>
          <p className="text-sm text-muted-foreground">
            Armazenamento de exames clínicos, relatórios em PDF, áudios/vídeos de sessões vinculados às crianças.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Upload de Arquivo</span>
        </motion.button>
      </div>

      {/* Filtros */}
      <div
        className="p-4 rounded-2xl border flex flex-col md:flex-row gap-4 bg-card"
        style={{ borderColor: "hsl(var(--border))" }}
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar arquivo por nome ou paciente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-sm outline-none border transition-colors bg-muted border-transparent text-foreground"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {["TODOS", "DOCUMENTO", "EXAME", "VIDEO", "AUDIO"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer",
                activeCategory === cat
                  ? "gradient-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {cat === "TODOS" ? "Todos" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Arquivos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArquivos.map((arq) => (
          <motion.div
            layout
            key={arq.id}
            whileHover={{ y: -4 }}
            className="rounded-2xl border p-5 flex flex-col justify-between relative overflow-hidden transition-all shadow-sm bg-card"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-xl bg-muted shrink-0">
                  {getFileIcon(arq.tipo)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-sm text-foreground leading-tight break-all">
                    {arq.nome}
                  </h3>
                  <p className="text-[10px] text-muted-foreground mt-1 truncate">
                    Paciente: {arq.pacienteNome}
                  </p>
                </div>
              </div>

              <div className="h-[1px] bg-border" />

              <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                <span>Criado em: {formatDate(arq.criadoEm)}</span>
                <span className="font-semibold text-foreground">{formatSize(arq.tamanho)}</span>
              </div>
            </div>

            <div className="h-[1px] bg-border my-4" />

            {/* Ações */}
            <div className="flex gap-2">
              <button
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
                style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}
              >
                <Download className="h-3.5 w-3.5 text-purple-500" />
                Baixar
              </button>

              <button
                onClick={() => handleDelete(arq.id)}
                className="p-2 rounded-xl border border-red-500/10 hover:bg-red-500/10 text-red-500 transition-colors cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}

        {filteredArquivos.length === 0 && (
          <div className="col-span-full py-12 text-center text-xs text-muted-foreground">
            Nenhum arquivo ou exame catalogado nesta categoria.
          </div>
        )}
      </div>

      {/* ─── MODAL UPLOAD ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden bg-card"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              {/* Header */}
              <div className="p-6 border-b flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-foreground">Upload de Arquivo Clínico</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Armazene exames ou relatórios de intervenções.</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl hover:bg-muted text-muted-foreground cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleCreateArquivo} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Paciente</label>
                  <input
                    type="text"
                    required
                    placeholder="Nome completo do paciente"
                    value={paciente}
                    onChange={(e) => setPaciente(e.target.value)}
                    className="w-full p-2.5 rounded-xl border text-xs outline-none focus:ring-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Nome do Arquivo</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Laudo Neurológico"
                      value={nomeArq}
                      onChange={(e) => setNomeArq(e.target.value)}
                      className="w-full p-2.5 rounded-xl border text-xs outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Tipo de Arquivo</label>
                    <select
                      value={tipo}
                      onChange={(e) => setTipo(e.target.value)}
                      className="w-full p-2.5 rounded-xl border text-xs bg-card outline-none"
                    >
                      <option value="DOCUMENTO">Documento / Laudo</option>
                      <option value="EXAME">Exame Clínico</option>
                      <option value="VIDEO">Vídeo de Sessão</option>
                      <option value="AUDIO">Áudio de Sessão</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Arraste e solte o arquivo</label>
                  <div className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/30 transition-colors">
                    <Upload className="h-8 w-8 text-purple-500 mb-2" />
                    <span className="text-xs font-semibold text-foreground">Clique para fazer upload</span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">Arquivos PDF, MP3, MP4, JPEG</span>
                  </div>
                </div>

                <div className="pt-4 border-t flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer"
                  >
                    Salvar Arquivo
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
