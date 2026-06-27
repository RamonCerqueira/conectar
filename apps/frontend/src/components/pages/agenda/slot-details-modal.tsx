"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, UserCheck, AlertTriangle } from "lucide-react";
import { Slot } from "@/types";

interface SlotDetailsModalProps {
  selectedSlot: Slot | null;
  onClose: () => void;
  onStatusChange: (id: string, newStatus: string) => void;
}

export function SlotDetailsModal({
  selectedSlot,
  onClose,
  onStatusChange,
}: SlotDetailsModalProps) {
  return (
    <AnimatePresence>
      {selectedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden bg-card p-6 space-y-4"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-foreground">{selectedSlot.paciente}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Consulta com {selectedSlot.profissional} às {selectedSlot.data.split("T")[1].slice(0, 5)}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="font-semibold text-muted-foreground">Confirmar Presença / Alterar Status:</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onStatusChange(selectedSlot.id, "PRESENTE")}
                  className="py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <CheckCircle className="h-4 w-4" /> Presente
                </button>
                <button
                  onClick={() => onStatusChange(selectedSlot.id, "FALTOU")}
                  className="py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <X className="h-4 w-4" /> Faltou
                </button>
                <button
                  onClick={() => onStatusChange(selectedSlot.id, "CONFIRMADO")}
                  className="py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <UserCheck className="h-4 w-4" /> Confirmado
                </button>
                <button
                  onClick={() => onStatusChange(selectedSlot.id, "CANCELADO")}
                  className="py-2.5 rounded-xl bg-gray-400 hover:bg-gray-500 text-white font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <AlertTriangle className="h-4 w-4" /> Cancelado
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
