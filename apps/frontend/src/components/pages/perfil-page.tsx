"use client";

import { useState, useEffect } from "react";
import { User, Lock, Mail, Shield, CheckCircle, AlertTriangle, Eye, EyeOff, FileText, Download } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

export function PerfilPage() {
  const [activeTab, setActiveTab] = useState<"dados" | "senha" | "holerites">("dados");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  // Form personal data state
  const [nome, setNome] = useState("");
  const [foto, setFoto] = useState("");
  
  // Form password state
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  
  // Passwords visibility state
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  // My Contracheques state
  const [mySlips, setMySlips] = useState<any[]>([]);
  const [slipsLoading, setSlipsLoading] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
      setNome(res.data.nome || "");
      setFoto(res.data.foto || "");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar os dados do seu perfil.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMySlips = async () => {
    setSlipsLoading(true);
    try {
      const res = await api.get("/financeiro/meus-contracheques");
      setMySlips(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar seus contracheques.");
    } finally {
      setSlipsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (activeTab === "holerites") {
      fetchMySlips();
    }
  }, [activeTab]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      toast.error("O nome é obrigatório.");
      return;
    }
    
    try {
      await api.put(`/usuarios/${user.id}`, { nome, foto });
      
      localStorage.setItem("userName", nome);
      if (foto) {
        localStorage.setItem("userFoto", foto);
      } else {
        localStorage.removeItem("userFoto");
      }
      
      toast.success("Dados do perfil atualizados com sucesso!");
      setUser((prev: any) => ({ ...prev, nome, foto }));
      
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("storage"));
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Erro ao atualizar dados do perfil.");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!novaSenha) {
      toast.error("A nova senha é obrigatória.");
      return;
    }
    
    if (novaSenha !== confirmarSenha) {
      toast.error("A nova senha e a confirmação não coincidem.");
      return;
    }

    if (novaSenha.length < 6) {
      toast.error("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      await api.put(`/usuarios/${user.id}/senha`, { novaSenha });
      toast.success("Senha alterada com sucesso!");
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Erro ao alterar a senha.");
    }
  };

  // Helper parser for detailed holerite parameters
  const parseHoleriteDetails = (obs: string, valorLiquido: number) => {
    if (!obs || !obs.includes("Holerite Detalhado:")) {
      return { proventos: [], descontos: [] };
    }
    const detailPart = obs.split("Holerite Detalhado:")[1].split(". Chave Pix:")[0];
    const items = detailPart.split(" | ");
    
    const proventos: any[] = [];
    const descontos: any[] = [];
    
    items.forEach(item => {
      const parts = item.split(": ");
      if (parts.length === 2) {
        const label = parts[0];
        const valStr = parts[1].replace("+", "").replace("-", "").replace("R$", "").replace(".", "").replace(",", ".").trim();
        const val = parseFloat(valStr) || 0;
        if (parts[1].startsWith("-")) {
          descontos.push({ label, value: val });
        } else {
          proventos.push({ label, value: val });
        }
      }
    });

    return { proventos, descontos };
  };

  const handlePrintContracheque = (l: any) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    
    let cargo = "Funcionário";
    let nome = user?.nome || "Funcionário";
    let mes = "MM/AAAA";
    
    const desc = l.descricao;
    if (desc.includes("[Folha Salarial]")) {
      const cleanDesc = desc.replace("[Folha Salarial]", "").trim();
      const parts = cleanDesc.split(" - ");
      if (parts.length >= 2) {
        cargo = parts[0].trim();
        const nameAndMonth = parts[1].split(" (");
        nome = nameAndMonth[0].trim();
        if (nameAndMonth.length >= 2) {
          mes = nameAndMonth[1].replace(")", "").trim();
        }
      }
    } else if (desc.includes("[Vale Transporte]")) {
      const cleanDesc = desc.replace("[Vale Transporte] Liberação Ref:", "").trim();
      const parts = cleanDesc.split(" - ");
      if (parts.length >= 2) {
        mes = parts[0].trim();
        nome = parts[1].trim();
        cargo = "Auxílio Vale-Transporte";
      }
    }

    const { proventos, descontos } = parseHoleriteDetails(l.observacoes, l.valor);
    
    if (proventos.length === 0 && descontos.length === 0) {
      proventos.push({ label: desc.includes("Vale") ? "Vale Transporte Liberação" : "Vencimento Base", value: l.valor });
    }

    const totalProventos = proventos.reduce((sum, p) => sum + p.value, 0);
    const totalDescontos = descontos.reduce((sum, d) => sum + d.value, 0);
    const liquido = totalProventos - totalDescontos;

    const html = `
      <html>
        <head>
          <title>Contracheque - ${nome}</title>
          <style>
            body { font-family: monospace; padding: 20px; color: #000; font-size: 12px; }
            .border-box { border: 2px solid #000; padding: 15px; max-width: 800px; margin: auto; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 10px; }
            .col { flex: 1; }
            .col-r { text-align: right; }
            .bold { font-weight: bold; }
            .section { border-bottom: 1px solid #000; padding: 5px 0; margin-bottom: 5px; }
            .grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 5px; border-bottom: 1px solid #000; padding-bottom: 5px; }
            .grid-head { font-weight: bold; border-bottom: 2px solid #000; padding-bottom: 2px; }
            .grid-row { padding: 4px 0; }
            .totals { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 5px; font-weight: bold; padding-top: 5px; border-top: 1px solid #000; }
            .footer { margin-top: 30px; display: flex; justify-content: space-between; }
            .sign-area { border-top: 1px solid #000; width: 220px; text-align: center; margin-top: 40px; padding-top: 5px; }
          </style>
        </head>
        <body>
          <div class="border-box">
            <div class="header">
              <div class="col">
                <div class="bold">INSTITUTO CONECTAR APOIO À APRENDIZAM LTDA</div>
                <div>CNPJ: 12.345.678/0001-99</div>
              </div>
              <div class="col col-r">
                <div class="bold">RECIBO DE PAGAMENTO DE SALÁRIO</div>
                <div>Referência: ${mes}</div>
              </div>
            </div>

            <div class="section grid-row">
              <div><span class="bold">Nome do Funcionário:</span> ${nome}</div>
              <div><span class="bold">Função/Cargo:</span> ${cargo}</div>
              <div><span class="bold">Identificação ID:</span> ${l.id.substring(0, 8)}</div>
            </div>

            <div class="grid grid-head">
              <div>Descrição do Evento</div>
              <div style="text-align: right;">Proventos (+)</div>
              <div style="text-align: right;">Descontos (-)</div>
            </div>

            ${proventos.map(p => `
              <div class="grid grid-row">
                <div>${p.label}</div>
                <div style="text-align: right;">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.value)}</div>
                <div style="text-align: right;">—</div>
              </div>
            `).join("")}

            ${descontos.map(d => `
              <div class="grid grid-row">
                <div>${d.label}</div>
                <div style="text-align: right;">—</div>
                <div style="text-align: right;">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(d.value)}</div>
              </div>
            `).join("")}

            <div style="height: 40px;"></div>

            <div class="totals">
              <div>Totais Consolidados</div>
              <div style="text-align: right;">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalProventos)}</div>
              <div style="text-align: right;">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalDescontos)}</div>
            </div>

            <div class="totals" style="border-top: 2px solid #000; margin-top: 5px; padding-top: 5px; font-size: 14px;">
              <div>VALOR LÍQUIDO RECEBIDO:</div>
              <div style="grid-column: span 2; text-align: right;" class="bold">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(liquido)}</div>
            </div>

            <div class="footer">
              <div class="sign-area">Assinatura do Funcionário</div>
              <div class="sign-area">Instituto Conectar</div>
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;
    
    printWindow.document.write(html);
    printWindow.document.close();
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-violet-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "hsl(var(--foreground))" }}>
          Meu Perfil
        </h1>
        <p className="text-sm text-muted-foreground">
          Gerencie suas informações cadastrais, foto de avatar, segurança e consulte seus contracheques de pagamento.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Card: Summary & Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <div 
            className="p-6 rounded-2xl border bg-card flex flex-col items-center text-center gap-4"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            {/* Avatar container */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-violet-500/10 border-2 border-violet-500 flex items-center justify-center text-2xl font-bold text-violet-400">
                {foto ? (
                  <img src={foto} alt={user?.nome} className="w-full h-full object-cover" />
                ) : (
                  user?.nome?.substring(0, 2).toUpperCase() || "ME"
                )}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-sm text-foreground">{user?.nome}</h3>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-violet-500/10 text-violet-400 border border-violet-500/20 mt-1">
                <Shield className="h-3 w-3" /> {user?.perfil}
              </span>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab("dados")}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer text-left",
                activeTab === "dados"
                  ? "gradient-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              <User className="h-4 w-4 shrink-0" />
              <span>Dados Pessoais</span>
            </button>

            <button
              onClick={() => setActiveTab("senha")}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer text-left",
                activeTab === "senha"
                  ? "gradient-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              <Lock className="h-4 w-4 shrink-0" />
              <span>Alterar Senha</span>
            </button>

            <button
              onClick={() => setActiveTab("holerites")}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer text-left",
                activeTab === "holerites"
                  ? "gradient-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              <FileText className="h-4 w-4 shrink-0" />
              <span>Meus Contracheques</span>
            </button>
          </div>
        </div>

        {/* Right Card: Content Form */}
        <div className="md:col-span-3">
          <div 
            className="p-6 rounded-2xl border bg-card text-xs space-y-6"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            {activeTab === "dados" && (
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="border-b border-[hsl(var(--border))] pb-3">
                  <h3 className="text-sm font-bold text-foreground">Informações Cadastrais</h3>
                  <p className="text-[10px] text-muted-foreground">Atualize seus dados básicos que aparecem no sistema.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 col-span-2 md:col-span-1">
                    <label className="text-xs font-semibold text-muted-foreground">Nome Completo</label>
                    <input
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="w-full p-2.5 rounded-xl border outline-none bg-background text-foreground"
                      placeholder="Seu nome"
                    />
                  </div>

                  <div className="space-y-1.5 col-span-2 md:col-span-1">
                    <label className="text-xs font-semibold text-muted-foreground">E-mail (Login)</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <input
                        type="email"
                        value={user?.email}
                        disabled
                        className="w-full pl-9 p-2.5 rounded-xl border outline-none bg-muted text-muted-foreground cursor-not-allowed"
                        placeholder="seuemail@conectar.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 col-span-2">
                    <label className="text-xs font-semibold text-muted-foreground">Link da Foto de Perfil</label>
                    <input
                      type="text"
                      value={foto}
                      onChange={(e) => setFoto(e.target.value)}
                      className="w-full p-2.5 rounded-xl border outline-none bg-background text-foreground"
                      placeholder="https://exemplo.com/sua-foto.jpg"
                    />
                    <p className="text-[9px] text-muted-foreground">Insira uma URL pública válida de imagem para atualizar o seu avatar.</p>
                  </div>
                </div>

                <div className="pt-4 border-t flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </form>
            )}

            {activeTab === "senha" && (
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div className="border-b border-[hsl(var(--border))] pb-3">
                  <h3 className="text-sm font-bold text-foreground">Alteração de Senha</h3>
                  <p className="text-[10px] text-muted-foreground">Mantenha sua senha forte para proteger o acesso à clínica.</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Nova Senha</label>
                      <div className="relative">
                        <input
                          type={showNovaSenha ? "text" : "password"}
                          value={novaSenha}
                          onChange={(e) => setNovaSenha(e.target.value)}
                          className="w-full p-2.5 pr-10 rounded-xl border outline-none bg-background text-foreground"
                          placeholder="Mínimo 6 caracteres"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNovaSenha(!showNovaSenha)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          {showNovaSenha ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Confirmar Nova Senha</label>
                      <div className="relative">
                        <input
                          type={showConfirmarSenha ? "text" : "password"}
                          value={confirmarSenha}
                          onChange={(e) => setConfirmarSenha(e.target.value)}
                          className="w-full p-2.5 pr-10 rounded-xl border outline-none bg-background text-foreground"
                          placeholder="Repita a nova senha"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          {showConfirmarSenha ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer"
                  >
                    Redefinir Senha
                  </button>
                </div>
              </form>
            )}

            {activeTab === "holerites" && (
              <div className="space-y-6">
                <div className="border-b border-[hsl(var(--border))] pb-3">
                  <h3 className="text-sm font-bold text-foreground">Meus Holerites & Contracheques</h3>
                  <p className="text-[10px] text-muted-foreground">Veja a lista e emita a impressão do seu recibo de pagamento salarial.</p>
                </div>

                {slipsLoading ? (
                  <div className="flex h-32 items-center justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-violet-600 border-t-transparent" />
                  </div>
                ) : mySlips.length === 0 ? (
                  <div className="p-8 text-center text-zinc-500 italic border rounded-xl border-dashed">
                    Nenhum contracheque localizado no seu nome até o momento.
                  </div>
                ) : (
                  <div className="overflow-hidden border rounded-xl bg-background" style={{ borderColor: "hsl(var(--border))" }}>
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="bg-muted/50 border-b text-muted-foreground font-bold uppercase tracking-wider">
                          <th className="p-3">Descrição / Referência</th>
                          <th className="p-3">Valor Líquido</th>
                          <th className="p-3">Data Lançado</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {mySlips.map((l) => (
                          <tr key={l.id} className="hover:bg-muted/5 transition-colors">
                            <td className="p-3 font-bold text-foreground">{l.descricao}</td>
                            <td className="p-3 font-bold text-emerald-500">{formatCurrency(l.valor)}</td>
                            <td className="p-3 text-muted-foreground">{formatDate(l.vencimento)}</td>
                            <td className="p-3">
                              <span className={cn(
                                "px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider",
                                l.status === "PAGO" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                              )}>
                                {l.status}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => handlePrintContracheque(l)}
                                className="inline-flex items-center gap-1 py-1.5 px-3 rounded-lg border border-purple-500/20 text-purple-400 font-bold hover:bg-purple-500/10 transition-all cursor-pointer text-[10px] uppercase tracking-wider"
                              >
                                <Download className="h-3.5 w-3.5" />
                                <span>Imprimir</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
