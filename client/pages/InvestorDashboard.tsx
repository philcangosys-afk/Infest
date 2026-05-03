import { Link, useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Bell,
  Heart,
  Send,
  Briefcase,
  Search,
  User,
  MessageCircle,
  Bot,
  Wand2,
  Trash2,
} from "lucide-react";
import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

type InvestorSection = "dashboard" | "available" | "favorites" | "requests" | "messages" | "profile";

type Project = {
  id: number;
  name: string;
  amount: string;
  sector: string;
  stage: string;
  description: string;
  matching: string;
  entrepreneurId: string;
  entrepreneurName: string;
};

type RequestItem = {
  id: number;
  project: string;
  status: string;
  date: string;
  entrepreneurId: string;
};

type ChatMessage = {
  id: number;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
};

type ProfileForm = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  investorType: string;
  linkedinUrl: string;
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}/${m}/${day}`;
};

export default function InvestorDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<InvestorSection>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("الكل");
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [myRequests, setMyRequests] = useState<RequestItem[]>([]);
  const [selectedRequestChat, setSelectedRequestChat] = useState<RequestItem | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [loadingChat, setLoadingChat] = useState(false);
  const [actionNotice, setActionNotice] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<ProfileForm>({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    investorType: "",
    linkedinUrl: "",
  });
  const [kycComplete, setKycComplete] = useState(false);
  const [kycStatus, setKycStatus] = useState<"not_uploaded" | "ready_to_submit" | "under_review" | "approved">("not_uploaded");
  const [kycDocumentType, setKycDocumentType] = useState<"passport" | "national_id">("national_id");
  const [kycDocumentName, setKycDocumentName] = useState("");
  const [profileDataComplete, setProfileDataComplete] = useState(false);

  const isVerified = kycComplete && profileDataComplete;
  const profileCompletion = (kycComplete ? 50 : 0) + (profileDataComplete ? 50 : 0);

  const filteredProjects = projects.filter((project) => {
    const query = searchQuery.trim();
    const queryMatch =
      !query || project.name.includes(query) || project.description.includes(query) || project.entrepreneurName.includes(query);
    const sectorMatch = selectedSector === "الكل" || project.sector === selectedSector;
    return queryMatch && sectorMatch;
  });

  const favoriteProjects = projects.filter((project) => favoriteIds.includes(project.id));

  const loadDashboardData = async () => {
    setLoading(true);
    setActionNotice("");

    if (!isSupabaseConfigured) {
      setLoading(false);
      setActionNotice("ربط قاعدة البيانات غير مكتمل حالياً.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/login?role=investor");
      return;
    }

    setCurrentUserId(user.id);

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, full_name, phone, city, address, investor_type, linkedin_url, kyc_complete, profile_data_complete")
      .eq("id", user.id)
      .single();

    if (profileError) {
      setActionNotice("تعذر تحميل بيانات المستثمر من قاعدة البيانات.");
      setLoading(false);
      return;
    }

    if (profile.role !== "investor") {
      navigate("/dashboard");
      return;
    }

    setProfileForm({
      fullName: profile.full_name ?? "",
      email: user.email ?? "",
      phone: profile.phone ?? "",
      city: profile.city ?? "",
      address: profile.address ?? "",
      investorType: profile.investor_type ?? "",
      linkedinUrl: profile.linkedin_url ?? "",
    });

    const isKycComplete = Boolean(profile.kyc_complete);
    setKycComplete(isKycComplete);
    setKycStatus(isKycComplete ? "approved" : "not_uploaded");
    setKycDocumentName(isKycComplete ? "مستند مرفوع مسبقاً" : "");
    setProfileDataComplete(Boolean(profile.profile_data_complete));

    const { data: projectsRows, error: projectsError } = await supabase
      .from("projects")
      .select("id, owner_id, name, sector, stage, description, budget, matching")
      .order("created_at", { ascending: false });

    if (projectsError) {
      setActionNotice("تعذر تحميل المشاريع من قاعدة البيانات.");
      setLoading(false);
      return;
    }

    const ownerIds = [...new Set((projectsRows ?? []).map((row) => row.owner_id).filter(Boolean))];
    const ownerMap = new Map<string, string>();

    if (ownerIds.length) {
      const { data: owners } = await supabase.from("profiles").select("id, full_name").in("id", ownerIds);
      (owners ?? []).forEach((owner) => ownerMap.set(owner.id, owner.full_name ?? "رائد أعمال"));
    }

    const mappedProjects: Project[] = (projectsRows ?? []).map((row) => ({
      id: row.id,
      entrepreneurId: row.owner_id,
      entrepreneurName: ownerMap.get(row.owner_id) ?? "رائد أعمال",
      name: row.name,
      amount: row.budget,
      sector: row.sector,
      stage: row.stage,
      description: row.description,
      matching: row.matching ?? "80%",
    }));

    setProjects(mappedProjects);

    const { data: favoriteRows } = await supabase
      .from("favorites")
      .select("project_id")
      .eq("investor_id", user.id);

    setFavoriteIds((favoriteRows ?? []).map((row) => row.project_id));

    const { data: requestRows } = await supabase
      .from("investment_requests")
      .select("id, project_id, entrepreneur_id, status, created_at")
      .eq("investor_id", user.id)
      .order("created_at", { ascending: false });

    const projectMap = new Map(mappedProjects.map((p) => [p.id, p.name]));
    setMyRequests(
      (requestRows ?? []).map((request) => ({
        id: request.id,
        project: projectMap.get(request.project_id) ?? "مشروع",
        status: request.status,
        date: formatDate(request.created_at),
        entrepreneurId: request.entrepreneur_id,
      })),
    );

    setLoading(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    const isBasicProfileComplete = Boolean(
      profileForm.fullName.trim() &&
      profileForm.email.trim() &&
      profileForm.phone.trim() &&
      profileForm.city.trim() &&
      profileForm.address.trim(),
    );
    setProfileDataComplete(isBasicProfileComplete);
  }, [profileForm]);

  const toggleFavorite = async (projectId: number, isFavorite: boolean) => {
    if (!isSupabaseConfigured) {
      setActionNotice("ربط قاعدة البيانات غير مكتمل حالياً.");
      return;
    }
    if (!currentUserId) return;

    if (isFavorite) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("investor_id", currentUserId)
        .eq("project_id", projectId);

      if (error) {
        setActionNotice("تعذر حذف المشروع من الاهتمامات.");
        return;
      }

      setFavoriteIds((prev) => prev.filter((id) => id !== projectId));
      return;
    }

    const { error } = await supabase.from("favorites").insert({
      investor_id: currentUserId,
      project_id: projectId,
    });

    if (error) {
      setActionNotice("تعذر إضافة المشروع إلى الاهتمامات.");
      return;
    }

    setFavoriteIds((prev) => [...prev, projectId]);
  };

  const handleKycDocumentUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setKycDocumentName(file.name);
    setKycComplete(false);
    setKycStatus("ready_to_submit");
    setActionNotice("تم رفع المستند. اضغط إرسال للمراجعة.");
  };

  const submitKycForReview = () => {
    if (!kycDocumentName) return;
    setKycComplete(false);
    setKycStatus("under_review");
    setActionNotice("تم إرسال مستند KYC للمراجعة. الحالة الآن: تحت المراجعة.");
  };

  const approveKycByAdmin = () => {
    setKycStatus("approved");
    setKycComplete(true);
    setActionNotice("تمت الموافقة على مستند KYC من لجنة التحقق.");
  };

  const sendContactRequest = async (project: Project) => {
    if (!isSupabaseConfigured) {
      setActionNotice("ربط قاعدة البيانات غير مكتمل حالياً.");
      return;
    }
    if (!currentUserId) return;

    if (!isVerified) {
      if (kycStatus === "under_review") {
        setActionNotice("مستند KYC تحت المراجعة حالياً. يمكنك إرسال طلب التواصل بعد اعتماد اللجنة.");
      } else {
        setActionNotice("لا يمكن إرسال طلب التواصل قبل رفع مستند الجواز أو الرقم الوطني واعتماده ثم إكمال الملف الشخصي.");
      }
      return;
    }

    const { data, error } = await supabase
      .from("investment_requests")
      .insert({
        investor_id: currentUserId,
        entrepreneur_id: project.entrepreneurId,
        project_id: project.id,
        status: "تم الإرسال",
        message: `طلب تواصل جديد بخصوص مشروع ${project.name}`,
      })
      .select("id, status, created_at")
      .single();

    if (error || !data) {
      setActionNotice("تعذر إرسال طلب التواصل، حاول مرة أخرى.");
      return;
    }

    setMyRequests((prev) => [
      {
        id: data.id,
        project: project.name,
        status: data.status,
        date: formatDate(data.created_at),
        entrepreneurId: project.entrepreneurId,
      },
      ...prev,
    ]);

    setActionNotice("تم إرسال طلب التواصل إلى رائد الأعمال بنجاح.");
  };

  const loadChatMessages = async (request: RequestItem, silent = false) => {
    if (!isSupabaseConfigured) return;

    setSelectedRequestChat(request);
    if (!silent) setLoadingChat(true);

    const { data, error } = await supabase
      .from("messages")
      .select("id, sender_id, receiver_id, content, created_at")
      .eq("request_id", request.id)
      .order("created_at", { ascending: true });

    if (!silent) setLoadingChat(false);

    if (error) {
      setChatMessages([]);
      setActionNotice("لتفعيل الرسائل الحقيقية أنشئ جدول messages في قاعدة البيانات.");
      return;
    }

    setChatMessages(
      (data ?? []).map((item) => ({
        id: item.id,
        senderId: item.sender_id,
        receiverId: item.receiver_id,
        content: item.content,
        createdAt: item.created_at,
      })),
    );
  };

  const sendChatMessage = async () => {
    if (!isSupabaseConfigured || !currentUserId || !selectedRequestChat) return;

    const message = chatInput.trim();
    if (!message) return;

    const { data, error } = await supabase
      .from("messages")
      .insert({
        request_id: selectedRequestChat.id,
        sender_id: currentUserId,
        receiver_id: selectedRequestChat.entrepreneurId,
        content: message,
      })
      .select("id, sender_id, receiver_id, content, created_at")
      .single();

    if (error || !data) {
      setActionNotice("تعذر إرسال الرسالة. تأكد من وجود جدول messages وصلاحياته.");
      return;
    }

    setChatMessages((prev) => [
      ...prev,
      {
        id: data.id,
        senderId: data.sender_id,
        receiverId: data.receiver_id,
        content: data.content,
        createdAt: data.created_at,
      },
    ]);
    setChatInput("");
  };

  useEffect(() => {
    if (activeSection !== "messages") return;
    if (!myRequests.length) return;
    if (selectedRequestChat) return;

    loadChatMessages(myRequests[0]);
  }, [activeSection, myRequests, selectedRequestChat]);

  useEffect(() => {
    if (activeSection !== "messages") return;
    if (!selectedRequestChat) return;

    const intervalId = setInterval(() => {
      loadChatMessages(selectedRequestChat, true);
    }, 4000);

    return () => clearInterval(intervalId);
  }, [activeSection, selectedRequestChat]);

  const deleteRequest = async (requestId: number) => {
    if (!isSupabaseConfigured) {
      setActionNotice("ربط قاعدة البيانات غير مكتمل حالياً.");
      return;
    }

    const { error } = await supabase.from("investment_requests").delete().eq("id", requestId);

    if (error) {
      setActionNotice("تعذر حذف الطلب.");
      return;
    }

    setMyRequests((prev) => prev.filter((item) => item.id !== requestId));
  };

  const saveProfile = async () => {
    if (!isSupabaseConfigured) {
      setActionNotice("ربط قاعدة البيانات غير مكتمل حالياً.");
      return;
    }
    if (!currentUserId) return;
    setSavingProfile(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profileForm.fullName,
        phone: profileForm.phone,
        city: profileForm.city,
        address: profileForm.address,
        investor_type: profileForm.investorType,
        linkedin_url: profileForm.linkedinUrl,
        kyc_complete: kycStatus === "approved",
        profile_data_complete: profileDataComplete,
      })
      .eq("id", currentUserId);

    setSavingProfile(false);

    if (error) {
      setActionNotice("تعذر تحديث الملف الشخصي.");
      return;
    }

    setActionNotice("تم تحديث الملف الشخصي بنجاح.");
  };

  const nav = useMemo(
    () => [
      { key: "dashboard" as const, label: "لوحة التحكم", icon: "📊" },
      { key: "available" as const, label: "المشاريع المتاحة", icon: "🔎" },
      { key: "favorites" as const, label: "اهتماماتي", icon: "❤️" },
      { key: "requests" as const, label: "طلباتي", icon: "📋" },
      { key: "messages" as const, label: "الرسائل", icon: "💬" },
      { key: "profile" as const, label: "الملف الشخصي", icon: "👤" },
    ],
    [],
  );

  const titles: Record<InvestorSection, string> = {
    dashboard: "ملخص المستثمر",
    available: "المشاريع المتاحة",
    favorites: "المشاريع المحفوظة",
    requests: "طلبات الاستثمار",
    messages: "محادثاتك",
    profile: "بيانات المستثمر",
  };

  const sectors = ["الكل", ...Array.from(new Set(projects.map((project) => project.sector)))];

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
                activeSection === item.key ? "bg-invest-teal text-invest-blue" : "text-white hover:bg-invest-blue/80"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="mr-64 min-h-screen">
        <header className="bg-white border-b border-light-gray sticky top-0 z-20">
          <div className="px-8 h-20 flex items-center justify-between">
            <div>
              <h1 className="font-cairo font-bold text-2xl text-invest-blue">مرحباً، {profileForm.fullName || "مستثمر"} 👋</h1>
              <p className="font-cairo text-sm text-dark-gray">{titles[activeSection]}</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-light-gray rounded-lg transition relative">
                <Bell className="w-6 h-6 text-dark-gray" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-invest-red"></span>
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-invest-blue to-invest-teal text-white font-cairo font-bold flex items-center justify-center">
                م
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {loading && (
            <div className="bg-white rounded-2xl p-6 shadow-lg font-cairo text-dark-gray">جاري تحميل البيانات من قاعدة البيانات...</div>
          )}

          {!!actionNotice && (
            <div className="font-cairo text-sm bg-invest-teal/10 text-invest-blue border border-invest-teal/30 rounded-lg p-3">
              {actionNotice}
            </div>
          )}

          {!loading && activeSection === "dashboard" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: Heart, label: "اهتمامات محفوظة", value: String(favoriteIds.length) },
                  { icon: Send, label: "طلبات مرسلة", value: String(myRequests.length) },
                  { icon: Briefcase, label: "مطابقات", value: String(projects.length) },
                  { icon: Search, label: "صفقات منجزة", value: String(myRequests.filter((req) => req.status === "تم الرد").length) },
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
                  {projects.slice(0, 3).map((p) => (
                    <div key={p.id} className="border border-light-gray rounded-xl p-4">
                      <p className="font-cairo font-bold">{p.name}</p>
                      <p className="font-cairo text-sm text-dark-gray">{p.amount}</p>
                      <p className="font-cairo text-xs text-invest-teal mt-1">Matching: {p.matching}</p>
                    </div>
                  ))}
                  {projects.length === 0 && <p className="font-cairo text-dark-gray">لا توجد مشاريع متاحة حالياً.</p>}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-light-gray">
                <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-invest-blue/10 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-invest-blue" />
                    </div>
                    <div>
                      <h2 className="font-cairo font-bold text-xl text-text-dark">خدمات المستشار الذكي</h2>
                      <p className="font-cairo text-xs text-dark-gray">اختر الخدمة المناسبة بدلاً من الدردشة الفورية</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-invest-teal/10 text-invest-teal font-cairo text-xs font-bold">
                    <Wand2 className="w-3.5 h-3.5" />
                    Services
                  </span>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    "تحليل جدوى مشروع",
                    "خدمة Matching بين المستثمر والمشروع",
                    "تقييم مخاطر الاستثمار",
                    "حساب العائد المتوقع",
                  ].map((service) => (
                    <button key={service} className="border border-light-gray rounded-xl p-4 text-right hover:border-invest-teal hover:bg-light-gray transition">
                      <p className="font-cairo font-semibold text-sm text-text-dark">{service}</p>
                      <p className="font-cairo text-xs text-dark-gray mt-1">خدمة مدفوعة</p>
                    </button>
                  ))}
                </div>

                <div className="mt-4 p-4 rounded-xl bg-invest-blue text-white flex items-center justify-between gap-3 flex-wrap">
                  <p className="font-cairo text-sm">خدمة إرشاد استثماري مدفوع مع مستشار خبير لمدة 45 دقيقة.</p>
                  <button className="px-4 py-2 rounded-lg bg-white text-invest-blue font-cairo font-bold text-sm">حجز جلسة Mentoring</button>
                </div>
              </div>
            </>
          )}

          {!loading && activeSection === "available" && (
            <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Search className="w-5 h-5 text-dark-gray" />
                <h2 className="font-cairo font-bold text-xl">المشاريع المتاحة</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-3">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="بحث عن مشروع"
                  className="md:col-span-2 border border-light-gray rounded-xl px-4 py-2.5 font-cairo text-sm focus:outline-none focus:border-invest-teal"
                />
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="border border-light-gray rounded-xl px-4 py-2.5 font-cairo text-sm focus:outline-none focus:border-invest-teal bg-white"
                >
                  {sectors.map((sector) => (
                    <option key={sector} value={sector}>
                      {sector === "الكل" ? "كل المجالات" : sector}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                {filteredProjects.map((project) => {
                  const isFav = favoriteIds.includes(project.id);
                  return (
                    <div key={project.id} className="border border-light-gray rounded-xl p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-cairo font-bold">{project.name}</p>
                          <p className="font-cairo text-xs text-dark-gray">{project.sector} • {project.stage}</p>
                          <p className="font-cairo text-xs text-dark-gray">رائد الأعمال: {project.entrepreneurName}</p>
                          <p className="font-cairo text-xs text-invest-teal mt-1">Matching: {project.matching}</p>
                        </div>
                        <button
                          onClick={() => toggleFavorite(project.id, isFav)}
                          className={`p-2 rounded-lg border ${isFav ? "text-invest-red border-invest-red/30" : "text-dark-gray border-light-gray"}`}
                        >
                          <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3 gap-2">
                        <p className="font-cairo text-sm text-dark-gray">{project.amount}</p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => sendContactRequest(project)}
                            className={`px-3 py-2 rounded-lg font-cairo text-xs ${
                              isVerified
                                ? "border border-invest-teal text-invest-teal hover:bg-invest-teal/10"
                                : "border border-light-gray text-dark-gray cursor-not-allowed"
                            }`}
                          >
                            طلب تواصل
                          </button>
                          <button
                            onClick={() => setSelectedProject(project)}
                            disabled={!isVerified}
                            className={`px-4 py-2 rounded-lg font-cairo text-sm ${
                              isVerified
                                ? "bg-invest-blue text-white hover:bg-blue-900"
                                : "bg-light-gray text-dark-gray cursor-not-allowed"
                            }`}
                          >
                            عرض التفاصيل
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredProjects.length === 0 && <p className="font-cairo text-dark-gray">لا توجد مشاريع مطابقة.</p>}

              {!isVerified && (
                <p className="font-cairo text-sm text-invest-red bg-invest-red/10 border border-invest-red/20 rounded-lg p-3">
                  عرض التفاصيل متاح فقط للمستخدمين الموثقين.
                </p>
              )}
            </div>
          )}

          {!loading && activeSection === "favorites" && (
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="font-cairo font-bold text-xl mb-4">اهتماماتي</h2>
              <div className="space-y-3">
                {favoriteProjects.map((project) => (
                  <div key={project.id} className="border border-light-gray rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="font-cairo font-semibold">{project.name}</p>
                      <p className="font-cairo text-xs text-dark-gray">{project.stage} • {project.sector}</p>
                    </div>
                    <button
                      onClick={() => isVerified && setSelectedProject(project)}
                      className={`px-4 py-2 rounded-lg font-cairo text-sm ${
                        isVerified ? "border border-invest-teal text-invest-teal" : "border border-light-gray text-dark-gray cursor-not-allowed"
                      }`}
                    >
                      عرض
                    </button>
                  </div>
                ))}
                {favoriteProjects.length === 0 && <p className="font-cairo text-dark-gray">لا توجد مشاريع محفوظة.</p>}
              </div>
            </div>
          )}

          {!loading && activeSection === "requests" && (
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="font-cairo font-bold text-xl mb-4">طلباتي</h2>
              <div className="space-y-3">
                {myRequests.map((request) => (
                  <div key={request.id} className="border border-light-gray rounded-xl p-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-cairo font-semibold">{request.project}</p>
                      <p className="font-cairo text-xs text-dark-gray">{request.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-cairo bg-light-gray text-text-dark">{request.status}</span>
                      <button
                        onClick={() => deleteRequest(request.id)}
                        className="p-2 rounded-lg text-invest-red hover:bg-invest-red/10"
                        aria-label="حذف الطلب"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {myRequests.length === 0 && <p className="font-cairo text-dark-gray">لا توجد طلبات حالياً.</p>}
              </div>
            </div>
          )}

          {!loading && activeSection === "messages" && (
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="w-5 h-5 text-invest-teal" />
                <h2 className="font-cairo font-bold text-xl">الرسائل</h2>
              </div>

              {!isVerified ? (
                <p className="font-cairo text-invest-red bg-invest-red/10 border border-invest-red/20 rounded-lg p-3">
                  الرسائل غير متاحة قبل التوثيق.
                </p>
              ) : (
                <div className="grid lg:grid-cols-3 gap-4">
                  <div className="space-y-2 lg:col-span-1">
                    {myRequests.map((request) => (
                      <button
                        key={request.id}
                        onClick={() => loadChatMessages(request)}
                        className={`w-full text-right p-3 rounded-xl border font-cairo text-sm ${
                          selectedRequestChat?.id === request.id ? "border-invest-teal bg-invest-teal/5" : "border-light-gray hover:bg-light-gray"
                        }`}
                      >
                        <p className="font-semibold">{request.project}</p>
                        <p className="text-xs text-dark-gray mt-1">{request.status}</p>
                      </button>
                    ))}
                    {myRequests.length === 0 && <p className="font-cairo text-sm text-dark-gray">لا توجد محادثات متاحة.</p>}
                  </div>

                  <div className="lg:col-span-2 border border-light-gray rounded-xl p-4 min-h-[320px] flex flex-col">
                    {!selectedRequestChat ? (
                      <p className="font-cairo text-dark-gray">اختر مشروعاً من القائمة لعرض المحادثة.</p>
                    ) : (
                      <>
                        <p className="font-cairo font-bold mb-3">محادثة مشروع: {selectedRequestChat.project}</p>
                        <div className="flex-1 space-y-2 overflow-y-auto mb-3">
                          {loadingChat ? (
                            <p className="font-cairo text-sm text-dark-gray">جاري تحميل الرسائل...</p>
                          ) : chatMessages.length ? (
                            chatMessages.map((msg) => (
                              <div key={msg.id} className={`flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[80%] rounded-xl px-3 py-2 font-cairo text-sm ${msg.senderId === currentUserId ? "bg-invest-blue text-white" : "bg-light-gray text-text-dark"}`}>
                                  {msg.content}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="font-cairo text-sm text-dark-gray">لا توجد رسائل بعد. ابدأ المحادثة الآن.</p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <input
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
                            placeholder="اكتب رسالتك..."
                            className="flex-1 border border-light-gray rounded-lg px-4 py-2 font-cairo text-sm"
                          />
                          <button onClick={sendChatMessage} className="px-4 py-2 rounded-lg bg-invest-teal text-white font-cairo text-sm">
                            إرسال
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {!loading && activeSection === "profile" && (
            <div className="bg-white rounded-2xl p-6 shadow-lg space-y-5">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-5 h-5 text-invest-teal" />
                <h2 className="font-cairo font-bold text-xl">الملف الشخصي</h2>
              </div>

              <div className="p-4 border border-light-gray rounded-xl bg-light-gray/40">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-cairo text-sm font-semibold text-text-dark">اكتمال الملف الشخصي</p>
                  <p className="font-cairo text-sm font-bold text-invest-teal">{profileCompletion}%</p>
                </div>
                <div className="h-2.5 rounded-full bg-white overflow-hidden">
                  <div className="h-full bg-gradient-to-l from-invest-blue to-invest-teal rounded-full" style={{ width: `${profileCompletion}%` }}></div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-cairo bg-invest-blue/10 text-invest-blue">KYC: {kycComplete ? "50%" : "0%"}</span>
                  <span className="px-3 py-1 rounded-full text-xs font-cairo bg-invest-teal/10 text-invest-teal">المعلومات الأساسية: {profileDataComplete ? "50%" : "0%"}</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <input
                  className="border border-light-gray rounded-xl p-3 font-cairo text-sm"
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, fullName: e.target.value }))}
                  placeholder="الاسم الكامل"
                />
                <input className="border border-light-gray rounded-xl p-3 font-cairo text-sm bg-light-gray" value={profileForm.email} readOnly />
                <input
                  className="border border-light-gray rounded-xl p-3 font-cairo text-sm"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="رقم الهاتف"
                />
                <input
                  className="border border-light-gray rounded-xl p-3 font-cairo text-sm"
                  value={profileForm.city}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, city: e.target.value }))}
                  placeholder="المدينة"
                />
                <input
                  className="border border-light-gray rounded-xl p-3 font-cairo text-sm"
                  value={profileForm.address}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, address: e.target.value }))}
                  placeholder="العنوان"
                />
                <input
                  className="border border-light-gray rounded-xl p-3 font-cairo text-sm"
                  value={profileForm.investorType}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, investorType: e.target.value }))}
                  placeholder="نوع المستثمر"
                />
                <input
                  className="border border-light-gray rounded-xl p-3 font-cairo text-sm"
                  placeholder="رابط LinkedIn"
                  value={profileForm.linkedinUrl}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, linkedinUrl: e.target.value }))}
                />
              </div>

              <div className="border border-light-gray rounded-xl p-4 space-y-3 bg-light-gray/40">
                <p className="font-cairo text-sm font-bold text-text-dark">متطلبات KYC</p>
                <p className="font-cairo text-xs text-dark-gray">لابد من رفع مستند الجواز أو الرقم الوطني لإكمال التحقق.</p>

                <select
                  value={kycDocumentType}
                  onChange={(e) => {
                    setKycDocumentType(e.target.value as "passport" | "national_id");
                    setKycComplete(false);
                    setKycStatus("not_uploaded");
                    setKycDocumentName("");
                  }}
                  className="border border-light-gray rounded-xl px-4 py-2.5 font-cairo text-sm focus:outline-none focus:border-invest-teal bg-white w-full md:w-72"
                >
                  <option value="national_id">مستند الرقم الوطني</option>
                  <option value="passport">مستند جواز السفر</option>
                </select>

                <div className="flex flex-wrap items-center gap-3">
                  <label className="px-4 py-2 rounded-lg border border-invest-teal text-invest-teal font-cairo text-sm cursor-pointer hover:bg-invest-teal/10">
                    رفع المستند
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleKycDocumentUpload} />
                  </label>
                  <span className="font-cairo text-xs text-dark-gray">
                    {kycDocumentName ? `تم الرفع: ${kycDocumentName}` : "لم يتم رفع أي مستند بعد"}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-cairo ${
                      kycStatus === "approved"
                        ? "bg-invest-teal/10 text-invest-teal"
                        : kycStatus === "under_review"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-light-gray text-dark-gray"
                    }`}
                  >
                    {kycStatus === "approved"
                      ? "تمت الموافقة"
                      : kycStatus === "under_review"
                        ? "تحت المراجعة"
                        : kycStatus === "ready_to_submit"
                          ? "جاهز للإرسال"
                          : "غير مكتمل"}
                  </span>
                </div>

                {kycStatus === "ready_to_submit" && (
                  <button
                    onClick={submitKycForReview}
                    className="px-4 py-2 rounded-lg bg-invest-blue text-white font-cairo text-sm"
                  >
                    إرسال للمراجعة
                  </button>
                )}

                {kycStatus === "under_review" && (
                  <button
                    onClick={approveKycByAdmin}
                    className="px-4 py-2 rounded-lg border border-invest-teal text-invest-teal font-cairo text-sm"
                  >
                    موافقة الادمن بعد مراجعة اللجنة
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={saveProfile}
                  disabled={savingProfile}
                  className="px-5 py-2 bg-invest-blue text-white rounded-lg font-cairo font-semibold disabled:opacity-60"
                >
                  {savingProfile ? "جاري الحفظ..." : "تحديث الملف الشخصي"}
                </button>
              </div>

              <div className="border border-light-gray rounded-xl p-4 space-y-4">
                <h3 className="font-cairo font-bold text-text-dark">تغيير كلمة المرور</h3>
                <div className="grid md:grid-cols-3 gap-3">
                  <input type="password" placeholder="كلمة المرور الحالية" className="border border-light-gray rounded-lg px-4 py-2.5 font-cairo text-sm" />
                  <input type="password" placeholder="كلمة المرور الجديدة" className="border border-light-gray rounded-lg px-4 py-2.5 font-cairo text-sm" />
                  <input type="password" placeholder="تأكيد كلمة المرور" className="border border-light-gray rounded-lg px-4 py-2.5 font-cairo text-sm" />
                </div>
                <button className="px-5 py-2.5 bg-invest-blue text-white rounded-lg font-cairo font-semibold">تحديث كلمة المرور</button>
              </div>
            </div>
          )}

          {selectedProject && (
            <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-cairo font-bold text-xl">تفاصيل المشروع</h3>
                  <button onClick={() => setSelectedProject(null)} className="text-dark-gray font-cairo">إغلاق</button>
                </div>
                <p className="font-cairo font-bold text-lg text-invest-blue">{selectedProject.name}</p>
                <p className="font-cairo text-sm text-dark-gray">رائد الأعمال: {selectedProject.entrepreneurName}</p>
                <p className="font-cairo text-sm text-dark-gray mt-2">{selectedProject.description}</p>
                <div className="grid md:grid-cols-3 gap-3 mt-4">
                  <div className="p-3 bg-light-gray rounded-lg font-cairo text-sm">القطاع: {selectedProject.sector}</div>
                  <div className="p-3 bg-light-gray rounded-lg font-cairo text-sm">المرحلة: {selectedProject.stage}</div>
                  <div className="p-3 bg-light-gray rounded-lg font-cairo text-sm">الميزانية: {selectedProject.amount}</div>
                </div>
                <button
                  onClick={() => sendContactRequest(selectedProject)}
                  className={`mt-4 px-5 py-2.5 rounded-lg font-cairo font-semibold ${
                    isVerified ? "bg-invest-teal text-white hover:bg-emerald-600" : "bg-light-gray text-dark-gray cursor-not-allowed"
                  }`}
                >
                  طلب تواصل مع رائد الأعمال
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
