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
import { useMemo, useState } from "react";
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
        name: "د. محمد الفاتح",
        specialty: "استشارات التمويل والتوسع للشركات الناشئة",
        bio: "خبرة طويلة في تجهيز ملفات الاستثمار، تقييم المخاطر، وإعداد خطط تمويل قابلة للتنفيذ للمشاريع في السوق السوداني.",
        experienceYears: 12,
        profileUrl: "https://example.com/advisors/mohamed-alfateh",
        paidPrice: "65,000 ج.س / الجلسة",
        rating: 4.9,
        transactionsCount: 148,
      },
      {
        id: 2,
        name: "أ. آمنة الطيب",
        specialty: "مستشارة تطوير عروض المشاريع للمستثمرين",
        bio: "تساعد رواد الأعمال في إعادة صياغة عرض المشروع، بناء قصة استثمارية مقنعة، وتحسين جاهزية المستندات قبل طلب التمويل.",
        experienceYears: 9,
        profileUrl: "https://example.com/advisors/amna-altayeb",
        paidPrice: "55,000 ج.س / الجلسة",
        rating: 4.8,
        transactionsCount: 112,
      },
      {
        id: 3,
        name: "م. معتصم عبد الرحمن",
        specialty: "استشارات دراسات الجدوى المالية والتشغيلية",
        bio: "متخصص في تحليل الجدوى، توقعات التدفقات النقدية، وتقييم قابلية المشروع للاستمرار والنمو في بيئات تشغيل مختلفة.",
        experienceYears: 11,
        profileUrl: "https://example.com/advisors/mutasim-abdelrahman",
        paidPrice: "70,000 ج.س / الجلسة",
        rating: 4.7,
        transactionsCount: 96,
      },
    ],
    [],
  );

  const navigate = useNavigate();
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);
  const [requestDescription, setRequestDescription] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [sendingRequest, setSendingRequest] = useState(false);

  const closeRequestModal = () => {
    setSelectedAdvisor(null);
    setRequestDescription("");
    setAttachedFiles([]);
  };

  const submitPaidRequest = async () => {
    if (!selectedAdvisor) return;

    if (!requestDescription.trim()) {
      toast.error("يرجى كتابة شرح مختصر عن طلب الخدمة قبل الإرسال.");
      return;
    }

    if (!isSupabaseConfigured) {
      toast.error("ربط قاعدة البيانات غير مكتمل حالياً.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً لإرسال طلب استشارة.");
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
      toast.error("تعذر إرسال الطلب. تأكد من وجود جدول advisor_service_requests وصلاحياته.");
      return;
    }

    toast.success("تم ارسال الطلب لرائد الاعمال وسوف يرد");
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

          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-lg border border-light-gray text-dark-gray font-cairo font-semibold hover:bg-white transition"
            >
              لوحة رائد الأعمال
            </Link>
            <Link
              to="/investor-dashboard"
              className="px-4 py-2 rounded-lg bg-invest-blue text-white font-cairo font-semibold hover:bg-blue-900 transition"
            >
              لوحة المستثمر
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 grid md:grid-cols-2 xl:grid-cols-3 gap-6">
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
