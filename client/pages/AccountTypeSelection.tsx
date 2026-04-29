import { Link } from "react-router-dom";
import { Lightbulb, Wallet, TrendingUp } from "lucide-react";

export default function AccountTypeSelection() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Header */}
      <header className="border-b border-light-gray sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <span className="font-cairo font-bold text-2xl text-invest-blue hidden sm:inline group-hover:text-invest-teal transition">
              Nile Invest AI
            </span>
            <div className="w-12 h-12 bg-gradient-to-br from-invest-teal to-invest-teal/80 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
          </Link>
          <Link to="/login" className="font-cairo font-bold text-sm bg-light-gray text-text-dark px-6 py-2.5 rounded-lg hover:bg-invest-teal hover:text-white transition-all duration-200">
            تسجيل دخول
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 sm:px-6 lg:px-8 py-16 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-invest-teal/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-invest-blue/5 rounded-full blur-3xl"></div>

        <div className="w-full max-w-5xl relative z-10">
          {/* Heading */}
          <div className="text-center mb-16">
            <div className="mb-6 inline-block">
              <span className="font-cairo text-sm font-bold text-invest-teal uppercase tracking-widest bg-invest-teal/10 px-4 py-2 rounded-full">
                🚀 ابدأ رحلتك الآن
              </span>
            </div>
            <h1 className="font-cairo text-6xl sm:text-7xl font-bold text-invest-blue mb-6">
              اختر دورك
            </h1>
            <p className="font-cairo text-2xl text-dark-gray max-w-3xl mx-auto leading-relaxed">
              اختر النوع المناسب لبدء رحلتك معنا واستكشاف فرص استثمارية جديدة
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Investor Card */}
            <Link
              to="/browse-projects"
              className="group relative bg-white border-2 border-light-gray rounded-3xl p-10 hover:border-invest-teal hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden"
            >
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-invest-teal/10 rounded-full blur-2xl group-hover:bg-invest-teal/20 transition-all duration-300"></div>

              {/* Icon */}
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 relative z-10">
                <Wallet className="w-12 h-12 text-invest-blue" />
              </div>

              {/* Content */}
              <h2 className="font-cairo font-bold text-4xl text-text-dark mb-4 relative z-10">
                أنا مستثمر
              </h2>
              <p className="font-cairo text-dark-gray text-lg mb-8 leading-relaxed relative z-10">
                أبحث عن مشاريع واعدة للاستثمار فيها والحصول على عوائد مجزية
              </p>

              {/* Features List */}
              <ul className="space-y-3 mb-10 relative z-10">
                {[
                  "تصفح المشاريع المختلفة",
                  "تحليل ذكي للفرص",
                  "إدارة محفظتك"
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 font-cairo text-dark-gray">
                    <div className="w-2 h-2 bg-invest-teal rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Button */}
              <div className="py-4 bg-gradient-to-r from-invest-teal to-invest-teal/90 text-white rounded-xl font-cairo font-bold text-lg text-center group-hover:shadow-lg transition-all duration-200 relative z-10 group-hover:scale-105 origin-center">
                ابدأ الآن →
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-invest-teal/5 to-transparent opacity-0 group-hover:opacity-100 transition pointer-events-none"></div>
            </Link>

            {/* Entrepreneur Card */}
            <Link
              to="/identity-verification"
              className="group relative bg-white border-2 border-light-gray rounded-3xl p-10 hover:border-invest-teal hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden"
            >
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-invest-teal/10 rounded-full blur-2xl group-hover:bg-invest-teal/20 transition-all duration-300"></div>

              {/* Icon */}
              <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-200 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 relative z-10">
                <Lightbulb className="w-12 h-12 text-invest-orange" />
              </div>

              {/* Content */}
              <h2 className="font-cairo font-bold text-4xl text-text-dark mb-4 relative z-10">
                أنا رائد أعمال
              </h2>
              <p className="font-cairo text-dark-gray text-lg mb-8 leading-relaxed relative z-10">
                أريد تقديم مشروعي والحصول على تمويل وشركاء موثوقين للنمو والتطور
              </p>

              {/* Features List */}
              <ul className="space-y-3 mb-10 relative z-10">
                {[
                  "تقديم مشروعك",
                  "الوصول للمستثمرين",
                  "تحقيق أحلامك"
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 font-cairo text-dark-gray">
                    <div className="w-2 h-2 bg-invest-teal rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Button */}
              <div className="py-4 bg-gradient-to-r from-invest-teal to-invest-teal/90 text-white rounded-xl font-cairo font-bold text-lg text-center group-hover:shadow-lg transition-all duration-200 relative z-10 group-hover:scale-105 origin-center">
                ابدأ الآن →
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-invest-teal/5 to-transparent opacity-0 group-hover:opacity-100 transition pointer-events-none"></div>
            </Link>
          </div>

          {/* Login Link */}
          <div className="text-center mt-16">
            <p className="font-cairo text-dark-gray text-lg">
              هل لديك حساب بالفعل؟{" "}
              <Link to="/login" className="text-invest-teal font-bold hover:underline">
                تسجيل دخول
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
