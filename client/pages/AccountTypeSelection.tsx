import { Link } from "react-router-dom";
import { Lightbulb, Wallet, TrendingUp } from "lucide-react";

export default function AccountTypeSelection() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Header */}
      <header className="border-b border-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-invest-teal rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="font-cairo font-bold text-xl text-invest-blue">
              استثمرك
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-4xl">
          {/* Heading */}
          <div className="text-center mb-12">
            <h1 className="font-cairo text-4xl sm:text-5xl font-bold text-invest-blue mb-4">
              اختر نوع حسابك
            </h1>
            <p className="font-cairo text-lg text-dark-gray max-w-2xl mx-auto">
              اختر النوع المناسب لبدء رحلتك معنا واستكشاف فرص استثمارية جديدة
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Investor Card */}
            <div className="group relative bg-white border-2 border-light-gray rounded-2xl p-8 hover:border-invest-teal transition cursor-pointer">
              {/* Icon */}
              <div className="w-20 h-20 bg-invest-teal/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-invest-teal/20 transition">
                <Wallet className="w-10 h-10 text-invest-teal" />
              </div>

              {/* Content */}
              <h2 className="font-cairo font-bold text-2xl text-text-dark mb-4">
                أنا مستثمر
              </h2>
              <p className="font-cairo text-dark-gray text-lg mb-8 leading-relaxed">
                أبحث عن مشاريع واعدة للاستثمار فيها والحصول على عوائد مجزية
              </p>

              {/* Button */}
              <Link
                to="/login"
                className="inline-block font-cairo font-semibold bg-invest-teal text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition w-full text-center"
              >
                اختر هذا الخيار
              </Link>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-invest-teal/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition pointer-events-none"></div>
            </div>

            {/* Entrepreneur Card */}
            <div className="group relative bg-white border-2 border-light-gray rounded-2xl p-8 hover:border-invest-teal transition cursor-pointer">
              {/* Icon */}
              <div className="w-20 h-20 bg-invest-teal/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-invest-teal/20 transition">
                <Lightbulb className="w-10 h-10 text-invest-teal" />
              </div>

              {/* Content */}
              <h2 className="font-cairo font-bold text-2xl text-text-dark mb-4">
                أنا رائد أعمال
              </h2>
              <p className="font-cairo text-dark-gray text-lg mb-8 leading-relaxed">
                أريد تقديم مشروعي والحصول على تمويل وشركاء موثوقين للنمو والتطور
              </p>

              {/* Button */}
              <Link
                to="/login"
                className="inline-block font-cairo font-semibold bg-invest-teal text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition w-full text-center"
              >
                اختر هذا الخيار
              </Link>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-invest-teal/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition pointer-events-none"></div>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center mt-12">
            <p className="font-cairo text-dark-gray">
              هل لديك حساب بالفعل؟{" "}
              <Link to="/login" className="text-invest-teal font-semibold hover:underline">
                تسجيل دخول
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
