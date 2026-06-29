"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Shield,
  Building,
  Key,
  Database,
  Lock,
  Eye,
  CheckCircle,
  Plus,
  Trash2,
  LockKeyhole,
  CheckSquare,
  Square
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface RoleRules {
  [role: string]: string[];
}

const defaultRoles = [
  "ADMINISTRADOR",
  "DIRETOR",
  "COORDENADOR",
  "RECEPCAO",
  "FINANCEIRO",
  "PSICOLOGO",
  "PSICOPEDAGOGO",
  "NEUROPSICÓLOGO",
  "FONOAUDIOLOGO",
  "TERAPEUTA_OCUPACIONAL",
  "PEDAGOGO",
  "SUPERVISOR",
  "PAIS"
];

const availableMenus = [
  "Dashboard",
  "Agenda",
  "Ponto Eletrônico",
  "Pacientes",
  "Prontuário Clínico",
  "Profissionais",
  "Colaboradores",
  "Salas",
  "Controle Escolar",
  "Lista de Espera",
  "Financeiro",
  "Contratos",
  "Arquivos",
  "Relatórios",
  "Comunicação",
  "IA Conectar",
  "Configurações"
];

const initialDefaultRules: RoleRules = {
  ADMINISTRADOR: [...availableMenus],
  DIRETOR: [...availableMenus],
  COORDENADOR: [
    "Dashboard",
    "Agenda",
    "Ponto Eletrônico",
    "Pacientes",
    "Prontuário Clínico",
    "Profissionais",
    "Salas",
    "Controle Escolar",
    "Lista de Espera",
    "Contratos",
    "Arquivos",
    "Relatórios",
    "Comunicação",
    "IA Conectar"
  ],
  RECEPCAO: [
    "Dashboard",
    "Agenda",
    "Ponto Eletrônico",
    "Pacientes",
    "Salas",
    "Lista de Espera",
    "Comunicação"
  ],
  FINANCEIRO: [
    "Dashboard",
    "Financeiro",
    "Contratos",
    "Arquivos"
  ],
  PSICOLOGO: [
    "Dashboard",
    "Agenda",
    "Ponto Eletrônico",
    "Pacientes",
    "Prontuário Clínico",
    "IA Conectar"
  ],
  PSICOPEDAGOGO: [
    "Dashboard",
    "Agenda",
    "Ponto Eletrônico",
    "Pacientes",
    "Prontuário Clínico",
    "IA Conectar"
  ],
  NEUROPSICÓLOGO: [
    "Dashboard",
    "Agenda",
    "Ponto Eletrônico",
    "Pacientes",
    "Prontuário Clínico",
    "IA Conectar"
  ],
  FONOAUDIOLOGO: [
    "Dashboard",
    "Agenda",
    "Ponto Eletrônico",
    "Pacientes",
    "Prontuário Clínico",
    "IA Conectar"
  ],
  TERAPEUTA_OCUPACIONAL: [
    "Dashboard",
    "Agenda",
    "Ponto Eletrônico",
    "Pacientes",
    "Prontuário Clínico",
    "IA Conectar"
  ],
  PEDAGOGO: [
    "Dashboard",
    "Agenda",
    "Ponto Eletrônico",
    "Pacientes",
    "Prontuário Clínico",
    "IA Conectar"
  ],
  SUPERVISOR: [
    "Dashboard",
    "Agenda",
    "Ponto Eletrônico",
    "Pacientes",
    "Prontuário Clínico",
    "IA Conectar"
  ],
  PAIS: [
    "Dashboard"
  ]
};

export function ConfiguracoesPage() {
  const [activeSection, setActiveSection] = useState("clinica");
  const [successMsg, setSuccessMsg] = useState("");

  // RBAC States
  const [rolesList, setRolesList] = useState<string[]>(defaultRoles);
  const [selectedRole, setSelectedRole] = useState("RECEPCAO");
  const [rbacRules, setRbacRules] = useState<RoleRules>(initialDefaultRules);
  const [newRoleName, setNewRoleName] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRules = localStorage.getItem("rbac_rules");
      const storedRoles = localStorage.getItem("rbac_roles_list");
      
      if (storedRules) {
        try {
          setRbacRules(JSON.parse(storedRules));
        } catch (e) {
          console.error(e);
        }
      } else {
        localStorage.setItem("rbac_rules", JSON.stringify(initialDefaultRules));
      }

      if (storedRoles) {
        try {
          setRolesList(JSON.parse(storedRoles));
        } catch (e) {
          console.error(e);
        }
      } else {
        localStorage.setItem("rbac_roles_list", JSON.stringify(defaultRoles));
      }
    }
  }, []);

  const handleSaveClinica = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("Configurações da clínica gravadas com sucesso!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleSaveRBAC = () => {
    localStorage.setItem("rbac_rules", JSON.stringify(rbacRules));
    localStorage.setItem("rbac_roles_list", JSON.stringify(rolesList));
    toast.success("Políticas de Acesso (RBAC) atualizadas com sucesso!");
    // Trigger update event to app sidebar
    window.dispatchEvent(new Event("storage"));
  };

  const handleTogglePermission = (menu: string) => {
    const activePerms = rbacRules[selectedRole] || [];
    let updated: string[];
    
    if (activePerms.includes(menu)) {
      updated = activePerms.filter((m) => m !== menu);
    } else {
      updated = [...activePerms, menu];
    }

    setRbacRules({
      ...rbacRules,
      [selectedRole]: updated
    });
  };

  const handleAddCustomRole = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanRoleName = newRoleName.trim().toUpperCase().replace(/ /g, "_");
    if (!cleanRoleName) return;

    if (rolesList.includes(cleanRoleName)) {
      toast.error("Este perfil já existe no sistema.");
      return;
    }

    const updatedRoles = [...rolesList, cleanRoleName];
    setRolesList(updatedRoles);
    
    setRbacRules({
      ...rbacRules,
      [cleanRoleName]: ["Dashboard"] // default starter menu
    });

    setNewRoleName("");
    setSelectedRole(cleanRoleName);
    toast.success(`Perfil ${cleanRoleName} adicionado! Defina as permissões.`);
  };

  const handleDeleteCustomRole = (roleToDelete: string) => {
    if (defaultRoles.includes(roleToDelete)) {
      toast.error("Não é possível remover perfis do sistema nativo.");
      return;
    }

    if (!confirm(`Remover perfil ${roleToDelete}?`)) return;

    const updatedRoles = rolesList.filter((r) => r !== roleToDelete);
    setRolesList(updatedRoles);

    const updatedRules = { ...rbacRules };
    delete updatedRules[roleToDelete];
    setRbacRules(updatedRules);

    setSelectedRole("RECEPCAO");
    toast.success("Perfil de usuário personalizado removido.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Configurações do Sistema
        </h1>
        <p className="text-sm text-muted-foreground">
          Gerenciamento técnico do monorepo, controle de acesso dinâmico por perfil e integrações.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navegação de Seções */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: "clinica", label: "Dados da Clínica", icon: Building },
            { id: "seguranca", label: "Perfis & Permissões (RBAC)", icon: Shield },
            { id: "integracoes", label: "APIs e Integrações", icon: Key },
            { id: "backup", label: "Backup de Dados", icon: Database },
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer text-left border-0",
                activeSection === sec.id
                  ? "gradient-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              <sec.icon className="h-4 w-4 shrink-0" />
              <span>{sec.label}</span>
            </button>
          ))}
        </div>

        {/* Formulário Central */}
        <div
          className="lg:col-span-3 p-6 rounded-2xl border bg-card space-y-6 text-xs"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          {successMsg && (
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl font-bold flex items-center gap-2">
              <CheckCircle className="h-4 w-4" /> {successMsg}
            </div>
          )}

          {/* DADOS CLINICA */}
          {activeSection === "clinica" && (
            <form onSubmit={handleSaveClinica} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-foreground">Identidade do Instituto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Razão Social</label>
                    <input
                      type="text"
                      defaultValue="Instituto Conectar Apoio à Aprendizagem LTDA"
                      className="w-full p-2.5 rounded-xl border bg-background text-foreground outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">CNPJ</label>
                    <input
                      type="text"
                      defaultValue="12.345.678/0001-99"
                      className="w-full p-2.5 rounded-xl border bg-background text-foreground outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Telefone Comercial</label>
                    <input
                      type="text"
                      defaultValue="(11) 98765-4321"
                      className="w-full p-2.5 rounded-xl border bg-background text-foreground outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">E-mail de Contato</label>
                    <input
                      type="email"
                      defaultValue="contato@institutoconectar.com.br"
                      className="w-full p-2.5 rounded-xl border bg-background text-foreground outline-none"
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl font-semibold text-white gradient-primary shadow-lg border-0 cursor-pointer text-xs"
              >
                Salvar Configurações
              </button>
            </form>
          )}

          {/* DYNAMIC RBAC CRUD */}
          {activeSection === "seguranca" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-foreground">Matriz de Perfis e Acessos (RBAC)</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Adicione novos perfis personalizados ou redefina quais menus de navegação cada nível de usuário tem permissão para visualizar.
                </p>
              </div>

              {/* CRUD: Adicionar Novo Perfil */}
              <form onSubmit={handleAddCustomRole} className="p-4 bg-muted/30 rounded-xl border flex items-end gap-3" style={{ borderColor: "hsl(var(--border))" }}>
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Nome do Novo Perfil</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: RECEPCIONISTA_JUNIOR, ESTAGIARIO, PSICOPEDAGOGO_PJ"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    className="w-full p-2 rounded-lg border bg-background text-foreground outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-lg font-bold text-white gradient-primary flex items-center gap-1.5 cursor-pointer border-0 text-[10px]"
                >
                  <Plus className="h-4 w-4" /> Adicionar Perfil
                </button>
              </form>

              {/* Seletor de Perfil Ativo para Edição */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {/* Lista de Perfis */}
                <div className="md:col-span-1 space-y-1.5 pr-2 border-r" style={{ borderColor: "hsl(var(--border))" }}>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Perfis Cadastrados</p>
                  <div className="max-h-80 overflow-y-auto space-y-1 pr-1">
                    {rolesList.map((role) => (
                      <div
                        key={role}
                        onClick={() => setSelectedRole(role)}
                        className={cn(
                          "w-full flex items-center justify-between p-2 rounded-lg text-[11px] font-semibold cursor-pointer transition-all",
                          selectedRole === role
                            ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                            : "hover:bg-muted text-muted-foreground border border-transparent"
                        )}
                      >
                        <span className="truncate">{role}</span>
                        {!defaultRoles.includes(role) && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCustomRole(role);
                            }}
                            className="p-1 hover:text-red-500 transition-colors text-muted-foreground bg-transparent border-0 cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grid de Permissões (Menus Disponíveis) */}
                <div className="md:col-span-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">
                      Menus Permitidos para <span className="text-purple-400">{selectedRole}</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
                    {availableMenus.map((menu) => {
                      const isAllowed = (rbacRules[selectedRole] || []).includes(menu);
                      return (
                        <div
                          key={menu}
                          onClick={() => handleTogglePermission(menu)}
                          className={cn(
                            "flex items-center gap-2.5 p-2 rounded-lg border cursor-pointer select-none transition-all",
                            isAllowed
                              ? "bg-purple-500/5 border-purple-500/20 text-foreground"
                              : "bg-background border-border text-muted-foreground hover:bg-muted/30"
                          )}
                        >
                          <div className={cn("shrink-0", isAllowed ? "text-purple-400" : "text-muted-foreground")}>
                            {isAllowed ? (
                              <CheckSquare className="h-4.5 w-4.5" />
                            ) : (
                              <Square className="h-4.5 w-4.5" />
                            )}
                          </div>
                          <span className="font-semibold">{menu}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Botão de Salvar Alterações RBAC */}
              <div className="pt-4 border-t flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveRBAC}
                  className="px-6 py-2.5 rounded-xl font-bold text-white gradient-primary shadow-lg cursor-pointer border-0 text-xs"
                >
                  Salvar Regras de Acesso
                </button>
              </div>
            </div>
          )}

          {/* APIS E INTEGRACOES */}
          {activeSection === "integracoes" && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-foreground">Chaves e Credenciais de APIs</h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Google Gemini API Key</label>
                  <input
                    type="password"
                    defaultValue="AIzaSyA1234567890-ExampleKey"
                    className="w-full p-2.5 rounded-xl border bg-background text-foreground outline-none"
                  />
                  <p className="text-[10px] text-muted-foreground">Chave de API necessária para rodar sugestões de planos terapêuticos e resumos clínicos.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Servidor WhatsApp Microservice URL</label>
                  <input
                    type="text"
                    defaultValue="http://localhost:8002"
                    className="w-full p-2.5 rounded-xl border bg-background text-foreground outline-none"
                  />
                  <p className="text-[10px] text-muted-foreground">Endpoints do microserviço de gatilhos automáticos do WhatsApp Web.</p>
                </div>
              </div>
            </div>
          )}

          {/* BACKUP */}
          {activeSection === "backup" && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-foreground">Backups Automáticos</h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Frequência do pg_dump</label>
                  <select className="w-full p-2.5 rounded-xl border bg-background text-foreground outline-none">
                    <option>Diário (Às 03:00 da manhã)</option>
                    <option>Semanal (Domingos)</option>
                    <option>Mensal</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Retenção de Arquivos de Backup</label>
                  <select className="w-full p-2.5 rounded-xl border bg-background text-foreground outline-none">
                    <option>Manter últimos 30 backups</option>
                    <option>Manter últimos 15 backups</option>
                    <option>Manter todos</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
