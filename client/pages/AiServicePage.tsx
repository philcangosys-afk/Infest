import { Link, useNavigate, useParams } from "react-router-dom";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

type Role = "investor" | "entrepreneur";

type ServiceConfig = {
  title: string;
  subtitle: string;
};

type FollowupItem = {
  question: string;
  answer: string;
};

const normalizeArabicDigits = (value: string) =>
  value
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/٬/g, ",")
    .replace(/٫/g, ".");

let pdfjsLibPromise: Promise<any> | null = null;

const loadPdfJs = async () => {
  if (pdfjsLibPromise) return pdfjsLibPromise;

  pdfjsLibPromise = (async () => {
    const lib = await import(/* @vite-ignore */ "https://esm.sh/pdfjs-dist@3.11.174/build/pdf.mjs");
    lib.GlobalWorkerOptions.workerSrc = "https://esm.sh/pdfjs-dist@3.11.174/build/pdf.worker.mjs";
    return lib;
  })();

  return pdfjsLibPromise;
};

const extractPdfText = async (file: File) => {
  const buffer = await file.arrayBuffer();

  try {
    const pdfjs = await loadPdfJs();
    const loadingTask = pdfjs.getDocument({ data: new Uint8Array(buffer) });
    const pdf = await loadingTask.promise;
    const pageTexts: string[] = [];

    const totalPages = Math.min(pdf.numPages, 60);
    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const textContent = await page.getTextContent();
      const pageStrings = textContent.items
        .map((item: any) => (typeof item.str === "string" ? item.str : ""))
        .filter((item: string) => item.trim().length > 0);
      if (pageStrings.length) {
        pageTexts.push(pageStrings.join(" "));
      }
    }

    if (pageTexts.length) {
      return normalizeArabicDigits(pageTexts.join("\n")).replace(/[ \t]+/g, " ").trim();
    }
  } catch (error) {
    console.warn("pdfjs extraction failed, falling back to raw text", error);
  }

  const bytes = new Uint8Array(buffer);
  const binaryLatin = new TextDecoder("latin1").decode(bytes);
  const chunks: string[] = [];
  const directTextRegex = /\(([^()]*)\)\s*Tj/g;
  let match: RegExpExecArray | null;

  while ((match = directTextRegex.exec(binaryLatin)) !== null) {
    const text = match[1]
      .replace(/\\n/g, " ")
      .replace(/\\r/g, " ")
      .replace(/\\\(/g, "(")
      .replace(/\\\)/g, ")")
      .trim();
    if (text.length > 1) chunks.push(text);
  }

  return normalizeArabicDigits(chunks.join(" ")).replace(/\s+/g, " ").trim();
};

const detectCurrencyHint = (rawText: string, summary: string) => {
  const text = normalizeArabicDigits(`${rawText} ${summary}`).toLowerCase();

  if (/\b(sdg|ج\.?\s*س|جنيه\s*سوداني|جنيه)\b/i.test(text)) {
    return { code: "SDG", label: "الجنيه السوداني (ج.س)" };
  }

  if (/\b(usd|دولار|\$)\b/i.test(text)) {
    return { code: "USD", label: "الدولار الأمريكي (USD)" };
  }

  if (/\b(sar|ريال\s*سعودي|ريال)\b/i.test(text)) {
    return { code: "SAR", label: "الريال السعودي (SAR)" };
  }

  if (/\b(aed|درهم\s*إماراتي|درهم)\b/i.test(text)) {
    return { code: "AED", label: "الدرهم الإماراتي (AED)" };
  }

  if (/\b(egp|جنيه\s*مصري)\b/i.test(text)) {
    return { code: "EGP", label: "الجنيه المصري (EGP)" };
  }

  return { code: "SDG", label: "الجنيه السوداني (ج.س)" };
};

const extractFinancialSignals = (rawText: string, summary: string) => {
  const text = normalizeArabicDigits(`${rawText} ${summary}`);
  const signals = new Set<string>();

  const amountRegex = /(\d[\d,.]{0,15})\s*(ج\.?س|جنيه|جنيهًا|sdg|\$|usd|ريال|دينار)/gi;
  const percentageRegex = /(\d+(?:\.\d+)?)\s*%/g;
  const keywordContextRegex = /([^.!?\n]{0,40}(?:ايراد|إيراد|تكلفة|تكاليف|مصروف|رسوم|هامش|ربح|خسارة|نقطة التعادل|اشتراك|عمولة|نمو|مبيعات)[^.!?\n]{0,60})/gi;

  for (const matchItem of text.matchAll(amountRegex)) {
    signals.add(`${matchItem[1]} ${matchItem[2]}`);
  }

  for (const matchItem of text.matchAll(percentageRegex)) {
    signals.add(`${matchItem[1]}%`);
  }

  for (const matchItem of text.matchAll(keywordContextRegex)) {
    signals.add(matchItem[1].replace(/\s+/g, " ").trim());
  }

  return Array.from(signals).slice(0, 80);
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
    business_model: {
      title: "نموذج العمل",
      subtitle: "ارفع دراسة الجدوى ليقوم الذكاء باستخلاص نموذج العمل الكامل وهيكل الإيرادات والتكاليف والتشغيل.",
    },
  },
  entrepreneur: {
    pitch: {
      title: "تحسين عرض المشروع",
      subtitle: "ارفع ملف المشروع للحصول على ملاحظات واضحة حول ترتيب العرض والنواقص وكيفية تحسينه.",
    },
    financial: {
      title: "خطة مالية أولية",
      subtitle: "ارفع ملف المشروع للحصول على مراجعة للدراسة المالية: التكاليف، الإيرادات، الربحية والنواقص.",
    },
    business_model: {
      title: "نموذج العمل",
      subtitle: "ارفع دراسة الجدوى لاستخلاص نموذج عمل متكامل: عرض القيمة، هيكل الإيرادات ورسوم المعاملات والإدارة والأداء وقنوات التنفيذ.",
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
  const analysisCardRef = useRef<HTMLDivElement | null>(null);

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
      const extractedPdfText = question ? "" : await extractPdfText(pdfFile);
      const boundedExtractedPdfText = extractedPdfText.slice(0, 30000);
      const detectedFinancialSignals = question ? [] : extractFinancialSignals(boundedExtractedPdfText, projectSummary);
      const currencyHint = question ? undefined : detectCurrencyHint(boundedExtractedPdfText, projectSummary);

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
          pdfExtractedText: boundedExtractedPdfText || undefined,
          pdfDetectedNumbers: detectedFinancialSignals.length ? detectedFinancialSignals : undefined,
          currencyHint: currencyHint || undefined,
        }),
      });

      const data = (await response.json()) as { result?: string; error?: string };

      if (!response.ok) {
        setErrorMessage(data.error || "تعذر تنفيذ التحليل الآن.");
        setLoading(false);
        return false;
      }

      const nextResult = data.result || "لا توجد نتيجة حالياً.";

      if (question) {
        setFollowupHistory((prev) => [...prev, { question, answer: nextResult }]);
      } else {
        setAnalysisResult(nextResult);
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

  const downloadAnalysisPdf = async () => {
    if (!analysisCardRef.current) return;

    const canvas = await html2canvas(analysisCardRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
    });

    const image = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imageProps = pdf.getImageProperties(image);
    const imageWidth = pageWidth;
    const imageHeight = (imageProps.height * imageWidth) / imageProps.width;

    let remainingHeight = imageHeight;
    let position = 0;

    pdf.addImage(image, "PNG", 0, position, imageWidth, imageHeight);
    remainingHeight -= pageHeight;

    while (remainingHeight > 0) {
      position = remainingHeight - imageHeight;
      pdf.addPage();
      pdf.addImage(image, "PNG", 0, position, imageWidth, imageHeight);
      remainingHeight -= pageHeight;
    }

    pdf.save("analysis-report.pdf");
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
          <div ref={analysisCardRef} className="bg-white rounded-2xl p-6 shadow-lg border border-light-gray space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-cairo font-bold text-xl text-text-dark">نتيجة التحليل</h2>
              <button
                onClick={downloadAnalysisPdf}
                className="px-4 py-2 rounded-lg border border-invest-blue text-invest-blue font-cairo text-sm hover:bg-invest-blue hover:text-white transition"
              >
                تحميل PDF للتحليل
              </button>
            </div>
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

              <div className="flex flex-col gap-2">
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
                  className="px-4 py-2.5 rounded-lg bg-invest-teal text-white font-cairo text-sm disabled:opacity-60 self-start"
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
