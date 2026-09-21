"use client";

import { motion } from "framer-motion";
import { Clock, ChevronRight, CalendarCheck } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Appointment {
  id?: string;
  data: string | Date;
  tipoAtendimento?: string;
  tipo?: string;
  profissional?: {
    usuario?: {
      nome?: string;
    };
    especialidade?: string;
  };
  sala?: {
    nome?: string;
  };
}

interface PortalUpcomingSectionProps {
  nextAppointment: Appointment | null;
  onSeeAll: () => void;
  onOpenDetails: (appointment: Appointment) => void;
}

export function PortalUpcomingSection({
  nextAppointment,
  onSeeAll,
  onOpenDetails,
}: PortalUpcomingSectionProps) {
  // Fallback seguro caso não haja consulta retornada pela API
  const appointment: Appointment = nextAppointment || {
    data: new Date("2026-09-24T09:00:00Z"),
    tipoAtendimento: "Avaliação Neuropsicopedagógica",
    profissional: {
      usuario: { nome: "Dra. Leliane Dantas" },
      especialidade: "Neuropsicopedagogia",
    },
    sala: { nome: "Sala 02 - Ludoterapia" },
    tipo: "PRESENCIAL",
  };

  const appointmentDate = new Date(appointment.data);
  const day = appointmentDate.getDate();
  const month = appointmentDate
    .toLocaleDateString("pt-BR", { month: "short" })
    .replace(".", "")
    .toUpperCase();
  const time = appointmentDate.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <section id="upcoming-section" className="pt-1 space-y-2 select-none">
      {/* Header (id: "upcoming-header") */}
      <div id="upcoming-header" className="flex items-center justify-between">
        <h2 id="upcoming-title" className="text-[17px] font-bold text-[#29232F] tracking-tight">
          Próximos compromissos
        </h2>
        <button
          id="upcoming-see-all"
          onClick={onSeeAll}
          className="text-[10px] font-bold text-[#8D5BD1] hover:text-[#733EB8] transition-colors flex items-center gap-0.5 cursor-pointer py-1"
        >
          <span>Ver todos</span>
          <span>→</span>
        </button>
      </div>

      {/* Lista / Card de Atendimento (id: "upcoming-list") */}
      <div id="upcoming-list" className="space-y-2">
        <motion.div
          id="appointment-card"
          whileHover={{ y: -1.5, scale: 1.01 }}
          whileTap={{ scale: 0.985 }}
          onClick={() => onOpenDetails(appointment)}
          className="h-[68px] rounded-[14px] bg-white border border-[#EEEAF4] p-2.5 flex items-center justify-between shadow-[0_2px_8px_rgba(60,40,80,0.04)] hover:shadow-xs hover:border-[#8D5BD1]/30 transition-all cursor-pointer group"
        >
          <div className="flex items-center flex-1 min-w-0">
            {/* Appointment Date Badge (48x48, borderRadius 12, bg: #F1EAFF) */}
            <div
              id="appointment-date"
              className="w-12 h-12 rounded-[12px] bg-gradient-to-b from-[#F5EEFF] to-[#EBDCFF] flex flex-col items-center justify-center text-[#8D5BD1] shrink-0 border border-[#E0CEFF] shadow-2xs group-hover:scale-105 transition-transform"
            >
              <span className="text-[17px] font-black leading-none text-[#8D5BD1]">
                {day}
              </span>
              <span className="text-[8px] font-extrabold tracking-wider uppercase text-[#8D5BD1] mt-0.5">
                {month}
              </span>
            </div>

            {/* Appointment Info (id: "appointment-info") */}
            <div id="appointment-info" className="flex-1 ml-2.5 min-w-0 space-y-0.5">
              <h4 className="text-[11px] font-extrabold text-[#29232F] truncate leading-tight group-hover:text-[#8D5BD1] transition-colors">
                {appointment.tipoAtendimento || "Atendimento Clínico"}
              </h4>
              <p className="text-[9px] text-[#77717E] truncate font-medium">
                {appointment.profissional?.usuario?.nome || "Terapeuta da Criança"}
              </p>
              <p className="text-[9px] text-[#8D5BD1] font-bold flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#8D5BD1]" />
                <span>{time}h • Presencial</span>
              </p>
            </div>
          </div>

          {/* Appointment Action Button (id: "appointment-action") */}
          <div
            id="appointment-action"
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#77717E] group-hover:text-[#8D5BD1] group-hover:bg-[#FAF8FF] transition-colors shrink-0 ml-1"
          >
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
