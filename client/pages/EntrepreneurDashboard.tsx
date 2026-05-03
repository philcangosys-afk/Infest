import { Link } from "react-router-dom";
import {
  TrendingUp,
  Bell,
  LogOut,
  Briefcase,
  Users,
  MessageCircle,
  Heart,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  User,
  FolderOpen,
  Bot,
  Wand2,
  Award,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type SectionKey =
  | "dashboard"
  | "projects"
  | "requests"
  | "messages"
  | "profile";

type EntrepreneurProject = {
  id: number;
  name: string;
  status: string;
  statusColor: string;
  requests: number;
  date: string;
  image: string;
  sector: string;
  budget: string;
  description: string;
  duration: string;
};

const INITIAL_ENTREPRENEUR_PROJECTS: EntrepreneurProject[] = [
  {
    id: 1,
    name: "تطبيق التعليم الذكي",
    status: "نشط",
    statusColor: "bg-invest-green",
    requests: 3,
    date: "2024/06/15",
    image: "bg-gradient-to-br from-blue-400 to-blue-600",
    sector: "التعليم",
    budget: "2,500,000",
    description: "منصة تعليمية تفاعلية مدعومة بالذكاء الاصطناعي للطلاب.",
    duration: "12 شهر",
  },
  {
    id: 2,
    name: "منصة الزراعة الذكية",
    status: "معلق",
    statusColor: "bg-invest-orange",
    requests: 2,
    date: "2024/05/10",
    image: "bg-gradient-to-br from-green-400 to-green-600",
    sector: "الزراعة",
    budget: "1,800,000",
    description: "حل رقمي لمتابعة المزارع والإنتاجية وسلاسل التوريد.",
    duration: "10 شهر",
  },
  {
    id: 3,
    name: "حلول الصحة الرقمية",
    status: "مراجعة",
    statusColor: "bg-invest-blue",
    requests: 5,
    date: "2024/04/20",
    image: "bg-gradient-to-br from-red-400 to-red-600",
    sector: "الصحة",
    budget: "3,500,000",
    description: "خدمات متابعة طبية رقمية مع إدارة ملفات المرضى.",
    duration: "14 شهر",
  },
];

export default function EntrepreneurDashboard() {
  const [activeSection, setActiveSection] = useState<SectionKey>("dashboard");
  const [advisorMode, setAdvisorMode] = useState<"pitch" | "financial" | "requests">("pitch");
  const [advisorInput, setAdvisorInput] = useState("");
  const [selectedAdvisorProject, setSelectedAdvisorProject] = useState("تطبيق التعليم الذكي");
  const [personalFiles, setPersonalFiles] = useState({
    nationalId: false,
    personalPhoto: false,
  });

  const uploadedFilesCount = Object.values(personalFiles).filter(Boolean).length;
  const verificationPercent = Math.round((uploadedFilesCount / 2) * 100);
  const isVerificationComplete = verificationPercent === 100;
  const [advisorChat, setAdvisorChat] = useState<{ id: number; role: "assistant" | "user"; text: string }[]>([
    {
      id: 1,
      role: "assistant",
      text: "مرحبًا، أنا مستشارك الذكي. اكتب سؤالك عن التمويل أو العرض التقديمي وسأساعدك مباشرة.",
    },
  ]);
  const [projects, setProjects] = useState<EntrepreneurProject[]>(INITIAL_ENTREPRENEUR_PROJECTS);
  const [projectForm, setProjectForm] = useState({
    name: "",
    sector: "",
    budget: "",
    duration: "",
    description: "",
  });

  useEffect(() => {
    const storedProjects = localStorage.getItem("nile_invest_custom_projects");
    if (!storedProjects) return;

    const parsedProjects = JSON.parse(storedProjects) as EntrepreneurProject[];
    setProjects([...parsedProjects, ...INITIAL_ENTREPRENEUR_PROJECTS]);
  }, []);

  const handleAddProject = () => {
    if (!projectForm.name || !projectForm.sector || !projectForm.budget || !projectForm.description) return;

    const newProject: EntrepreneurProject = {
      id: Date.now(),
      name: projectForm.name,
      status: "قيد المراجعة",
      statusColor: "bg-invest-blue",
      requests: 0,
      date: new Date().toISOString().slice(0, 10).replace(/-/g, "/"),
      image: "bg-gradient-to-br from-indigo-400 to-indigo-600",
      sector: projectForm.sector,
      budget: projectForm.budget,
      description: projectForm.description,
      duration: projectForm.duration || "غير محدد",
    };

    const updatedProjects = [newProject, ...projects];
    setProjects(updatedProjects);
    setSelectedAdvisorProject(newProject.name);
    setProjectForm({ name: "", sector: "", budget: "", duration: "", description: "" });

    localStorage.setItem(
      "nile_invest_custom_projects",
      JSON.stringify(updatedProjects.filter((project) => project.id > 1000)),
    );
  };

  const sendAdvisorMessage = () => {
    const message = advisorInput.trim();
    if (!message) return;

    const modeReply =
      advisorMode === "pitch"
        ? `اقتراحي لمشروع ${selectedAdvisorProject}: ابدأ شرحك بالمشكلة ثم الحل ثم الأرقام الأساسية (حجم السوق، عدد العملاء، والإيراد الشهري).`
        : advisorMode === "financial"
          ? `اقتراحي المالي لمشروع ${selectedAdvisorProject}: قسّم المبلغ على تطوير المنتج، التسويق، والتشغيل مع هدف واضح لكل بند.`
          : `اقتراحي للرد بخصوص مشروع ${selectedAdvisorProject}: استخدم رد مختصر يوضح الوضع الحالي والخطوة التالية وموعد اجتماع مقترح.`;

    setAdvisorChat((prev) => [
      ...prev,
      { id: prev.length + 1, role: "user" as const, text: message },
      { id: prev.length + 2, role: "assistant" as const, text: modeReply },
    ]);
    setAdvisorInput("");
  };


  const [requests, setRequests] = useState([
    {
      id: 1,
      investorName: "أحمد العبدالله",
      badge: "مستثمر معتمد",
      projectName: "تطبيق التعليم الذكي",
      message: "يريد الاستثمار في مشروع 'منصة التعليم الذكي'",
      date: "2024/06/20",
      time: "10:30",
    },
    {
      id: 2,
      investorName: "سارة الفقحاني",
      badge: "مستثمر معتمد",
      projectName: "منصة الزراعة الذكية",
      message: "اهتمام في الاستثمار للمشروع",
      date: "2024/06/19",
      time: "09:15",
    },
    {
      id: 3,
      investorName: "محمد القرني",
      badge: "مستثمر جديد",
      projectName: "حلول الصحة الرقمية",
      message: "يود معرفة المزيد عن المشروع",
      date: "2024/06/18",
      time: "14:45",
    },
  ]);

  useEffect(() => {
    const incomingRaw = localStorage.getItem("nile_invest_incoming_requests");
    if (!incomingRaw) return;

    const incoming = JSON.parse(incomingRaw) as {
      id: number;
      investorName: string;
      badge: string;
      projectName: string;
      message: string;
      date: string;
      time: string;
    }[];

    if (!incoming.length) return;

    setRequests((prev) => {
      const prevIds = new Set(prev.map((item) => item.id));
      const uniqueIncoming = incoming.filter((item) => !prevIds.has(item.id));
      return [...uniqueIncoming, ...prev];
    });
  }, []);

  const removeIncomingRequestFromStorage = (requestId: number) => {
    const incomingRaw = localStorage.getItem("nile_invest_incoming_requests");
    if (!incomingRaw) return;

    const incoming = JSON.parse(incomingRaw) as { id: number }[];
    localStorage.setItem(
      "nile_invest_incoming_requests",
      JSON.stringify(incoming.filter((item) => item.id !== requestId)),
    );
  };

  const messages = [
    { id: 1, name: "محمد صلاح", text: "أحتاج مزيد من التفاصيل المالية", time: "10:24" },
    { id: 2, name: "نجلاء حسن", text: "أرسلت عرض الاستثمار", time: "09:10" },
    { id: 3, name: "عبدالرحمن آدم", text: "متى يمكننا الاجتماع؟", time: "أمس" },
  ];

  const sidebarItems = useMemo(
    () => [
      { key: "dashboard" as const, icon: "📊", label: "لوحة التحكم" },
      { key: "projects" as const, icon: "📁", label: "مشاريعي" },
      { key: "requests" as const, icon: "📬", label: "الطلبات الواردة" },
      { key: "messages" as const, icon: "💬", label: "الرسائل" },
      { key: "profile" as const, icon: "👤", label: "الملف الشخصي" },
    ],
    [],
  );

  const sectionTitle: Record<SectionKey, string> = {
    dashboard: "لوحة التحكم",
    projects: "مشاريعي",
    requests: "الطلبات الواردة",
    messages: "الرسائل",
    profile: "الملف الشخصي",
  };

  return (
    <div className="min-h-screen bg-light-gray" dir="rtl">
      {/* Sidebar */}
      <div className="fixed right-0 top-0 bottom-0 w-64 bg-invest-blue text-white p-6 overflow-y-auto">
        <Link to="/" className="flex items-center gap-2 mb-12">
          <div className="w-10 h-10 bg-invest-teal rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <span className="font-cairo font-bold text-lg">Nile Invest AI</span>
        </Link>

        <nav className="space-y-3 mb-12">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveSection(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-cairo font-semibold transition ${
                activeSection === item.key
                  ? "bg-invest-teal text-invest-blue"
                  : "text-white hover:bg-invest-blue/80"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>


        <Link
          to="/"
          className="w-full flex items-center gap-2 px-4 py-3 text-white hover:bg-invest-blue/80 rounded-lg font-cairo font-semibold transition mt-6"
        >
          <LogOut className="w-5 h-5" />
          <span>تسجيل الخروج</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="mr-64 min-h-screen">
        <header className="bg-white border-b border-light-gray sticky top-0 z-40">
          <div className="px-8 h-20 flex items-center justify-between">
            <div>
              <h1 className="font-cairo font-bold text-2xl text-invest-blue">مرحباً بك، أحمد! 👋</h1>
              <p className="font-cairo text-sm text-dark-gray">{sectionTitle[activeSection]}</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-light-gray rounded-lg transition relative">
                <Bell className="w-6 h-6 text-dark-gray" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-invest-red rounded-full"></span>
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-invest-blue to-invest-teal rounded-full flex items-center justify-center text-white font-cairo font-bold">
                أ
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Dashboard */}
          {activeSection === "dashboard" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: Briefcase, label: "عدد مشاريعي", value: "3" },
                  { icon: Users, label: "طلبات جديدة", value: "2" },
                  { icon: MessageCircle, label: "رسائل جديدة", value: "5" },
                  { icon: Heart, label: "نسبة التحقق", value: `${verificationPercent}%`, verification: true },
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg">
                      <Icon className="w-8 h-8 text-invest-teal mb-3" />
                      <p className="font-cairo text-sm text-dark-gray">{stat.label}</p>
                      <p className="font-cairo font-bold text-4xl text-text-dark">{stat.value}</p>
                      {stat.verification && isVerificationComplete && (
                        <span className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-invest-teal/10 text-invest-teal font-cairo text-xs font-bold">
                          <Award className="w-3.5 h-3.5" />
                          شارة مميزة
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="font-cairo font-bold text-2xl mb-4">ملخص سريع</h2>
                <p className="font-cairo text-dark-gray">لديك 2 طلبات استثمار جديدة و 5 رسائل غير مقروءة.</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-light-gray">
                <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-invest-teal/10 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-invest-teal" />
                    </div>
                    <div>
                      <h2 className="font-cairo font-bold text-xl text-text-dark">مستشار رائد الأعمال الذكي</h2>
                      <p className="font-cairo text-xs text-dark-gray">مخصص لتحسين عرض مشروعك قبل التواصل مع المستثمرين</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-invest-blue/10 text-invest-blue font-cairo text-xs font-bold">
                    <Wand2 className="w-3.5 h-3.5" />
                    AI Advisor
                  </span>
                </div>

                <div className="mb-4">
                  <label className="font-cairo text-xs text-dark-gray mb-2 block">اختر المشروع للمناقشة أو المراجعة</label>
                  <select
                    value={selectedAdvisorProject}
                    onChange={(e) => setSelectedAdvisorProject(e.target.value)}
                    className="w-full md:w-80 border border-light-gray rounded-xl px-4 py-2.5 font-cairo text-sm focus:outline-none focus:border-invest-teal bg-white"
                  >
                    {projects.map((project) => (
                      <option key={project.id} value={project.name}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid md:grid-cols-3 gap-2 mb-4">
                  {[
                    { key: "pitch", label: "تحسين عرض المشروع" },
                    { key: "financial", label: "خطة مالية أولية" },
                    { key: "requests", label: "الرد على المستثمرين" },
                  ].map((option) => (
                    <button
                      key={option.key}
                      onClick={() => setAdvisorMode(option.key as "pitch" | "financial" | "requests")}
                      className={`px-4 py-2.5 rounded-xl border font-cairo text-sm font-semibold transition ${
                        advisorMode === option.key
                          ? "bg-invest-blue text-white border-invest-blue"
                          : "bg-white text-dark-gray border-light-gray hover:border-invest-teal hover:text-invest-teal"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                {advisorMode === "pitch" && (
                  <div className="rounded-xl border border-light-gray p-4 bg-light-gray/40">
                    <p className="font-cairo text-sm font-bold text-text-dark mb-2">اقتراح سريع لعرضك التمويلي</p>
                    <p className="font-cairo text-sm text-dark-gray leading-7">
                      ركّز على: المشكلة في السوق السوداني، حجم الطلب المحلي، وكيف سيزيد التمويل من عدد العملاء خلال 6 أشهر.
                      أضف رقمين واضحين: تكلفة اكتساب العميل ومتوسط الإيراد الشهري.
                    </p>
                  </div>
                )}

                {advisorMode === "financial" && (
                  <div className="rounded-xl border border-light-gray p-4 bg-light-gray/40">
                    <p className="font-cairo text-sm font-bold text-text-dark mb-2">خطة مالية مقترحة</p>
                    <ul className="space-y-2 font-cairo text-sm text-dark-gray list-disc pr-5">
                      <li>40% لتطوير المنتج وتحسين التجربة.</li>
                      <li>35% للتسويق والمبيعات في الخرطوم والولايات الرئيسية.</li>
                      <li>25% للتشغيل وبناء فريق أساسي لمدة 8 أشهر.</li>
                    </ul>
                  </div>
                )}

                {advisorMode === "requests" && (
                  <div className="rounded-xl border border-light-gray p-4 bg-light-gray/40">
                    <p className="font-cairo text-sm font-bold text-text-dark mb-2">رد مقترح على المستثمرين</p>
                    <p className="font-cairo text-sm text-dark-gray leading-7">
                      شكرًا لاهتمامكم. أرفقنا تحديثًا بالمؤشرات الحالية، ونقترح اجتماعًا قصيرًا لعرض خطة النمو المتوقعة
                      ونموذج العائد خلال الربعين القادمين.
                    </p>
                  </div>
                )}

                <div className="mt-4 rounded-xl border border-light-gray overflow-hidden">
                  <div className="bg-light-gray/60 px-4 py-3 border-b border-light-gray">
                    <p className="font-cairo text-sm font-bold text-text-dark">الدردشة مع المستشار الذكي</p>
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
                      placeholder="اكتب سؤالك للمستشار الذكي..."
                      className="flex-1 border border-light-gray rounded-lg px-4 py-2 font-cairo text-sm focus:outline-none focus:border-invest-teal"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Projects */}
          {activeSection === "projects" && (
            <div className="bg-white rounded-2xl p-8 shadow-lg space-y-6">
              <h2 className="font-cairo font-bold text-2xl">إضافة مشروع جديد</h2>

              <div className="border border-light-gray rounded-2xl p-5 bg-light-gray/40 space-y-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <input
                    value={projectForm.name}
                    onChange={(e) => setProjectForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="اسم المشروع"
                    className="border border-light-gray rounded-xl px-4 py-2.5 font-cairo text-sm focus:outline-none focus:border-invest-teal"
                  />
                  <select
                    value={projectForm.sector}
                    onChange={(e) => setProjectForm((prev) => ({ ...prev, sector: e.target.value }))}
                    className="border border-light-gray rounded-xl px-4 py-2.5 font-cairo text-sm focus:outline-none focus:border-invest-teal bg-white"
                  >
                    <option value="">اختر المجال</option>
                    <option value="التعليم">التعليم</option>
                    <option value="الزراعة">الزراعة</option>
                    <option value="الصحة">الصحة</option>
                    <option value="الطاقة">الطاقة</option>
                    <option value="التقنية">التقنية</option>
                  </select>
                  <input
                    value={projectForm.budget}
                    onChange={(e) => setProjectForm((prev) => ({ ...prev, budget: e.target.value }))}
                    placeholder="الميزانية المطلوبة (ج.س)"
                    className="border border-light-gray rounded-xl px-4 py-2.5 font-cairo text-sm focus:outline-none focus:border-invest-teal"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <input
                    value={projectForm.duration}
                    onChange={(e) => setProjectForm((prev) => ({ ...prev, duration: e.target.value }))}
                    placeholder="مدة تنفيذ المشروع"
                    className="border border-light-gray rounded-xl px-4 py-2.5 font-cairo text-sm focus:outline-none focus:border-invest-teal"
                  />
                  <textarea
                    value={projectForm.description}
                    onChange={(e) => setProjectForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="الوصف التفصيلي للمشروع"
                    rows={3}
                    className="border border-light-gray rounded-xl px-4 py-2.5 font-cairo text-sm focus:outline-none focus:border-invest-teal resize-none"
                  />
                </div>
                <button
                  onClick={handleAddProject}
                  className="px-5 py-2.5 bg-invest-blue text-white rounded-lg font-cairo font-semibold hover:bg-blue-900 transition"
                >
                  إضافة المشروع
                </button>
              </div>

              <h3 className="font-cairo font-bold text-xl">قائمة المشاريع</h3>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="p-4 border border-light-gray rounded-xl flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg ${project.image}`}></div>
                      <div>
                        <p className="font-cairo font-semibold">{project.name}</p>
                        <p className="font-cairo text-xs text-dark-gray">{project.date}</p>
                        <p className="font-cairo text-xs text-dark-gray mt-1">المجال: {project.sector}</p>
                        <p className="font-cairo text-xs text-dark-gray">الميزانية المطلوبة: {project.budget} ج.س</p>
                        <p className="font-cairo text-xs text-dark-gray">المدة: {project.duration}</p>
                        <p className="font-cairo text-xs text-dark-gray mt-1 max-w-xl">{project.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-white text-xs rounded ${project.statusColor}`}>{project.status}</span>
                      <button className="p-2 text-invest-blue"><Edit2 className="w-4 h-4" /></button>
                      <button
                        onClick={() => setProjects((prev) => prev.filter((item) => item.id !== project.id))}
                        className="p-2 text-invest-red"
                      ><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Requests */}
          {activeSection === "requests" && (
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="font-cairo font-bold text-2xl mb-6">طلبات المستثمرين</h2>
              <div className="space-y-4">
                {requests.map((request) => (
                  <div key={request.id} className="border border-light-gray rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-cairo font-semibold">{request.investorName}</p>
                      <p className="font-cairo text-xs text-dark-gray">{request.date} - {request.time}</p>
                    </div>
                    <p className="font-cairo text-sm text-dark-gray mb-3">{request.message}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setRequests((prev) => prev.filter((item) => item.id !== request.id));
                          removeIncomingRequestFromStorage(request.id);
                        }}
                        className="px-4 py-2 bg-invest-green text-white rounded-lg font-cairo text-sm inline-flex items-center gap-1"
                      ><CheckCircle className="w-4 h-4" /> قبول</button>
                      <button
                        onClick={() => {
                          setRequests((prev) => prev.filter((item) => item.id !== request.id));
                          removeIncomingRequestFromStorage(request.id);
                        }}
                        className="px-4 py-2 bg-invest-red text-white rounded-lg font-cairo text-sm inline-flex items-center gap-1"
                      ><XCircle className="w-4 h-4" /> رفض</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {activeSection === "messages" && (
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="font-cairo font-bold text-2xl mb-6">الرسائل</h2>
              <div className="space-y-3">
                {messages.map((msg) => (
                  <button key={msg.id} className="w-full text-right p-4 border border-light-gray rounded-xl hover:bg-light-gray transition">
                    <div className="flex items-center justify-between">
                      <p className="font-cairo font-semibold">{msg.name}</p>
                      <p className="font-cairo text-xs text-dark-gray">{msg.time}</p>
                    </div>
                    <p className="font-cairo text-sm text-dark-gray mt-1">{msg.text}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Profile */}
          {activeSection === "profile" && (
            <div className="bg-white rounded-2xl p-8 shadow-lg space-y-5">
              <h2 className="font-cairo font-bold text-2xl">الملف الشخصي</h2>

              <div className="p-4 border border-light-gray rounded-xl bg-light-gray/40">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-cairo text-sm font-semibold text-text-dark">اكتمال ملف رائد الأعمال</p>
                  <p className="font-cairo text-sm font-bold text-invest-teal">{verificationPercent}%</p>
                </div>
                <div className="h-2.5 rounded-full bg-white overflow-hidden">
                  <div className="h-full bg-gradient-to-l from-invest-blue to-invest-teal rounded-full" style={{ width: `${verificationPercent}%` }}></div>
                </div>
                <p className="font-cairo text-xs text-dark-gray mt-2">
                  {isVerificationComplete
                    ? "تم رفع الملفات الشخصية بالكامل وحصلت على الشارة المميزة."
                    : "لا يكتمل التحقق إلا بعد رفع الملفات الشخصية المطلوبة."}
                </p>
                {isVerificationComplete && (
                  <span className="mt-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-invest-teal/10 text-invest-teal font-cairo text-xs font-bold">
                    <Award className="w-3.5 h-3.5" />
                    شارة مميزة
                  </span>
                )}
              </div>

              <div className="border border-light-gray rounded-xl p-4 space-y-3">
                <p className="font-cairo font-bold text-text-dark">الملفات الشخصية المطلوبة للتحقق</p>
                {[
                  { key: "nationalId" as const, label: "رفع الهوية الوطنية" },
                  { key: "personalPhoto" as const, label: "رفع الصورة الشخصية" },
                ].map((file) => (
                  <div key={file.key} className="flex items-center justify-between border border-light-gray rounded-lg px-3 py-2.5">
                    <p className="font-cairo text-sm text-text-dark">{file.label}</p>
                    <button
                      onClick={() => setPersonalFiles((prev) => ({ ...prev, [file.key]: !prev[file.key] }))}
                      className={`px-3 py-1.5 rounded-lg font-cairo text-xs font-bold transition ${
                        personalFiles[file.key]
                          ? "bg-invest-green text-white"
                          : "bg-invest-blue text-white hover:bg-blue-900"
                      }`}
                    >
                      {personalFiles[file.key] ? "تم الرفع" : "رفع الملف"}
                    </button>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-xl border-light-gray">
                  <p className="font-cairo text-sm text-dark-gray">الاسم الكامل</p>
                  <p className="font-cairo font-bold">زين خلف الله</p>
                </div>
                <div className="p-4 border rounded-xl border-light-gray">
                  <p className="font-cairo text-sm text-dark-gray">البريد الإلكتروني</p>
                  <p className="font-cairo font-bold">zain.founder@nileinvest.ai</p>
                </div>
                <div className="p-4 border rounded-xl border-light-gray">
                  <p className="font-cairo text-sm text-dark-gray">رقم الهاتف</p>
                  <p className="font-cairo font-bold">+249 92 345 6789</p>
                </div>
                <div className="p-4 border rounded-xl border-light-gray">
                  <p className="font-cairo text-sm text-dark-gray">المدينة</p>
                  <p className="font-cairo font-bold">الخرطوم - السودان</p>
                </div>
                <div className="p-4 border rounded-xl border-light-gray">
                  <p className="font-cairo text-sm text-dark-gray">القطاع الرئيسي</p>
                  <p className="font-cairo font-bold">التعليم التقني</p>
                </div>
                <div className="p-4 border rounded-xl border-light-gray">
                  <p className="font-cairo text-sm text-dark-gray">مرحلة المشروع</p>
                  <p className="font-cairo font-bold">نمو / توسع</p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between border border-light-gray rounded-xl p-4">
                  <span className="font-cairo text-sm">استقبال تنبيهات المستثمرين الجدد</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-invest-teal" />
                </label>
                <button className="px-5 py-2.5 bg-invest-blue text-white rounded-lg font-cairo font-semibold hover:bg-blue-900 transition">
                  تحديث الملف الشخصي
                </button>
              </div>

              <div className="border border-light-gray rounded-xl p-4 space-y-4">
                <h3 className="font-cairo font-bold text-text-dark">تغيير كلمة المرور</h3>
                <div className="grid md:grid-cols-3 gap-3">
                  <input type="password" placeholder="كلمة المرور الحالية" className="border border-light-gray rounded-lg px-4 py-2.5 font-cairo text-sm focus:outline-none focus:border-invest-teal" />
                  <input type="password" placeholder="كلمة المرور الجديدة" className="border border-light-gray rounded-lg px-4 py-2.5 font-cairo text-sm focus:outline-none focus:border-invest-teal" />
                  <input type="password" placeholder="تأكيد كلمة المرور" className="border border-light-gray rounded-lg px-4 py-2.5 font-cairo text-sm focus:outline-none focus:border-invest-teal" />
                </div>
                <button className="px-5 py-2.5 bg-invest-blue text-white rounded-lg font-cairo font-semibold hover:bg-blue-900 transition">
                  تحديث كلمة المرور
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
