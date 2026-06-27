import { Heart, Award, Home as HomeIcon, Star } from "lucide-react";

export default function TrustBar() {
  return (
    <section className="bg-zinc-50/45 py-8 border-y border-zinc-100">
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-around gap-6 text-xs font-extrabold text-[#3c2a4d]">
        <div className="flex items-center gap-2.5">
          <Heart className="w-5 h-5 text-[#db2777]" /> Atendimento Humanizado
        </div>
        <div className="flex items-center gap-2.5">
          <Award className="w-5 h-5 text-[#8e7bbe]" /> Equipe Especializada
        </div>
        <div className="flex items-center gap-2.5">
          <HomeIcon className="w-5 h-5 text-emerald-500" /> Ambiente Acolhedor
        </div>
        <div className="flex items-center gap-2.5">
          <Star className="w-5 h-5 text-amber-500" /> Desenvolvimento Individual
        </div>
      </div>
    </section>
  );
}
