"use client";

import { motion } from "framer-motion";
import {
  PortalWelcomeHero,
  PortalFamilyCard,
  PortalMoodCheckin,
  PortalQuickActions,
  PortalUpcomingSection,
  PortalPrimaryAction,
} from "@/components/portal";

interface PortalHomeScreenProps {
  parentName: string;
  childName: string;
  childAge: string;
  school?: string;
  nextAppointment: any;
  pendingExercisesCount: number;
  pendingInvoicesCount: number;
  onOpenFamilyProfile: () => void;
  onSelectAction: (actionKey: "agenda" | "evolucao" | "atividades" | "documentos" | "jornada" | "financeiro") => void;
  onSeeAllAppointments: () => void;
  onOpenAppointmentDetails: (appointment: any) => void;
  onOpenScheduling: () => void;
}

export function PortalHomeScreen({
  parentName,
  childName,
  childAge,
  school,
  nextAppointment,
  pendingExercisesCount,
  pendingInvoicesCount,
  onOpenFamilyProfile,
  onSelectAction,
  onSeeAllAppointments,
  onOpenAppointmentDetails,
  onOpenScheduling,
}: PortalHomeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-3"
    >
      {/* 1. WELCOME BANNER (Hero Card de 104px com gradiente e mascote interativo) */}
      <PortalWelcomeHero parentName={parentName} />

      {/* 2. FAMILY PROFILE CARD (Card do paciente acompanhado de 76px) */}
      <PortalFamilyCard
        childName={childName}
        childAge={childAge}
        school={school}
        onOpenFamilyProfile={onOpenFamilyProfile}
      />

      {/* 2.1 WIDGET INTERATIVO DE HUMOR / CHECK-IN DIÁRIO */}
      <PortalMoodCheckin childName={childName} />

      {/* 3. QUICK ACTIONS (Grade em 3 colunas x 6 cards pastéis de 106px) */}
      <PortalQuickActions
        pendingExercisesCount={pendingExercisesCount}
        pendingInvoicesCount={pendingInvoicesCount}
        onSelectAction={onSelectAction}
      />

      {/* 4. UPCOMING SECTION (Card de próximo compromisso de 68px com badge de data) */}
      <PortalUpcomingSection
        nextAppointment={nextAppointment}
        onSeeAll={onSeeAllAppointments}
        onOpenDetails={onOpenAppointmentDetails}
      />

      {/* 5. PRIMARY ACTION (Botão pill de 42px full-width em #8D5BD1) */}
      <PortalPrimaryAction
        onClick={onOpenScheduling}
        label="Agendar atendimento"
      />

      {/* Rodapé institucional acolhedor */}
      <div className="pt-2 pb-1 text-center select-none">
        <p className="text-[8.5px] font-bold text-[#77717E]/70 uppercase tracking-wider">
          Instituto Conectar • Tudo em um só lugar
        </p>
      </div>
    </motion.div>
  );
}
