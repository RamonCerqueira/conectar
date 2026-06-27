"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string;
}

export default function Faq() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqData: FAQItem[] = [
    {
      question: "Como funciona a triagem inicial?",
      answer: "O primeiro contato é uma entrevista inicial de acolhimento com a família. Nela, entendemos as queixas principais, o histórico de desenvolvimento e definimos quais especialidades e avaliações são indicadas para iniciar o acompanhamento."
    },
    {
      question: "Como faço para acompanhar o prontuário e as evoluções clínicas?",
      answer: "Os pais e responsáveis recebem credenciais exclusivas para acessar o 'Portal dos Pais' do Instituto Conectar. Através dele, você pode visualizar relatórios de progresso terapêutico, frequência diária e orientações de atividades para aplicar em ambiente domiciliar."
    },
    {
      question: "Quais convênios ou formas de reembolso a clínica aceita?",
      answer: "Trabalhamos com atendimentos particulares e fornecemos relatórios clínicos detalhados e recibos adequados para solicitação de reembolso junto ao seu plano de saúde. Para convênios específicos, consulte nosso atendimento via WhatsApp."
    },
    {
      question: "Quanto tempo dura cada sessão de terapia?",
      answer: "Normalmente, as sessões individuais de fonoaudiologia, psicologia e terapia ocupacional duram entre 40 e 50 minutos. A frequência semanal é definida pela equipe clínica baseada na necessidade específica de intervenção de cada paciente."
    }
  ];

  const handleFaqToggle = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-black/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col gap-4">
          <h2 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight">Perguntas Frequentes</h2>
          <p className="text-zinc-400 leading-relaxed">Tire suas dúvidas sobre nosso processo de atendimento e acolhimento.</p>
        </div>

        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          {faqData.map((item, index) => {
            const isOpen = activeFaq === index;
            return (
              <div
                key={index}
                onClick={() => handleFaqToggle(index)}
                className={`glass-card rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border ${
                  isOpen ? "border-violet-500/25 bg-[#16161a]/60" : "border-white/5"
                }`}
              >
                <div className="flex items-center justify-between p-6">
                  <span className="font-semibold text-white text-base md:text-lg">{item.question}</span>
                  <Plus
                    className={`w-5 h-5 text-zinc-400 transition-transform duration-300 shrink-0 ${
                      isOpen ? "rotate-45 text-violet-400" : ""
                    }`}
                  />
                </div>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-zinc-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
