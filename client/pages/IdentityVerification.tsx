import { Link } from "react-router-dom";
import {
  TrendingUp,
  Upload,
  CheckCircle,
  AlertCircle,
  Shield,
  Folder,
  Camera,
  IdCard,
} from "lucide-react";

export default function IdentityVerification() {
  return (
    <div className="min-h-screen bg-[#f7f9fc]" dir="rtl">
      {/* Sidebar */}
      <aside className="fixed right-0 top-0 bottom-0 w-72 bg-gradient-to-b from-[#0d2f7a] to-[#08255f] text-white p-6 overflow-y-auto shadow-2xl">
        <Link to="/" className="flex items-center gap-3 mb-12">
          <div className="w-11 h-11 bg-gradient-to-br from-invest-teal to-[#00b897] rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-cairo font-bold text-xl leading-tight">Nile Invest AI</p>
            <p className="font-cairo text-xs text-white/70">منصة استثمارية ذكية</p>
          </div>
        </Link>

        <nav className="space-y-2">
          {[
            "لوحة التحكم",
            "محفظتي",
            "استثماري",
            "تمويل الأعمال",
            "التقارير",
            "التحقق من الهوية",
            "الإعدادات",
            "المساعدة",
          ].map((item) => (
            <Link
              key={item}
              to={item === "لوحة التحكم" ? "/dashboard" : item === "التحقق من الهوية" ? "/identity-verification" : "/dashboard"}
              className={`font-cairo flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                item === "التحقق من الهوية"
                  ? "bg-invest-teal text-invest-blue shadow-lg"
                  : "text-white/90 hover:bg-white/10"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-current/80"></span>
              {item}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="pr-72 min-h-screen">
        <header className="bg-white border-b border-light-gray sticky top-0 z-30">
          <div className="px-10 py-6">
            <h1 className="font-cairo text-5xl font-bold text-invest-blue mb-2">التحقق من الهوية</h1>
            <p className="font-cairo text-dark-gray">نحن نلتزم بحماية بياناتك وضمان أمان حسابك</p>
          </div>
        </header>

        <div className="p-10 space-y-6">
          {/* Sudanese sample person */}
          <section className="bg-white rounded-2xl border border-light-gray p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="font-cairo text-sm text-dark-gray">مثال بيانات المستخدم</p>
                <p className="font-cairo text-xl font-bold text-text-dark">محمد الطيب أحمد</p>
                <p className="font-cairo text-sm text-dark-gray">الخرطوم - السودان • الرقم الوطني: 2987XXXXXX</p>
              </div>
              <span className="font-cairo text-xs bg-invest-green/10 text-invest-green px-3 py-1 rounded-full font-bold">
                حساب سوداني تجريبي
              </span>
            </div>
          </section>

          {/* Step tracker */}
          <section className="bg-white rounded-2xl border border-light-gray p-6 shadow-sm">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="w-8 h-8 mx-auto rounded-full bg-invest-green text-white flex items-center justify-center font-cairo font-bold">✓</div>
                <p className="font-cairo text-sm font-bold text-invest-green mt-2">مكتمل</p>
                <p className="font-cairo text-xs text-dark-gray">تم التحقق</p>
              </div>
              <div>
                <div className="w-8 h-8 mx-auto rounded-full bg-invest-teal text-white flex items-center justify-center font-cairo font-bold">2</div>
                <p className="font-cairo text-sm font-bold text-invest-teal mt-2">جاري</p>
                <p className="font-cairo text-xs text-dark-gray">قيد التدقيق</p>
              </div>
              <div>
                <div className="w-8 h-8 mx-auto rounded-full bg-invest-orange text-white flex items-center justify-center font-cairo font-bold">3</div>
                <p className="font-cairo text-sm font-bold text-invest-orange mt-2">معلق</p>
                <p className="font-cairo text-xs text-dark-gray">بانتظار المراجعة</p>
              </div>
            </div>
          </section>

          {/* upload cards */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[{
              title: "صورة الهوية",
              subtitle: "صورة واضحة للهوية من الأمام",
              icon: <IdCard className="w-6 h-6 text-invest-teal" />,
              status: "مكتمل",
              statusColor: "text-invest-green",
              statusIcon: <CheckCircle className="w-4 h-4 text-invest-green" />,
            }, {
              title: "صورة شخصية",
              subtitle: "صورة شخصية واضحة لوجهك",
              icon: <Camera className="w-6 h-6 text-invest-teal" />,
              status: "جاري",
              statusColor: "text-invest-teal",
              statusIcon: <CheckCircle className="w-4 h-4 text-invest-teal" />,
            }, {
              title: "وثائق إضافية",
              subtitle: "أي مستندات داعمة إضافية",
              icon: <Folder className="w-6 h-6 text-invest-orange" />,
              status: "معلق",
              statusColor: "text-invest-orange",
              statusIcon: <AlertCircle className="w-4 h-4 text-invest-orange" />,
            }].map((card) => (
              <article key={card.title} className="bg-white rounded-2xl border border-light-gray p-5 shadow-sm hover:shadow-md transition">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-light-gray flex items-center justify-center">{card.icon}</div>
                  <div>
                    <h3 className="font-cairo font-bold text-lg text-text-dark">{card.title}</h3>
                    <p className="font-cairo text-xs text-dark-gray">{card.subtitle}</p>
                  </div>
                </div>

                <div className="border-2 border-dashed border-light-gray rounded-xl p-6 text-center mb-4 hover:border-invest-teal transition cursor-pointer">
                  <Upload className="w-7 h-7 text-dark-gray mx-auto mb-2" />
                  <p className="font-cairo text-sm text-dark-gray">Upload file or drag here</p>
                  <p className="font-cairo text-xs text-dark-gray mt-1">PDF, JPG, PNG • 10MB</p>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`font-cairo text-sm font-bold ${card.statusColor} flex items-center gap-1`}>
                    {card.statusIcon}
                    {card.status}
                  </span>
                  <span className="font-cairo text-xs text-dark-gray">10:30 ص • 15 يونيو</span>
                </div>
              </article>
            ))}
          </section>

          <section className="bg-[#edf9f7] border border-[#c9efe7] rounded-2xl p-4">
            <p className="font-cairo text-sm text-dark-gray text-center">
              <Shield className="w-4 h-4 inline ml-1 text-invest-teal" />
              حماية بياناتك: جميع البيانات مشفرة بالكامل ولا يتم مشاركتها مع أي طرف ثالث
            </p>
          </section>

          {/* actions incl. skip */}
          <section className="flex flex-wrap gap-3">
            <button className="flex-1 min-w-[220px] py-3.5 bg-invest-blue text-white rounded-xl font-cairo font-bold hover:bg-blue-900 transition">
              إرسال للتحقق
            </button>
            <Link
              to="/dashboard"
              className="py-3.5 px-8 border-2 border-light-gray rounded-xl font-cairo font-bold text-text-dark hover:bg-light-gray transition"
            >
              إلغاء
            </Link>
            <Link
              to="/browse-projects"
              className="py-3.5 px-8 border-2 border-invest-teal text-invest-teal rounded-xl font-cairo font-bold hover:bg-invest-teal/10 transition"
            >
              تخطي التحقق حالياً
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
