import { CheckCircle2, Crown, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSafeUser, isSupabaseConfigured, supabase } from "@/lib/supabase";

type MembershipPlan = {
  id: "basic" | "plus" | "elite";
  name: string;
  colorClass: string;
  borderClass: string;
  monthlyPrice: string;
  yearlyPrice: string;
  features: string[];
};

const plans: MembershipPlan[] = [
  {
    id: "basic",
    name: "أساسي",
    colorClass: "from-slate-500 to-slate-700",
    borderClass: "border-slate-200",
    monthlyPrice: "مجاني",
    yearlyPrice: "مجاني",
    features: ["تصفح المشاريع", "إرسال طلبات محدودة", "دعم قياسي"],
  },
  {
    id: "plus",
    name: "بلس",
    colorClass: "from-invest-teal to-invest-blue",
    borderClass: "border-invest-teal/30",
    monthlyPrice: "30,000 ج.س / شهري",
    yearlyPrice: "300,000 ج.س / سنوي",
    features: ["الوصول إلى المستشارين", "أولوية في الطلبات", "تحليلات أعمق للمشاريع"],
  },
  {
    id: "elite",
    name: "نخبة",
    colorClass: "from-amber-500 to-orange-600",
    borderClass: "border-amber-300",
    monthlyPrice: "55,000 ج.س / شهري",
    yearlyPrice: "540,000 ج.س / سنوي",
    features: ["كل مميزات بلس", "جلسات استشارية أكثر", "مدير حساب ومتابعة أسرع"],
  },
];

export default function MembershipPage() {
  const navigate = useNavigate();
  const [dashboardLink, setDashboardLink] = useState<{ to: string; label: string }>({
    to: "/investor-dashboard",
    label: "لوحة المستثمر",
  });

  useEffect(() => {
    const resolveDashboardLink = async () => {
      if (!isSupabaseConfigured) return;

      const { user } = await getSafeUser();

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

  return (
    <div className="min-h-screen bg-light-gray" dir="rtl">
      <header className="bg-white border-b border-light-gray">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center">
              <Crown className="w-6 h-6 text-purple-700" />
            </div>
            <div>
              <h1 className="font-cairo text-2xl font-bold text-invest-blue">العضوية</h1>
              <p className="font-cairo text-sm text-dark-gray">اختر الباقة المناسبة واستفد من مزايا إضافية حسب الخطة.</p>
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

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <article key={plan.id} className={`bg-white rounded-2xl border ${plan.borderClass} p-5 shadow-sm flex flex-col gap-4`}>
              <div className={`rounded-xl px-4 py-3 bg-gradient-to-l ${plan.colorClass} text-white`}>
                <p className="font-cairo text-lg font-bold">{plan.name}</p>
                <p className="font-cairo text-sm opacity-95 mt-1">{plan.monthlyPrice}</p>
                <p className="font-cairo text-xs opacity-90 mt-1">{plan.yearlyPrice}</p>
              </div>

              <div className="space-y-2">
                {plan.features.map((feature) => (
                  <p key={feature} className="font-cairo text-sm text-dark-gray inline-flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-invest-teal" />
                    {feature}
                  </p>
                ))}
              </div>

              <div className="mt-auto">
                {plan.id === "basic" ? (
                  <button
                    type="button"
                    className="w-full px-4 py-2.5 rounded-xl bg-light-gray text-dark-gray font-cairo font-bold text-sm cursor-default"
                  >
                    الخطة الأساسية الحالية
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(`/membership/${plan.id}`)}
                    className={`w-full px-4 py-2.5 rounded-xl bg-gradient-to-l ${plan.colorClass} text-white font-cairo font-bold text-sm shadow hover:shadow-lg transition`}
                  >
                    عرض التفاصيل والاشتراك
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-purple-200 bg-purple-50 p-4 inline-flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-700" />
          <p className="font-cairo text-sm text-purple-900">الباقات المدفوعة تمنحك مزايا إضافية، ومنها الوصول إلى المستشارين.</p>
        </div>
      </main>
    </div>
  );
}
