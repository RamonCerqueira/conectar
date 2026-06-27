"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, User, Clock, ArrowRight, ArrowLeft, Heart, CheckCircle } from "lucide-react";
import SectionTitle from "./SectionTitle";

const posts = [
  {
    id: 1,
    tag: "Desenvolvimento",
    title: "A importância do brincar no desenvolvimento sensorial",
    desc: "Como brincadeiras estruturadas ajudam na integração e autorregulação infantil.",
    content: "O brincar não é apenas uma distração para a criança, mas sim o seu principal meio de comunicação e exploração do mundo. Através de atividades lúdicas planejadas com balanços, texturas e blocos de montar, os terapeutas ocupacionais auxiliam no processamento sensorial. Crianças com TEA (Transtorno do Espectro Autista) ou TDAH que apresentam hipersensibilidade ou hiposensibilidade a estímulos encontram no brincar terapêutico a chave para a regulação corporal e emocional. Integrar rotinas divertidas no lar, em conjunto com o acompanhamento clínico, acelera o desenvolvimento de habilidades motoras finas e amplia a capacidade de foco no ambiente escolar.",
    date: "15 Mai, 2026",
    author: "Dra. Camila Alves",
    readTime: "4 min de leitura",
    img: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800" // Kid drawing
  },
  {
    id: 2,
    tag: "Linguagem",
    title: "Sinais de atraso na fala: quando procurar ajuda?",
    desc: "Entenda os marcos de desenvolvimento de linguagem e quando o fonoaudiólogo é necessário.",
    content: "O desenvolvimento da fala é um dos momentos mais aguardados pelos pais, mas o ritmo de cada criança deve ser acompanhado com atenção. Embora existam variações individuais, marcos básicos como balbuciar aos 6 meses, apontar para objetos com 1 ano e formular frases simples aos 2 anos são fundamentais. Se a criança demonstra dificuldades de socialização, não responde ao ser chamada pelo nome ou apresenta frustração excessiva por não se fazer compreender, indica-se a avaliação por um fonoaudiólogo. A intervenção precoce aproveita a plasticidade cerebral típica da primeira infância, gerando avanços significativos de comunicação e autoconfiança.",
    date: "10 Mai, 2026",
    author: "Dra. Juliana R.",
    readTime: "5 min de leitura",
    img: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800" // Kid speaking
  },
  {
    id: 3,
    tag: "Aprendizagem",
    title: "Dificuldades de aprendizagem e o ambiente escolar",
    desc: "Como a parceria entre a clínica psicopedagógica e a escola impulsiona os resultados do aluno.",
    content: "Quando uma criança apresenta baixo rendimento escolar, dificuldades na escrita ou na leitura de sílabas simples, o sentimento de incapacidade pode gerar isolamento e recusa escolar. O papel da psicopedagogia é investigar a causa por trás da barreira de aprendizagem — seja um quadro de dislexia, TDAH ou simplesmente bloqueio emocional. O tratamento clínico alcança sua máxima eficácia quando há uma ponte ativa com o colégio. Orientar professores com metodologias alternativas de avaliação, adaptar rotinas de estudo e treinar funções cognitivas e executivas na clínica transforma o ambiente de estudos em um espaço de acolhimento e conquistas constantes.",
    date: "04 Mai, 2026",
    author: "Dra. Marina Costa",
    readTime: "6 min de leitura",
    img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800" // Kid reading book
  }
];

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

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

        {/* Premium Magazine Asymmetric Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Magazine Feature Post (Left side, spans 7 columns) */}
          <motion.div 
            whileHover={{ y: -6 }}
            onClick={() => setSelectedPost(posts[0])}
            className="lg:col-span-7 bg-[#F8F9FB] rounded-[2.5rem] p-6 md:p-8 flex flex-col justify-between border border-[#E7E7E7]/50 shadow-premium-sm hover:shadow-premium-md cursor-pointer transition-all text-left"
          >
            <div className="space-y-4">
              <div className="aspect-[16/9] w-full rounded-3xl overflow-hidden bg-zinc-100 relative">
                <img src={posts[0].img} alt={posts[0].title} className="w-full h-full object-cover" />
                <span className="absolute top-4 left-4 bg-[#8E7BBE] text-white text-[9px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full">
                  {posts[0].tag}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-zinc-400 text-[10px] font-bold">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {posts[0].date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {posts[0].readTime}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-extrabold text-[#4A4A4A] leading-tight hover:text-[#8E7BBE] transition-colors">
                  {posts[0].title}
                </h3>
                <p className="text-zinc-500 text-xs leading-relaxed font-medium">
                  {posts[0].desc}
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-6 border-t border-[#E7E7E7]/60 mt-4">
              <span className="text-[10px] font-black text-[#8E7BBE] flex items-center gap-1">
                Ler matéria completa <ArrowRight className="w-3.5 h-3.5" />
              </span>
              <span className="text-[9px] font-bold text-zinc-400">Escrito por: {posts[0].author}</span>
            </div>
          </motion.div>

          {/* Secondary Magazine Posts list (Right side, spans 5 columns) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {posts.slice(1).map((post) => (
              <motion.div
                key={post.id}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedPost(post)}
                className="bg-white border border-[#E7E7E7] rounded-[2rem] p-5 shadow-premium-sm hover:shadow-premium-md cursor-pointer transition-all flex flex-col justify-between h-full text-left"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase tracking-wider text-[#8E7BBE] bg-[#8E7BBE]/10 px-2.5 py-1 rounded-full">
                      {post.tag}
                    </span>
                    <span className="text-[9px] font-bold text-zinc-400">{post.readTime}</span>
                  </div>
                  <h4 className="font-extrabold text-sm text-[#4A4A4A] leading-snug hover:text-[#8E7BBE] transition-colors">
                    {post.title}
                  </h4>
                  <p className="text-zinc-400 text-[10px] leading-relaxed">
                    {post.desc}
                  </p>
                </div>
                
                <div className="flex justify-between items-center border-t border-[#E7E7E7]/40 pt-3.5 mt-3">
                  <span className="text-[9px] font-black text-[#8E7BBE] flex items-center gap-1">
                    Ler matéria <ArrowRight className="w-3 h-3" />
                  </span>
                  <span className="text-[9px] font-bold text-zinc-400">{post.date}</span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

      </div>

      {/* ─── FULL TAKEOVER PREMIUM MAGAZINE READING PAGE OVERLAY ─────────── */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 bg-white overflow-y-auto text-left"
          >
            {/* Sticky Navigation Header */}
            <header className="sticky top-0 left-0 w-full h-[75px] bg-white/90 backdrop-blur-md border-b border-[#E7E7E7]/40 z-50 flex items-center shadow-xs">
              <div className="max-w-4xl mx-auto px-6 w-full flex items-center justify-between">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="flex items-center gap-2 text-zinc-500 hover:text-[#8E7BBE] border-0 bg-transparent cursor-pointer font-bold uppercase tracking-wider text-[10px] transition-colors"
                >
                  <ArrowLeft className="w-4.5 h-4.5" />
                  <span>Voltar ao Blog</span>
                </button>
                
                <span className="text-[10px] font-black uppercase tracking-widest text-[#8E7BBE]">
                  Instituto Conectar Leitura
                </span>

                <button
                  onClick={() => setSelectedPost(null)}
                  className="w-10 h-10 rounded-full hover:bg-zinc-50 flex items-center justify-center text-zinc-500 border-0 bg-transparent cursor-pointer transition-colors"
                  aria-label="Fechar artigo"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </header>

            {/* Main Reading Container */}
            <article className="max-w-3xl mx-auto px-6 py-16 space-y-8 text-xs md:text-sm">
              
              {/* Category & Title */}
              <div className="space-y-4 text-center md:text-left">
                <span className="bg-[#8E7BBE]/15 text-[#8E7BBE] text-[9px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full inline-block">
                  {selectedPost.tag}
                </span>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#4A4A4A] leading-[1.12]">
                  {selectedPost.title}
                </h1>
                
                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-4 text-zinc-400 text-[10px] font-bold py-3 border-y border-[#E7E7E7]/40">
                  <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {selectedPost.author}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {selectedPost.date}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {selectedPost.readTime}</span>
                </div>
              </div>

              {/* Large Img */}
              <div className="rounded-[2rem] overflow-hidden aspect-[21/9] w-full bg-zinc-50 shadow-premium-sm border border-[#E7E7E7]/30">
                <img src={selectedPost.img} alt={selectedPost.title} className="w-full h-full object-cover" />
              </div>

              {/* Article Content Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
                
                {/* Main Text Content */}
                <div className="lg:col-span-8 space-y-6 text-[#4A4A4A] leading-relaxed font-normal">
                  <p className="first-letter:text-5xl first-letter:font-black first-letter:text-[#8E7BBE] first-letter:float-left first-letter:mr-3.5 first-letter:leading-none">
                    {selectedPost.content}
                  </p>
                  
                  {/* Premium Pullquote Accent Card */}
                  <blockquote className="border-l-4 border-[#E98BAE] pl-4 py-1 italic font-semibold text-zinc-500 text-xs md:text-sm my-6 bg-[#E98BAE]/5 pr-4 rounded-r-2xl">
                    "O acompanhamento contínuo e a parceria com a escola são fundamentais para que a criança desenvolva sua autoestima e alcance marcos clínicos significativos."
                  </blockquote>

                  <p>
                    Oferecer recursos sensoriais e ferramentas lúdicas no dia a dia fortalece as conexões neurais e auxilia a desenvolver a autonomia de maneira prazerosa e natural. O diagnóstico e intervenção precoce no Instituto Conectar trazem benefícios para toda a estrutura familiar.
                  </p>
                </div>

                {/* Right Author Bio card */}
                <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-[95px]">
                  
                  {/* Doctor Bio Card */}
                  <div className="border border-[#E7E7E7]/60 rounded-3xl p-5 bg-[#F8F9FB] space-y-4">
                    <h4 className="font-extrabold text-[9px] text-zinc-400 uppercase tracking-widest">AUTORA</h4>
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full overflow-hidden bg-zinc-100 border">
                        <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100" alt={selectedPost.author} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-left">
                        <h5 className="font-extrabold text-xs text-[#4A4A4A]">{selectedPost.author}</h5>
                        <p className="text-[9px] text-[#8E7BBE] font-bold leading-none">Corpo Clínico</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-zinc-500 leading-relaxed font-semibold text-left">
                      Especialista do Instituto Conectar dedicada ao desenvolvimento terapêutico individualizado infantil e juvenil.
                    </p>
                  </div>

                  {/* Immediate Action CTA */}
                  <button
                    onClick={() => {
                      setSelectedPost(null);
                      // Scroll to contact area
                      const el = document.getElementById("faq");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="w-full py-3 rounded-2xl bg-[#8E7BBE] hover:bg-[#7e6bb0] text-white font-bold uppercase tracking-wider text-[10px] cursor-pointer border-0 shadow-md transition-colors"
                  >
                    Agendar Avaliação
                  </button>

                </div>

              </div>

            </article>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
