import { Link } from "react-router-dom";
import {
  ArrowLeft,
  TrendingUp,
  ShieldCheck,
  Users,
  BarChart3,
  Briefcase,
  Handshake,
  Sparkles,
  Star,
  Play,
  Search,
  Heart,
  CheckCircle2,
  Quote,
  Plus,
  Minus,
  Globe2,
  Wallet,
  Zap,
  Bot,
  ArrowUpRight,
  Building2,
  CircleDollarSign,
  Crown,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

type Audience = "investor" | "entrepreneur";

type ShowcaseProject = {
  id: number;
  title: string;
  sector: string;
  founder: string;
  progress: number;
  raised: string;
  target: string;
  accent: string;
  icon: string;
};

const accents = [
  "from-emerald-400 via-teal-500 to-cyan-600",
  "from-amber-400 via-orange-500 to-rose-500",
  "from-sky-400 via-blue-500 to-indigo-600",
];
const icons = ["🚀", "💡", "📊"];

function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      setP(total > 0 ? (h.scrollTop / total) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return p;
}

function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setInView(true),
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
}

function Counter({ value, suffix = "", duration = 1600 }: { value: number; suffix?: string; duration?: number }) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setN(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);
  return (
    <span ref={ref}>
      {n.toLocaleString("ar-EG")}
      {suffix}
    </span>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-2xl border transition-all duration-300 ${open ? "border-invest-teal/40 bg-white shadow-xl" : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"}`}>
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center justify-between gap-4 p-5 text-right">
        <span className={`font-cairo font-bold text-base sm:text-lg ${open ? "text-invest-blue" : "text-white"}`}>{q}</span>
        <span className={`w-9 h-9 rounded-full flex items-center justify-center transition ${open ? "bg-invest-teal text-white" : "bg-white/10 text-white"}`}>
          {open ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </span>
      </button>
      <div className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <p className="font-cairo text-dark-gray leading-relaxed px-5 pb-5">{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function Index() {
  const [audience, setAudience] = useState<Audience>("investor");
  const [activeProject, setActiveProject] = useState(0);
  const [projectShowcase, setProjectShowcase] = useState<ShowcaseProject[]>([]);
  const [mouse, setMouse] = useState({ x: 50, y: 30 });
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollProgress = useScrollProgress();

  useEffect(() => {
    const loadShowcase = async () => {
      if (!isSupabaseConfigured) return setProjectShowcase([]);
      const { data: rows } = await supabase
        .from("projects")
        .select("id, owner_id, name, sector, budget")
        .order("created_at", { ascending: false })
        .limit(6);
      if (!rows?.length) return setProjectShowcase([]);

      const ownerIds = [...new Set(rows.map(r => r.owner_id))];
      const ownerMap = new Map<string, string>();
      if (ownerIds.length) {
        const { data: owners } = await supabase.from("profiles").select("id, full_name").in("id", ownerIds);
        (owners ?? []).forEach(o => ownerMap.set(o.id, o.full_name ?? "رائد أعمال"));
      }

      setProjectShowcase(
        rows.map((p, i) => ({
          id: p.id,
          title: p.name,
          sector: p.sector,
          founder: ownerMap.get(p.owner_id) ?? "رائد أعمال",
          progress: 20,
          raised: "0",
          target: p.budget,
          accent: accents[i % accents.length],
          icon: icons[i % icons.length],
        }))
      );
    };
    loadShowcase();
  }, []);

  useEffect(() => {
    if (!projectShowcase.length) return;
    const id = setInterval(() => setActiveProject(p => (p + 1) % projectShowcase.length), 4500);
    return () => clearInterval(id);
  }, [projectShowcase.length]);

  useEffect(() => {
    if (activeProject >= projectShowcase.length) setActiveProject(0);
  }, [activeProject, projectShowcase.length]);

  const heroCopy = useMemo(() => {
    if (audience === "investor") {
      return {
        tag: "للمستثمرين",
        eyebrow: "منصة استثمار ذكية",
        title: "استثمر في أفضل",
        highlight: "المشاريع السودانية",
        suffix: "بثقة كاملة",
        subtitle: "اكتشف فرصًا مدروسة، حلّلها بمساعدة الذكاء الاصطناعي، وتواصل مباشرةً مع رواد الأعمال — كل ذلك من مكان واحد.",
        primary: { label: "ابدأ كمستثمر", to: "/login?role=investor" },
        secondary: { label: "تصفح المشاريع", to: "/browse-projects" },
      };
    }
    return {
      tag: "لرواد الأعمال",
      eyebrow: "منصة تمويل رقمية",
      title: "حوّل فكرتك إلى",
      highlight: "مشروع ممول",
      suffix: "في وقت قياسي",
      subtitle: "قدّم مشروعك، تواصل مع مستثمرين معتمدين، واحصل على تمويل بالعملة السودانية في خطوات بسيطة.",
      primary: { label: "ابدأ كرائد أعمال", to: "/login?role=entrepreneur" },
      secondary: { label: "كيف نعمل؟", to: "#how" },
    };
  }, [audience]);

  const project = projectShowcase[activeProject];

  return (
    <div
      className="w-full min-h-screen bg-[#05132e] text-white relative overflow-x-hidden"
      dir="rtl"
      onMouseMove={e => setMouse({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 })}
    >
      <style>{`
        @keyframes floaty { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-14px) } }
        @keyframes floatySlow { 0%,100% { transform: translateY(0) rotate(0) } 50% { transform: translateY(-20px) rotate(4deg) } }
        @keyframes shimmerBg { 0% { background-position: 0% 50% } 50% { background-position: 100% 50% } 100% { background-position: 0% 50% } }
        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes pulseDot { 0%,100% { opacity: 1; transform: scale(1) } 50% { opacity: .55; transform: scale(.85) } }
        @keyframes glow { 0%,100% { box-shadow: 0 0 0 0 rgba(20,184,166,.4) } 50% { box-shadow: 0 0 40px 10px rgba(20,184,166,.15) } }
        .float-anim { animation: floaty 6s ease-in-out infinite }
        .float-slow { animation: floatySlow 9s ease-in-out infinite }
        .gradient-anim { background-size: 200% 200%; animation: shimmerBg 8s ease infinite }
        .marquee-track { animation: marquee 32s linear infinite }
        .pulse-dot { animation: pulseDot 1.6s ease-in-out infinite }
        .glow-anim { animation: glow 3s ease-in-out infinite }
        .text-gradient { background: linear-gradient(90deg,#5eead4,#34d399,#22d3ee); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .glass { background: rgba(255,255,255,0.04); backdrop-filter: blur(14px); border: 1px solid rgba(255,255,255,0.08); }
      `}</style>

      {/* Scroll progress */}
      <div className="fixed top-0 right-0 left-0 h-[3px] z-[60]">
        <div className="h-full bg-gradient-to-l from-invest-teal via-emerald-400 to-cyan-400 transition-[width] duration-150" style={{ width: `${scrollProgress}%` }} />
      </div>

      {/* Ambient backgrounds */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0" style={{ background: `radial-gradient(700px circle at ${mouse.x}% ${mouse.y}%, rgba(20,184,166,0.18), transparent 60%)` }} />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-3xl float-slow" />
        <div className="absolute top-[40vh] -left-40 w-[600px] h-[600px] rounded-full bg-blue-500/15 blur-3xl float-anim" />
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "linear-gradient(to right, #ffffff20 1px, transparent 1px), linear-gradient(to bottom, #ffffff20 1px, transparent 1px)", backgroundSize: "44px 44px", maskImage: "radial-gradient(ellipse at top, rgba(0,0,0,.7), transparent 70%)" }} />
      </div>

      {/* HEADER */}
      <header className="fixed top-0 right-0 left-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3">
          <div className="glass rounded-2xl px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F7f0a4564e10744da98b8f1029aa8c5f2%2F84c6e7db3a0941afb913c99169ea9bde?format=webp&width=800&height=1200"
                alt="Nile Invest AI"
                className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/15 group-hover:scale-105 transition"
              />
              <div className="hidden sm:block leading-tight">
                <p className="font-cairo font-bold text-base">Nile Invest AI</p>
                <p className="font-cairo text-[10px] text-white/60">المنصة السودانية للاستثمار الذكي</p>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {[
                { l: "الميزات", h: "#features" },
                { l: "للمستثمرين", h: "#investors" },
                { l: "لرواد الأعمال", h: "#founders" },
                { l: "كيف نعمل", h: "#how" },
                { l: "آراء العملاء", h: "#testimonials" },
              ].map(it => (
                <a key={it.l} href={it.h} className="font-cairo text-sm font-semibold text-white/80 hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg transition">
                  {it.l}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Link to="/login" className="hidden sm:inline-flex font-cairo font-semibold text-sm text-white/80 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition">
                دخول
              </Link>
              <Link
                to="/account-type"
                className="hidden sm:inline-flex items-center gap-2 font-cairo font-bold text-sm bg-gradient-to-l from-emerald-500 to-teal-500 text-white px-5 py-2.5 rounded-xl hover:shadow-[0_0_30px_-5px_rgba(20,184,166,0.6)] transition"
              >
                ابدأ مجاناً
                <ChevronLeft className="w-4 h-4" />
              </Link>
              <button onClick={() => setMenuOpen(v => !v)} className="lg:hidden p-2 rounded-lg hover:bg-white/5">
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {menuOpen && (
            <div className="lg:hidden glass rounded-2xl mt-2 p-3 space-y-1">
              {[
                { l: "الميزات", h: "#features" },
                { l: "للمستثمرين", h: "#investors" },
                { l: "لرواد الأعمال", h: "#founders" },
                { l: "كيف نعمل", h: "#how" },
                { l: "آراء العملاء", h: "#testimonials" },
                { l: "تسجيل الدخول", h: "/login" },
                { l: "إنشاء حساب", h: "/account-type" },
              ].map(it => (
                <a key={it.l} href={it.h} onClick={() => setMenuOpen(false)} className="block font-cairo text-sm text-white/85 hover:bg-white/5 rounded-lg px-3 py-2">
                  {it.l}
                </a>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* HERO */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-7xl mx-auto">
          {/* Audience switch */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex glass p-1.5 rounded-2xl">
              {([
                { key: "investor", label: "أنا مستثمر" },
                { key: "entrepreneur", label: "أنا رائد أعمال" },
              ] as { key: Audience; label: string }[]).map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setAudience(opt.key)}
                  className={`font-cairo font-bold text-sm px-6 py-2.5 rounded-xl transition-all duration-300 ${
                    audience === opt.key ? "bg-gradient-to-l from-invest-teal to-emerald-500 text-white shadow-lg" : "text-white/70 hover:text-white"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 lg:order-2 text-center lg:text-right">
              <span className="inline-flex items-center gap-2 font-cairo text-xs font-bold text-emerald-300 bg-emerald-400/10 ring-1 ring-emerald-400/20 px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                {heroCopy.eyebrow} • {heroCopy.tag}
              </span>
              <h1 className="font-cairo font-bold text-5xl sm:text-6xl lg:text-7xl leading-[1.05] mb-6 tracking-tight">
                {heroCopy.title}{" "}
                <span className="text-gradient">{heroCopy.highlight}</span>
                <br />
                <span className="text-white/90">{heroCopy.suffix}</span>
              </h1>
              <p className="font-cairo text-lg text-white/70 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {heroCopy.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 mb-12 justify-center lg:justify-start">
                <Link to={heroCopy.primary.to} className="font-cairo font-bold text-base bg-gradient-to-l from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-[0_0_40px_-5px_rgba(20,184,166,0.7)] transition inline-flex items-center gap-2 group glow-anim">
                  {heroCopy.primary.label}
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition" />
                </Link>
                <Link to={heroCopy.secondary.to} className="font-cairo font-bold text-base text-white px-7 py-4 rounded-xl glass hover:bg-white/10 transition inline-flex items-center gap-2">
                  <Play className="w-4 h-4 fill-current" />
                  {heroCopy.secondary.label}
                </Link>
              </div>

              {/* Trust strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto lg:mx-0">
                {[
                  { icon: ShieldCheck, label: "تشفير قوي" },
                  { icon: CheckCircle2, label: "KYC معتمد" },
                  { icon: Bot, label: "ذكاء اصطناعي" },
                  { icon: Globe2, label: "دعم عربي" },
                ].map(t => {
                  const I = t.icon;
                  return (
                    <div key={t.label} className="flex items-center gap-2 glass rounded-xl px-3 py-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-400/15 flex items-center justify-center">
                        <I className="w-4 h-4 text-emerald-300" />
                      </div>
                      <span className="font-cairo text-xs text-white/80">{t.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Showcase */}
            <div className="lg:col-span-5 lg:order-1">
              <div className="relative">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-emerald-400/30 to-transparent rounded-2xl rotate-12 float-slow" />
                <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-gradient-to-br from-blue-400/30 to-transparent rounded-2xl -rotate-12 float-anim" />

                <div className="relative glass rounded-3xl overflow-hidden shadow-2xl">
                  {project ? (
                    <>
                      <div className={`h-2 bg-gradient-to-r ${project.accent}`} />
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-5">
                          <div className="flex items-center gap-3">
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${project.accent} flex items-center justify-center text-3xl shadow-lg`}>
                              {project.icon}
                            </div>
                            <div>
                              <p className="font-cairo text-xs text-white/60">{project.sector}</p>
                              <h3 className="font-cairo font-bold text-lg text-white">{project.title}</h3>
                              <p className="font-cairo text-xs text-white/50">رائد الأعمال: {project.founder}</p>
                            </div>
                          </div>
                          <button className="w-9 h-9 rounded-full bg-white/10 hover:bg-rose-500/20 transition flex items-center justify-center">
                            <Heart className="w-4 h-4 text-rose-400" />
                          </button>
                        </div>

                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-cairo text-xs text-white/60">تم تمويله</span>
                            <span className="font-cairo text-xs font-bold text-emerald-300">{project.progress}%</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className={`h-full bg-gradient-to-r ${project.accent} rounded-full transition-all duration-700`} style={{ width: `${project.progress}%` }} />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="bg-white/5 rounded-xl p-3 ring-1 ring-white/10">
                            <p className="font-cairo text-[10px] text-white/60">الجمع</p>
                            <p className="font-cairo font-bold text-sm text-emerald-300">{project.raised} ج.س</p>
                          </div>
                          <div className="bg-white/5 rounded-xl p-3 ring-1 ring-white/10">
                            <p className="font-cairo text-[10px] text-white/60">المستهدف</p>
                            <p className="font-cairo font-bold text-sm text-white">{project.target} ج.س</p>
                          </div>
                        </div>

                        <Link to="/browse-projects" className="w-full inline-flex items-center justify-center gap-2 py-3 bg-gradient-to-l from-emerald-500 to-teal-500 text-white rounded-xl font-cairo font-bold text-sm hover:shadow-[0_0_30px_-5px_rgba(20,184,166,0.6)] transition">
                          عرض التفاصيل
                          <ArrowLeft className="w-4 h-4" />
                        </Link>

                        <div className="flex items-center justify-center gap-2 mt-5">
                          {projectShowcase.map((p, idx) => (
                            <button key={p.id} onClick={() => setActiveProject(idx)} className={`h-2 rounded-full transition-all ${idx === activeProject ? "w-8 bg-emerald-400" : "w-2 bg-white/20 hover:bg-white/40"}`} aria-label={`عرض المشروع ${idx + 1}`} />
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="p-10 text-center">
                      <p className="font-cairo text-white/70">لا توجد مشاريع منشورة بعد في قاعدة البيانات.</p>
                    </div>
                  )}
                </div>

                {/* floating chips */}
                <div className="absolute -top-4 left-6 glass rounded-2xl px-4 py-2 flex items-center gap-2 shadow-lg">
                  <div className="w-7 h-7 rounded-full bg-amber-400/20 flex items-center justify-center">
                    <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                  </div>
                  <div>
                    <p className="font-cairo text-[10px] text-white/60">تقييم</p>
                    <p className="font-cairo font-bold text-xs">4.9 / 5</p>
                  </div>
                </div>
                <div className="absolute -bottom-4 right-8 glass rounded-2xl px-4 py-2 flex items-center gap-2 shadow-lg">
                  <div className="w-7 h-7 rounded-full bg-emerald-400/20 flex items-center justify-center">
                    <Users className="w-4 h-4 text-emerald-300" />
                  </div>
                  <div>
                    <p className="font-cairo text-[10px] text-white/60">مستثمرون</p>
                    <p className="font-cairo font-bold text-xs">128 مهتم</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-3xl p-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 70%, white 1px, transparent 1px)", backgroundSize: "40px 40px,56px 56px" }} />
            {[
              { v: 500, suffix: "+", l: "مشروع مسجل", icon: Briefcase },
              { v: 1000, suffix: "+", l: "مستثمر نشط", icon: Users },
              { v: 2000, suffix: "+", l: "رائد أعمال", icon: TrendingUp },
              { v: 50, suffix: "+", l: "مطابقات ناجحة", icon: Handshake },
            ].map((s, i) => {
              const I = s.icon;
              return (
                <div key={i} className="relative flex flex-col items-center group">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 group-hover:bg-emerald-400/20 transition flex items-center justify-center mb-3 ring-1 ring-emerald-400/20">
                    <I className="w-6 h-6 text-emerald-300" />
                  </div>
                  <p className="font-cairo font-bold text-4xl tracking-tight"><Counter value={s.v} suffix={s.suffix} /></p>
                  <p className="font-cairo text-sm text-white/60 mt-1">{s.l}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PARTNERS MARQUEE */}
      <section className="py-10 relative z-10">
        <p className="text-center font-cairo text-xs font-bold tracking-widest text-white/50 mb-6">شركاء النجاح والثقة</p>
        <div className="relative overflow-hidden" style={{ maskImage: "linear-gradient(to left, transparent, black 10%, black 90%, transparent)" }}>
          <div className="flex gap-14 items-center whitespace-nowrap marquee-track" style={{ width: "max-content" }}>
            {Array.from({ length: 2 }).flatMap((_, dup) =>
              [
                { n: "بنك المزارع", icon: Wallet },
                { n: "إرادة للتمويل الأصغر", icon: Handshake },
                { n: "غرفة التجارة", icon: Briefcase },
                { n: "اتحاد المستثمرين", icon: Users },
                { n: "وزارة الاستثمار", icon: ShieldCheck },
                { n: "حاضنة الأعمال", icon: Sparkles },
                { n: "شبكة المصدرين", icon: Globe2 },
              ].map((p, i) => {
                const I = p.icon;
                return (
                  <div key={`${dup}-${i}`} className="flex items-center gap-3 text-white/60 hover:text-white transition">
                    <div className="w-10 h-10 rounded-xl bg-white/5 ring-1 ring-white/10 flex items-center justify-center">
                      <I className="w-5 h-5" />
                    </div>
                    <span className="font-cairo font-bold text-base">{p.n}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* FEATURES — bento style */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="font-cairo text-xs font-bold text-emerald-300 bg-emerald-400/10 ring-1 ring-emerald-400/20 px-3 py-1.5 rounded-full inline-block mb-4">لماذا Nile Invest AI</span>
            <h2 className="font-cairo text-4xl sm:text-5xl font-bold mb-4 tracking-tight">كل ما تحتاجه <span className="text-gradient">في مكان واحد</span></h2>
            <p className="font-cairo text-lg text-white/70">أدوات احترافية تجعل رحلتك الاستثمارية أسهل وأكثر أماناً</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
            {/* Big card */}
            <div className="md:col-span-4 glass rounded-3xl p-8 relative overflow-hidden group hover:bg-white/[0.06] transition">
              <div className="absolute -top-20 -left-20 w-72 h-72 bg-gradient-to-br from-emerald-400 to-cyan-400 opacity-10 rounded-full blur-3xl group-hover:opacity-25 transition" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg mb-5">
                  <Bot className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-cairo font-bold text-2xl mb-3">تحليل عميق بالذكاء الاصطناعي</h3>
                <p className="font-cairo text-white/70 leading-relaxed mb-6 max-w-xl">تقارير مالية تلقائية، تحليل جدوى شامل، تقييم مخاطر، ونماذج عمل قابلة للقياس مبنية على دراسة الجدوى الفعلية لكل مشروع.</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
                  {["تحليل جدوى", "تقييم مخاطر", "حساب العائد", "نموذج العمل"].map(t => (
                    <div key={t} className="bg-white/5 ring-1 ring-white/10 rounded-xl px-3 py-2 text-center font-cairo text-xs text-white/85">{t}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Two stacked */}
            <div className="md:col-span-2 grid gap-5">
              <div className="glass rounded-3xl p-6 relative overflow-hidden group hover:bg-white/[0.06] transition">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-400/10 rounded-full blur-2xl" />
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow mb-4">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-cairo font-bold text-lg mb-1">حماية وتحقق كامل</h3>
                <p className="font-cairo text-sm text-white/70 leading-relaxed">نظام KYC شامل وتشفير كامل لجميع البيانات والمعاملات.</p>
              </div>
              <div className="glass rounded-3xl p-6 relative overflow-hidden group hover:bg-white/[0.06] transition">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl" />
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow mb-4">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-cairo font-bold text-lg mb-1">باقات عضوية متعددة</h3>
                <p className="font-cairo text-sm text-white/70 leading-relaxed">Basic / Plus / Elite — اختر ما يناسب طموحك.</p>
              </div>
            </div>

            {/* row 2 */}
            {[
              { icon: Search, title: "اكتشاف ذكي للمشاريع", desc: "بحث وتصنيف متقدم حسب القطاع والمرحلة والتمويل.", grad: "from-sky-400 to-blue-600" },
              { icon: Handshake, title: "ربط مباشر وآمن", desc: "تواصل بدون وسطاء بين المستثمرين ورواد الأعمال.", grad: "from-emerald-400 to-cyan-500" },
              { icon: BarChart3, title: "تتبع الأداء", desc: "لوحة تحكم تعرض نمو محفظتك بالوقت الفعلي.", grad: "from-violet-500 to-fuchsia-600" },
            ].map(f => {
              const I = f.icon;
              return (
                <div key={f.title} className="md:col-span-2 glass rounded-3xl p-6 relative overflow-hidden group hover:bg-white/[0.06] transition">
                  <div className={`absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br ${f.grad} opacity-10 rounded-full blur-2xl group-hover:opacity-25 transition`} />
                  <div className={`relative w-12 h-12 rounded-2xl bg-gradient-to-br ${f.grad} flex items-center justify-center shadow mb-4`}>
                    <I className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-cairo font-bold text-lg mb-1">{f.title}</h3>
                  <p className="font-cairo text-sm text-white/70 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AUDIENCE SPLIT */}
      <section id="investors" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6">
          {[
            {
              tag: "للمستثمرين",
              title: "اكتشف فرصاً استثمارية واعدة",
              desc: "تصفح مشاريع مدروسة، احصل على تحليلات ذكية، وابن محفظة استثمارية متنوعة.",
              cta: { label: "ابدأ كمستثمر", to: "/login?role=investor" },
              icon: CircleDollarSign,
              grad: "from-emerald-500 to-teal-600",
              points: ["مطابقة ذكية مع المشاريع", "تحليل مخاطر شامل", "تقارير عائد وأداء", "تواصل آمن مع رواد الأعمال"],
            },
            {
              tag: "لرواد الأعمال",
              title: "حوّل فكرتك إلى مشروع ممول",
              desc: "قدّم مشروعك بوضوح، احصل على ملاحظات احترافية، وتواصل مع مستثمرين معتمدين.",
              cta: { label: "ابدأ كرائد أعمال", to: "/login?role=entrepreneur" },
              icon: Building2,
              grad: "from-amber-500 to-orange-600",
              points: ["نشر المشروع بسهولة", "تحسين عرض المشروع", "خطة مالية أولية", "نموذج عمل متكامل"],
            },
          ].map((a, i) => {
            const I = a.icon;
            return (
              <div key={i} id={i === 1 ? "founders" : undefined} className="glass rounded-3xl p-8 relative overflow-hidden group hover:bg-white/[0.06] transition">
                <div className={`absolute -top-20 -left-20 w-72 h-72 bg-gradient-to-br ${a.grad} opacity-10 rounded-full blur-3xl group-hover:opacity-25 transition`} />
                <div className="relative">
                  <span className={`inline-block font-cairo text-xs font-bold px-3 py-1 rounded-full mb-4 bg-gradient-to-l ${a.grad} text-white shadow`}>{a.tag}</span>
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${a.grad} flex items-center justify-center shadow-lg`}>
                      <I className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-cairo font-bold text-2xl flex-1 leading-tight">{a.title}</h3>
                  </div>
                  <p className="font-cairo text-white/70 leading-relaxed mb-6">{a.desc}</p>
                  <ul className="grid sm:grid-cols-2 gap-2.5 mb-6">
                    {a.points.map(p => (
                      <li key={p} className="flex items-center gap-2 font-cairo text-sm text-white/85">
                        <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <Link to={a.cta.to} className="inline-flex items-center gap-2 font-cairo font-bold text-sm bg-white text-invest-blue px-5 py-3 rounded-xl hover:bg-emerald-300 hover:text-invest-blue transition">
                    {a.cta.label}
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="font-cairo text-xs font-bold text-emerald-300 bg-emerald-400/10 ring-1 ring-emerald-400/20 px-3 py-1.5 rounded-full inline-block mb-4">كيف نعمل</span>
            <h2 className="font-cairo text-4xl sm:text-5xl font-bold mb-4 tracking-tight">ابدأ خلال <span className="text-gradient">دقائق</span></h2>
            <p className="font-cairo text-lg text-white/70">3 خطوات بسيطة لبدء رحلتك معنا</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 relative">
            {[
              { n: "01", t: "أنشئ حسابك", d: "سجل واختر دورك كمستثمر أو رائد أعمال." },
              { n: "02", t: "أكمل التحقق", d: "ارفع وثائقك وأكمل خطوات KYC في دقائق." },
              { n: "03", t: "ابدأ التفاعل", d: "تصفح المشاريع، أرسل طلبات، وحقق صفقاتك." },
            ].map((s, i) => (
              <div key={s.n} className="relative glass rounded-3xl p-7 hover:bg-white/[0.06] transition group">
                <span className="absolute top-5 left-5 font-cairo font-bold text-5xl text-white/5 group-hover:text-emerald-400/30 transition">{s.n}</span>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white font-cairo font-bold text-xl flex items-center justify-center mb-5 shadow-lg">
                  {i + 1}
                </div>
                <h3 className="font-cairo font-bold text-xl mb-2">{s.t}</h3>
                <p className="font-cairo text-white/70 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="font-cairo text-xs font-bold text-emerald-300 bg-emerald-400/10 ring-1 ring-emerald-400/20 px-3 py-1.5 rounded-full inline-block mb-4">آراء العملاء</span>
            <h2 className="font-cairo text-4xl sm:text-5xl font-bold mb-4 tracking-tight">ثقة عملائنا <span className="text-gradient">تتحدث عنا</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "زين خلف الله", role: "رائد أعمال", text: "حصلت على تمويل لمشروعي خلال أسبوعين فقط. التجربة احترافية ومريحة جداً." },
              { name: "زين العابدين", role: "مستثمر", text: "أحببت كيف يعرض الذكاء الاصطناعي نقاط القوة والضعف لكل مشروع." },
              { name: "محمد الطيب", role: "رائد أعمال", text: "منصة موثوقة وتدعم العملة السودانية. أوصي بها كل من يبحث عن تمويل." },
            ].map(t => (
              <div key={t.name} className="glass rounded-3xl p-7 hover:bg-white/[0.06] hover:-translate-y-1 transition relative overflow-hidden">
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl" />
                <Quote className="w-8 h-8 text-emerald-300 mb-4" />
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="font-cairo text-white/85 leading-relaxed mb-6">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white font-cairo font-bold flex items-center justify-center">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-cairo font-bold">{t.name}</p>
                    <p className="font-cairo text-sm text-white/60">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="font-cairo text-xs font-bold text-emerald-300 bg-emerald-400/10 ring-1 ring-emerald-400/20 px-3 py-1.5 rounded-full inline-block mb-4">الأسئلة الشائعة</span>
            <h2 className="font-cairo text-4xl sm:text-5xl font-bold mb-4 tracking-tight">إجابات سريعة <span className="text-gradient">لأهم استفساراتك</span></h2>
          </div>
          <div className="space-y-3">
            {[
              { q: "هل المنصة آمنة لإيداع بياناتي ووثائقي؟", a: "نعم، نستخدم تشفيراً متقدماً لكل البيانات والوثائق، ونعتمد نظام KYC للتحقق من هوية كل مستخدم قبل الوصول إلى الميزات الحساسة." },
              { q: "كيف أبدأ كمستثمر أو رائد أعمال؟", a: "اضغط على «ابدأ مجاناً»، أنشئ حسابك خلال دقيقتين، أكمل التحقق، ثم تصفح المشاريع أو انشر مشروعك مباشرة." },
              { q: "هل هناك عمولات على التمويل؟", a: "نوضح كل الرسوم بشفافية في صفحة العضوية. توجد باقات مجانية وأخرى مدفوعة حسب احتياجك." },
              { q: "هل الذكاء الاصطناعي يحلل المشاريع فعلاً؟", a: "نعم، نقدم تحليل جدوى وتقييم مخاطر وحساب عائد ونموذج عمل مدعومة بالذكاء الاصطناعي بناءً على الملف المرفوع." },
              { q: "ما العملات المدعومة؟", a: "ندعم الجنيه السوداني (ج.س) كعملة أساسية، ويمكن للنماذج الذكية التعامل مع أي عملة موجودة في دراسة الجدوى." },
            ].map(f => <FaqItem key={f.q} {...f} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto rounded-[2rem] px-8 py-16 sm:px-16 relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-600 to-blue-700 gradient-anim">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute top-6 right-6 inline-flex items-center gap-2 bg-white/15 backdrop-blur px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-300 pulse-dot" />
            <span className="font-cairo text-xs">المنصة نشطة الآن</span>
          </div>
          <div className="relative grid md:grid-cols-2 gap-10 items-center">
            <div className="text-center md:text-right">
              <h2 className="font-cairo text-4xl sm:text-5xl font-bold mb-4 leading-tight">هل أنت <span className="underline decoration-white/40 underline-offset-8">مستعد للبدء؟</span></h2>
              <p className="font-cairo text-white/90 text-lg leading-relaxed">انضم لآلاف المستثمرين ورواد الأعمال على منصة Nile Invest AI اليوم.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-end">
              <Link to="/account-type" className="font-cairo font-bold text-lg bg-white text-invest-blue px-8 py-4 rounded-xl shadow-xl hover:scale-[1.03] transition">إنشاء حساب</Link>
              <Link to="/login" className="font-cairo font-bold text-lg border-2 border-white/70 text-white px-8 py-4 rounded-xl hover:bg-white/10 transition">تسجيل دخول</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-14 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10 mb-10">
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src="https://cdn.builder.io/api/v1/image/assets%2F7f0a4564e10744da98b8f1029aa8c5f2%2F84c6e7db3a0941afb913c99169ea9bde?format=webp&width=800&height=1200" alt="Nile Invest AI" className="w-11 h-11 rounded-2xl object-cover ring-1 ring-white/10" />
              <span className="font-cairo font-bold text-xl">Nile Invest AI</span>
            </Link>
            <p className="font-cairo text-sm text-white/60 leading-relaxed">منصة استثمارية سودانية تربط رواد الأعمال بالمستثمرين في كل مكان.</p>
          </div>
          {[
            { t: "المنصة", l: ["الرئيسية", "المشاريع", "كيف نعمل"] },
            { t: "الدعم", l: ["مساعدة", "اتصل بنا", "الأسئلة"] },
            { t: "قانوني", l: ["الشروط", "الخصوصية", "السياسات"] },
          ].map(col => (
            <div key={col.t}>
              <h4 className="font-cairo font-bold mb-4">{col.t}</h4>
              <ul className="space-y-2">
                {col.l.map(it => (
                  <li key={it}><a href="#" className="font-cairo text-sm text-white/60 hover:text-emerald-300 transition">{it}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-cairo text-sm text-white/50">© 2026 Nile Invest AI. جميع الحقوق محفوظة.</p>
          <p className="font-cairo text-sm text-white/50">صنع بحب 💚 في السودان</p>
        </div>
      </footer>
    </div>
  );
}
