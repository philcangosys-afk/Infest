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
  Handshake,
  Sparkles,
  Crown,
  Users,
  FileDown,
  Upload,
} from "lucide-react";
import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import { getSafeUser, isSupabaseConfigured, supabase } from "@/lib/supabase";

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

type InvestorKycDraft = {
  documentName: string;
  documentType: "passport" | "national_id";
  status: "ready_to_submit" | "under_review";
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}/${m}/${day}`;
};

const toEnglishDigits = (value: string) =>
  value
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/٬/g, ",")
    .replace(/٫/g, ".");

const formatFundingAmount = (amount: string | number | null | undefined) => {
  const normalized = toEnglishDigits(String(amount ?? "")).trim();
  const numeric = Number(normalized.replace(/[^\d.]/g, ""));

  if (Number.isFinite(numeric) && numeric > 0) {
    return numeric.toLocaleString("en-US");
  }

  return normalized;
};

const formatFundingAmountWithCurrency = (amount: string | number | null | undefined) => `${formatFundingAmount(amount)} SDG`;

const getInvestorKycStorageKey = (userId: string) => `investor_kyc_draft_${userId}`;

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
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
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
  const [showNdaModal, setShowNdaModal] = useState(false);
  const [pendingRequestProject, setPendingRequestProject] = useState<Project | null>(null);
  const [ndaDownloaded, setNdaDownloaded] = useState(false);
  const [signedNdaFileName, setSignedNdaFileName] = useState("");
  const [submittingNdaRequest, setSubmittingNdaRequest] = useState(false);

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

    const { user } = await getSafeUser();

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

    if (isKycComplete) {
      setKycStatus("approved");
      setKycDocumentName("مستند مرفوع مسبقاً");
    } else {
      const draftRaw = localStorage.getItem(getInvestorKycStorageKey(user.id));
      if (draftRaw) {
        try {
          const draft = JSON.parse(draftRaw) as InvestorKycDraft;
          setKycDocumentName(draft.documentName || "");
          setKycDocumentType(draft.documentType === "passport" ? "passport" : "national_id");
          setKycStatus(draft.status || "ready_to_submit");
        } catch {
          localStorage.removeItem(getInvestorKycStorageKey(user.id));
          setKycStatus("not_uploaded");
          setKycDocumentName("");
        }
      } else {
        setKycStatus("not_uploaded");
        setKycDocumentName("");
      }
    }

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
      amount: String(row.budget ?? ""),
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
    setActionNotice("تم اختيار المستند. اضغط تحديث الملف الشخصي لحفظه.");
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
    if (currentUserId) {
      localStorage.removeItem(getInvestorKycStorageKey(currentUserId));
    }
    setActionNotice("تمت الموافقة على مستند KYC من لجنة التحقق.");
  };

  const openContactRequestModal = (project: Project) => {
    if (!isVerified) {
      if (kycStatus === "under_review") {
        setActionNotice("مستند KYC تحت المراجعة حالياً. يمكنك إرسال طلب التواصل بعد اعتماد اللجنة.");
      } else {
        setActionNotice("لا يمكن إرسال طلب التواصل قبل رفع مستند الجواز أو الرقم الوطني واعتماده ثم إكمال الملف الشخصي.");
      }
      return;
    }

    setPendingRequestProject(project);
    setNdaDownloaded(false);
    setSignedNdaFileName("");
    setShowNdaModal(true);
  };

  const downloadNdaAgreement = () => {
    if (!pendingRequestProject) return;

    const agreement = [
      "اتفاقية عدم الإفشاء والسرية",
      "",
      `المشروع: ${pendingRequestProject.name}`,
      "",
      "يقر المستثمر بعدم إفشاء أو مشاركة أي معلومات تخص المشروع أو رائد الأعمال خارج المنصة.",
      "ويتعهد باستخدام المعلومات لغرض تقييم فرصة الاستثمار فقط.",
      "",
      "اسم المستثمر: ____________________",
      "التوقيع: ____________________",
      "التاريخ: ____________________",
    ].join("\n");

    const blob = new Blob([agreement], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `nda-${pendingRequestProject.id}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    setNdaDownloaded(true);
    setActionNotice("تم تنزيل ملف اتفاقية عدم الإفشاء. يرجى التوقيع عليه ثم رفعه لإكمال إرسال الطلب.");
  };

  const handleSignedNdaUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSignedNdaFileName(file.name);
  };

  const sendContactRequest = async (project: Project, ndaFileName: string) => {
    if (!isSupabaseConfigured) {
      setActionNotice("ربط قاعدة البيانات غير مكتمل حالياً.");
      return false;
    }
    if (!currentUserId) return false;

    const { data, error } = await supabase
      .from("investment_requests")
      .insert({
        investor_id: currentUserId,
        entrepreneur_id: project.entrepreneurId,
        project_id: project.id,
        status: "تم الإرسال",
        message: `طلب تواصل جديد بخصوص مشروع ${project.name} - مرفق اتفاقية عدم الإفشاء: ${ndaFileName}`,
      })
      .select("id, status, created_at")
      .single();

    if (error || !data) {
      setActionNotice("تعذر إرسال طلب التواصل، حاول مرة أخرى.");
      return false;
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
    return true;
  };

  const submitContactRequestWithNda = async () => {
    if (!pendingRequestProject) return;

    if (!ndaDownloaded) {
      setActionNotice("يجب تنزيل ملف اتفاقية عدم الإفشاء والسرية أولاً.");
      return;
    }

    if (!signedNdaFileName) {
      setActionNotice("يرجى رفع ملف الاتفاقية بعد التوقيع لإكمال إرسال الطلب.");
      return;
    }

    setSubmittingNdaRequest(true);
    const success = await sendContactRequest(pendingRequestProject, signedNdaFileName);
    setSubmittingNdaRequest(false);

    if (!success) return;

    setShowNdaModal(false);
    setPendingRequestProject(null);
    setSelectedProject(null);
    setNdaDownloaded(false);
    setSignedNdaFileName("");
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

    const nextKycStatus =
      kycStatus === "approved" ? "approved" : kycDocumentName ? "under_review" : "not_uploaded";

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profileForm.fullName,
        phone: profileForm.phone,
        city: profileForm.city,
        address: profileForm.address,
        investor_type: profileForm.investorType,
        linkedin_url: profileForm.linkedinUrl,
        kyc_complete: nextKycStatus === "approved",
        profile_data_complete: profileDataComplete,
      })
      .eq("id", currentUserId);

    setSavingProfile(false);

    if (error) {
      setActionNotice("تعذر تحديث الملف الشخصي.");
      return;
    }

    setKycStatus(nextKycStatus);
    setKycComplete(nextKycStatus === "approved");

    if (nextKycStatus === "approved") {
      localStorage.removeItem(getInvestorKycStorageKey(currentUserId));
    } else if (kycDocumentName) {
      localStorage.setItem(
        getInvestorKycStorageKey(currentUserId),
        JSON.stringify({
          documentName: kycDocumentName,
          documentType: kycDocumentType,
          status: nextKycStatus,
        } satisfies InvestorKycDraft),
      );
    }

    setActionNotice(
      nextKycStatus === "under_review"
        ? "تم تحديث الملف الشخصي وحفظ مستند KYC، والحالة الآن: تحت المراجعة."
        : "تم تحديث الملف الشخصي بنجاح.",
    );
  };

  const updatePassword = async () => {
    if (!isSupabaseConfigured) {
      setActionNotice("ربط قاعدة البيانات غير مكتمل حالياً.");
      return;
    }

    const currentPassword = passwordForm.currentPassword.trim();
    const newPassword = passwordForm.newPassword.trim();
    const confirmPassword = passwordForm.confirmPassword.trim();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setActionNotice("يرجى تعبئة جميع حقول كلمة المرور.");
      return;
    }

    if (newPassword.length < 6) {
      setActionNotice("كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setActionNotice("تأكيد كلمة المرور غير مطابق.");
      return;
    }

    if (!profileForm.email) {
      setActionNotice("تعذر التحقق من البريد الإلكتروني للحساب.");
      return;
    }

    setSavingPassword(true);

    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email: profileForm.email,
      password: currentPassword,
    });

    if (reauthError) {
      setSavingPassword(false);
      setActionNotice("كلمة المرور الحالية غير صحيحة.");
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

    setSavingPassword(false);

    if (updateError) {
      setActionNotice("تعذر تحديث كلمة المرور.");
      return;
    }

    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setActionNotice("تم تحديث كلمة المرور بنجاح.");
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
    <div className="min-h-screen bg-gradient-to-br from-light-gray via-white to-light-gray" dir="rtl">
      <aside className="fixed right-0 top-0 bottom-0 w-64 bg-gradient-to-b from-invest-blue via-[#0c2a52] to-[#081f40] text-white p-5 overflow-y-auto border-l border-white/5 shadow-2xl">
        <Link to="/" className="flex items-center gap-3 mb-10 group">
          <div className="w-11 h-11 bg-gradient-to-br from-invest-teal to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg ring-1 ring-white/10 group-hover:scale-105 transition">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-cairo font-bold text-base block leading-none">Nile Invest AI</span>
            <span className="font-cairo text-[10px] text-white/60">لوحة المستثمر</span>
          </div>
        </Link>

        <p className="font-cairo text-[10px] font-bold tracking-widest text-white/40 px-2 mb-2">القائمة الرئيسية</p>
        <nav className="space-y-1.5">
          {nav.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveSection(item.key)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-cairo font-semibold text-sm transition-all duration-200 group relative overflow-hidden ${
                activeSection === item.key
                  ? "bg-gradient-to-l from-invest-teal to-emerald-500 text-white shadow-lg ring-1 ring-white/10"
                  : "text-white/80 hover:bg-white/5 hover:text-white"
              }`}
            >
              {activeSection === item.key && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white/90 rounded-l-full" />
              )}
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <p className="font-cairo text-[10px] font-bold tracking-widest text-white/40 px-2 mt-6 mb-2">خدمات تفاعلية</p>
        <div className="space-y-1.5">
          <button
            onClick={() => navigate("/my-advisor")}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-cairo font-semibold text-sm text-white/80 hover:bg-white/5 hover:text-white transition"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>مستشارك الخاص</span>
          </button>
          <button
            onClick={() => navigate("/partnerships")}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-cairo font-semibold text-sm text-white/80 hover:bg-white/5 hover:text-white transition"
          >
            <Handshake className="w-4 h-4 text-emerald-300" />
            <span>الشراكات</span>
          </button>
          <button
            onClick={() => navigate("/community-support")}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-cairo font-semibold text-sm text-white/80 hover:bg-white/5 hover:text-white transition"
          >
            <Users className="w-4 h-4 text-sky-300" />
            <span>منتدي الدعم</span>
          </button>
          <button
            onClick={() => navigate("/social-responsibility")}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-cairo font-semibold text-sm text-white/80 hover:bg-white/5 hover:text-white transition"
          >
            <Handshake className="w-4 h-4 text-emerald-300" />
            <span>المسئولية المجتمعية</span>
          </button>
        </div>

        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/0 border border-white/10">
          <p className="font-cairo text-[11px] text-white/70 mb-2">ترقية حسابك</p>
          <p className="font-cairo font-bold text-sm mb-3">انضم لخطة Elite</p>
          <button onClick={() => navigate("/membership")} className="w-full text-xs font-cairo font-bold py-2 rounded-lg bg-white text-invest-blue hover:bg-invest-teal hover:text-white transition">
            عرض الباقات
          </button>
        </div>
      </aside>

      <main className="mr-64 min-h-screen">
        <header className="bg-white/80 backdrop-blur-xl border-b border-light-gray sticky top-0 z-20 shadow-sm">
          <div className="px-8 h-20 flex items-center justify-between">
            <div>
              <h1 className="font-cairo font-bold text-2xl text-invest-blue tracking-tight">مرحباً، {profileForm.fullName || "مستثمر"} 👋</h1>
              <p className="font-cairo text-sm text-dark-gray flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {titles[activeSection]}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/membership")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-l from-purple-600 to-indigo-700 text-white font-cairo font-bold text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] transition"
              >
                <Crown className="w-4 h-4" />
                العضوية
              </button>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { icon: Heart, label: "اهتمامات محفوظة", value: String(favoriteIds.length), grad: "from-rose-500 to-pink-600" },
                  { icon: Send, label: "طلبات مرسلة", value: String(myRequests.length), grad: "from-sky-500 to-blue-600" },
                  { icon: Briefcase, label: "مطابقات", value: String(projects.length), grad: "from-emerald-500 to-teal-600" },
                  { icon: Search, label: "صفقات منجزة", value: String(myRequests.filter((req) => req.status === "تم الرد").length), grad: "from-amber-500 to-orange-600" },
                ].map((card, i) => {
                  const Icon = card.icon;
                  return (
                    <div key={i} className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-2xl border border-light-gray hover:border-invest-teal/30 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                      <div className={`absolute -top-12 -left-12 w-28 h-28 rounded-full bg-gradient-to-br ${card.grad} opacity-10 blur-2xl group-hover:opacity-20 transition`} />
                      <div className={`relative w-12 h-12 rounded-2xl bg-gradient-to-br ${card.grad} flex items-center justify-center shadow-md mb-3`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="font-cairo text-xs text-dark-gray mb-1">{card.label}</p>
                      <p className="font-cairo text-3xl font-bold text-text-dark tracking-tight">{card.value}</p>
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
                      <p className="font-cairo text-2xl font-black text-invest-blue tracking-tight" dir="ltr">{formatFundingAmountWithCurrency(p.amount)}</p>
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

                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-3">
                  {[
                    { title: "تحليل جدوى مشروع", route: "/ai-service/investor/feasibility", paid: true },
                    { title: "تقييم مخاطر الاستثمار", route: "/ai-service/investor/risk", paid: true },
                    { title: "حساب العائد المتوقع", route: "/ai-service/investor/returns", paid: true },
                    { title: "نموذج العمل", route: "/ai-service/investor/business_model", paid: true },
                    { title: "المسئولية المجتمعية", route: "/social-responsibility", paid: false },
                  ].map((serviceItem) => (
                    <button
                      key={serviceItem.title}
                      onClick={() => navigate(serviceItem.route)}
                      className="border border-light-gray rounded-xl p-4 text-right hover:border-invest-teal hover:bg-light-gray transition"
                    >
                      <p className="font-cairo font-semibold text-sm text-text-dark">{serviceItem.title}</p>
                      <p className="font-cairo text-xs text-dark-gray mt-1">{serviceItem.paid ? "خدمة مدفوعة" : "مبادرة مجتمعية"}</p>
                    </button>
                  ))}
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
                        <p className="font-cairo text-2xl font-black text-invest-blue tracking-tight" dir="ltr">{formatFundingAmountWithCurrency(project.amount)}</p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openContactRequestModal(project)}
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
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="كلمة المرور الحالية"
                    className="border border-light-gray rounded-lg px-4 py-2.5 font-cairo text-sm"
                  />
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="كلمة المرور الجديدة"
                    className="border border-light-gray rounded-lg px-4 py-2.5 font-cairo text-sm"
                  />
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="تأكيد كلمة المرور"
                    className="border border-light-gray rounded-lg px-4 py-2.5 font-cairo text-sm"
                  />
                </div>
                <button
                  onClick={updatePassword}
                  disabled={savingPassword}
                  className="px-5 py-2.5 bg-invest-blue text-white rounded-lg font-cairo font-semibold disabled:opacity-60"
                >
                  {savingPassword ? "جاري تحديث كلمة المرور..." : "تحديث كلمة المرور"}
                </button>
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
                  <div className="p-3 bg-light-gray rounded-lg font-cairo text-sm">الميزانية: <span className="font-bold text-invest-blue text-base" dir="ltr">{formatFundingAmountWithCurrency(selectedProject.amount)}</span></div>
                </div>
                <button
                  onClick={() => openContactRequestModal(selectedProject)}
                  className={`mt-4 px-5 py-2.5 rounded-lg font-cairo font-semibold ${
                    isVerified ? "bg-invest-teal text-white hover:bg-emerald-600" : "bg-light-gray text-dark-gray cursor-not-allowed"
                  }`}
                >
                  طلب تواصل مع رائد الأعمال
                </button>
              </div>
            </div>
          )}

          {showNdaModal && pendingRequestProject && (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-cairo font-bold text-xl text-invest-blue">اتفاقية عدم الإفشاء والسرية</h3>
                  <button
                    onClick={() => {
                      setShowNdaModal(false);
                      setPendingRequestProject(null);
                    }}
                    className="text-dark-gray font-cairo"
                  >
                    إغلاق
                  </button>
                </div>

                <p className="font-cairo text-sm text-dark-gray leading-7">
                  لإكمال إرسال طلب التواصل الخاص بمشروع <span className="font-bold">{pendingRequestProject.name}</span>، يجب تنزيل ملف
                  اتفاقية عدم الإفشاء والسرية، توقيعه، ثم رفع النسخة الموقعة.
                </p>

                <button
                  onClick={downloadNdaAgreement}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-invest-blue text-white font-cairo font-semibold"
                >
                  <FileDown className="w-4 h-4" />
                  تحميل ملف اتفاقية عدم الإفشاء والسرية
                </button>

                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-invest-teal text-invest-teal font-cairo text-sm font-semibold cursor-pointer hover:bg-invest-teal/10">
                    <Upload className="w-4 h-4" />
                    رفع الملف بعد التوقيع
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt" className="hidden" onChange={handleSignedNdaUpload} />
                  </label>
                  <span className="font-cairo text-xs text-dark-gray">
                    {signedNdaFileName ? `الملف المرفوع: ${signedNdaFileName}` : "لم يتم رفع ملف موقع بعد"}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={submitContactRequestWithNda}
                    disabled={submittingNdaRequest || !ndaDownloaded || !signedNdaFileName}
                    className="px-5 py-2.5 rounded-lg bg-invest-teal text-white font-cairo font-semibold disabled:opacity-50"
                  >
                    {submittingNdaRequest ? "جاري إرسال الطلب..." : "إرسال الطلب لرائد الأعمال"}
                  </button>
                  <span className="font-cairo text-xs text-dark-gray">يتم تفعيل الإرسال بعد التحميل والتوقيع والرفع.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
