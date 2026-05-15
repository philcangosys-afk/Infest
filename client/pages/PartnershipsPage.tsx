import { ArrowRight, Building2, Handshake, Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

type Partner = {
  id: "irada" | "farmers-bank";
  name: string;
  subtitle: string;
  overview: string;
  offerings: string[];
  contact: {
    phone: string;
    email: string;
    location: string;
  };
};

export default function PartnershipsPage() {
  const partners = useMemo<Partner[]>(
    () => [
      {
        id: "irada",
        name: "شركة إرادة للتمويل الأصغر",
        subtitle: "حلول تمويل أصغر للمشروعات الناشئة والأنشطة الإنتاجية",
        overview:
          "شركة إرادة تدعم رواد الأعمال عبر برامج تمويل مرنة، وتستهدف المشاريع القابلة للنمو التي تحتاج دفعة أولى للتشغيل أو التوسع. كما تقدم إرشادًا ماليًا يساعد صاحب المشروع على تنظيم التدفقات النقدية وتحسين الجدارة التمويلية.",
        offerings: [
          "تمويل تشغيلي قصير ومتوسط الأجل",
          "برامج مخصصة لتمويل المشاريع الصغيرة والناشئة",
          "دعم في إعداد الملف المالي قبل التقديم",
        ],
        contact: {
          phone: "+249 900 120 200",
          email: "partnerships@iradamicro.sd",
          location: "الخرطوم - السودان",
        },
      },
      {
        id: "farmers-bank",
        name: "بنك المزارع",
        subtitle: "شريك تمويلي للقطاعات الزراعية وسلاسل القيمة المرتبطة بها",
        overview:
          "بنك المزارع يركز على تمويل المشاريع الزراعية والإنتاجية، ويوفر حلولًا تتناسب مع طبيعة الموسم الزراعي ودورة رأس المال. يدعم البنك رواد الأعمال في قطاعات الزراعة والتصنيع الغذائي والنقل اللوجستي المرتبط بالإنتاج.",
        offerings: [
          "تمويل مدخلات الإنتاج والتشغيل الزراعي",
          "برامج تمويل موسمية مع خطط سداد متدرجة",
          "خدمات مصرفية للمشاريع المرتبطة بسلاسل الإمداد",
        ],
        contact: {
          phone: "+249 900 330 440",
          email: "partners@farmersbank.sd",
          location: "ود مدني - السودان",
        },
      },
    ],
    [],
  );

  const [selectedPartnerId, setSelectedPartnerId] = useState<Partner["id"]>("irada");
  const [dashboardLink, setDashboardLink] = useState<{ to: string; label: string }>({
    to: "/investor-dashboard",
    label: "لوحة المستثمر",
  });
  const selectedPartner = partners.find((partner) => partner.id === selectedPartnerId) ?? partners[0];

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

  return (
    <div className="min-h-screen bg-light-gray" dir="rtl">
      <header className="bg-white border-b border-light-gray">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-invest-blue/10 flex items-center justify-center">
              <Handshake className="w-6 h-6 text-invest-blue" />
            </div>
            <div>
              <h1 className="font-cairo text-2xl font-bold text-invest-blue">الشراكات</h1>
              <p className="font-cairo text-sm text-dark-gray">اختر الشريك المناسب وتواصل معه مباشرة عبر بيانات التواصل المعتمدة.</p>
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

      <main className="max-w-6xl mx-auto px-6 py-8 grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-1 bg-white rounded-2xl border border-light-gray p-5 shadow-sm h-fit">
          <h2 className="font-cairo text-lg font-bold text-text-dark mb-4">قائمة شركاء النجاح</h2>
          <div className="space-y-3">
            {partners.map((partner) => {
              const isActive = selectedPartnerId === partner.id;
              return (
                <button
                  key={partner.id}
                  onClick={() => setSelectedPartnerId(partner.id)}
                  className={`w-full text-right rounded-xl border p-4 transition ${
                    isActive
                      ? "border-invest-teal bg-invest-teal/5"
                      : "border-light-gray hover:border-invest-blue/40 hover:bg-light-gray/50"
                  }`}
                >
                  <p className="font-cairo font-bold text-text-dark">{partner.name}</p>
                  <p className="font-cairo text-xs text-dark-gray mt-1 leading-6">{partner.subtitle}</p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="lg:col-span-2 bg-white rounded-2xl border border-light-gray p-6 shadow-sm space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-invest-blue/10 text-invest-blue font-cairo text-xs font-bold mb-3">
              <Building2 className="w-3.5 h-3.5" />
              جهة الشراكة
            </div>
            <h3 className="font-cairo text-2xl font-bold text-text-dark">{selectedPartner.name}</h3>
            <p className="font-cairo text-sm text-dark-gray mt-2 leading-7">{selectedPartner.subtitle}</p>
          </div>

          <div className="rounded-xl border border-light-gray p-4 bg-light-gray/40">
            <p className="font-cairo text-sm text-text-dark leading-8">{selectedPartner.overview}</p>
          </div>

          <div>
            <h4 className="font-cairo font-bold text-text-dark mb-3">الخدمات والفرص المتاحة</h4>
            <ul className="space-y-2">
              {selectedPartner.offerings.map((item) => (
                <li key={item} className="font-cairo text-sm text-dark-gray flex items-start gap-2">
                  <span className="mt-1 text-invest-teal">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-invest-teal/20 bg-invest-teal/5 p-5 space-y-4">
            <h4 className="font-cairo font-bold text-invest-blue">بيانات التواصل</h4>
            <div className="grid md:grid-cols-3 gap-3">
              <div className="rounded-xl bg-white border border-light-gray p-3">
                <p className="font-cairo text-xs text-dark-gray mb-1 inline-flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  الهاتف
                </p>
                <a href={`tel:${selectedPartner.contact.phone}`} className="font-cairo font-bold text-text-dark text-sm">
                  {selectedPartner.contact.phone}
                </a>
              </div>
              <div className="rounded-xl bg-white border border-light-gray p-3">
                <p className="font-cairo text-xs text-dark-gray mb-1 inline-flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  البريد
                </p>
                <a href={`mailto:${selectedPartner.contact.email}`} className="font-cairo font-bold text-text-dark text-sm break-all">
                  {selectedPartner.contact.email}
                </a>
              </div>
              <div className="rounded-xl bg-white border border-light-gray p-3">
                <p className="font-cairo text-xs text-dark-gray mb-1 inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  الموقع
                </p>
                <p className="font-cairo font-bold text-text-dark text-sm">{selectedPartner.contact.location}</p>
              </div>
            </div>
          </div>

          <div className="pt-1">
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-cairo font-semibold text-invest-blue hover:text-blue-900"
            >
              <ArrowRight className="w-4 h-4" />
              العودة للصفحة الرئيسية
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
