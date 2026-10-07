"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import LandingMascot from "./LandingMascot";
import {
  ArrowRight,
  Brain,
  BookOpen,
  MessageCircle,
  Footprints,
  Users,
  Heart,
  Puzzle,
  School,
  Sprout,
  MapPin,
  Smartphone,
  UserRound,
} from "lucide-react";
const services = [
  [Brain, "Atenção e funções executivas", "pink"],
  [BookOpen, "Dificuldades de aprendizagem", "yellow"],
  [MessageCircle, "Linguagem e comunicação", "blue"],
  [Footprints, "Desenvolvimento infantil", "green"],
  [Users, "Questões comportamentais", "purple"],
  [Heart, "Desenvolvimento socioemocional", "pink"],
  [Puzzle, "Coordenação motora e autonomia", "teal"],
  [Users, "Orientação à família", "peach"],
  [School, "Parceria escola–família", "blue"],
] as const;
const values = [
  [
    Heart,
    "Acolhimento",
    "Cada criança é compreendida em sua singularidade.",
    "peach",
  ],
  [
    BookOpen,
    "Individualização",
    "Cada plano é pensado a partir das necessidades e potencialidades.",
    "yellow",
  ],
  [
    Users,
    "Parceria",
    "Família, escola e profissionais caminham juntos.",
    "purple",
  ],
  [
    Sprout,
    "Desenvolvimento",
    "Pequenos avanços também são grandes conquistas.",
    "green",
  ],
] as const;
export default function ReferenceLanding({ onChat }: { onChat: () => void }) {
  const number = (
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ""
  ).replace(/\D/g, "");
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://app.institutoconectar.net.br").replace(/\/+$/, "");
  const portalUrl = `${appUrl}/portal/login`;
  const address =
    process.env.NEXT_PUBLIC_CLINIC_ADDRESS ||
    "Edifício Aero — Condomínio Aero Espaço Empresarial e Hotel, Av. Santos Dumont, nº 1883 (Km 1.5), Centro, Lauro de Freitas - BA, CEP 42702-400";
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const targets = Array.from(root.querySelectorAll<HTMLElement>(".help-section, .purpose-card, .connection-image, .values-card, .space-copy, .space-photo, .founder-photo, .founder-copy, .contact-card, .video-section, .content-grid article, .footer-main, .footer-apps"));
    let observer: IntersectionObserver | undefined;
    if (!reducedMotion.matches && "IntersectionObserver" in window) {
      root.classList.add("motion-ready");
      observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add("is-revealed"); observer?.unobserve(entry.target); }
      }), { threshold: 0.08, rootMargin: "0px 0px -18px 0px" });
      targets.forEach((target, index) => { target.classList.add("reveal-item"); target.style.setProperty("--reveal-delay", `${index % 3 * 65}ms`); observer?.observe(target); });
    }
    const revealAll = () => { if (reducedMotion.matches) { observer?.disconnect(); targets.forEach(target => target.classList.add("is-revealed")); } };
    reducedMotion.addEventListener("change", revealAll);
    const links = Array.from(root.querySelectorAll<HTMLAnchorElement>(".site-header nav a"));
    const sections = links.map(link => root.querySelector<HTMLElement>(link.getAttribute("href") || "")).filter((item): item is HTMLElement => Boolean(item));
    let frame = 0;
    const updateScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      root.style.setProperty("--scroll-progress", `${max > 0 ? Math.min(1, window.scrollY / max) : 0}`);
      root.classList.toggle("has-scrolled", window.scrollY > 24);
      const current = sections.map(section => ({ section, top: section.getBoundingClientRect().top })).filter(item => item.top <= window.innerHeight * .35).sort((a, b) => b.top - a.top)[0]?.section;
      links.forEach(link => { if (current && link.hash === `#${current.id}`) link.setAttribute("aria-current", "location"); else link.removeAttribute("aria-current"); });
      frame = 0;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(updateScroll); };
    updateScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { observer?.disconnect(); targets.forEach(target => target.classList.remove("reveal-item")); root.classList.remove("motion-ready"); reducedMotion.removeEventListener("change", revealAll); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(frame); };
  }, []);
  const contact = (label: string, cls = "button button-teal") =>
    number ? (
      <a
        className={cls}
        href={`https://wa.me/${number}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <MessageCircle size={20} aria-hidden="true" />
        {label}
      </a>
    ) : (
      <button type="button" className={cls} onClick={onChat}>
        <MessageCircle size={20} aria-hidden="true" />
        {label.replace(/ pelo WhatsApp$/, "")}
      </button>
    );
  return (
    <div className="reference-landing" ref={rootRef}>
      <div className="landing-progress" aria-hidden="true" />
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <header className="site-header shell">
        <a href="#inicio" aria-label="Instituto Conectar — início">
          <Image
            className="brand-logo"
            src="/brand/conectar.png"
            alt="Instituto Conectar"
            width={320}
            height={110}
            priority
          />
        </a>
        <nav aria-label="Navegação principal">
          <a href="#inicio">Início</a>
          <a href="#sobre">Quem somos</a>
          <a href="#ajuda">Como podemos ajudar</a>
          <a href="#espaco">Nosso espaço</a>
          <a href="#equipe">Equipe</a>
          <a href="#conteudos">Conteúdos</a>
          <a href="#contato">Contato</a>
        </nav>
        <div className="header-actions">
          <a href={portalUrl} className="button button-portal"><UserRound size={18} aria-hidden="true" /> Portal dos Pais</a>
          {contact("Fale conosco")}
        </div>
      </header>
      <main id="conteudo">
        <section id="inicio" className="hero-reference shell">
          <div className="hero-copy">
            <p className="eyebrow">Instituto Conectar</p>
            <h1>
              <span>Desenvolvimento,</span>
              <span>aprendizagem e</span>
              <span>bem-estar infantil.</span>
            </h1>
            <p>
              Um espaço pensado para acolher crianças, adolescentes e suas
              famílias, conectando profissionais, escola e família para
              favorecer o desenvolvimento e a aprendizagem.
            </p>
            <div className="hero-actions">
              <a className="button button-coral" href="#sobre">
                Conheça o Instituto <ArrowRight size={18} />
              </a>
              {contact("Fale conosco", "button button-outline")}
            </div>
          </div>
          <div className="hero-visual">
            <Image
              src="/media/recepcao.webp"
              alt="Projeto da recepção do Instituto Conectar, um ambiente acolhedor com os personagens da marca"
              fill
              priority
              sizes="(max-width:760px) 100vw, 58vw"
            />
            <div className="hero-message">
              Conectar pessoas,
              <br />
              histórias e<br />
              potencialidades.
            </div>
          </div>
        </section>
        <section id="ajuda" className="help-section shell">
          <h2>Como podemos ajudar seu filho?</h2>
          <p>
            Atendimento interdisciplinar para diferentes necessidades e fases do
            desenvolvimento.
          </p>
          <div className="service-grid">
            {services.map(([Icon, label, color]) => (
              <a href="#contato" className="service-item" key={label}>
                <span className={`icon-circle ${color}`}>
                  <Icon size={34} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <span>{label}</span>
              </a>
            ))}
          </div>
        </section>
        <section id="sobre" className="about-grid shell">
          <article className="purpose-card">
            <h2>
              Mais do que atendimento,
              <br />
              <em>conexão.</em>
            </h2>
            <p>
              Acreditamos que o desenvolvimento infantil acontece quando
              criança, família, escola e profissionais caminham juntos.
            </p>
            <p>
              Por isso, nosso trabalho busca compreender cada criança em sua
              singularidade, acolher sua família e construir estratégias que
              façam sentido para a sua realidade.
            </p>
            <a className="text-link" href="#equipe">
              Conheça nosso propósito <ArrowRight size={17} />
            </a>
          </article>
          <div className="connection-image">
            <Image
              src="/media/sala-infantil.webp"
              alt="Projeto da sala infantil com brinquedos e materiais para aprendizagem"
              fill
              sizes="(max-width:760px) 100vw, 35vw"
            />
            <p className="coral-note">
              Cada criança é única e tem um jeito especial de se desenvolver.
            </p>
          </div>
          <aside className="values-card">
            <h2>
              O que guia
              <br />
              nosso trabalho
            </h2>
            {values.map(([Icon, title, text, color]) => (
              <div className="value-row" key={title}>
                <span className={`value-icon ${color}`}>
                  <Icon size={27} aria-hidden="true" />
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </aside>
        </section>
        <section id="espaco" className="space-grid shell">
          <div className="space-copy">
            <h2>Nosso espaço</h2>
            <h3>Um ambiente pensado para acolher</h3>
            <p>
              Nossa estrutura foi cuidadosamente planejada para ser um espaço
              seguro, lúdico e funcional, favorecendo o bem-estar, a
              concentração e o desenvolvimento das crianças.
            </p>
            <a className="button button-soft" href="#visita">
              Conheça nosso espaço <ArrowRight size={17} />
            </a>
          </div>
          {[
            ["recepcao", "Projeto da recepção"],
            ["sala-infantil", "Projeto da sala de aprendizagem"],
            ["sala-terapia", "Projeto da sala de atendimento"],
          ].map(([file, label]) => (
            <div className="space-photo" key={file}>
              <Image
                src={`/media/${file}.webp`}
                alt={label}
                fill
                sizes="(max-width:760px) 90vw, 23vw"
              />
            </div>
          ))}
        </section>
        <section className="founder-grid shell">
          <div className="founder-photo">
            <Image
              src="/leliane.jpg"
              alt="Foto provisória para a apresentação da fundadora"
              fill
              sizes="(max-width:760px) 90vw, 30vw"
            />
          </div>
          <article id="equipe" className="founder-copy">
            <h2>
              <span>O Conectar</span> nasceu
              <br />
              de um propósito.
            </h2>
            <p>
              O Instituto Conectar nasceu do desejo de construir um espaço onde
              crianças e famílias fossem acolhidas para além das suas
              dificuldades.
            </p>
            <p>
              Um espaço onde desenvolvimento e aprendizagem fossem compreendidos
              de forma integral, respeitando a singularidade de cada criança e
              fortalecendo a parceria entre família, escola e profissionais.
            </p>
            <p className="founder-signature">
              <strong>Leliane Cerqueira Dantas</strong>
              <br />
              Fundadora | Neuropsicopedagoga
            </p>
          </article>
          <aside id="contato" className="contact-card">
            <LandingMascot />
            <h2>
              Vamos conversar
              <br />
              sobre o seu filho?
            </h2>
            <p>
              Estamos aqui para acolher a sua história e construir, juntos, os
              próximos passos.
            </p>
            {contact("Fale conosco pelo WhatsApp")}
            <p className="official-contact">
              (XX) XXXXX-XXXX
              <br />
              Edifício Aero · Av. Santos Dumont, 1883
              <br />
              Centro · Lauro de Freitas – BA
            </p>
            {address ? (
              <a
                className="location-link"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin size={24} />
                Ver localização e como chegar
              </a>
            ) : (
              <button className="location-link" onClick={onChat}>
                <MapPin size={24} />
                Consulte nossa localização
              </button>
            )}
          </aside>
        </section>
        <section id="visita" className="video-section shell">
          <div>
            <p className="eyebrow">Nosso espaço</p>
            <h2>Conheça cada detalhe do Conectar.</h2>
            <p>Um passeio pelo projeto de um espaço pensado para acolher.</p>
          </div>
          <video
            controls
            preload="none"
            poster="/media/recepcao.webp"
            aria-label="Vídeo de apresentação do projeto do Instituto Conectar"
          >
            <source src="/media/instituto-conectar.mp4" type="video/mp4" />
            Seu navegador não suporta vídeo.{" "}
            <a href="/media/instituto-conectar.mp4">Baixe a apresentação.</a>
          </video>
        </section>
        <section id="conteudos" className="content-section shell">
          <h2>Conexões para aprender e crescer.</h2>
          <p>
            Conheça o nosso olhar sobre a infância, a aprendizagem e o
            acolhimento.
          </p>
          <div className="content-grid">
            {[
              ["jornada", "Jornada Conectar"],
              ["acolhimento", "O primeiro passo é se sentir acolhido"],
              ["singularidade", "Cada criança tem um potencial único"],
            ].map(([file, label]) => (
              <article key={file}>
                <Image
                  src={`/media/${file}.webp`}
                  alt={label}
                  width={540}
                  height={675}
                  sizes="(max-width:760px) 90vw, 30vw"
                />
              </article>
            ))}
          </div>
        </section>
      </main>
      <footer className="site-footer" aria-label="Informações do Instituto Conectar">
        <div className="shell footer-main">
          <div className="footer-brand">
            <a href="#inicio" aria-label="Instituto Conectar — início">
              <Image src="/brand/conectar.png" alt="Instituto Conectar" width={240} height={82} />
            </a>
            <p className="footer-tagline">Desenvolvimento · aprendizagem · bem-estar</p>
            <p>Conectamos crianças, famílias, escola e profissionais para acolher cada história e desenvolver potencialidades.</p>
            {contact("Converse com nossa equipe", "footer-whatsapp")}
          </div>
          <nav className="footer-column" aria-label="Navegação do rodapé">
            <h2>Conheça o Instituto</h2>
            <a href="#sobre">Quem somos</a>
            <a href="#ajuda">Como podemos ajudar</a>
            <a href="#espaco">Nosso espaço</a>
            <a href="#equipe">Nossa fundadora</a>
            <a href="#conteudos">Conteúdos</a>
            <a href="#contato">Fale conosco</a>
          </nav>
          <div className="footer-column footer-contact">
            <h2>Estamos aqui para acolher</h2>
            <p className="footer-phone"><MessageCircle size={19} aria-hidden="true" /> (XX) XXXXX-XXXX</p>
            <p className="contact-updating">Número de atendimento em atualização.</p>
            <address>{address}</address>
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`} target="_blank" rel="noopener noreferrer" className="footer-map">
              <MapPin size={18} aria-hidden="true" /> Ver no mapa e como chegar
            </a>
            <a href={process.env.NEXT_PUBLIC_APP_URL || "https://app.institutoconectar.net.br"} className="footer-system">Acessar o sistema do Instituto <ArrowRight size={16} aria-hidden="true" /></a>
          </div>
        </div>
        <div className="shell footer-apps">
          <div className="footer-apps-copy">
            <h2>O Conectar perto da sua família</h2>
            <p>O Portal dos Pais já está disponível pelo navegador. Nossos aplicativos para Android e iOS serão lançados no futuro.</p>
            <a href={portalUrl} className="footer-portal"><UserRound size={18} aria-hidden="true" /> Acessar Portal dos Pais <ArrowRight size={16} aria-hidden="true" /></a>
          </div>
          <div className="app-store-buttons" aria-label="Aplicativos com lançamento futuro">
            <button type="button" disabled className="app-store-badge" aria-label="Baixar aplicativo Android na Google Play — em breve">
              <Smartphone size={26} aria-hidden="true" />
              <span><small>Aplicativo Android</small><strong>Google Play</strong><span className="app-coming-soon">Em breve</span></span>
            </button>
            <button type="button" disabled className="app-store-badge" aria-label="Baixar aplicativo iOS na App Store — em breve">
              <Smartphone size={26} aria-hidden="true" />
              <span><small>Aplicativo iOS</small><strong>App Store</strong><span className="app-coming-soon">Em breve</span></span>
            </button>
          </div>
        </div>
        <div className="shell footer-bottom">
          <p>© {new Date().getFullYear()} Instituto Conectar. Todos os direitos reservados.</p>
          <p className="developer-credit">Desenvolvido por <strong>Ramon Cerqueira</strong></p>
          <a href="#inicio" className="footer-top">Voltar ao início ↑</a>
        </div>
      </footer>
    </div>
  );
}
