import { Link } from "react-router-dom";
import { TrendingUp, Bell, Eye, Heart, Send, Briefcase, Search, User, MessageCircle, Settings, Bot, Wand2, Calculator } from "lucide-react";
import { useMemo, useState } from "react";

type InvestorSection = "dashboard" | "available" | "favorites" | "requests" | "messages" | "profile" | "settings";

export default function InvestorDashboard() {
  const [activeSection, setActiveSection] = useState<InvestorSection>("dashboard");
  const [advisorTask, setAdvisorTask] = useState<"feasibility" | "compare" | "returns">("feasibility");
  const [advisorInput, setAdvisorInput] = useState("");
  const [advisorChat, setAdvisorChat] = useState<{ id: number; role: "assistant" | "user"; text: string }[]>([
    {
      id: 1,
      role: "assistant",
      text: "مرحبًا، أنا مستشار المستثمر الذكي. اكتب أي مشروع وسأقدم لك تحليلًا سريعًا للجدوى والعائد.",
    },
  ]);

  const sendAdvisorMessage = () => {
    const message = advisorInput.trim();
    if (!message) return;

    const modeReply =
      advisorTask === "feasibility"
        ? "تحليل الجدوى: ابدأ بمراجعة التدفق النقدي المتوقع، نسبة الإشغال/المبيعات، ومخاطر السوق قبل اتخاذ القرار."
        : advisorTask === "compare"
          ? "المقارنة: قارن بين معدل النمو، فترة الاسترداد، وخبرة الفريق التشغيلي لتحديد الخيار الأكثر توازنًا."
          : "تقدير العائد: أدخل مبلغ الاستثمار والعائد السنوي المتوقع لأحسب لك صافي العائد بصورة مبسطة.";

    setAdvisorChat((prev) => [
      ...prev,
      { id: prev.length + 1, role: "user", text: message },
      { id: prev.length + 2, role: "assistant", text: modeReply },
    ]);
    setAdvisorInput("");
  };

  const suggestedProjects = [
    { id: 1, name: "منصة التعليم الذكي", founder: "زين خلف الله", amount: "2,500,000 ج.س", rating: 4.8 },
    { id: 2, name: "نمو الزراعة", founder: "سارة نور", amount: "1,800,000 ج.س", rating: 4.6 },
    { id: 3, name: "سلسلة الإمداد الذكية", founder: "خالد عثمان", amount: "3,500,000 ج.س", rating: 4.7 },
  ];

  const favorites = [
    { id: 1, project: "فكرة AI للرعاية", stage: "Prototype", savedAt: "2024/05/12" },
    { id: 2, project: "صحة الآن", stage: "Startup", savedAt: "2024/05/10" },
  ];

  const myRequests = [
    { id: 1, project: "منصة التعليم الذكي", status: "قيد المراجعة", date: "2024/05/20" },
    { id: 2, project: "نمو الزراعة", status: "تم الرد", date: "2024/05/18" },
  ];

  const nav = useMemo(
    () => [
      { key: "dashboard" as const, label: "لوحة التحكم", icon: "📊" },
      { key: "available" as const, label: "المشاريع المتاحة", icon: "🔎" },
      { key: "favorites" as const, label: "اهتماماتي", icon: "❤️" },
      { key: "requests" as const, label: "طلباتي", icon: "📋" },
      { key: "messages" as const, label: "الرسائل", icon: "💬" },
      { key: "profile" as const, label: "الملف الشخصي", icon: "👤" },
      { key: "settings" as const, label: "الإعدادات", icon: "⚙️" },
    ],
    [],
  );

  const titles: Record<InvestorSection, string> = {
    dashboard: "ملخص المستثمر",
    available: "استكشف المشاريع المتاحة",
    favorites: "المشاريع المحفوظة",
    requests: "طلبات الاستثمار",
    messages: "محادثاتك",
    profile: "بيانات المستثمر",
    settings: "إعدادات الحساب",
  };

  return (
    <div className="min-h-screen bg-light-gray" dir="rtl">
      <aside className="fixed right-0 top-0 bottom-0 w-64 bg-invest-blue text-white p-6 overflow-y-auto">
        <Link to="/" className="flex items-center gap-2 mb-12">
          <div className="w-10 h-10 bg-invest-teal rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <span className="font-cairo font-bold text-lg">Nile Invest AI</span>
        </Link>

        <nav className="space-y-3">
          {nav.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveSection(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-cairo font-semibold transition ${
                activeSection === item.key
                  ? "bg-invest-teal text-invest-blue"
                  : "text-white hover:bg-invest-blue/80"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <Link
          to="/browse-projects"
          className="mt-10 block w-full px-4 py-3 border border-invest-teal/40 rounded-lg text-center font-cairo font-semibold text-invest-teal hover:bg-invest-teal/10 transition"
        >
          العودة لتصفح المشاريع
        </Link>
      </aside>

      <main className="mr-64 min-h-screen">
        <header className="bg-white border-b border-light-gray sticky top-0 z-20">
          <div className="px-8 h-20 flex items-center justify-between">
            <div>
              <h1 className="font-cairo font-bold text-2xl text-invest-blue">مرحباً، زين العابدين 👋</h1>
              <p className="font-cairo text-sm text-dark-gray">{titles[activeSection]}</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-light-gray rounded-lg transition relative">
                <Bell className="w-6 h-6 text-dark-gray" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-invest-red"></span>
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-invest-blue to-invest-teal text-white font-cairo font-bold flex items-center justify-center">م</div>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {activeSection === "dashboard" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: Eye, label: "مشاريع متصفحة", value: "24" },
                  { icon: Heart, label: "اهتمامات محفوظة", value: "8" },
                  { icon: Send, label: "طلبات مرسلة", value: "5" },
                  { icon: Briefcase, label: "صفقات منجزة", value: "2" },
                ].map((card, i) => {
                  const Icon = card.icon;
                  return (
                    <div key={i} className="bg-white rounded-2xl p-6 shadow-lg">
                      <Icon className="w-7 h-7 text-invest-teal mb-2" />
                      <p className="font-cairo text-sm text-dark-gray">{card.label}</p>
                      <p className="font-cairo text-4xl font-bold text-text-dark">{card.value}</p>
                    </div>
                  );
                })}
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="font-cairo font-bold text-xl mb-4">مشاريع مقترحة لك</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {suggestedProjects.map((p) => (
                    <div key={p.id} className="border border-light-gray rounded-xl p-4">
                      <p className="font-cairo font-bold">{p.name}</p>
                      <p className="font-cairo text-sm text-dark-gray">رائد الأعمال: {p.founder}</p>
                      <p className="font-cairo text-sm text-invest-teal mt-1">{p.amount}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-light-gray">
                <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-invest-blue/10 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-invest-blue" />
                    </div>
                    <div>
                      <h2 className="font-cairo font-bold text-xl text-text-dark">مستشار المستثمر الذكي</h2>
                      <p className="font-cairo text-xs text-dark-gray">تحليل سريع للجدوى والعائد قبل اتخاذ قرار الاستثمار</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-invest-teal/10 text-invest-teal font-cairo text-xs font-bold">
                    <Wand2 className="w-3.5 h-3.5" />
                    AI Assistant
                  </span>
                </div>

                <div className="grid md:grid-cols-3 gap-2 mb-4">
                  {[
                    { key: "feasibility", label: "تحليل الجدوى" },
                    { key: "compare", label: "قارن المشاريع" },
                    { key: "returns", label: "احسب العائد" },
                  ].map((action) => (
                    <button
                      key={action.key}
                      onClick={() => setAdvisorTask(action.key as "feasibility" | "compare" | "returns")}
                      className={`px-4 py-2.5 rounded-xl border font-cairo text-sm font-semibold transition ${
                        advisorTask === action.key
                          ? "bg-invest-teal text-white border-invest-teal"
                          : "bg-white text-dark-gray border-light-gray hover:border-invest-blue hover:text-invest-blue"
                      }`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-light-gray/50 border border-light-gray max-w-2xl">
                    <p className="font-cairo text-sm text-dark-gray">
                      أرغب في تقييم مشروع عقاري في الخرطوم، هل يمكنك تحليل الجدوى الاستثمارية؟
                    </p>
                  </div>

                  {advisorTask === "feasibility" && (
                    <div className="p-4 rounded-xl bg-invest-blue text-white max-w-3xl mr-auto">
                      <p className="font-cairo text-sm leading-7">
                        بناءً على البيانات المدخلة: العائد المتوقع على الاستثمار (ROI) حوالي 16-18% سنويًا،
                        وفترة الاسترداد التقديرية 5.5 سنوات مع مستوى مخاطرة متوسط.
                      </p>
                    </div>
                  )}

                  {advisorTask === "compare" && (
                    <div className="p-4 rounded-xl bg-invest-blue text-white max-w-3xl mr-auto">
                      <p className="font-cairo text-sm leading-7">
                        مقارنة سريعة: مشروع التعليم الذكي يحقق نموًا أسرع للمستخدمين، بينما مشروع الزراعة يقدم
                        استقرارًا أعلى في التدفق النقدي. التنويع بينهما يقلل المخاطر الإجمالية.
                      </p>
                    </div>
                  )}

                  {advisorTask === "returns" && (
                    <div className="p-4 rounded-xl bg-invest-blue text-white max-w-3xl mr-auto">
                      <p className="font-cairo text-sm leading-7">
                        <span className="inline-flex items-center gap-1 ml-1 font-bold"><Calculator className="w-4 h-4" />تقدير العائد:</span>
                        عند استثمار 2,000,000 ج.س بعائد سنوي 17%، العائد السنوي المتوقع ≈ 340,000 ج.س قبل الرسوم.
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4 rounded-xl border border-light-gray overflow-hidden">
                  <div className="bg-light-gray/60 px-4 py-3 border-b border-light-gray">
                    <p className="font-cairo text-sm font-bold text-text-dark">الدردشة مع مستشار المستثمر</p>
                  </div>

                  <div className="p-4 space-y-3 max-h-64 overflow-y-auto bg-white">
                    {advisorChat.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.role === "assistant" ? "justify-start" : "justify-end"}`}>
                        <div
                          className={`max-w-[85%] rounded-xl px-4 py-2.5 font-cairo text-sm leading-7 ${
                            msg.role === "assistant"
                              ? "bg-light-gray text-text-dark"
                              : "bg-invest-blue text-white"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 border-t border-light-gray bg-white flex gap-2">
                    <button
                      onClick={sendAdvisorMessage}
                      className="px-4 py-2 rounded-lg bg-invest-teal text-white font-cairo text-sm font-bold hover:bg-emerald-600 transition"
                    >
                      إرسال
                    </button>
                    <input
                      value={advisorInput}
                      onChange={(e) => setAdvisorInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendAdvisorMessage()}
                      placeholder="اكتب سؤالك لمستشار المستثمر..."
                      className="flex-1 border border-light-gray rounded-lg px-4 py-2 font-cairo text-sm focus:outline-none focus:border-invest-teal"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSection === "available" && (
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Search className="w-5 h-5 text-dark-gray" />
                <h2 className="font-cairo font-bold text-xl">المشاريع المتاحة للاستثمار</h2>
              </div>
              <p className="font-cairo text-dark-gray mb-4">يمكنك استعراض المشاريع بالتفصيل من صفحة التصفح.</p>
              <Link to="/browse-projects" className="inline-block px-5 py-2.5 bg-invest-teal text-white rounded-lg font-cairo font-semibold">فتح صفحة التصفح</Link>
            </div>
          )}

          {activeSection === "favorites" && (
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="font-cairo font-bold text-xl mb-4">اهتماماتي</h2>
              <div className="space-y-3">
                {favorites.map((f) => (
                  <div key={f.id} className="border border-light-gray rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="font-cairo font-semibold">{f.project}</p>
                      <p className="font-cairo text-xs text-dark-gray">{f.stage} • {f.savedAt}</p>
                    </div>
                    <button className="px-4 py-2 border border-invest-teal text-invest-teal rounded-lg font-cairo text-sm">عرض</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "requests" && (
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="font-cairo font-bold text-xl mb-4">طلباتي</h2>
              <div className="space-y-3">
                {myRequests.map((r) => (
                  <div key={r.id} className="border border-light-gray rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="font-cairo font-semibold">{r.project}</p>
                      <p className="font-cairo text-xs text-dark-gray">{r.date}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-cairo bg-light-gray text-text-dark">{r.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "messages" && (
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="w-5 h-5 text-invest-teal" />
                <h2 className="font-cairo font-bold text-xl">الرسائل</h2>
              </div>
              <p className="font-cairo text-dark-gray">لا توجد رسائل جديدة حالياً. يمكنك التواصل مع رواد الأعمال من صفحة المشروع.</p>
            </div>
          )}

          {activeSection === "profile" && (
            <div className="bg-white rounded-2xl p-6 shadow-lg space-y-5">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-5 h-5 text-invest-teal" />
                <h2 className="font-cairo font-bold text-xl">الملف الشخصي</h2>
              </div>

              <div className="p-4 border border-light-gray rounded-xl bg-light-gray/40">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-cairo text-sm font-semibold text-text-dark">اكتمال الملف الشخصي</p>
                  <p className="font-cairo text-sm font-bold text-invest-teal">88%</p>
                </div>
                <div className="h-2.5 rounded-full bg-white overflow-hidden">
                  <div className="h-full w-[88%] bg-gradient-to-l from-invest-blue to-invest-teal rounded-full"></div>
                </div>
                <p className="font-cairo text-xs text-dark-gray mt-2">أضف وثيقة إثبات الدخل لإكمال الملف 100%</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border border-light-gray rounded-xl p-4">
                  <p className="font-cairo text-xs text-dark-gray">الاسم الكامل</p>
                  <p className="font-cairo font-semibold">زين العابدين</p>
                </div>
                <div className="border border-light-gray rounded-xl p-4">
                  <p className="font-cairo text-xs text-dark-gray">البريد الإلكتروني</p>
                  <p className="font-cairo font-semibold">zain.investor@nileinvest.ai</p>
                </div>
                <div className="border border-light-gray rounded-xl p-4">
                  <p className="font-cairo text-xs text-dark-gray">رقم الهاتف</p>
                  <p className="font-cairo font-semibold">+249 91 234 5678</p>
                </div>
                <div className="border border-light-gray rounded-xl p-4">
                  <p className="font-cairo text-xs text-dark-gray">المدينة</p>
                  <p className="font-cairo font-semibold">الخرطوم - السودان</p>
                </div>
                <div className="border border-light-gray rounded-xl p-4">
                  <p className="font-cairo text-xs text-dark-gray">نوع المستثمر</p>
                  <p className="font-cairo font-semibold">مستثمر فردي</p>
                </div>
                <div className="border border-light-gray rounded-xl p-4">
                  <p className="font-cairo text-xs text-dark-gray">الميزانية الاستثمارية</p>
                  <p className="font-cairo font-semibold">2,000,000 - 5,000,000 ج.س</p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between border border-light-gray rounded-xl p-4">
                  <span className="font-cairo text-sm">إظهار بياناتي لرواد الأعمال المعتمدين</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-invest-teal" />
                </label>
                <label className="flex items-center justify-between border border-light-gray rounded-xl p-4">
                  <span className="font-cairo text-sm">استقبال تنبيهات الفرص حسب اهتماماتي</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-invest-teal" />
                </label>
              </div>
            </div>
          )}

          {activeSection === "settings" && (
            <div className="bg-white rounded-2xl p-6 shadow-lg space-y-6">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-invest-teal" />
                <h2 className="font-cairo font-bold text-xl">الإعدادات</h2>
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between border border-light-gray rounded-xl p-4">
                  <span className="font-cairo">إشعارات فرص جديدة</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-invest-teal" />
                </label>
                <label className="flex items-center justify-between border border-light-gray rounded-xl p-4">
                  <span className="font-cairo">عرض الملف العام</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-invest-teal" />
                </label>
                <label className="flex items-center justify-between border border-light-gray rounded-xl p-4">
                  <span className="font-cairo">تفعيل تنبيهات انخفاض المخاطر</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-invest-teal" />
                </label>
                <label className="flex items-center justify-between border border-light-gray rounded-xl p-4">
                  <span className="font-cairo">استقبال التقارير الأسبوعية تلقائياً</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-invest-teal" />
                </label>
              </div>

              <div className="border border-light-gray rounded-xl p-4 space-y-4">
                <h3 className="font-cairo font-bold text-text-dark">تغيير كلمة المرور</h3>
                <div className="grid md:grid-cols-3 gap-3">
                  <input
                    type="password"
                    placeholder="كلمة المرور الحالية"
                    className="border border-light-gray rounded-lg px-4 py-2.5 font-cairo text-sm focus:outline-none focus:border-invest-teal"
                  />
                  <input
                    type="password"
                    placeholder="كلمة المرور الجديدة"
                    className="border border-light-gray rounded-lg px-4 py-2.5 font-cairo text-sm focus:outline-none focus:border-invest-teal"
                  />
                  <input
                    type="password"
                    placeholder="تأكيد كلمة المرور"
                    className="border border-light-gray rounded-lg px-4 py-2.5 font-cairo text-sm focus:outline-none focus:border-invest-teal"
                  />
                </div>
                <button className="px-5 py-2.5 bg-invest-blue text-white rounded-lg font-cairo font-semibold hover:bg-blue-900 transition">
                  تحديث كلمة المرور
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
