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
  Zap,
  Wallet,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      setProgress(total > 0 ? (h.scrollTop / total) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return progress;
}

function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setInView(true),
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
}

function AnimatedCounter({ value, prefix = "", suffix = "", duration = 1600 }: { value: number; prefix?: string; suffix?: string; duration?: number }) {
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
      {prefix}
      {n.toLocaleString("ar-EG")}
      {suffix}
    </span>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white border border-light-gray rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 p-5 text-right"
      >
        <span className="font-cairo font-bold text-text-dark text-base sm:text-lg">{q}</span>
        <span className={`w-9 h-9 rounded-full flex items-center justify-center transition ${open ? "bg-invest-teal text-white rotate-180" : "bg-light-gray text-invest-blue"}`}>
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

const accents = ["from-blue-500 to-indigo-500", "from-emerald-500 to-teal-500", "from-amber-500 to-orange-500"];
const icons = ["🚀", "💡", "📊"];

export default function Index() {
  const [audience, setAudience] = useState<Audience>("investor");
  const [activeProject, setActiveProject] = useState(0);
  const [projectShowcase, setProjectShowcase] = useState<ShowcaseProject[]>([]);
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const scrollProgress = useScrollProgress();

  useEffect(() => {
    const loadShowcase = async () => {
      if (!isSupabaseConfigured) {
        setProjectShowcase([]);
        return;
      }

      const { data: projectRows } = await supabase
        .from("projects")
        .select("id, owner_id, name, sector, budget")
        .order("created_at", { ascending: false })
        .limit(6);

      if (!projectRows?.length) {
        setProjectShowcase([]);
        return;
      }

      const ownerIds = [...new Set(projectRows.map((row) => row.owner_id))];
      const ownerMap = new Map<string, string>();

      if (ownerIds.length) {
        const { data: owners } = await supabase.from("profiles").select("id, full_name").in("id", ownerIds);
        (owners ?? []).forEach((owner) => ownerMap.set(owner.id, owner.full_name ?? "رائد أعمال"));
      }

      const mapped: ShowcaseProject[] = projectRows.map((project, index) => ({
        id: project.id,
        title: project.name,
        sector: project.sector,
        founder: ownerMap.get(project.owner_id) ?? "رائد أعمال",
        progress: 20,
        raised: "0",
        target: project.budget,
        accent: accents[index % accents.length],
        icon: icons[index % icons.length],
      }));

      setProjectShowcase(mapped);
    };

    loadShowcase();
  }, []);

  // Auto-rotate showcase
  useEffect(() => {
    if (!projectShowcase.length) return;

    const id = setInterval(() => {
      setActiveProject((prev) => (prev + 1) % projectShowcase.length);
    }, 4000);
    return () => clearInterval(id);
  }, [projectShowcase.length]);

  useEffect(() => {
    if (activeProject >= projectShowcase.length) setActiveProject(0);
  }, [activeProject, projectShowcase.length]);

  const heroCopy = useMemo(() => {
    if (audience === "investor") {
      return {
        tag: "للمستثمرين",
        title: "اكتشف فرص استثمارية",
        highlight: "موثوقة وذكية",
        subtitle:
          "تصفح مشاريع سودانية واعدة، حلل بياناتها بمساعدة الذكاء الاصطناعي، واستثمر بكل ثقة من مكان واحد.",
        primaryCta: { label: "ابدأ كمستثمر", to: "/login?role=investor" },
        secondaryCta: { label: "تصفح المشاريع", to: "/browse-projects" },
      } as const;
    }
    return {
      tag: "لرواد الأعمال",
      title: "حوّل فكرتك إلى",
      highlight: "مشروع ممول وناجح",
      subtitle:
        "قدم مشروعك بأبسط طريقة، وتواصل مع مستثمرين معتمدين، واحصل على تمويل بالعملة السودانية بسهولة.",
      primaryCta: { label: "ابدأ كرائد أعمال", to: "/login?role=entrepreneur" },
      secondaryCta: { label: "كيف نعمل؟", to: "#how" },
    } as const;
  }, [audience]);

  const project = projectShowcase[activeProject];

  return (
    <div
      className="w-full min-h-screen bg-white relative overflow-x-hidden"
      dir="rtl"
      onMouseMove={(e) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        setMouse({ x, y });
      }}
    >
      <style>{`
        @keyframes floaty { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-12px) } }
        @keyframes floatySlow { 0%,100% { transform: translateY(0) rotate(0) } 50% { transform: translateY(-18px) rotate(3deg) } }
        @keyframes shimmer { 0% { background-position: 0% 50% } 50% { background-position: 100% 50% } 100% { background-position: 0% 50% } }
        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes pulseDot { 0%,100% { opacity: 1; transform: scale(1) } 50% { opacity: .55; transform: scale(.85) } }
        .float-anim { animation: floaty 5s ease-in-out infinite }
        .float-slow { animation: floatySlow 8s ease-in-out infinite }
        .gradient-anim { background-size: 200% 200%; animation: shimmer 6s ease infinite }
        .marquee-track { animation: marquee 28s linear infinite }
        .pulse-dot { animation: pulseDot 1.6s ease-in-out infinite }
        .reveal { opacity: 0; transform: translateY(20px); transition: opacity .8s ease, transform .8s ease }
        .reveal.show { opacity: 1; transform: translateY(0) }
      `}</style>

      {/* Scroll progress */}
      <div className="fixed top-0 right-0 left-0 h-1 z-[60] bg-transparent">
        <div
          className="h-full bg-gradient-to-l from-invest-teal via-emerald-400 to-invest-blue transition-[width] duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Mouse-following ambient orb */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `radial-gradient(600px circle at ${mouse.x}% ${mouse.y}%, rgba(20, 184, 166, 0.08), transparent 60%)`,
        }}
      />
      {/* HEADER */}
      <header className="fixed top-0 right-0 left-0 z-50 bg-white/85 backdrop-blur-xl border-b border-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F7f0a4564e10744da98b8f1029aa8c5f2%2F84c6e7db3a0941afb913c99169ea9bde?format=webp&width=800&height=1200"
              alt="Nile Invest AI"
              className="w-12 h-12 rounded-2xl object-cover shadow-md ring-1 ring-black/5 group-hover:shadow-xl transition"
            />
            <div className="hidden sm:block">
              <p className="font-cairo font-bold text-xl text-invest-blue leading-none">Nile Invest AI</p>
              <p className="font-cairo text-[11px] text-dark-gray">المنصة السودانية للاستثمار الذكي</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {[
              { l: "الميزات", h: "#features" },
              { l: "للمستثمرين", h: "#investors" },
              { l: "لرواد الأعمال", h: "#founders" },
              { l: "كيف نعمل", h: "#how" },
              { l: "آراء العملاء", h: "#testimonials" },
            ].map((it) => (
              <a
                key={it.l}
                href={it.h}
                className="font-cairo text-sm font-semibold text-text-dark hover:text-invest-teal hover:bg-light-gray px-4 py-2 rounded-lg transition"
              >
                {it.l}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden sm:inline-flex font-cairo font-semibold text-sm text-invest-blue px-4 py-2 rounded-lg hover:bg-light-gray transition"
            >
              دخول
            </Link>
            <Link
              to="/account-type"
              className="font-cairo font-bold text-sm bg-invest-blue text-white px-5 py-2.5 rounded-xl hover:bg-blue-900 transition shadow-md hover:shadow-xl"
            >
              ابدأ مجاناً
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-invest-teal/10 rounded-full blur-3xl float-slow"></div>
        <div className="absolute top-40 -left-32 w-[500px] h-[500px] bg-invest-blue/10 rounded-full blur-3xl float-anim"></div>
        <div
          aria-hidden
          className="absolute inset-0 -z-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #0f3360 1px, transparent 1px), linear-gradient(to bottom, #0f3360 1px, transparent 1px)",
            backgroundSize: "42px 42px",
            maskImage:
              "radial-gradient(ellipse at center, rgba(0,0,0,.7), transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, rgba(0,0,0,.7), transparent 70%)",
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Audience Switch */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-light-gray p-1.5 rounded-2xl shadow-inner">
              {(
                [
                  { key: "investor", label: "أنا مستثمر" },
                  { key: "entrepreneur", label: "أنا رائد أعمال" },
                ] as { key: Audience; label: string }[]
              ).map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setAudience(opt.key)}
                  className={`font-cairo font-bold text-sm px-6 py-2.5 rounded-xl transition-all duration-300 ${
                    audience === opt.key
                      ? "bg-white text-invest-blue shadow"
                      : "text-dark-gray hover:text-text-dark"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Text */}
            <div className="lg:col-span-7 lg:order-2 text-center lg:text-right">
              <span className="inline-flex items-center gap-2 font-cairo text-xs font-bold text-invest-teal bg-invest-teal/10 px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4" />
                {heroCopy.tag}
              </span>
              <h1 className="font-cairo text-5xl sm:text-6xl lg:text-7xl font-bold text-invest-blue leading-tight mb-6">
                {heroCopy.title}{" "}
                <span className="bg-gradient-to-r from-invest-teal to-emerald-500 bg-clip-text text-transparent">
                  {heroCopy.highlight}
                </span>
              </h1>
              <p className="font-cairo text-lg text-dark-gray mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {heroCopy.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 mb-10 justify-center lg:justify-start">
                <Link
                  to={heroCopy.primaryCta.to}
                  className="font-cairo font-bold text-base bg-invest-blue text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-2xl hover:bg-blue-900 transition inline-flex items-center gap-2 group"
                >
                  {heroCopy.primaryCta.label}
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition" />
                </Link>
                <Link
                  to={heroCopy.secondaryCta.to}
                  className="font-cairo font-bold text-base text-invest-blue px-7 py-4 rounded-xl hover:bg-light-gray transition inline-flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  {heroCopy.secondaryCta.label}
                </Link>
              </div>

              {/* trust strip */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-dark-gray">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-invest-teal" />
                  <span className="font-cairo text-sm">تحقق KYC معتمد</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-invest-teal" />
                  <span className="font-cairo text-sm">تشفير عالي الجودة</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-invest-teal" />
                  <span className="font-cairo text-sm">دعم بالذكاء الاصطناعي</span>
                </div>
              </div>
            </div>

            {/* Interactive showcase */}
            <div className="lg:col-span-5 lg:order-1">
              <div className="relative">
                {/* Decorative blocks */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-invest-teal/30 to-transparent rounded-2xl rotate-12 float-slow"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-invest-blue/30 to-transparent rounded-2xl -rotate-12 float-anim"></div>

                <div className="relative bg-white rounded-3xl shadow-2xl border border-light-gray overflow-hidden">
                  {project ? (
                    <>
                      <div className={`h-2 bg-gradient-to-r ${project.accent}`}></div>

                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${project.accent} flex items-center justify-center text-3xl shadow-lg`}>
                              {project.icon}
                            </div>
                            <div>
                              <p className="font-cairo text-xs text-dark-gray">{project.sector}</p>
                              <h3 className="font-cairo font-bold text-lg text-text-dark">{project.title}</h3>
                              <p className="font-cairo text-xs text-dark-gray">رائد الأعمال: {project.founder}</p>
                            </div>
                          </div>
                          <button className="w-9 h-9 rounded-full bg-light-gray hover:bg-invest-teal/10 transition flex items-center justify-center">
                            <Heart className="w-4 h-4 text-invest-red" />
                          </button>
                        </div>

                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-cairo text-xs text-dark-gray">تم تمويله</span>
                            <span className="font-cairo text-xs font-bold text-invest-blue">{project.progress}%</span>
                          </div>
                          <div className="h-2 bg-light-gray rounded-full overflow-hidden">
                            <div className={`h-full bg-gradient-to-r ${project.accent} rounded-full transition-all duration-700`} style={{ width: `${project.progress}%` }}></div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="bg-light-gray rounded-xl p-3">
                            <p className="font-cairo text-[10px] text-dark-gray">الجمع</p>
                            <p className="font-cairo font-bold text-sm text-invest-teal">{project.raised} ج.س</p>
                          </div>
                          <div className="bg-light-gray rounded-xl p-3">
                            <p className="font-cairo text-[10px] text-dark-gray">المستهدف</p>
                            <p className="font-cairo font-bold text-sm text-invest-blue">{project.target} ج.س</p>
                          </div>
                        </div>

                        <Link
                          to="/browse-projects"
                          className="w-full inline-flex items-center justify-center gap-2 py-3 bg-invest-blue text-white rounded-xl font-cairo font-bold text-sm hover:bg-blue-900 transition"
                        >
                          عرض التفاصيل
                          <ArrowLeft className="w-4 h-4" />
                        </Link>

                        <div className="flex items-center justify-center gap-2 mt-5">
                          {projectShowcase.map((p, idx) => (
                            <button
                              key={p.id}
                              onClick={() => setActiveProject(idx)}
                              className={`h-2 rounded-full transition-all ${idx === activeProject ? "w-8 bg-invest-teal" : "w-2 bg-light-gray hover:bg-dark-gray/40"}`}
                              aria-label={`عرض المشروع ${idx + 1}`}
                            />
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="p-10 text-center">
                      <p className="font-cairo text-dark-gray">لا توجد مشاريع منشورة بعد في قاعدة البيانات.</p>
                    </div>
                  )}
                </div>

                {/* Floating chips */}
                <div className="absolute -top-4 left-6 bg-white rounded-2xl shadow-lg px-4 py-2 flex items-center gap-2 border border-light-gray">
                  <div className="w-7 h-7 rounded-full bg-invest-teal/10 flex items-center justify-center">
                    <Star className="w-4 h-4 text-invest-teal fill-invest-teal" />
                  </div>
                  <div>
                    <p className="font-cairo text-[10px] text-dark-gray">تقييم</p>
                    <p className="font-cairo font-bold text-xs text-text-dark">4.9 / 5</p>
                  </div>
                </div>
                <div className="absolute -bottom-4 right-8 bg-white rounded-2xl shadow-lg px-4 py-2 flex items-center gap-2 border border-light-gray">
                  <div className="w-7 h-7 rounded-full bg-invest-blue/10 flex items-center justify-center">
                    <Users className="w-4 h-4 text-invest-blue" />
                  </div>
                  <div>
                    <p className="font-cairo text-[10px] text-dark-gray">مستثمرون</p>
                    <p className="font-cairo font-bold text-xs text-text-dark">128 مهتم</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-gradient-to-l from-invest-blue via-[#0c2a52] to-invest-blue text-white relative overflow-hidden gradient-anim">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 70%, white 1px, transparent 1px)", backgroundSize: "40px 40px, 56px 56px" }} />
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative">
          {[
            { v: 500, suffix: "+", l: "مشروع مسجل", icon: Briefcase },
            { v: 1000, suffix: "+", l: "مستثمر نشط", icon: Users },
            { v: 2000, suffix: "+", l: "رائد أعمال", icon: TrendingUp },
            { v: 50, suffix: "+", l: "مطابقات ناجحة", icon: Handshake },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="flex flex-col items-center group">
                <div className="w-12 h-12 rounded-2xl bg-white/10 group-hover:bg-invest-teal/20 transition flex items-center justify-center mb-3 ring-1 ring-white/10">
                  <Icon className="w-6 h-6 text-invest-teal" />
                </div>
                <p className="font-cairo font-bold text-4xl tracking-tight">
                  <AnimatedCounter value={s.v} suffix={s.suffix} />
                </p>
                <p className="font-cairo text-sm text-white/70 mt-1">{s.l}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* PARTNERS MARQUEE */}
      <section className="py-10 bg-white border-b border-light-gray">
        <p className="text-center font-cairo text-xs font-bold tracking-widest text-dark-gray mb-6">
          شركاء النجاح والثقة
        </p>
        <div className="relative overflow-hidden" style={{ maskImage: "linear-gradient(to left, transparent, black 12%, black 88%, transparent)", WebkitMaskImage: "linear-gradient(to left, transparent, black 12%, black 88%, transparent)" }}>
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
                const Icon = p.icon;
                return (
                  <div key={`${dup}-${i}`} className="flex items-center gap-3 text-dark-gray hover:text-invest-blue transition">
                    <div className="w-10 h-10 rounded-xl bg-light-gray flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-cairo font-bold text-base">{p.n}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-cairo text-xs font-bold text-invest-teal bg-invest-teal/10 px-3 py-1.5 rounded-full inline-block mb-4">
              لماذا Nile Invest AI
            </span>
            <h2 className="font-cairo text-4xl sm:text-5xl font-bold text-invest-blue mb-4">
              كل ما تحتاجه في مكان واحد
            </h2>
            <p className="font-cairo text-lg text-dark-gray">
              أدوات احترافية تجعل رحلتك الاستثمارية أسهل وأكثر أماناً
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Search,
                title: "اكتشاف ذكي للمشاريع",
                desc: "بحث وتصنيف متقدم حسب القطاع والمرحلة والتمويل المطلوب.",
                color: "from-blue-500 to-indigo-500",
              },
              {
                icon: BarChart3,
                title: "تحليل بالذكاء الاصطناعي",
                desc: "تقييمات ذكية وتقارير مالية تلقائية لكل مشروع.",
                color: "from-emerald-500 to-teal-500",
              },
              {
                icon: ShieldCheck,
                title: "حماية وتحقق كامل",
                desc: "نظام KYC شامل وتشفير لجميع البيانات والمعاملات.",
                color: "from-amber-500 to-orange-500",
              },
              {
                icon: Handshake,
                title: "ربط مباشر وآمن",
                desc: "تواصل بدون وسطاء بين المستثمرين ورواد الأعمال.",
                color: "from-rose-500 to-pink-500",
              },
              {
                icon: TrendingUp,
                title: "تتبع أداء الاستثمار",
                desc: "لوحة تحكم تعرض نمو محفظتك في الوقت الفعلي.",
                color: "from-purple-500 to-fuchsia-500",
              },
              {
                icon: Sparkles,
                title: "توصيات مخصصة",
                desc: "نقترح عليك أفضل الفرص حسب اهتماماتك وميزانيتك.",
                color: "from-cyan-500 to-blue-500",
              },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="group relative bg-white border border-light-gray rounded-2xl p-7 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  <div
                    className={`absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br ${f.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition`}
                  ></div>
                  <div
                    className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center shadow-lg mb-5`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-cairo font-bold text-xl text-text-dark mb-2">{f.title}</h3>
                  <p className="font-cairo text-dark-gray leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-24 px-4 sm:px-6 lg:px-8 bg-light-gray">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-cairo text-xs font-bold text-invest-blue bg-invest-blue/10 px-3 py-1.5 rounded-full inline-block mb-4">
              كيف نعمل
            </span>
            <h2 className="font-cairo text-4xl sm:text-5xl font-bold text-invest-blue mb-4">
              ابدأ خلال دقائق
            </h2>
            <p className="font-cairo text-lg text-dark-gray">3 خطوات بسيطة لبدء رحلتك معنا</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {[
              { n: "1", t: "أنشئ حسابك", d: "سجل واختر دورك كمستثمر أو رائد أعمال." },
              { n: "2", t: "أكمل التحقق", d: "ارفع وثائقك وأكمل خطوات KYC في دقائق." },
              { n: "3", t: "ابدأ التفاعل", d: "تصفح المشاريع، أرسل طلبات، وحقق صفقاتك." },
            ].map((s) => (
              <div key={s.n} className="relative bg-white rounded-2xl p-7 shadow-md">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-invest-blue to-invest-teal text-white font-cairo font-bold text-2xl flex items-center justify-center mb-5 shadow-lg">
                  {s.n}
                </div>
                <h3 className="font-cairo font-bold text-xl text-text-dark mb-2">{s.t}</h3>
                <p className="font-cairo text-dark-gray leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="font-cairo text-xs font-bold text-invest-teal bg-invest-teal/10 px-3 py-1.5 rounded-full inline-block mb-4">
              الأسئلة الشائعة
            </span>
            <h2 className="font-cairo text-4xl sm:text-5xl font-bold text-invest-blue mb-4">
              إجابات سريعة لأهم استفساراتك
            </h2>
            <p className="font-cairo text-lg text-dark-gray">كل ما تحتاج معرفته قبل أن تبدأ معنا</p>
          </div>
          <div className="space-y-3">
            {[
              { q: "هل المنصة آمنة لإيداع بياناتي ووثائقي؟", a: "نعم، نستخدم تشفيراً متقدماً لكل البيانات والوثائق، ونعتمد نظام KYC للتحقق من هوية كل مستخدم قبل الوصول إلى الميزات الحساسة." },
              { q: "كيف أبدأ كمستثمر أو رائد أعمال؟", a: "اضغط على «ابدأ مجاناً»، أنشئ حسابك خلال دقيقتين، أكمل التحقق، ثم تصفح المشاريع أو انشر مشروعك مباشرة." },
              { q: "هل هناك عمولات على التمويل؟", a: "نوضح كل الرسوم بشفافية في صفحة العضوية. توجد باقات مجانية وأخرى مدفوعة حسب احتياجك." },
              { q: "هل الذكاء الاصطناعي يحلل المشاريع فعلاً؟", a: "نعم، نقدم تحليل جدوى وتقييم مخاطر وحساب عائد ونموذج عمل مدعومة بالذكاء الاصطناعي بناءً على الملف المرفوع." },
              { q: "ما العملات المدعومة؟", a: "ندعم الجنيه السوداني (ج.س) كعملة أساسية، ويمكن للنماذج الذكية التعامل مع أي عملة موجودة في دراسة الجدوى." },
            ].map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-cairo text-xs font-bold text-invest-teal bg-invest-teal/10 px-3 py-1.5 rounded-full inline-block mb-4">
              آراء العملاء
            </span>
            <h2 className="font-cairo text-5xl sm:text-6xl font-bold text-invest-blue mb-4">
              ثقة عملائنا تتحدث عنا
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "زين خلف الله",
                role: "رائد أعمال",
                text: "حصلت على تمويل لمشروعي خلال أسبوعين فقط. التجربة احترافية ومريحة جداً.",
              },
              {
                name: "زين العابدين",
                role: "مستثمر",
                text: "أحببت كيف يعرض الذكاء الاصطناعي نقاط القوة والضعف لكل مشروع.",
              },
              {
                name: "محمد الطيب",
                role: "رائد أعمال",
                text: "منصة موثوقة وتدعم العملة السودانية. أوصي بها كل من يبحث عن تمويل.",
              },
            ].map((t, idx) => (
              <div
                key={t.name}
                className="bg-white border border-light-gray rounded-2xl p-7 hover:-translate-y-1 hover:shadow-2xl transition relative overflow-hidden"
                style={{ animationDelay: `${idx * 120}ms` }}
              >
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-invest-teal/10 rounded-full blur-2xl" />
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-invest-teal mb-4" />
                <p className="font-cairo text-text-dark leading-relaxed mb-6">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-invest-blue to-invest-teal text-white font-cairo font-bold flex items-center justify-center">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-cairo font-bold text-text-dark">{t.name}</p>
                    <p className="font-cairo text-sm text-dark-gray">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto bg-gradient-to-br from-invest-blue via-invest-blue to-invest-teal rounded-3xl px-8 py-16 sm:px-16 relative overflow-hidden gradient-anim">
          <div className="absolute top-6 right-6 inline-flex items-center gap-2 bg-white/15 backdrop-blur px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot"></span>
            <span className="font-cairo text-xs text-white">المنصة نشطة الآن</span>
          </div>
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

          <div className="relative grid md:grid-cols-2 gap-10 items-center">
            <div className="text-white text-center md:text-right">
              <h2 className="font-cairo text-4xl sm:text-5xl font-bold mb-4">
                هل أنت مستعد للبدء؟
              </h2>
              <p className="font-cairo text-white/90 text-lg leading-relaxed">
                انضم لآلاف المستثمرين ورواد الأعمال على منصة Nile Invest AI اليوم.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-end">
              <Link
                to="/account-type"
                className="font-cairo font-bold text-lg bg-white text-invest-blue px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition"
              >
                إنشاء حساب
              </Link>
              <Link
                to="/login"
                className="font-cairo font-bold text-lg border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white/10 transition"
              >
                تسجيل دخول
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-light-gray py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10 mb-10">
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F7f0a4564e10744da98b8f1029aa8c5f2%2F84c6e7db3a0941afb913c99169ea9bde?format=webp&width=800&height=1200"
                alt="Nile Invest AI"
                className="w-11 h-11 rounded-2xl object-cover shadow ring-1 ring-black/5"
              />
              <span className="font-cairo font-bold text-xl text-invest-blue">Nile Invest AI</span>
            </Link>
            <p className="font-cairo text-sm text-dark-gray leading-relaxed">
              منصة استثمارية سودانية تربط رواد الأعمال بالمستثمرين في كل مكان.
            </p>
          </div>
          {[
            { t: "المنصة", l: ["الرئيسية", "المشاريع", "كيف نعمل"] },
            { t: "الدعم", l: ["مساعدة", "اتصل بنا", "الأسئلة"] },
            { t: "قانوني", l: ["الشروط", "الخصوصية", "السياسات"] },
          ].map((col) => (
            <div key={col.t}>
              <h4 className="font-cairo font-bold text-text-dark mb-4">{col.t}</h4>
              <ul className="space-y-2">
                {col.l.map((it) => (
                  <li key={it}>
                    <a href="#" className="font-cairo text-sm text-dark-gray hover:text-invest-teal">
                      {it}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto pt-6 border-t border-light-gray flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-cairo text-sm text-dark-gray">© 2026 Nile Invest AI. جميع الحقوق محفوظة.</p>
          <p className="font-cairo text-sm text-dark-gray">صنع بحب 💚 في السودان</p>
        </div>
      </footer>
    </div>
  );
}
