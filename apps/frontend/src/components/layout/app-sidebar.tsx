"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import * as Tooltip from "@radix-ui/react-tooltip";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  ClipboardList,
  Brain,
  HeartHandshake,
  DollarSign,
  BarChart3,
  FileText,
  MessageSquare,
  Clock,
  Building2,
  Stethoscope,
  BookOpen,
  Settings,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

interface NavItem {
  label: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
  children?: NavItem[];
}

const navGroups: { title: string; items: NavItem[] }[] = [
  {
    title: "Principal",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Agenda",
        href: "/agenda",
        icon: CalendarDays,
        badge: "Hoje",
        badgeColor: "bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300",
      },
    ],
  },
  {
    title: "Clínica",
    items: [
      {
        label: "Pacientes",
        href: "/pacientes",
        icon: Users,
      },
      {
        label: "Prontuário Clínico",
        href: "/prontuarios",
        icon: ClipboardList,
      },
    ],
  },
  {
    title: "Gestão",
    items: [
      {
        label: "Profissionais",
        href: "/profissionais",
        icon: Stethoscope,
      },
      {
        label: "Salas",
        href: "/salas",
        icon: Building2,
      },
      {
        label: "Controle Escolar",
        href: "/escolar",
        icon: GraduationCap,
      },
      {
        label: "Lista de Espera",
        href: "/lista-espera",
        icon: Clock,
        badge: 3,
        badgeColor: "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300",
      },
    ],
  },
  {
    title: "Financeiro",
    items: [
      {
        label: "Financeiro",
        href: "/financeiro",
        icon: DollarSign,
      },
      {
        label: "Contratos",
        href: "/contratos",
        icon: FileText,
      },
      {
        label: "Arquivos",
        href: "/arquivos",
        icon: BookOpen,
      },
    ],
  },
  {
    title: "Relatórios",
    items: [
      {
        label: "Relatórios",
        href: "/relatorios",
        icon: BarChart3,
      },
      {
        label: "Comunicação",
        href: "/comunicacao",
        icon: MessageSquare,
      },
      {
        label: "IA Conectar",
        href: "/ia",
        icon: Sparkles,
        badge: "Novo",
        badgeColor: "bg-teal-100 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300",
      },
    ],
  },
  {
    title: "Sistema",
    items: [
      {
        label: "Configurações",
        href: "/configuracoes",
        icon: Settings,
      },
    ],
  },
];

function NavItemComponent({
  item,
  depth = 0,
  isCollapsed,
}: {
  item: NavItem;
  depth?: number;
  isCollapsed: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = item.href ? pathname.startsWith(item.href) : false;
  const hasChildren = item.children && item.children.length > 0;

  const content = (
    <motion.div
      whileHover={{ x: isCollapsed ? 0 : 2 }}
      transition={{ duration: 0.15 }}
      className={cn(
        "sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200",
        isCollapsed ? "justify-center" : "",
        isActive && "active"
      )}
    >
      <item.icon className="h-4 w-4 shrink-0" />
      {!isCollapsed && <span className="flex-1 truncate">{item.label}</span>}
      {!isCollapsed && item.badge !== undefined && (
        <span
          className={cn(
            "text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0",
            item.badgeColor || "bg-purple-500/20 text-purple-300"
          )}
        >
          {item.badge}
        </span>
      )}
    </motion.div>
  );

  if (isCollapsed) {
    return (
      <Tooltip.Root delayDuration={50}>
        <Tooltip.Trigger asChild>
          <Link href={item.href || "#"}>{content}</Link>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="right"
            align="center"
            sideOffset={8}
            className="z-50 px-2.5 py-1.5 rounded-lg bg-violet-950 text-white text-[11px] font-bold shadow-xl border border-violet-800 animate-in fade-in zoom-in-95 duration-150 select-none flex items-center gap-1.5"
          >
            {item.label}
            {item.badge !== undefined && (
              <span className="bg-white/20 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                {item.badge}
              </span>
            )}
            <Tooltip.Arrow className="fill-violet-950" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    );
  }

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            "sidebar-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium",
            isActive && "active"
          )}
        >
          <item.icon className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left">{item.label}</span>
          {open ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="ml-4 mt-1 space-y-0.5"
            >
              {item.children!.map((child) => (
                <NavItemComponent key={child.href} item={child} isCollapsed={isCollapsed} depth={depth + 1} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <Link href={item.href!}>
      {content}
    </Link>
  );
}

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("sidebar-collapsed");
    if (stored === "true") {
      setIsCollapsed(true);
    }
  }, []);

  const toggleCollapse = () => {
    const nextVal = !isCollapsed;
    setIsCollapsed(nextVal);
    localStorage.setItem("sidebar-collapsed", String(nextVal));
  };

  return (
    <Tooltip.Provider>
      <aside
        className={cn(
          "sidebar shrink-0 flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out",
          mounted && isCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo Header */}
        <div
          className={cn(
            "flex border-b border-[hsl(var(--sidebar-border))] py-5 transition-all duration-300",
            mounted && isCollapsed ? "flex-col items-center gap-3 px-2" : "flex-row items-center justify-between px-5"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-border shadow-lg bg-white flex items-center justify-center shrink-0">
              <Image
                src="/logo.jpeg"
                alt="Logo Conectar"
                width={36}
                height={36}
                className="object-cover w-full h-full"
              />
            </div>
            {(!mounted || !isCollapsed) && (
              <div className="animate-in fade-in duration-200">
                <p className="text-[11px] font-medium text-[hsl(var(--sidebar-muted))] uppercase tracking-widest leading-none">
                  Instituto
                </p>
                <p className="text-sm font-bold text-[hsl(var(--sidebar-fg))] mt-0.5 leading-none">
                  Conectar
                </p>
              </div>
            )}
          </div>

          <button
            onClick={toggleCollapse}
            className="p-1.5 rounded-lg hover:bg-muted text-[hsl(var(--sidebar-muted))] hover:text-[hsl(var(--sidebar-fg))] transition-colors cursor-pointer border border-transparent shrink-0"
            title={mounted && isCollapsed ? "Expandir Menu" : "Colapsar Menu"}
          >
            {mounted && isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-violet-500" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-violet-500" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-4">
          {navGroups.map((group, groupIdx) => (
            <div key={group.title}>
              {(!mounted || !isCollapsed) ? (
                <p className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-2 text-[hsl(var(--sidebar-muted))] animate-in fade-in duration-200">
                  {group.title}
                </p>
              ) : (
                groupIdx > 0 && <div className="h-px bg-border/40 my-3" />
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavItemComponent
                    key={item.href || item.label}
                    item={item}
                    isCollapsed={mounted && isCollapsed}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Panel (User Profile) */}
        <div
          className={cn(
            "border-t border-[hsl(var(--sidebar-border))] p-3 flex transition-all duration-300",
            mounted && isCollapsed ? "justify-center" : ""
          )}
        >
          {/* User Profile */}
          {mounted && isCollapsed ? (
            <Tooltip.Root delayDuration={50}>
              <Tooltip.Trigger asChild>
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold shadow-md cursor-pointer shrink-0">
                  A
                </div>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="right"
                  align="center"
                  sideOffset={8}
                  className="z-50 px-2.5 py-1.5 rounded-lg bg-violet-950 text-white text-[11px] font-bold shadow-xl border border-violet-800 animate-in fade-in zoom-in-95 duration-150 select-none"
                >
                  Administrador (admin@conectar.com)
                  <Tooltip.Arrow className="fill-violet-950" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          ) : (
            <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[hsl(var(--sidebar-accent)/0.1)] transition-colors cursor-pointer animate-in fade-in duration-200">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                A
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[hsl(var(--sidebar-fg))] truncate">
                  Administrador
                </p>
                <p className="text-[10px] text-[hsl(var(--sidebar-muted))] truncate">
                  admin@conectar.com
                </p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </Tooltip.Provider>
  );
}
