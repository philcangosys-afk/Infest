import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, ShieldCheck, Users, BarChart3 } from "lucide-react";

export default function Index() {
  return (
    <div className="w-full min-h-screen bg-white" dir="rtl">
      {/* Header */}
      <header className="fixed top-0 right-0 left-0 z-50 bg-white border-b border-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-invest-teal rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="font-cairo font-bold text-xl text-invest-blue hidden sm:inline">
              استثمرك
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="font-cairo text-sm text-text-dark hover:text-invest-teal transition">
              اتصل بنا
            </a>
            <a href="#" className="font-cairo text-sm text-text-dark hover:text-invest-teal transition">
              من نحن
            </a>
            <a href="#" className="font-cairo text-sm text-text-dark hover:text-invest-teal transition">
              الميزات
            </a>
          </nav>
          <Link
            to="/account-type"
            className="font-cairo font-semibold text-sm bg-invest-blue text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition"
          >
            سجل الدخول
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Right side - Text and CTA */}
            <div className="lg:order-2 flex flex-col justify-center">
              <h1 className="font-cairo text-4xl sm:text-5xl lg:text-6xl font-bold text-invest-blue leading-tight mb-6">
                ربط الأفكار الذكية بالاستثمارات الموثوقة
              </h1>
              <p className="font-cairo text-lg text-dark-gray mb-8 max-w-lg">
                منصة ذكية تربط رواد الأعمال بالمستثمرين لتحقيق أحلام المشاريع والاستثمارات الناجحة
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/account-type"
                  className="font-cairo font-semibold bg-invest-blue text-white px-8 py-4 rounded-lg hover:bg-blue-800 transition inline-flex items-center justify-center gap-2 group"
                >
                  ابدأ الآن
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </Link>
                <button className="font-cairo font-semibold border-2 border-invest-blue text-invest-blue px-8 py-4 rounded-lg hover:bg-light-gray transition">
                  اعرف المزيد
                </button>
              </div>
            </div>

            {/* Left side - Illustration */}
            <div className="lg:order-1 relative h-96 lg:h-full min-h-96">
              <div className="absolute inset-0 bg-gradient-to-br from-invest-blue to-invest-teal rounded-2xl opacity-10"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  {/* Placeholder for illustration */}
                  <div className="w-full h-full bg-gradient-to-br from-invest-blue/20 to-invest-teal/20 rounded-2xl flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-24 h-24 text-invest-teal mx-auto mb-4 opacity-50" />
                      <p className="font-cairo text-dark-gray">صورة توضيحية</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-light-gray">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition">
              <div className="w-14 h-14 bg-invest-teal/10 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-invest-teal" />
              </div>
              <h3 className="font-cairo font-bold text-xl text-text-dark mb-4">
                فرص استثمارية حقيقية
              </h3>
              <p className="font-cairo text-dark-gray leading-relaxed">
                تصفح مشاريع واعدة من رواد أعمال موثوقين في مختلف القطاعات
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition">
              <div className="w-14 h-14 bg-invest-teal/10 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-invest-teal" />
              </div>
              <h3 className="font-cairo font-bold text-xl text-text-dark mb-4">
                تحليل ذكي مع AI
              </h3>
              <p className="font-cairo text-dark-gray leading-relaxed">
                احصل على تقييمات ذكية وتحليلات شاملة لكل مشروع باستخدام الذكاء الاصطناعي
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition">
              <div className="w-14 h-14 bg-invest-teal/10 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-7 h-7 text-invest-teal" />
              </div>
              <h3 className="font-cairo font-bold text-xl text-text-dark mb-4">
                تحقق آمن وموثوق
              </h3>
              <p className="font-cairo text-dark-gray leading-relaxed">
                عملية تحقق شاملة وآمنة تضمن الثقة بين المستثمرين ورواد الأعمال
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Stat 1 */}
            <div className="text-center">
              <div className="font-cairo font-bold text-4xl lg:text-5xl text-invest-teal mb-3">
                500+
              </div>
              <p className="font-cairo text-dark-gray">مشروع مسجل</p>
            </div>

            {/* Stat 2 */}
            <div className="text-center">
              <div className="font-cairo font-bold text-4xl lg:text-5xl text-invest-teal mb-3">
                1000+
              </div>
              <p className="font-cairo text-dark-gray">مستثمر نشط</p>
            </div>

            {/* Stat 3 */}
            <div className="text-center">
              <div className="font-cairo font-bold text-4xl lg:text-5xl text-invest-teal mb-3">
                50+
              </div>
              <p className="font-cairo text-dark-gray">صفقة منجزة</p>
            </div>

            {/* Stat 4 */}
            <div className="text-center">
              <div className="font-cairo font-bold text-4xl lg:text-5xl text-invest-teal mb-3">
                95%
              </div>
              <p className="font-cairo text-dark-gray">معدل الرضا</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-invest-blue">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-cairo text-4xl sm:text-5xl font-bold text-white mb-8">
            هل أنت مستعد للبدء؟
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/account-type"
              className="font-cairo font-semibold bg-invest-teal text-invest-blue px-8 py-4 rounded-lg hover:bg-opacity-90 transition inline-flex items-center justify-center gap-2"
            >
              تسجيل جديد
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="font-cairo font-semibold border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:bg-opacity-10 transition">
              تسجيل دخول
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-invest-blue/5 border-t border-light-gray py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-cairo font-bold text-text-dark mb-4">عن المنصة</h3>
              <p className="font-cairo text-sm text-dark-gray">
                منصة استثمارية سودانية موثوقة تربط المستثمرين برواد الأعمال
              </p>
            </div>
            <div>
              <h3 className="font-cairo font-bold text-text-dark mb-4">الروابط</h3>
              <ul className="space-y-2 text-sm text-dark-gray font-cairo">
                <li><a href="#" className="hover:text-invest-teal transition">الرئيسية</a></li>
                <li><a href="#" className="hover:text-invest-teal transition">الميزات</a></li>
                <li><a href="#" className="hover:text-invest-teal transition">التسعيرة</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-cairo font-bold text-text-dark mb-4">المساعدة</h3>
              <ul className="space-y-2 text-sm text-dark-gray font-cairo">
                <li><a href="#" className="hover:text-invest-teal transition">الأسئلة الشائعة</a></li>
                <li><a href="#" className="hover:text-invest-teal transition">التواصل</a></li>
                <li><a href="#" className="hover:text-invest-teal transition">الشروط والأحكام</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-cairo font-bold text-text-dark mb-4">تابعنا</h3>
              <ul className="space-y-2 text-sm text-dark-gray font-cairo">
                <li><a href="#" className="hover:text-invest-teal transition">تويتر</a></li>
                <li><a href="#" className="hover:text-invest-teal transition">لينكدإن</a></li>
                <li><a href="#" className="hover:text-invest-teal transition">الفيسبوك</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-light-gray pt-8 text-center">
            <p className="font-cairo text-sm text-dark-gray">
              © 2024 استثمرك. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
