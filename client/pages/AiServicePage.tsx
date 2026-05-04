import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

type Role = "investor" | "entrepreneur";

type ServiceConfig = {
  title: string;
  subtitle: string;
};

type FollowupItem = {
  question: string;
  answer: string;
};

const CONFIG: Record<Role, Record<string, ServiceConfig>> = {
  investor: {
    feasibility: {
      title: "تحليل جدوى مشروع",
      subtitle: "ارفع ملف PDF للمشروع ثم ابدأ تحليل الجدوى بالذكاء الاصطناعي.",
    },
    risk: {
      title: "تقييم مخاطر الاستثمار",
      subtitle: "ارفع ملف المشروع لتحليل المخاطر المحتملة وخيارات التخفيف.",
    },
    returns: {
      title: "حساب العائد المتوقع",
      subtitle: "ارفع ملف المشروع لتحليل السيناريوهات المتوقعة للعائد.",
    },
  },
  entrepreneur: {
    pitch: {
      title: "تحسين عرض المشروع",
      subtitle: "ارفع ملف العرض لتحسين الصياغة والبنية والأرقام الرئيسية.",
    },
    financial: {
      title: "خطة مالية أولية",
      subtitle: "ارفع ملف المشروع لبناء خطة مالية عملية قابلة للتنفيذ.",
    },
    responses: {
      title: "الرد على المستثمرين",
      subtitle: "ارفع ملف المشروع ثم احصل على ردود احترافية لأسئلة المستثمرين.",
    },
  },
};

export default function AiServicePage() {
  const navigate = useNavigate();
  const { role, service } = useParams<{ role: Role; service: string }>();

  const validRole = role === "entrepreneur" ? "entrepreneur" : "investor";
  const serviceConfig = CONFIG[validRole][service || ""];

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [projectSummary, setProjectSummary] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const [followupQuestion, setFollowupQuestion] = useState("");
  const [followupHistory, setFollowupHistory] = useState<FollowupItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!serviceConfig) {
    return (
      <div className="min-h-screen bg-light-gray flex items-center justify-center p-6" dir="rtl">
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center w-full max-w-lg">
          <p className="font-cairo text-dark-gray mb-4">الخدمة المطلوبة غير موجودة.</p>
          <button
            onClick={() => navigate(validRole === "investor" ? "/investor-dashboard" : "/dashboard")}
            className="px-5 py-2.5 rounded-lg bg-invest-blue text-white font-cairo"
          >
            العودة إلى لوحة التحكم
          </button>
        </div>
      </div>
    );
  }

  const runAnalysis = async (question?: string) => {
    if (!pdfFile) {
      setErrorMessage("يرجى رفع ملف PDF أولاً.");
      return false;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/ai-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: validRole,
          service,
          fileName: pdfFile.name,
          projectSummary,
          question,
          previousAnalysis: analysisResult || undefined,
        }),
      });

      const data = (await response.json()) as { result?: string; error?: string };

      if (!response.ok) {
        setErrorMessage(data.error || "تعذر تنفيذ التحليل الآن.");
        setLoading(false);
        return false;
      }

      const nextResult = data.result || "لا توجد نتيجة حالياً.";
      setAnalysisResult(nextResult);

      if (question) {
        setFollowupHistory((prev) => [...prev, { question, answer: nextResult }]);
      } else {
        setFollowupHistory([]);
      }

      setLoading(false);
      return true;
    } catch {
      setErrorMessage("تعذر الاتصال بخدمة الذكاء الاصطناعي.");
      setLoading(false);
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-light-gray" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="font-cairo font-bold text-3xl text-invest-blue">{serviceConfig.title}</h1>
            <p className="font-cairo text-dark-gray mt-1">{serviceConfig.subtitle}</p>
          </div>
          <Link
            to={validRole === "investor" ? "/investor-dashboard" : "/dashboard"}
            className="px-4 py-2 rounded-lg border border-light-gray font-cairo text-sm hover:bg-white"
          >
            الرجوع للوحة التحكم
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-light-gray space-y-4">
          <div className="inline-flex px-3 py-1 rounded-full bg-invest-teal/10 text-invest-teal font-cairo text-xs font-bold">
            تم تأكيد دفع الخدمة
          </div>

          <label className="font-cairo text-sm font-bold text-text-dark block">رفع ملف PDF للمشروع</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
            className="block w-full border border-light-gray rounded-xl px-4 py-2.5 font-cairo text-sm bg-white"
          />

          <textarea
            value={projectSummary}
            onChange={(e) => setProjectSummary(e.target.value)}
            placeholder="اكتب ملخصًا سريعًا للمشروع أو أهم النقاط التي تريد التركيز عليها في التحليل..."
            rows={4}
            className="w-full border border-light-gray rounded-xl px-4 py-3 font-cairo text-sm focus:outline-none focus:border-invest-teal"
          />

          <button
            onClick={() => runAnalysis()}
            disabled={loading}
            className="px-5 py-2.5 rounded-lg bg-invest-blue text-white font-cairo font-semibold disabled:opacity-60"
          >
            {loading ? "جاري التحليل..." : "تحليل الخدمة"}
          </button>

          {errorMessage && (
            <div className="rounded-xl border border-invest-red/20 bg-invest-red/10 p-3 font-cairo text-sm text-invest-red">
              {errorMessage}
            </div>
          )}
        </div>

        {analysisResult && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-light-gray space-y-4">
            <h2 className="font-cairo font-bold text-xl text-text-dark">نتيجة التحليل</h2>
            <div className="font-cairo text-sm text-dark-gray whitespace-pre-wrap leading-7">{analysisResult}</div>

            <div className="pt-2 border-t border-light-gray space-y-3">
              <p className="font-cairo text-sm font-bold text-text-dark">استفسار إضافي حول التحليل</p>

              {followupHistory.length > 0 && (
                <div className="space-y-3">
                  {followupHistory.map((item, index) => (
                    <div key={`${item.question}-${index}`} className="space-y-2 rounded-xl border border-light-gray p-3">
                      <div>
                        <p className="font-cairo text-xs text-invest-blue font-bold mb-1">سؤالك</p>
                        <p className="font-cairo text-sm text-text-dark whitespace-pre-wrap">{item.question}</p>
                      </div>
                      <div>
                        <p className="font-cairo text-xs text-invest-teal font-bold mb-1">رد المستشار</p>
                        <p className="font-cairo text-sm text-dark-gray whitespace-pre-wrap leading-7">{item.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <input
                  value={followupQuestion}
                  onChange={(e) => setFollowupQuestion(e.target.value)}
                  placeholder="اكتب سؤالك أو استفسارك هنا..."
                  className="flex-1 border border-light-gray rounded-lg px-4 py-2.5 font-cairo text-sm"
                />
                <button
                  onClick={async () => {
                    const nextQuestion = followupQuestion.trim();
                    if (!nextQuestion) return;
                    const isSent = await runAnalysis(nextQuestion);
                    if (isSent) {
                      setFollowupQuestion("");
                    }
                  }}
                  disabled={loading}
                  className="px-4 py-2.5 rounded-lg bg-invest-teal text-white font-cairo text-sm disabled:opacity-60"
                >
                  إرسال
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
