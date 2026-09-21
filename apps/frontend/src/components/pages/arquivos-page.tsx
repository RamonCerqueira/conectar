"use client";

import { useState, useEffect, useRef } from "react";
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
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";

export function ArquivosPage() {
  const [arquivos, setArquivos] = useState<any[]>([]);
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("TODOS");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [pacienteId, setPacienteId] = useState("");
  const [nomeArq, setNomeArq] = useState("");
  const [tipo, setTipo] = useState("DOCUMENTO");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resArquivos, resPacientes] = await Promise.all([
        api.get("/arquivos"),
        api.get("/pacientes"),
      ]);

      const listaArquivos = Array.isArray(resArquivos.data) ? resArquivos.data : [];
      setArquivos(listaArquivos);

      const listaPacientes = Array.isArray(resPacientes.data)
        ? resPacientes.data
        : resPacientes.data?.data || [];
      setPacientes(listaPacientes);
      if (listaPacientes.length > 0 && !pacienteId) {
        setPacienteId(listaPacientes[0].id);
      }
    } catch (err) {
      console.error("Erro ao carregar arquivos:", err);
      toast.error("Erro ao carregar repositório de arquivos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!nomeArq) {
        // Sugere o nome sem a extensão
        setNomeArq(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Por favor, selecione um arquivo para upload.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("nome", nomeArq || selectedFile.name);
      formData.append("tipo", tipo);
      if (pacienteId) {
        formData.append("pacienteId", pacienteId);
      }

      await api.post("/arquivos/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Arquivo enviado e armazenado com sucesso!");
      setIsModalOpen(false);
      setSelectedFile(null);
      setNomeArq("");
      setTipo("DOCUMENTO");

      // Recarrega listagem
      loadData();
    } catch (err: any) {
      console.error("Erro no upload:", err);
      toast.error(err.response?.data?.message || "Falha no envio do arquivo.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, nome: string) => {
    if (!confirm(`Deseja realmente excluir o arquivo "${nome}"?`)) {
      return;
    }

    try {
      await api.delete(`/arquivos/${id}`);
      toast.success("Arquivo excluído com sucesso.");
      setArquivos((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Erro ao excluir arquivo.");
    }
  };

  const handleDownload = (arq: any) => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5101";
    const downloadUrl = arq.caminho.startsWith("http")
      ? arq.caminho
      : `${apiBase.replace(/\/api$/, "")}${arq.caminho}`;
    window.open(downloadUrl, "_blank");
  };

  const getFileIcon = (tipoArquivo: string) => {
    switch (tipoArquivo) {
      case "VIDEO":
        return <Video className="h-5 w-5 text-pink-500" />;
      case "AUDIO":
        return <Music className="h-5 w-5 text-amber-500" />;
      case "EXAME":
        return <FileText className="h-5 w-5 text-emerald-500" />;
      case "FOTO":
        return <Image className="h-5 w-5 text-blue-500" />;
      default:
        return <FileText className="h-5 w-5 text-purple-500" />;
    }
  };

  const formatSize = (bytes: number) => {
    if (!bytes || bytes === 0) return "0 KB";
    const mb = bytes / (1024 * 1024);
    if (mb >= 1) return mb.toFixed(2) + " MB";
    return (bytes / 1024).toFixed(0) + " KB";
  };

  const filteredArquivos = arquivos.filter((a) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (a.nome?.toLowerCase() || "").includes(term) ||
      (a.paciente?.nome?.toLowerCase() || "").includes(term) ||
      (a.nomeOriginal?.toLowerCase() || "").includes(term);

    const matchesCategory = activeCategory === "TODOS" || a.tipo === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: "hsl(var(--foreground))" }}
          >
            Repositório de Arquivos & Exames
          </h1>
          <p className="text-sm text-muted-foreground">
            Armazenamento físico persistente de exames clínicos, laudos em PDF, fotos e mídias vinculadas aos pacientes.
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
            placeholder="Buscar arquivo por título, paciente ou nome original..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-sm outline-none border transition-colors bg-muted border-transparent text-foreground"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {["TODOS", "DOCUMENTO", "EXAME", "VIDEO", "AUDIO", "FOTO"].map((cat) => (
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

      {/* Loading state */}
      {loading ? (
        <div className="p-16 text-center text-sm text-muted-foreground bg-card border rounded-2xl">
          <div className="animate-spin h-6 w-6 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-3" />
          Carregando repositório de arquivos do storage...
        </div>
      ) : (
        /* Grid de Arquivos */
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
                      Paciente:{" "}
                      <strong className="text-foreground">
                        {arq.paciente?.nome || "Geral / Clínica"}
                      </strong>
                    </p>
                    <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground">
                      {arq.tipo}
                    </span>
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
                  onClick={() => handleDownload(arq)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
                  style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}
                >
                  <Download className="h-3.5 w-3.5 text-purple-500" />
                  Visualizar / Baixar
                </button>

                <button
                  onClick={() => handleDelete(arq.id, arq.nome)}
                  title="Excluir arquivo"
                  className="p-2 rounded-xl border border-red-500/10 hover:bg-red-500/10 text-red-500 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && filteredArquivos.length === 0 && (
        <div className="p-16 text-center text-sm text-muted-foreground border rounded-2xl bg-card">
          Nenhum arquivo ou exame catalogado nesta categoria. Clique em "Upload de Arquivo" para enviar o primeiro.
        </div>
      )}

      {/* ─── MODAL UPLOAD REAL ────────────────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="absolute inset-0" onClick={() => !uploading && setIsModalOpen(false)} />

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
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Armazene exames, laudos ou mídias no storage da clínica.
                  </p>
                </div>
                <button
                  onClick={() => !uploading && setIsModalOpen(false)}
                  disabled={uploading}
                  className="p-2 rounded-xl hover:bg-muted text-muted-foreground cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Paciente</label>
                  <select
                    value={pacienteId}
                    onChange={(e) => setPacienteId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border text-xs outline-none bg-muted border-transparent text-foreground"
                  >
                    <option value="">Arquivo Geral da Clínica (Sem paciente)</option>
                    {pacientes.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Nome de Exibição</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Laudo Neurológico 2026"
                      value={nomeArq}
                      onChange={(e) => setNomeArq(e.target.value)}
                      className="w-full p-2.5 rounded-xl border text-xs outline-none bg-muted border-transparent text-foreground"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Tipo de Arquivo</label>
                    <select
                      value={tipo}
                      onChange={(e) => setTipo(e.target.value)}
                      className="w-full p-2.5 rounded-xl border text-xs bg-muted border-transparent text-foreground outline-none"
                    >
                      <option value="DOCUMENTO">Documento / Laudo</option>
                      <option value="EXAME">Exame Clínico</option>
                      <option value="VIDEO">Vídeo de Sessão</option>
                      <option value="AUDIO">Áudio de Sessão</option>
                      <option value="FOTO">Foto / Imagem</option>
                      <option value="CONTRATO">Contrato Assinado</option>
                    </select>
                  </div>
                </div>

                {/* File picker */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Arquivo Físico</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors",
                      selectedFile
                        ? "border-purple-500 bg-purple-500/5"
                        : "border-border hover:bg-muted/30"
                    )}
                  >
                    <Upload className="h-8 w-8 text-purple-500 mb-2" />
                    {selectedFile ? (
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-foreground block truncate max-w-[280px]">
                          {selectedFile.name}
                        </span>
                        <span className="text-[10px] text-purple-600 font-semibold block">
                          {formatSize(selectedFile.size)} · Pronto para envio
                        </span>
                      </div>
                    ) : (
                      <>
                        <span className="text-xs font-semibold text-foreground">
                          Clique para escolher o arquivo
                        </span>
                        <span className="text-[10px] text-muted-foreground mt-0.5">
                          PDF, MP3, MP4, JPEG, PNG (até 50MB)
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t flex justify-end gap-3">
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={uploading || !selectedFile}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer disabled:opacity-50 flex items-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <span>Salvar Arquivo</span>
                    )}
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
