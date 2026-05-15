import {
  Briefcase,
  FileText,
  Link as LinkIcon,
  MessageSquare,
  Paperclip,
  Send,
  Sparkles,
  Star,
  Wallet,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

type Advisor = {
  id: number;
  name: string;
  specialty: string;
  bio: string;
  experienceYears: number;
  profileUrl: string;
  paidPrice: string;
  rating: number;
  transactionsCount: number;
};

export default function MyAdvisorPage() {
  const advisors = useMemo<Advisor[]>(
    () => [
      {
        id: 1,
        name: "عزة حسن",
        specialty: "تطوير الأعمال والشراكات الاستراتيجية",
        bio: "خبيرة تطوير أعمال وشراكات استراتيجية في قطاعات التكنولوجيا المالية والطاقة والتعدين. قادت مبادرات توسع وفتحت أسواقًا جديدة عبر استراتيجيات نمو مستدامة، ومتخصصة في تحليل الأسواق وتصميم نماذج تعاون تحقق قيمة مشتركة طويلة المدى.",
        experienceYears: 10,
        profileUrl: "https://www.linkedin.com/in/azza-h-khalid?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
        paidPrice: "65,000 ج.س / الجلسة",
        rating: 4.9,
        transactionsCount: 128,
      },
      {
        id: 2,
        name: "أمجد عزالدين",
        specialty: "التحول الرقمي والتميز التشغيلي",
        bio: "مختص في تمكين المؤسسات من تحويل استراتيجياتها الرقمية إلى نتائج قابلة للقياس من خلال الجمع بين الرؤية الاستراتيجية والانضباط التشغيلي وأحدث ممارسات التنفيذ. يمتلك خبرة تزيد عن 13 عامًا في تقنية المعلومات والتحول الرقمي، ويقود مبادرات التسليم المؤسسي وتحسين العمليات لتعزيز الكفاءة التشغيلية وتجربة العملاء، مع خبرة في أطر العمل المرنة (Agile) وحوكمة التنفيذ.",
        experienceYears: 13,
        profileUrl: "https://www.linkedin.com/in/amjed-ezaddin",
        paidPrice: "70,000 ج.س / الجلسة",
        rating: 4.8,
        transactionsCount: 141,
      },
    ],
    [],
  );

  const navigate = useNavigate();
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);
  const [requestDescription, setRequestDescription] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [pageNotice, setPageNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [dashboardLink, setDashboardLink] = useState<{ to: string; label: string }>({
    to: "/investor-dashboard",
    label: "لوحة المستثمر",
  });

  useEffect(() => {
    const resolveDashboardLink = async () => {
      if (!isSupabaseConfigured) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();

      if (profile?.role === "entrepreneur") {
        setDashboardLink({ to: "/dashboard", label: "لوحة رائد الأعمال" });
      } else {
        setDashboardLink({ to: "/investor-dashboard", label: "لوحة المستثمر" });
      }
    };

    resolveDashboardLink();
  }, []);

  const closeRequestModal = () => {
    setSelectedAdvisor(null);
    setRequestDescription("");
    setAttachedFiles([]);
  };

  const submitPaidRequest = async () => {
    if (!selectedAdvisor) return;

    if (!requestDescription.trim()) {
      const message = "يرجى كتابة شرح مختصر عن طلب الخدمة قبل الإرسال.";
      setPageNotice({ type: "error", text: message });
      toast.error(message);
      return;
    }

    if (!isSupabaseConfigured) {
      const message = "ربط قاعدة البيانات غير مكتمل حالياً.";
      setPageNotice({ type: "error", text: message });
      toast.error(message);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const message = "يجب تسجيل الدخول أولاً لإرسال طلب استشارة.";
      setPageNotice({ type: "error", text: message });
      toast.error(message);
      navigate("/login");
      return;
    }

    setSendingRequest(true);

    const attachedFilesMeta = attachedFiles.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    const { error } = await supabase.from("advisor_service_requests").insert({
      requester_id: user.id,
      advisor_name: selectedAdvisor.name,
      advisor_specialty: selectedAdvisor.specialty,
      service_description: requestDescription.trim(),
      attached_files: attachedFilesMeta,
      status: "pending",
      payment_status: "pending",
    });

    setSendingRequest(false);

    if (error) {
      const message = "تعذر إرسال الطلب. تأكد من وجود جدول advisor_service_requests وصلاحياته.";
      setPageNotice({ type: "error", text: message });
      toast.error(message);
      return;
    }

    const successMessage = "تم ارسال الطلب لرائد الاعمال وسوف يرد";
    setPageNotice({ type: "success", text: successMessage });
    toast.success(successMessage);
    closeRequestModal();
  };

  return (
    <div className="min-h-screen bg-light-gray" dir="rtl">
      <header className="bg-white border-b border-light-gray">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-invest-blue/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-invest-blue" />
            </div>
            <div>
              <h1 className="font-cairo text-2xl font-bold text-invest-blue">مستشارك الخاص</h1>
              <p className="font-cairo text-sm text-dark-gray">اختر من نماذج مستشارين متخصصين واطلب استشارة مدفوعة مباشرة.</p>
            </div>
          </div>

          <Link
            to={dashboardLink.to}
            className="px-4 py-2 rounded-lg bg-invest-blue text-white font-cairo font-semibold hover:bg-blue-900 transition"
          >
            {dashboardLink.label}
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-5">
        {pageNotice && (
          <div
            className={`rounded-xl border p-4 font-cairo text-sm ${
              pageNotice.type === "success"
                ? "border-invest-teal/30 bg-invest-teal/10 text-invest-blue"
                : "border-invest-red/30 bg-invest-red/10 text-invest-red"
            }`}
          >
            {pageNotice.text}
          </div>
        )}

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {advisors.map((advisor) => (
          <article key={advisor.id} className="bg-white rounded-2xl border border-light-gray p-5 shadow-sm space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="font-cairo text-xl font-bold text-text-dark">{advisor.name}</h2>
                <p className="font-cairo text-sm text-invest-teal mt-1">{advisor.specialty}</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-invest-blue/10 text-invest-blue text-xs font-cairo font-bold">مدفوع</span>
            </div>

            <p className="font-cairo text-sm text-dark-gray leading-7">{advisor.bio}</p>

            <div className="grid grid-cols-2 gap-3">
              <div className="border border-light-gray rounded-xl p-3 bg-light-gray/40">
                <p className="font-cairo text-xs text-dark-gray mb-1 inline-flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5" />
                  الخبرة
                </p>
                <p className="font-cairo font-bold text-sm text-text-dark">{advisor.experienceYears} سنة</p>
              </div>
              <div className="border border-light-gray rounded-xl p-3 bg-light-gray/40">
                <p className="font-cairo text-xs text-dark-gray mb-1 inline-flex items-center gap-1">
                  <Wallet className="w-3.5 h-3.5" />
                  قيمة الجلسة
                </p>
                <p className="font-cairo font-bold text-sm text-text-dark">{advisor.paidPrice}</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="inline-flex items-center gap-1.5 text-amber-500">
                {[1, 2, 3, 4, 5].map((item) => (
                  <Star key={item} className={`w-4 h-4 ${item <= Math.round(advisor.rating) ? "fill-current" : ""}`} />
                ))}
                <span className="font-cairo text-xs text-dark-gray mr-1">({advisor.rating})</span>
              </div>
              <p className="font-cairo text-xs text-dark-gray">عدد المعاملات: {advisor.transactionsCount}</p>
            </div>

            <a
              href={advisor.profileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 font-cairo text-sm font-semibold text-invest-blue hover:text-blue-900"
            >
              <LinkIcon className="w-4 h-4" />
              رابط صفحة المستشار
            </a>

            <button
              onClick={() => setSelectedAdvisor(advisor)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-l from-invest-blue to-invest-teal text-white font-cairo font-bold text-sm shadow-md hover:shadow-lg transition"
            >
              <MessageSquare className="w-4 h-4" />
              طلب استشارة مدفوعة
            </button>
          </article>
        ))}
        </div>
      </main>

      {selectedAdvisor && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl border border-light-gray shadow-2xl" dir="rtl">
            <div className="px-6 py-5 border-b border-light-gray flex items-start justify-between gap-3">
              <div>
                <h3 className="font-cairo text-xl font-bold text-invest-blue">طلب خدمة مدفوعة</h3>
                <p className="font-cairo text-sm text-dark-gray mt-1">المستشار: {selectedAdvisor.name}</p>
              </div>
              <button onClick={closeRequestModal} className="p-2 rounded-lg hover:bg-light-gray transition" aria-label="إغلاق">
                <X className="w-5 h-5 text-dark-gray" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="font-cairo text-sm font-bold text-text-dark mb-2 block">شرح طلب الخدمة</label>
                <textarea
                  rows={5}
                  value={requestDescription}
                  onChange={(event) => setRequestDescription(event.target.value)}
                  placeholder="اكتب تفاصيل طلبك، الهدف من الاستشارة، وما الذي تريد الوصول إليه."
                  className="w-full border border-light-gray rounded-xl px-4 py-3 font-cairo text-sm resize-none focus:outline-none focus:border-invest-teal"
                />
              </div>

              <div>
                <label className="font-cairo text-sm font-bold text-text-dark mb-2 block">إرفاق ملفات</label>
                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-invest-teal text-invest-teal font-cairo text-sm font-semibold cursor-pointer hover:bg-invest-teal/10 transition">
                  <Paperclip className="w-4 h-4" />
                  إرفاق ملفات
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(event) => setAttachedFiles(Array.from(event.target.files ?? []))}
                  />
                </label>
                {attachedFiles.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {attachedFiles.map((file) => (
                      <p key={`${file.name}-${file.size}`} className="font-cairo text-xs text-dark-gray inline-flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" />
                        {file.name}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-light-gray flex items-center justify-end">
              <button
                onClick={submitPaidRequest}
                disabled={sendingRequest}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-invest-blue text-white font-cairo font-bold text-sm hover:bg-blue-900 transition disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                {sendingRequest ? "جاري الإرسال..." : "إرسال"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
