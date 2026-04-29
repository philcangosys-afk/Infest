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
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Audience = "investor" | "entrepreneur";

const projectShowcase = [
  {
    id: 1,
    title: "منصة التعليم الذكي",
    sector: "التعليم",
    founder: "زين خلف الله",
    progress: 78,
    raised: "1,950,000",
    target: "2,500,000",
    accent: "from-blue-500 to-indigo-500",
    icon: "🎓",
  },
  {
    id: 2,
    title: "نمو الزراعة الذكية",
    sector: "الزراعة",
    founder: "سارة نور",
    progress: 64,
    raised: "1,150,000",
    target: "1,800,000",
    accent: "from-emerald-500 to-teal-500",
    icon: "🌱",
  },
  {
    id: 3,
    title: "حلول الطاقة المتجددة",
    sector: "الطاقة",
    founder: "خالد عثمان",
    progress: 42,
    raised: "1,470,000",
    target: "3,500,000",
    accent: "from-amber-500 to-orange-500",
    icon: "⚡",
  },
];

export default function Index() {
  const [audience, setAudience] = useState<Audience>("investor");
  const [activeProject, setActiveProject] = useState(0);

  // Auto-rotate showcase
  useEffect(() => {
    const id = setInterval(() => {
      setActiveProject((prev) => (prev + 1) % projectShowcase.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const heroCopy = useMemo(() => {
    if (audience === "investor") {
      return {
        tag: "للمستثمرين",
        title: "اكتشف فرص استثمارية",
        highlight: "موثوقة وذكية",
        subtitle:
          "تصفح مشاريع سودانية واعدة، حلل بياناتها بمساعدة الذكاء الاصطناعي، واستثمر بكل ثقة من مكان واحد.",
        primaryCta: { label: "ابدأ كمستثمر", to: "/investor-dashboard" },
        secondaryCta: { label: "تصفح المشاريع", to: "/browse-projects" },
      } as const;
    }
    return {
      tag: "لرواد الأعمال",
      title: "حوّل فكرتك إلى",
      highlight: "مشروع ممول وناجح",
      subtitle:
        "قدم مشروعك بأبسط طريقة، وتواصل مع مستثمرين معتمدين، واحصل على تمويل بالعملة السودانية بسهولة.",
      primaryCta: { label: "ابدأ كرائد أعمال", to: "/dashboard" },
      secondaryCta: { label: "كيف نعمل؟", to: "#how" },
    } as const;
  }, [audience]);

  const project = projectShowcase[activeProject];

  return (
    <div className="w-full min-h-screen bg-white" dir="rtl">
      {/* HEADER */}
      <header className="fixed top-0 right-0 left-0 z-50 bg-white/85 backdrop-blur-xl border-b border-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F7f0a4564e10744da98b8f1029aa8c5f2%2Fa3e69d6032c542e1bf773a404542304a?format=webp&width=800&height=1200"
              alt="Nile Invest AI"
              className="w-12 h-12 rounded-2xl object-cover shadow-md group-hover:shadow-xl transition"
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
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-invest-teal/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 -left-32 w-[500px] h-[500px] bg-invest-blue/10 rounded-full blur-3xl"></div>

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
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-invest-teal/30 to-transparent rounded-2xl rotate-12"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-invest-blue/30 to-transparent rounded-2xl -rotate-12"></div>

                <div className="relative bg-white rounded-3xl shadow-2xl border border-light-gray overflow-hidden">
                  {/* Header bar */}
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

                    {/* Progress */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-cairo text-xs text-dark-gray">تم تمويله</span>
                        <span className="font-cairo text-xs font-bold text-invest-blue">
                          {project.progress}%
                        </span>
                      </div>
                      <div className="h-2 bg-light-gray rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${project.accent} rounded-full transition-all duration-700`}
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-light-gray rounded-xl p-3">
                        <p className="font-cairo text-[10px] text-dark-gray">الجمع</p>
                        <p className="font-cairo font-bold text-sm text-invest-teal">
                          {project.raised} ج.س
                        </p>
                      </div>
                      <div className="bg-light-gray rounded-xl p-3">
                        <p className="font-cairo text-[10px] text-dark-gray">المستهدف</p>
                        <p className="font-cairo font-bold text-sm text-invest-blue">
                          {project.target} ج.س
                        </p>
                      </div>
                    </div>

                    <Link
                      to="/browse-projects"
                      className="w-full inline-flex items-center justify-center gap-2 py-3 bg-invest-blue text-white rounded-xl font-cairo font-bold text-sm hover:bg-blue-900 transition"
                    >
                      عرض التفاصيل
                      <ArrowLeft className="w-4 h-4" />
                    </Link>

                    {/* dots */}
                    <div className="flex items-center justify-center gap-2 mt-5">
                      {projectShowcase.map((p, idx) => (
                        <button
                          key={p.id}
                          onClick={() => setActiveProject(idx)}
                          className={`h-2 rounded-full transition-all ${
                            idx === activeProject
                              ? "w-8 bg-invest-teal"
                              : "w-2 bg-light-gray hover:bg-dark-gray/40"
                          }`}
                          aria-label={`عرض المشروع ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
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
      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-invest-blue text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { v: "+500", l: "مشروع مسجل", icon: Briefcase },
            { v: "+1000", l: "مستثمر نشط", icon: Users },
            { v: "+2000", l: "رائد أعمال", icon: TrendingUp },
            { v: "+50", l: "صفقة منجزة", icon: Handshake },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="flex flex-col items-center">
                <Icon className="w-7 h-7 mb-2 text-invest-teal" />
                <p className="font-cairo font-bold text-3xl">{s.v}</p>
                <p className="font-cairo text-sm text-white/70">{s.l}</p>
              </div>
            );
          })}
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

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-cairo text-xs font-bold text-invest-teal bg-invest-teal/10 px-3 py-1.5 rounded-full inline-block mb-4">
              آراء العملاء
            </span>
            <h2 className="font-cairo text-4xl sm:text-5xl font-bold text-invest-blue mb-4">
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
            ].map((t) => (
              <div
                key={t.name}
                className="bg-white border border-light-gray rounded-2xl p-7 hover:shadow-2xl transition"
              >
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
        <div className="max-w-6xl mx-auto bg-gradient-to-br from-invest-blue via-invest-blue to-invest-teal rounded-3xl px-8 py-16 sm:px-16 relative overflow-hidden">
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
                src="https://cdn.builder.io/api/v1/image/assets%2F7f0a4564e10744da98b8f1029aa8c5f2%2Fa3e69d6032c542e1bf773a404542304a?format=webp&width=800&height=1200"
                alt="Nile Invest AI"
                className="w-11 h-11 rounded-2xl object-cover shadow"
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
          <p className="font-cairo text-sm text-dark-gray">© 2024 Nile Invest AI. جميع الحقوق محفوظة.</p>
          <p className="font-cairo text-sm text-dark-gray">صنع بحب 💚 في السودان</p>
        </div>
      </footer>
    </div>
  );
}
