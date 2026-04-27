import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, ShieldCheck, Users, BarChart3, Briefcase, Handshake } from "lucide-react";

export default function Index() {
  return (
    <div className="w-full min-h-screen bg-white" dir="rtl">
      {/* Header */}
      <header className="fixed top-0 right-0 left-0 z-50 bg-white/95 backdrop-blur-md border-b border-light-gray shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 order-3 group">
            <span className="font-cairo font-bold text-2xl text-invest-blue hidden sm:inline group-hover:text-invest-teal transition">
              استثمرك
            </span>
            <div className="w-12 h-12 bg-gradient-to-br from-invest-teal to-invest-teal/80 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
          </Link>
          <nav className="hidden lg:flex items-center gap-8 order-2">
            {["الميزات", "لرواد الأعمال", "للمستثمرين", "استكشف المشاريع", "من نحن", "اتصل بنا"].map((item) => (
              <a
                key={item}
                href="#"
                className="font-cairo text-sm font-semibold text-text-dark hover:text-invest-teal transition-colors duration-200 relative group"
              >
                {item}
                <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-invest-teal group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </nav>
          <Link
            to="/account-type"
            className="font-cairo font-bold text-sm bg-gradient-to-r from-invest-blue to-invest-blue/90 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-200 order-1 hover:scale-105 shadow-md"
          >
            سجل الدخول
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-invest-teal/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-invest-blue/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text and CTA - Left (visually) */}
            <div className="flex flex-col justify-center lg:order-2">
              <div className="mb-8">
                <span className="font-cairo text-sm font-bold text-invest-teal uppercase tracking-widest bg-invest-teal/10 px-4 py-2 rounded-full inline-block">
                  🚀 منصة استثمارية مبتكرة
                </span>
              </div>
              <h1 className="font-cairo text-5xl sm:text-6xl lg:text-7xl font-bold text-invest-blue leading-tight mb-8">
                ربط الأفكار الذكية<br/>
                <span className="text-invest-teal">بالاستثمارات الموثوقة</span>
              </h1>
              <p className="font-cairo text-xl text-dark-gray mb-10 max-w-lg leading-relaxed">
                منصة ذكية تربط رواد الأعمال بالمستثمرين لتحقيق أحلام المشاريع والاستثمارات الناجحة في كل مكان
              </p>
              <div className="flex flex-col sm:flex-row gap-5">
                <Link
                  to="/account-type"
                  className="font-cairo font-bold text-lg bg-gradient-to-r from-invest-blue to-invest-blue/90 text-white px-10 py-4 rounded-xl hover:shadow-xl transition-all duration-200 inline-flex items-center justify-center gap-2 group shadow-lg hover:scale-105"
                >
                  ابدأ كمستثمر
                  <ArrowRight className="w-6 h-6 group-hover:-translate-x-1 transition" />
                </Link>
                <Link
                  to="/account-type"
                  className="font-cairo font-bold text-lg bg-gradient-to-r from-invest-teal to-invest-teal/90 text-white px-10 py-4 rounded-xl hover:shadow-xl transition-all duration-200 inline-flex items-center justify-center gap-2 shadow-lg hover:scale-105"
                >
                  ابدأ كرائد أعمال
                </Link>
              </div>
            </div>

            {/* Illustration - Right (visually) */}
            <div className="relative h-96 lg:h-full min-h-[500px] lg:order-1">
              <div className="absolute inset-0 bg-gradient-to-br from-invest-blue via-invest-teal to-invest-blue/50 rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-300"></div>
              <div className="absolute inset-4 bg-gradient-to-br from-white/10 to-transparent rounded-2xl backdrop-blur-sm"></div>

              {/* Animated Elements */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full flex flex-col items-center justify-center gap-8 px-8">
                  {/* Icon Grid */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-4xl hover:bg-white/30 transition-all duration-200 hover:scale-110">
                      📈
                    </div>
                    <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-4xl hover:bg-white/30 transition-all duration-200 hover:scale-110">
                      💡
                    </div>
                    <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-4xl hover:bg-white/30 transition-all duration-200 hover:scale-110">
                      🤝
                    </div>
                    <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-4xl hover:bg-white/30 transition-all duration-200 hover:scale-110">
                      🔐
                    </div>
                  </div>
                  <p className="font-cairo text-white/80 text-sm text-center">منصة آمنة وموثوقة</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 bg-light-gray">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="font-cairo text-5xl font-bold text-invest-blue mb-6">
              لماذا استثمرك؟
            </h2>
            <p className="font-cairo text-xl text-dark-gray max-w-2xl mx-auto">
              نحن نوفر أدوات وموارد شاملة لجعل رحلتك الاستثمارية سهلة وآمنة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-white p-10 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-invest-blue" />
              </div>
              <h3 className="font-cairo font-bold text-2xl text-text-dark mb-4">
                فرص استثمارية<br/>حقيقية
              </h3>
              <p className="font-cairo text-dark-gray leading-relaxed text-lg">
                تصفح مشاريع واعدة من رواد أعمال موثوقين في مختلف القطاعات
              </p>
              <div className="mt-6 pt-6 border-t border-light-gray">
                <div className="flex items-center gap-2 text-invest-teal font-cairo font-bold text-sm">
                  <span>500+ مشروع</span>
                  <span>→</span>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white p-10 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-teal-200 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-8 h-8 text-invest-teal" />
              </div>
              <h3 className="font-cairo font-bold text-2xl text-text-dark mb-4">
                تحليل ذكي<br/>مع AI
              </h3>
              <p className="font-cairo text-dark-gray leading-relaxed text-lg">
                احصل على تقييمات ذكية وتحليلات شاملة لكل مشروع باستخدام الذكاء الاصطناعي
              </p>
              <div className="mt-6 pt-6 border-t border-light-gray">
                <div className="flex items-center gap-2 text-invest-teal font-cairo font-bold text-sm">
                  <span>تحليلات فورية</span>
                  <span>→</span>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white p-10 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-200 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="w-8 h-8 text-invest-blue" />
              </div>
              <h3 className="font-cairo font-bold text-2xl text-text-dark mb-4">
                تحقق آمن<br/>وموثوق
              </h3>
              <p className="font-cairo text-dark-gray leading-relaxed text-lg">
                عملية تحقق شاملة وآمنة تضمن الثقة بين المستثمرين ورواد الأعمال
              </p>
              <div className="mt-6 pt-6 border-t border-light-gray">
                <div className="flex items-center gap-2 text-invest-teal font-cairo font-bold text-sm">
                  <span>تحقق معتمد</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-invest-blue/5 via-transparent to-invest-teal/5"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="font-cairo text-5xl font-bold text-invest-blue mb-6">
              أرقام تتحدث عن نجاحنا
            </h2>
            <p className="font-cairo text-xl text-dark-gray">
              منصة استثمارية موثوقة بآلاف المستخدمين الراضين
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {/* Stat 1 - Projects */}
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center hover:-translate-y-2">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Briefcase className="w-10 h-10 text-invest-blue" />
                </div>
              </div>
              <div className="font-cairo font-bold text-5xl text-invest-blue mb-3">
                500+
              </div>
              <p className="font-cairo text-lg text-dark-gray font-semibold">مشروع مسجل</p>
              <div className="mt-4 pt-4 border-t border-light-gray">
                <p className="font-cairo text-xs text-invest-teal font-bold">في جميع القطاعات</p>
              </div>
            </div>

            {/* Stat 2 - Investors */}
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center hover:-translate-y-2">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-10 h-10 text-invest-teal" />
                </div>
              </div>
              <div className="font-cairo font-bold text-5xl text-invest-blue mb-3">
                1000+
              </div>
              <p className="font-cairo text-lg text-dark-gray font-semibold">مستثمر نشط</p>
              <div className="mt-4 pt-4 border-t border-light-gray">
                <p className="font-cairo text-xs text-invest-teal font-bold">معتمدين وموثوقين</p>
              </div>
            </div>

            {/* Stat 3 - Entrepreneurs */}
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center hover:-translate-y-2">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-10 h-10 text-invest-green" />
                </div>
              </div>
              <div className="font-cairo font-bold text-5xl text-invest-blue mb-3">
                2000+
              </div>
              <p className="font-cairo text-lg text-dark-gray font-semibold">رائد أعمال</p>
              <div className="mt-4 pt-4 border-t border-light-gray">
                <p className="font-cairo text-xs text-invest-teal font-bold">بأفكار مبتكرة</p>
              </div>
            </div>

            {/* Stat 4 - Deals */}
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center hover:-translate-y-2">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Handshake className="w-10 h-10 text-invest-orange" />
                </div>
              </div>
              <div className="font-cairo font-bold text-5xl text-invest-blue mb-3">
                50+
              </div>
              <p className="font-cairo text-lg text-dark-gray font-semibold">صفقة منجزة</p>
              <div className="mt-4 pt-4 border-t border-light-gray">
                <p className="font-cairo text-xs text-invest-teal font-bold">بملايين الدولارات</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-invest-blue via-invest-blue to-invest-teal relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="font-cairo text-5xl sm:text-6xl font-bold text-white mb-6">
            هل أنت مستعد للبدء؟
          </h2>
          <p className="font-cairo text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            انضم إلى آلاف المستثمرين ورواد الأعمال الناجحين على منصتنا اليوم
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/account-type"
              className="font-cairo font-bold text-lg bg-white text-invest-blue px-12 py-5 rounded-xl hover:shadow-2xl transition-all duration-200 inline-flex items-center justify-center gap-3 group shadow-lg hover:scale-105"
            >
              <span>إنشاء حساب جديد</span>
              <ArrowRight className="w-6 h-6 group-hover:-translate-x-1 transition" />
            </Link>
            <Link
              to="/login"
              className="font-cairo font-bold text-lg border-3 border-white text-white px-12 py-5 rounded-xl hover:bg-white/20 transition-all duration-200 inline-flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              <span>تسجيل دخول</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-light-gray py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            {/* Brand */}
            <div>
              <Link to="/" className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-invest-teal to-invest-teal/80 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <span className="font-cairo font-bold text-xl text-invest-blue">استثمرك</span>
              </Link>
              <p className="font-cairo text-dark-gray leading-relaxed">
                منصة استثمارية سودانية موثوقة تربط المستثمرين برواد الأعمال
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-cairo font-bold text-text-dark mb-6 uppercase tracking-wide text-sm">
                الروابط السريعة
              </h4>
              <ul className="space-y-3 text-dark-gray font-cairo">
                <li><a href="#" className="hover:text-invest-teal transition font-semibold">الرئيسية</a></li>
                <li><a href="#" className="hover:text-invest-teal transition font-semibold">الميزات</a></li>
                <li><a href="#" className="hover:text-invest-teal transition font-semibold">المشاريع</a></li>
                <li><a href="#" className="hover:text-invest-teal transition font-semibold">التسعيرة</a></li>
              </ul>
            </div>

            {/* Help */}
            <div>
              <h4 className="font-cairo font-bold text-text-dark mb-6 uppercase tracking-wide text-sm">
                المساعدة والدعم
              </h4>
              <ul className="space-y-3 text-dark-gray font-cairo">
                <li><a href="#" className="hover:text-invest-teal transition font-semibold">الأسئلة الشائعة</a></li>
                <li><a href="#" className="hover:text-invest-teal transition font-semibold">التواصل بنا</a></li>
                <li><a href="#" className="hover:text-invest-teal transition font-semibold">دليل المستخدم</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-cairo font-bold text-text-dark mb-6 uppercase tracking-wide text-sm">
                القانوني
              </h4>
              <ul className="space-y-3 text-dark-gray font-cairo">
                <li><a href="#" className="hover:text-invest-teal transition font-semibold">الشروط والأحكام</a></li>
                <li><a href="#" className="hover:text-invest-teal transition font-semibold">سياسة الخصوصية</a></li>
                <li><a href="#" className="hover:text-invest-teal transition font-semibold">سياسة الملفات</a></li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="font-cairo font-bold text-text-dark mb-6 uppercase tracking-wide text-sm">
                تابعنا
              </h4>
              <div className="flex gap-4">
                {[
                  { icon: "𝕏", label: "تويتر" },
                  { icon: "in", label: "لينكدإن" },
                  { icon: "f", label: "فيسبوك" }
                ].map((social) => (
                  <button
                    key={social.label}
                    className="w-12 h-12 rounded-xl bg-light-gray hover:bg-invest-teal hover:text-white text-invest-blue font-bold transition-all duration-200 flex items-center justify-center"
                  >
                    {social.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-light-gray mb-8"></div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between pt-8">
            <p className="font-cairo text-dark-gray font-semibold">
              © 2024 <span className="text-invest-teal">استثمرك</span>. جميع الحقوق محفوظة.
            </p>
            <div className="flex items-center gap-6 mt-6 md:mt-0">
              <span className="font-cairo text-dark-gray">مدعوم من قبل:</span>
              <p className="font-cairo font-bold text-invest-blue">استثمرك</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
