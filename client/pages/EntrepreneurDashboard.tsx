import { Link, useNavigate } from "react-router-dom";
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
  Bot,
  Wand2,
  Award,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type SectionKey = "dashboard" | "projects" | "requests" | "messages" | "profile";

type EntrepreneurProject = {
  id: number;
  name: string;
  status: string;
  statusColor: string;
  date: string;
  sector: string;
  budget: string;
  description: string;
  duration: string;
};

type InvestorRequest = {
  id: number;
  investorName: string;
  projectName: string;
  message: string;
  date: string;
  time: string;
  status: string;
};

type ProfileForm = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  mainSector: string;
  projectStage: string;
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}/${m}/${day}`;
};

const formatTime = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

export default function EntrepreneurDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<SectionKey>("dashboard");
  const [advisorMode, setAdvisorMode] = useState<"pitch" | "financial" | "requests">("pitch");
  const [advisorInput, setAdvisorInput] = useState("");
  const [selectedAdvisorProject, setSelectedAdvisorProject] = useState("");
  const [advisorChat, setAdvisorChat] = useState<{ id: number; role: "assistant" | "user"; text: string }[]>([
    {
      id: 1,
      role: "assistant",
      text: "مرحبًا، أنا مستشارك الذكي. اكتب سؤالك عن التمويل أو العرض التقديمي وسأساعدك مباشرة.",
    },
  ]);

  const [projects, setProjects] = useState<EntrepreneurProject[]>([]);
  const [requests, setRequests] = useState<InvestorRequest[]>([]);
  const [messages] = useState([
    { id: 1, name: "محمد صلاح", text: "أحتاج مزيد من التفاصيل المالية", time: "10:24" },
    { id: 2, name: "نجلاء حسن", text: "أرسلت عرض الاستثمار", time: "09:10" },
    { id: 3, name: "عبدالرحمن آدم", text: "متى يمكننا الاجتماع؟", time: "أمس" },
  ]);

  const [projectForm, setProjectForm] = useState({
    name: "",
    sector: "",
    budget: "",
    duration: "",
    description: "",
  });

  const [profileForm, setProfileForm] = useState<ProfileForm>({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    mainSector: "",
    projectStage: "",
  });

  const [personalFiles, setPersonalFiles] = useState({
    nationalId: false,
    personalPhoto: false,
  });

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [actionNotice, setActionNotice] = useState("");

  const uploadedFilesCount = Object.values(personalFiles).filter(Boolean).length;
  const verificationPercent = Math.round((uploadedFilesCount / 2) * 100);
  const isVerificationComplete = verificationPercent === 100;

  const loadDashboardData = async () => {
    setLoading(true);
    setActionNotice("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/login?role=entrepreneur");
      return;
    }

    setCurrentUserId(user.id);

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select(
        "role, full_name, phone, city, main_sector, project_stage, national_id_uploaded, personal_photo_uploaded",
      )
      .eq("id", user.id)
      .single();

    if (profileError) {
      setLoading(false);
      setActionNotice("تعذر تحميل الملف الشخصي من قاعدة البيانات.");
      return;
    }

    if (profile.role !== "entrepreneur") {
      navigate("/investor-dashboard");
      return;
    }

    setProfileForm({
      fullName: profile.full_name ?? "",
      email: user.email ?? "",
      phone: profile.phone ?? "",
      city: profile.city ?? "",
      mainSector: profile.main_sector ?? "",
      projectStage: profile.project_stage ?? "",
    });

    setPersonalFiles({
      nationalId: Boolean(profile.national_id_uploaded),
      personalPhoto: Boolean(profile.personal_photo_uploaded),
    });

    const { data: projectRows, error: projectsError } = await supabase
      .from("projects")
      .select("id, name, status, status_color, created_at, sector, budget, description, duration")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    if (projectsError) {
      setLoading(false);
      setActionNotice("تعذر تحميل مشاريعك.");
      return;
    }

    const mappedProjects: EntrepreneurProject[] = (projectRows ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      status: row.status,
      statusColor: row.status_color || "bg-invest-blue",
      date: formatDate(row.created_at),
      sector: row.sector,
      budget: row.budget,
      description: row.description,
      duration: row.duration || "غير محدد",
    }));

    setProjects(mappedProjects);
    if (mappedProjects.length && !selectedAdvisorProject) {
      setSelectedAdvisorProject(mappedProjects[0].name);
    }

    const { data: requestRows } = await supabase
      .from("investment_requests")
      .select("id, investor_id, project_id, message, status, created_at")
      .eq("entrepreneur_id", user.id)
      .eq("status", "تم الإرسال")
      .order("created_at", { ascending: false });

    const investorIds = [...new Set((requestRows ?? []).map((row) => row.investor_id))];
    const projectIds = [...new Set((requestRows ?? []).map((row) => row.project_id))];

    const investorNameMap = new Map<string, string>();
    if (investorIds.length) {
      const { data: investors } = await supabase.from("profiles").select("id, full_name").in("id", investorIds);
      (investors ?? []).forEach((investor) => investorNameMap.set(investor.id, investor.full_name ?? "مستثمر"));
    }

    const projectNameMap = new Map<number, string>();
    if (projectIds.length) {
      const { data: requestProjects } = await supabase.from("projects").select("id, name").in("id", projectIds);
      (requestProjects ?? []).forEach((item) => projectNameMap.set(item.id, item.name));
    }

    setRequests(
      (requestRows ?? []).map((row) => ({
        id: row.id,
        investorName: investorNameMap.get(row.investor_id) ?? "مستثمر",
        projectName: projectNameMap.get(row.project_id) ?? "مشروع",
        message: row.message || `طلب تواصل جديد بخصوص ${projectNameMap.get(row.project_id) ?? "المشروع"}`,
        date: formatDate(row.created_at),
        time: formatTime(row.created_at),
        status: row.status,
      })),
    );

    setLoading(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleAddProject = async () => {
    if (!currentUserId) return;
    if (!projectForm.name || !projectForm.sector || !projectForm.budget || !projectForm.description) {
      setActionNotice("يرجى إكمال بيانات المشروع قبل الإضافة.");
      return;
    }

    const { data, error } = await supabase
      .from("projects")
      .insert({
        owner_id: currentUserId,
        name: projectForm.name,
        sector: projectForm.sector,
        budget: projectForm.budget,
        duration: projectForm.duration || "غير محدد",
        description: projectForm.description,
        status: "قيد المراجعة",
        status_color: "bg-invest-blue",
      })
      .select("id, name, status, status_color, created_at, sector, budget, description, duration")
      .single();

    if (error || !data) {
      setActionNotice("تعذر إضافة المشروع إلى قاعدة البيانات.");
      return;
    }

    const mappedProject: EntrepreneurProject = {
      id: data.id,
      name: data.name,
      status: data.status,
      statusColor: data.status_color,
      date: formatDate(data.created_at),
      sector: data.sector,
      budget: data.budget,
      description: data.description,
      duration: data.duration || "غير محدد",
    };

    setProjects((prev) => [mappedProject, ...prev]);
    setSelectedAdvisorProject(mappedProject.name);
    setProjectForm({ name: "", sector: "", budget: "", duration: "", description: "" });
    setActionNotice("تم إضافة المشروع بنجاح.");
  };

  const handleDeleteProject = async (projectId: number) => {
    const { error } = await supabase.from("projects").delete().eq("id", projectId);

    if (error) {
      setActionNotice("تعذر حذف المشروع.");
      return;
    }

    setProjects((prev) => prev.filter((item) => item.id !== projectId));
    setActionNotice("تم حذف المشروع.");
  };

  const handleRequestDecision = async (requestId: number, status: "مقبول" | "مرفوض") => {
    const { error } = await supabase.from("investment_requests").update({ status }).eq("id", requestId);

    if (error) {
      setActionNotice("تعذر تحديث حالة الطلب.");
      return;
    }

    setRequests((prev) => prev.filter((item) => item.id !== requestId));
    setActionNotice(`تم ${status === "مقبول" ? "قبول" : "رفض"} الطلب.`);
  };

  const saveProfile = async () => {
    if (!currentUserId) return;
    setSavingProfile(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profileForm.fullName,
        phone: profileForm.phone,
        city: profileForm.city,
        main_sector: profileForm.mainSector,
        project_stage: profileForm.projectStage,
        national_id_uploaded: personalFiles.nationalId,
        personal_photo_uploaded: personalFiles.personalPhoto,
        kyc_complete: isVerificationComplete,
      })
      .eq("id", currentUserId);

    setSavingProfile(false);

    if (error) {
      setActionNotice("تعذر تحديث الملف الشخصي.");
      return;
    }

    setActionNotice("تم تحديث الملف الشخصي بنجاح.");
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
                activeSection === item.key ? "bg-invest-teal text-invest-blue" : "text-white hover:bg-invest-blue/80"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <button
          onClick={async () => {
            await supabase.auth.signOut();
            navigate("/");
          }}
          className="w-full flex items-center gap-2 px-4 py-3 text-white hover:bg-invest-blue/80 rounded-lg font-cairo font-semibold transition mt-6"
        >
          <LogOut className="w-5 h-5" />
          <span>تسجيل الخروج</span>
        </button>
      </div>

      <div className="mr-64 min-h-screen">
        <header className="bg-white border-b border-light-gray sticky top-0 z-40">
          <div className="px-8 h-20 flex items-center justify-between">
            <div>
              <h1 className="font-cairo font-bold text-2xl text-invest-blue">مرحباً بك، {profileForm.fullName || "رائد أعمال"}! 👋</h1>
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
          {loading && <div className="bg-white rounded-2xl p-6 shadow-lg font-cairo text-dark-gray">جاري تحميل البيانات من قاعدة البيانات...</div>}

          {!!actionNotice && (
            <div className="font-cairo text-sm bg-invest-teal/10 text-invest-blue border border-invest-teal/30 rounded-lg p-3">{actionNotice}</div>
          )}

          {!loading && activeSection === "dashboard" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: Briefcase, label: "عدد مشاريعي", value: String(projects.length) },
                  { icon: Users, label: "طلبات جديدة", value: String(requests.length) },
                  { icon: MessageCircle, label: "رسائل جديدة", value: "0" },
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
                <p className="font-cairo text-dark-gray">لديك {requests.length} طلبات استثمار جديدة.</p>
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

                <div className="mt-4 rounded-xl border border-light-gray overflow-hidden">
                  <div className="bg-light-gray/60 px-4 py-3 border-b border-light-gray">
                    <p className="font-cairo text-sm font-bold text-text-dark">الدردشة مع المستشار الذكي</p>
                  </div>

                  <div className="p-4 space-y-3 max-h-64 overflow-y-auto bg-white">
                    {advisorChat.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.role === "assistant" ? "justify-start" : "justify-end"}`}>
                        <div
                          className={`max-w-[85%] rounded-xl px-4 py-2.5 font-cairo text-sm leading-7 ${
                            msg.role === "assistant" ? "bg-light-gray text-text-dark" : "bg-invest-blue text-white"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 border-t border-light-gray bg-white flex gap-2">
                    <button onClick={sendAdvisorMessage} className="px-4 py-2 rounded-lg bg-invest-teal text-white font-cairo text-sm font-bold hover:bg-emerald-600 transition">
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

          {!loading && activeSection === "projects" && (
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
                    <div>
                      <p className="font-cairo font-semibold">{project.name}</p>
                      <p className="font-cairo text-xs text-dark-gray">{project.date}</p>
                      <p className="font-cairo text-xs text-dark-gray mt-1">المجال: {project.sector}</p>
                      <p className="font-cairo text-xs text-dark-gray">الميزانية المطلوبة: {project.budget} ج.س</p>
                      <p className="font-cairo text-xs text-dark-gray">المدة: {project.duration}</p>
                      <p className="font-cairo text-xs text-dark-gray mt-1 max-w-xl">{project.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-white text-xs rounded ${project.statusColor}`}>{project.status}</span>
                      <button className="p-2 text-invest-blue">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteProject(project.id)} className="p-2 text-invest-red">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {projects.length === 0 && <p className="font-cairo text-dark-gray">لا توجد مشاريع بعد.</p>}
              </div>
            </div>
          )}

          {!loading && activeSection === "requests" && (
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="font-cairo font-bold text-2xl mb-6">طلبات المستثمرين</h2>
              <div className="space-y-4">
                {requests.map((request) => (
                  <div key={request.id} className="border border-light-gray rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-cairo font-semibold">{request.investorName}</p>
                      <p className="font-cairo text-xs text-dark-gray">
                        {request.date} - {request.time}
                      </p>
                    </div>
                    <p className="font-cairo text-sm text-dark-gray mb-3">{request.message}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRequestDecision(request.id, "مقبول")}
                        className="px-4 py-2 bg-invest-green text-white rounded-lg font-cairo text-sm inline-flex items-center gap-1"
                      >
                        <CheckCircle className="w-4 h-4" /> قبول
                      </button>
                      <button
                        onClick={() => handleRequestDecision(request.id, "مرفوض")}
                        className="px-4 py-2 bg-invest-red text-white rounded-lg font-cairo text-sm inline-flex items-center gap-1"
                      >
                        <XCircle className="w-4 h-4" /> رفض
                      </button>
                    </div>
                  </div>
                ))}
                {requests.length === 0 && <p className="font-cairo text-dark-gray">لا توجد طلبات واردة حالياً.</p>}
              </div>
            </div>
          )}

          {!loading && activeSection === "messages" && (
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

          {!loading && activeSection === "profile" && (
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
                        personalFiles[file.key] ? "bg-invest-green text-white" : "bg-invest-blue text-white hover:bg-blue-900"
                      }`}
                    >
                      {personalFiles[file.key] ? "تم الرفع" : "رفع الملف"}
                    </button>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <input
                  className="p-4 border rounded-xl border-light-gray font-cairo"
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, fullName: e.target.value }))}
                  placeholder="الاسم الكامل"
                />
                <input className="p-4 border rounded-xl border-light-gray font-cairo bg-light-gray" value={profileForm.email} readOnly />
                <input
                  className="p-4 border rounded-xl border-light-gray font-cairo"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="رقم الهاتف"
                />
                <input
                  className="p-4 border rounded-xl border-light-gray font-cairo"
                  value={profileForm.city}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, city: e.target.value }))}
                  placeholder="المدينة"
                />
                <input
                  className="p-4 border rounded-xl border-light-gray font-cairo"
                  value={profileForm.mainSector}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, mainSector: e.target.value }))}
                  placeholder="القطاع الرئيسي"
                />
                <input
                  className="p-4 border rounded-xl border-light-gray font-cairo"
                  value={profileForm.projectStage}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, projectStage: e.target.value }))}
                  placeholder="مرحلة المشروع"
                />
              </div>

              <div className="space-y-3">
                <button
                  onClick={saveProfile}
                  disabled={savingProfile}
                  className="px-5 py-2.5 bg-invest-blue text-white rounded-lg font-cairo font-semibold hover:bg-blue-900 transition disabled:opacity-60"
                >
                  {savingProfile ? "جاري التحديث..." : "تحديث الملف الشخصي"}
                </button>
              </div>

              <div className="border border-light-gray rounded-xl p-4 space-y-4">
                <h3 className="font-cairo font-bold text-text-dark">تغيير كلمة المرور</h3>
                <div className="grid md:grid-cols-3 gap-3">
                  <input type="password" placeholder="كلمة المرور الحالية" className="border border-light-gray rounded-lg px-4 py-2.5 font-cairo text-sm focus:outline-none focus:border-invest-teal" />
                  <input type="password" placeholder="كلمة المرور الجديدة" className="border border-light-gray rounded-lg px-4 py-2.5 font-cairo text-sm focus:outline-none focus:border-invest-teal" />
                  <input type="password" placeholder="تأكيد كلمة المرور" className="border border-light-gray rounded-lg px-4 py-2.5 font-cairo text-sm focus:outline-none focus:border-invest-teal" />
                </div>
                <button className="px-5 py-2.5 bg-invest-blue text-white rounded-lg font-cairo font-semibold hover:bg-blue-900 transition">تحديث كلمة المرور</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
