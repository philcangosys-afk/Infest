import { CheckCircle2, Copy, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

type BillingCycle = "monthly" | "yearly";
type WalletProvider = "bankak" | "fawry" | "zain-cash";

type PlanDetail = {
  id: "plus" | "elite";
  name: string;
  colorClass: string;
  monthlyAmount: number;
  yearlyAmount: number;
  monthlyLabel: string;
  yearlyLabel: string;
  privileges: string[];
};

const wallets: { id: WalletProvider; label: string }[] = [
  { id: "bankak", label: "بنكك" },
  { id: "fawry", label: "فوري" },
  { id: "zain-cash", label: "زين كاش" },
];

const plans: PlanDetail[] = [
  {
    id: "plus",
    name: "بلس",
    colorClass: "from-invest-teal to-invest-blue",
    monthlyAmount: 30000,
    yearlyAmount: 300000,
    monthlyLabel: "30,000 ج.س / شهري",
    yearlyLabel: "300,000 ج.س / سنوي (خصم)",
    privileges: ["الوصول إلى المستشارين", "أفضلية ظهور الطلبات", "تقارير أوسع للمشروع", "دعم أسرع"],
  },
  {
    id: "elite",
    name: "نخبة",
    colorClass: "from-amber-500 to-orange-600",
    monthlyAmount: 55000,
    yearlyAmount: 540000,
    monthlyLabel: "55,000 ج.س / شهري",
    yearlyLabel: "540,000 ج.س / سنوي (خصم)",
    privileges: ["كل مميزات بلس", "عدد أكبر من الجلسات الاستشارية", "أولوية عليا في المعالجة", "مدير حساب متخصص"],
  },
];

export default function MembershipCheckoutPage() {
  const { planId } = useParams();
  const selectedPlan = plans.find((plan) => plan.id === planId);

  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [wallet, setWallet] = useState<WalletProvider>("bankak");
  const [voucherCode, setVoucherCode] = useState("");

  const amount = useMemo(() => {
    if (!selectedPlan) return 0;
    return billingCycle === "monthly" ? selectedPlan.monthlyAmount : selectedPlan.yearlyAmount;
  }, [billingCycle, selectedPlan]);

  const amountLabel = useMemo(() => {
    if (!selectedPlan) return "";
    return billingCycle === "monthly" ? selectedPlan.monthlyLabel : selectedPlan.yearlyLabel;
  }, [billingCycle, selectedPlan]);

  const generateVoucher = () => {
    if (!selectedPlan) return;

    const code = `SUB-${selectedPlan.id.toUpperCase()}-${Date.now().toString().slice(-6)}`;
    setVoucherCode(code);
    toast.success("تم إنشاء قسيمة الدفع. استخدمها داخل المحفظة المختارة لإكمال العملية.");
  };

  const copyVoucher = async () => {
    if (!voucherCode) return;
    await navigator.clipboard.writeText(voucherCode);
    toast.success("تم نسخ قسيمة الدفع.");
  };

  if (!selectedPlan) {
    return (
      <div className="min-h-screen bg-light-gray flex items-center justify-center p-6" dir="rtl">
        <div className="bg-white rounded-2xl border border-light-gray p-6 text-center">
          <p className="font-cairo text-dark-gray mb-4">الباقة المطلوبة غير متاحة.</p>
          <Link to="/membership" className="px-4 py-2 rounded-lg bg-invest-blue text-white font-cairo font-semibold">
            العودة للعضوية
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-gray" dir="rtl">
      <header className="bg-white border-b border-light-gray">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="font-cairo text-2xl font-bold text-invest-blue">تفاصيل اشتراك {selectedPlan.name}</h1>
            <p className="font-cairo text-sm text-dark-gray">اختر نوع الاشتراك والمحفظة ثم احصل على قسيمة الدفع.</p>
          </div>
          <Link to="/membership" className="px-4 py-2 rounded-lg border border-light-gray text-dark-gray font-cairo font-semibold hover:bg-white transition">
            العودة إلى صفحة العضوية
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 grid lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl border border-light-gray p-6 space-y-5">
          <div className={`rounded-xl p-4 bg-gradient-to-l ${selectedPlan.colorClass} text-white`}>
            <p className="font-cairo text-xl font-bold">باقة {selectedPlan.name}</p>
            <p className="font-cairo text-sm mt-1">{amountLabel}</p>
          </div>

          <div>
            <h2 className="font-cairo font-bold text-text-dark mb-3">مميزات الاشتراك</h2>
            <div className="space-y-2">
              {selectedPlan.privileges.map((item) => (
                <p key={item} className="font-cairo text-sm text-dark-gray inline-flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-invest-teal" />
                  {item}
                </p>
              ))}
            </div>
          </div>

          <div>
            <p className="font-cairo font-bold text-text-dark mb-2">نوع الاشتراك</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`rounded-xl border px-4 py-3 font-cairo text-sm font-bold transition ${
                  billingCycle === "monthly" ? "border-invest-teal bg-invest-teal/10 text-invest-blue" : "border-light-gray text-dark-gray"
                }`}
              >
                شهري
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`rounded-xl border px-4 py-3 font-cairo text-sm font-bold transition ${
                  billingCycle === "yearly" ? "border-invest-teal bg-invest-teal/10 text-invest-blue" : "border-light-gray text-dark-gray"
                }`}
              >
                سنوي (خصم)
              </button>
            </div>
          </div>

          <div>
            <p className="font-cairo font-bold text-text-dark mb-2">اختيار المحفظة السودانية</p>
            <div className="grid grid-cols-3 gap-3">
              {wallets.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setWallet(item.id)}
                  className={`rounded-xl border px-3 py-2.5 font-cairo text-sm transition ${
                    wallet === item.id ? "border-invest-blue bg-invest-blue/10 text-invest-blue font-bold" : "border-light-gray text-dark-gray"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-light-gray p-6 space-y-5">
          <div className="rounded-xl border border-light-gray bg-light-gray/40 p-4">
            <p className="font-cairo text-sm text-dark-gray mb-2">تفاصيل الدفع</p>
            <p className="font-cairo font-bold text-2xl text-text-dark">{amount.toLocaleString("en-US")} ج.س</p>
            <p className="font-cairo text-xs text-dark-gray mt-1">{billingCycle === "monthly" ? "اشتراك شهري" : "اشتراك سنوي"}</p>
            <p className="font-cairo text-xs text-dark-gray mt-1">المحفظة: {wallets.find((w) => w.id === wallet)?.label}</p>
          </div>

          <button
            onClick={generateVoucher}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-invest-blue text-white font-cairo font-bold text-sm hover:bg-blue-900 transition"
          >
            <Wallet className="w-4 h-4" />
            الحصول على قسيمة الدفع
          </button>

          {voucherCode && (
            <div className="rounded-xl border border-invest-teal/30 bg-invest-teal/10 p-4 space-y-3">
              <p className="font-cairo font-bold text-invest-blue">قسيمة الدفع جاهزة</p>
              <p className="font-cairo text-xs text-dark-gray">استخدم هذا الكود داخل تطبيق المحفظة المختارة لإكمال عملية الدفع:</p>
              <div className="rounded-lg bg-white border border-light-gray px-3 py-2 flex items-center justify-between gap-3">
                <p className="font-cairo font-bold text-text-dark text-sm">{voucherCode}</p>
                <button
                  onClick={copyVoucher}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-light-gray text-dark-gray font-cairo text-xs hover:bg-light-gray transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                  نسخ
                </button>
              </div>
              <p className="font-cairo text-xs text-dark-gray">ملاحظة: القسيمة صالحة لمدة 48 ساعة من وقت الإنشاء.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
