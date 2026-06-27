"use client";

import { motion } from "framer-motion";
import SectionTitle from "./SectionTitle";

const posts = [
  {
    tag: "Desenvolvimento",
    title: "A importância do brincar no desenvolvimento sensorial",
    desc: "Como brincadeiras estruturadas ajudam na integração e autorregulação infantil.",
    date: "15 Mai, 2026",
    img: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=250"
  },
  {
    tag: "Comunicação",
    title: "Sinais de atraso na fala: quando procurar ajuda?",
    desc: "Entenda os marcos de desenvolvimento de linguagem e quando o fonoaudiólogo é necessário.",
    date: "10 Mai, 2026",
    img: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=250"
  },
  {
    tag: "Aprendizagem",
    title: "Dificuldades de aprendizagem e o ambiente escolar",
    desc: "Como a parceria entre a clínica psicopedagógica e a escola impulsiona os resultados do aluno.",
    date: "04 Mai, 2026",
    img: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=250"
  }
];

export default function Blog() {
  return (
    <section id="blog" className="py-24 bg-white border-t border-[#E7E7E7]/30 text-xs">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        
        <SectionTitle 
          subtitle="NOSSO BLOG"
          title="Conteúdos que acolhem e informam."
          coloredWord="informam"
          coloredWordColor="text-[#E98BAE]"
          description="Dicas práticas de terapeutas do Instituto Conectar para apoiar o dia a dia da sua família."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, idx) => (
            <motion.article
              key={idx}
              whileHover={{ y: -6 }}
              className="bg-white border border-[#E7E7E7] rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail */}
                <div className="aspect-video w-full bg-zinc-50 relative overflow-hidden border-b border-[#E7E7E7]/50">
                  <img src={post.img} alt={post.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-[#8E7BBE] text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
                    {post.tag}
                  </span>
                </div>

                {/* Text body */}
                <div className="p-6 space-y-2 text-left">
                  <span className="text-[9px] font-bold text-zinc-400">{post.date}</span>
                  <h4 className="font-extrabold text-[13px] text-[#4A4A4A] leading-snug hover:text-[#8E7BBE] transition-colors">
                    {post.title}
                  </h4>
                  <p className="text-zinc-500 text-[10px] leading-relaxed">
                    {post.desc}
                  </p>
                </div>
              </div>

              {/* Read link */}
              <div className="px-6 pb-6 pt-2 text-left">
                <span className="text-[10px] font-black text-[#8E7BBE] hover:text-[#7e6bb0] transition-colors flex items-center gap-1">
                  Ler artigo completo →
                </span>
              </div>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
}
