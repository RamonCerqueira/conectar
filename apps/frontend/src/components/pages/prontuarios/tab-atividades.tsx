"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Video,
  Gamepad2,
  CheckSquare,
  FileDown,
  Play,
  X,
  CheckCircle,
  Eye,
  Trash2,
  UploadCloud,
  Search,
  HardDrive,
  Database,
  Lock,
  Unlock,
  AlertCircle
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface TabAtividadesProps {
  paciente: any;
  recursos: any[];
  setRecursos: React.Dispatch<React.SetStateAction<any[]>>;
  isNewRecursoModalOpen: boolean;
  setIsNewRecursoModalOpen: (open: boolean) => void;
}

type MediaTabType = "TODOS" | "PDF" | "VIDEO" | "JOGO" | "QUIZ";

export function TabAtividades({
  paciente,
  recursos,
  setRecursos,
  isNewRecursoModalOpen,
  setIsNewRecursoModalOpen,
}: TabAtividadesProps) {
  // Filter recursos for current patient
  const filteredRecursos = recursos.filter((r) => r.pacienteId === paciente.id);

  // States
  const [selectedCategory, setSelectedCategory] = useState<MediaTabType>("TODOS");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Interactive Previews State
  const [previewMedia, setPreviewMedia] = useState<any | null>(null);

  // Form States - Novo Recurso
  const [recTitulo, setRecTitulo] = useState("");
  const [recTipo, setRecTipo] = useState("PDF");
  const [recDescricao, setRecDescricao] = useState("");
  const [recUrl, setRecUrl] = useState("");
  const [recCompartilhado, setRecCompartilhado] = useState(true);

  // Mock Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFileName, setUploadedFileName] = useState("");

  const handleCreateRecurso = (e: React.FormEvent) => {
    e.preventDefault();
    const newRec = {
      id: `rec-${Date.now()}`,
      pacienteId: paciente.id,
      titulo: recTitulo,
      tipo: recTipo,
      descricao: recDescricao,
      url: recUrl || "#",
      dataCriacao: new Date().toISOString().split("T")[0],
      compartilhado: recCompartilhado,
      tamanho: recTipo === "PDF" ? "2.1 MB" : undefined,
      duracao: recTipo === "VIDEO" ? "05:15" : undefined,
      plataforma: recTipo === "JOGO" ? "Wordwall" : undefined,
      respostasPai: null,
      perguntas: recTipo === "QUIZ" ? [
        { id: "q1", texto: "Como estava o nível de foco do paciente hoje?", opcoes: ["Muito Baixo", "Regular", "Bom", "Excelente"] },
        { id: "q2", texto: "Conseguiu realizar as atividades propostas?", opcoes: ["Não conseguiu", "Com muita ajuda", "Com pouca ajuda", "Sozinho"] },
        { id: "q3", texto: "Nível de regulação emocional e comportamental:", opcoes: ["Desregulado", "Instável", "Estável", "Muito Calmo"] }
      ] : undefined
    };

    setRecursos([newRec, ...recursos]);
    setIsNewRecursoModalOpen(false);
    
    // Reset Form
    setRecTitulo("");
    setRecDescricao("");
    setRecUrl("");
    setRecTipo("PDF");
    setRecCompartilhado(true);
    setUploadedFileName("");
    setUploadProgress(0);
    toast.success("Recurso / Mídia adicionado com sucesso!");
  };

  const handleDeleteRecurso = (id: string, titulo: string) => {
    setRecursos(recursos.filter((r) => r.id !== id));
    toast.success(`Mídia "${titulo}" excluída com sucesso!`);
    if (previewMedia && previewMedia.id === id) {
      setPreviewMedia(null);
    }
  };

  const handleToggleShare = (id: string, currentlyShared: boolean) => {
    setRecursos(
      recursos.map((r) => (r.id === id ? { ...r, compartilhado: !r.compartilhado } : r))
    );
    toast.success(
      currentlyShared
        ? "Mídia ocultada do aplicativo da família."
        : "Mídia publicada no Portal da Família com sucesso!"
    );
  };

  // Drag and drop mock handler
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropFile = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      setUploadedFileName(file.name);
      setRecTitulo(file.name.split(".").slice(0, -1).join(" "));
      
      // Select appropriate type by file extension
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext === "pdf") setRecTipo("PDF");
      else if (ext === "mp4" || ext === "avi" || ext === "mkv") setRecTipo("VIDEO");
      
      // Simulate progress bar upload
      setIsUploading(true);
      setUploadProgress(0);
      const timer = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setIsUploading(false);
            toast.success("Arquivo pré-carregado com sucesso!");
            return 100;
          }
          return prev + 25;
        });
      }, 200);
    }
  };

  // Calculations for Stats
  const totalMedia = filteredRecursos.length;
  const sharedMedia = filteredRecursos.filter((r) => r.compartilhado).length;
  const answeredFeedbacks = filteredRecursos.filter((r) => r.respostasPai).length;
  
  // Calculate mock storage size
  const mockStorageUsed = (filteredRecursos.reduce((acc, r) => {
    if (r.tipo === "PDF") return acc + 2.1;
    if (r.tipo === "VIDEO") return acc + 15.4;
    return acc + 0.1;
  }, 0)).toFixed(1);

  // Filters application
  const searchFilteredRecursos = filteredRecursos.filter((rec) => {
    const matchesSearch =
      rec.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.descricao.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "TODOS" || rec.tipo === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Internal Tabs List
  const tabCategories = [
    { id: "TODOS", label: "Todos os Arquivos" },
    { id: "PDF", label: "Laudos & PDFs" },
    { id: "VIDEO", label: "Vídeos & Exercícios" },
    { id: "JOGO", label: "Jogos Lúdicos" },
    { id: "QUIZ", label: "Quizzes & Feedback" },
  ] as const;

  return (
    <div className="space-y-6 text-xs text-left animate-in fade-in duration-200">
      
      {/* ─── INDICATORS ROW (DASHBOARD HIGHLIGHTS) ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl border bg-card border-border shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Total de Mídias</p>
            <p className="text-lg font-extrabold text-foreground mt-0.5">{totalMedia} Recursos</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl border bg-card border-border shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Compartilhados</p>
            <p className="text-lg font-extrabold text-foreground mt-0.5">{sharedMedia} Ativos</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl border bg-card border-border shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <CheckSquare className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Feedbacks / Quizzes</p>
            <p className="text-lg font-extrabold text-foreground mt-0.5">{answeredFeedbacks} Respondidos</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl border bg-card border-border shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <HardDrive className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Espaço em Nuvem</p>
            <p className="text-lg font-extrabold text-foreground mt-0.5">{mockStorageUsed} MB usados</p>
          </div>
        </div>

      </div>

      {/* ─── FILTERS & SEARCH TOOLBAR ─── */}
      <div className="p-4 rounded-2xl border bg-card border-border flex flex-col md:flex-row gap-4 justify-between items-center shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por título ou orientação de uso..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border bg-background text-foreground border-border outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        <div className="flex gap-1.5 w-full md:w-auto overflow-x-auto scrollbar-none">
          {tabCategories.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all border-0",
                selectedCategory === tab.id
                  ? "gradient-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── MEDIA CARDS GRID ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {searchFilteredRecursos.map((rec) => {
          const isShared = rec.compartilhado;
          return (
            <motion.div
              layout
              key={rec.id}
              className={cn(
                "p-5 rounded-2xl border bg-card flex flex-col justify-between gap-4 transition-all shadow-xs hover:shadow-md relative",
                isShared ? "border-purple-500/30 shadow-purple-500/[0.01]" : "border-border"
              )}
            >
              {/* Badge share status */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5">
                <span className={cn(
                  "text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border",
                  isShared 
                    ? "bg-purple-500/10 text-purple-600 border-purple-500/20" 
                    : "bg-neutral-500/10 text-neutral-500 border-neutral-500/20"
                )}>
                  {isShared ? "Publicado" : "Rascunho"}
                </span>
              </div>

              {/* Resource Meta Info */}
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="p-3 rounded-xl bg-muted text-purple-600 dark:text-purple-400 shrink-0 flex items-center justify-center">
                    {rec.tipo === "PDF" && <FileText className="h-5 w-5" />}
                    {rec.tipo === "VIDEO" && <Video className="h-5 w-5" />}
                    {rec.tipo === "JOGO" && <Gamepad2 className="h-5 w-5" />}
                    {rec.tipo === "QUIZ" && <CheckSquare className="h-5 w-5" />}
                  </div>
                  <div className="min-w-0 pr-12">
                    <h5 className="font-extrabold text-foreground truncate" title={rec.titulo}>{rec.titulo}</h5>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Criado em: {formatDate(rec.dataCriacao)}</p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 min-h-[48px]">
                  {rec.descricao || "Sem observações de uso cadastradas para este recurso."}
                </p>

                {/* Sub-item specific metadata indicators */}
                <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground pt-1.5">
                  <span className="font-bold bg-muted px-1.5 py-0.5 rounded uppercase tracking-wider text-[8px]">
                    {rec.tipo}
                  </span>
                  {rec.tamanho && <span>• {rec.tamanho}</span>}
                  {rec.duracao && <span>• Duração: {rec.duracao}</span>}
                  {rec.plataforma && <span>• Plataforma: {rec.plataforma}</span>}
                </div>

                {/* Quiz results preview */}
                {rec.tipo === "QUIZ" && rec.respostasPai && (
                  <div className="p-3 rounded-xl border border-emerald-500/25 bg-emerald-500/5 space-y-1.5 mt-2">
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>Retorno Familiar Recebido</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">Clique em "Visualizar Detalhes" para ler a avaliação completa enviada pelos pais.</p>
                  </div>
                )}
              </div>

              {/* Resource Action buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setPreviewMedia(rec)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer border-border text-foreground bg-transparent"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Visualizar
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleShare(rec.id, isShared)}
                  className="px-2.5 py-1.5 rounded-lg border hover:bg-muted transition-colors cursor-pointer border-border text-muted-foreground hover:text-foreground bg-transparent"
                  title={isShared ? "Retirar do Portal da Família" : "Publicar no Portal da Família"}
                >
                  {isShared ? <Lock className="h-3.5 w-3.5 text-purple-500" /> : <Unlock className="h-3.5 w-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteRecurso(rec.id, rec.titulo)}
                  className="px-2.5 py-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/5 text-red-500 hover:text-red-600 transition-colors cursor-pointer bg-transparent"
                  title="Excluir Mídia"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}

        {searchFilteredRecursos.length === 0 && (
          <div className="p-12 text-center text-xs text-muted-foreground border rounded-2xl bg-card border-border col-span-full">
            Nenhuma mídia encontrada para este filtro. Cadastre novas mídias acima.
          </div>
        )}
      </div>

      {/* ─── MODAL: PREVIEW INLINE DETAILED DRAWER ─── */}
      <AnimatePresence>
        {previewMedia && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 text-left">
            <div className="absolute inset-0" onClick={() => setPreviewMedia(null)} />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl shadow-2xl border overflow-hidden bg-card border-border z-50 text-foreground"
            >
              <div className="p-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600">
                    {previewMedia.tipo === "PDF" && <FileText className="h-5 w-5" />}
                    {previewMedia.tipo === "VIDEO" && <Video className="h-5 w-5" />}
                    {previewMedia.tipo === "JOGO" && <Gamepad2 className="h-5 w-5" />}
                    {previewMedia.tipo === "QUIZ" && <CheckSquare className="h-5 w-5" />}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base">{previewMedia.titulo}</h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Tipo: {previewMedia.tipo} • Publicado em: {formatDate(previewMedia.dataCriacao)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewMedia(null)}
                  className="p-2 rounded-xl hover:bg-muted text-muted-foreground cursor-pointer bg-transparent border-0"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-5 flex-1">
                
                {/* 1. Description Box */}
                <div className="space-y-1.5">
                  <h6 className="font-bold text-muted-foreground uppercase text-[10px]">Recomendações e Instruções Clínicas</h6>
                  <p className="p-4 bg-muted/20 border border-border rounded-xl italic text-foreground/80 leading-relaxed">
                    "{previewMedia.descricao || "Sem notas de uso fornecidas."}"
                  </p>
                </div>

                {/* 2. Interactive Media Simulation */}
                {previewMedia.tipo === "VIDEO" && (
                  <div className="space-y-2">
                    <h6 className="font-bold text-muted-foreground uppercase text-[10px]">Pré-visualização do Reprodutor de Vídeo</h6>
                    <div className="aspect-video rounded-xl bg-black relative flex flex-col justify-between p-3 overflow-hidden border border-neutral-800">
                      <div className="absolute inset-0 flex items-center justify-center bg-purple-950/20">
                        <Play className="h-12 w-12 text-white animate-pulse bg-purple-600/70 p-3 rounded-full cursor-pointer" />
                      </div>
                      <div className="w-full flex justify-between items-center text-white text-[10px] z-10 bg-black/50 p-2 rounded-lg">
                        <span className="font-bold">Player de Vídeo Prescrito</span>
                        <span className="font-semibold text-neutral-300">{previewMedia.duracao || "03:45"}</span>
                      </div>
                      <div className="w-full space-y-1 z-10">
                        <div className="w-full h-1.5 bg-neutral-700 rounded-full overflow-hidden">
                          <div className="w-1/4 h-full bg-purple-500" />
                        </div>
                        <div className="flex justify-between items-center text-[8px] text-neutral-400">
                          <span>01:12</span>
                          <span>{previewMedia.duracao || "03:45"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {previewMedia.tipo === "PDF" && (
                  <div className="space-y-2">
                    <h6 className="font-bold text-muted-foreground uppercase text-[10px]">Documento Prescrito</h6>
                    <div className="p-6 rounded-xl border border-border bg-muted/10 flex flex-col items-center text-center justify-center space-y-3">
                      <FileText className="h-12 w-12 text-red-500/80" />
                      <div>
                        <p className="font-bold text-foreground text-sm">{previewMedia.titulo}.pdf</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{previewMedia.tamanho || "1.8 MB"} • Documento PDF</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toast.info("Simulação de download de laudo iniciada.")}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[10px] border-0 cursor-pointer transition-all"
                      >
                        <FileDown className="h-4 w-4" /> Baixar Documento
                      </button>
                    </div>
                  </div>
                )}

                {previewMedia.tipo === "JOGO" && (
                  <div className="space-y-2">
                    <h6 className="font-bold text-muted-foreground uppercase text-[10px]">Link do Jogo Integrado</h6>
                    <div className="p-5 rounded-xl border border-border bg-indigo-500/5 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Gamepad2 className="h-8 w-8 text-indigo-500" />
                        <div>
                          <p className="font-bold text-foreground">{previewMedia.plataforma || "Wordwall"}</p>
                          <p className="text-[10px] text-muted-foreground">Endereço: {previewMedia.url}</p>
                        </div>
                      </div>
                      <a
                        href={previewMedia.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] no-underline hover:text-white transition-all cursor-pointer"
                      >
                        Testar Jogo Externo
                      </a>
                    </div>
                  </div>
                )}

                {previewMedia.tipo === "QUIZ" && (
                  <div className="space-y-4">
                    {/* Questions setup */}
                    <div className="space-y-2">
                      <h6 className="font-bold text-muted-foreground uppercase text-[10px]">Estrutura de Perguntas do Questionário</h6>
                      <div className="space-y-2">
                        {previewMedia.perguntas?.map((item: any, idx: number) => (
                          <div key={item.id} className="p-3 rounded-lg border border-border bg-muted/10 space-y-1">
                            <p className="font-bold text-foreground">Q{idx + 1}: {item.texto}</p>
                            <p className="text-[10px] text-muted-foreground">Opções de resposta: {item.opcoes.join(" | ")}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Responses detail if filled */}
                    {previewMedia.respostasPai ? (
                      <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2.5">
                        <h6 className="font-bold text-emerald-600 dark:text-emerald-400 uppercase text-[10px] flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" /> Respostas da Família Recebidas
                        </h6>
                        <div className="space-y-2 pl-1.5">
                          {previewMedia.perguntas?.map((item: any) => (
                            <div key={item.id} className="border-l-2 border-emerald-500/20 pl-3 py-0.5">
                              <span className="text-muted-foreground block text-[10px]">{item.texto}</span>
                              <span className="font-bold text-foreground block text-xs mt-0.5">✓ {previewMedia.respostasPai[item.id]}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl border border-border bg-muted/30 flex items-center gap-2 text-muted-foreground justify-center py-6">
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                        <span>Aguardando preenchimento e retorno por parte da família.</span>
                      </div>
                    )}
                  </div>
                )}

              </div>

              <div className="p-5 border-t border-border bg-card flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPreviewMedia(null)}
                  className="px-4 py-2 rounded-xl border font-bold hover:bg-muted transition-colors cursor-pointer border-border text-foreground bg-transparent"
                >
                  Fechar Visualização
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL: NOVO RECURSO / UPLOAD ─── */}
      <AnimatePresence>
        {isNewRecursoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 text-left">
            <div className="absolute inset-0" onClick={() => setIsNewRecursoModalOpen(false)} />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg rounded-2xl shadow-2xl border overflow-hidden bg-card border-border z-50 text-foreground"
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-foreground">Novo Recurso / Atividade de Apoio</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Disponibilize PDFs, vídeos, jogos ou quizzes para o paciente.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewRecursoModalOpen(false)}
                  className="p-2 rounded-xl hover:bg-muted text-muted-foreground cursor-pointer bg-transparent border-0"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateRecurso} className="p-6 space-y-4">
                
                {/* Drag & Drop File Zone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Arquivo / Mídia do Recurso</label>
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDropFile}
                    className="p-6 rounded-2xl border border-dashed border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/[0.01] transition-all flex flex-col items-center text-center justify-center cursor-pointer space-y-2 bg-muted/10 relative overflow-hidden"
                  >
                    <UploadCloud className="h-8 w-8 text-purple-500" />
                    <div>
                      <p className="font-bold text-foreground text-xs">Arraste e solte o arquivo aqui</p>
                      <p className="text-[9px] text-muted-foreground mt-0.5">Ou clique para navegar nos seus documentos (Laudo PDF, Vídeos do Exercício)</p>
                    </div>

                    {isUploading && (
                      <div className="absolute inset-0 bg-card/90 flex flex-col items-center justify-center p-6 space-y-2">
                        <p className="font-bold text-[10px] text-purple-600 animate-pulse">Carregando arquivo e gerando metadados...</p>
                        <div className="w-full max-w-[200px] h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-purple-600" style={{ width: `${uploadProgress}%` }} />
                        </div>
                      </div>
                    )}

                    {uploadedFileName && !isUploading && (
                      <div className="absolute inset-0 bg-card/95 flex items-center justify-between px-6 border border-emerald-500/20">
                        <div className="flex items-center gap-2 min-w-0 text-left">
                          <FileText className="h-5 w-5 text-emerald-500 shrink-0" />
                          <div className="min-w-0">
                            <p className="font-bold text-[10px] text-foreground truncate">{uploadedFileName}</p>
                            <p className="text-[8px] text-emerald-600 font-semibold uppercase">Pronto para salvar</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setUploadedFileName("")}
                          className="p-1 rounded bg-muted hover:bg-muted/80 text-muted-foreground border-0 cursor-pointer"
                        >
                          Remover
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Título do Recurso *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Treinamento Fonológico Semanal"
                    value={recTitulo}
                    onChange={(e) => setRecTitulo(e.target.value)}
                    className="w-full p-2.5 rounded-xl border text-xs outline-none bg-background text-foreground border-border focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Tipo de Mídia / Atividade</label>
                    <select
                      value={recTipo}
                      onChange={(e) => setRecTipo(e.target.value)}
                      className="w-full p-2.5 rounded-xl border text-xs bg-background text-foreground border-border outline-none focus:ring-1 focus:ring-purple-500"
                    >
                      <option value="PDF">Arquivo / Parecer PDF</option>
                      <option value="VIDEO">Vídeo / Áudio Aula</option>
                      <option value="JOGO">Link de Jogo Educativo</option>
                      <option value="QUIZ">Quiz / Questionário Familiar</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Link externo ou URL (opcional)</label>
                    <input
                      type="text"
                      placeholder="Ex: https://wordwall.net/..."
                      value={recUrl}
                      onChange={(e) => setRecUrl(e.target.value)}
                      className="w-full p-2.5 rounded-xl border text-xs outline-none bg-background text-foreground border-border focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-muted-foreground">Orientações de Uso Clínico *</label>
                  <textarea
                    required
                    placeholder="Escreva detalhadamente as instruções de aplicação da atividade..."
                    value={recDescricao}
                    onChange={(e) => setRecDescricao(e.target.value)}
                    rows={3}
                    className="w-full p-2.5 rounded-xl border text-xs outline-none bg-background text-foreground border-border focus:ring-1 focus:ring-purple-500 resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2 text-left">
                  <input
                    type="checkbox"
                    id="compartilhado"
                    checked={recCompartilhado}
                    onChange={(e) => setRecCompartilhado(e.target.checked)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-border rounded"
                  />
                  <label htmlFor="compartilhado" className="text-xs font-semibold text-foreground cursor-pointer select-none">
                    Compartilhar imediatamente com o Portal da Família
                  </label>
                </div>

                <div className="pt-4 border-t border-border flex justify-end gap-3 bg-card">
                  <button
                    type="button"
                    onClick={() => setIsNewRecursoModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer border-border text-foreground bg-transparent"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer border-0"
                  >
                    Salvar Recurso
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
