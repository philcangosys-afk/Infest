import { Link } from "react-router-dom";
import { TrendingUp, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left Side - Form */}
        <div className="flex flex-col justify-center px-8 sm:px-12 py-12">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 bg-invest-teal rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="font-cairo font-bold text-lg text-invest-blue">
              استثمرك
            </span>
          </Link>

          {/* Form Content */}
          <div>
            <h1 className="font-cairo text-4xl sm:text-5xl font-bold text-invest-blue mb-3">
              تسجيل الدخول
            </h1>
            <p className="font-cairo text-lg text-dark-gray mb-8">
              أدخل بيانات حسابك للمتابعة
            </p>

            {/* Email Field */}
            <div className="mb-6">
              <label className="font-cairo block text-sm font-semibold text-text-dark mb-2">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                placeholder="example@email.com"
                className="w-full px-4 py-3 border border-light-gray rounded-lg focus:border-invest-teal focus:outline-none font-cairo text-sm transition"
              />
            </div>

            {/* Password Field */}
            <div className="mb-2">
              <label className="font-cairo block text-sm font-semibold text-text-dark mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="أدخل كلمة المرور"
                  className="w-full px-4 py-3 pr-12 border border-light-gray rounded-lg focus:border-invest-teal focus:outline-none font-cairo text-sm transition"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-gray hover:text-invest-blue transition"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right mb-8">
              <a href="#" className="font-cairo text-sm text-invest-teal hover:underline">
                هل نسيت كلمة المرور؟
              </a>
            </div>

            {/* Login Button */}
            <button className="w-full py-3 bg-invest-blue text-white rounded-lg font-cairo font-semibold text-lg hover:bg-blue-800 transition mb-6">
              دخول
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-light-gray"></div>
              <span className="font-cairo text-sm text-dark-gray">أو</span>
              <div className="flex-1 h-px bg-light-gray"></div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button className="py-3 border-2 border-light-gray rounded-lg font-cairo font-semibold text-sm hover:bg-light-gray transition flex items-center justify-center gap-2">
                <span className="text-xl">🔵</span>
                <span className="hidden sm:inline">Google</span>
              </button>
              <button className="py-3 border-2 border-light-gray rounded-lg font-cairo font-semibold text-sm hover:bg-light-gray transition flex items-center justify-center gap-2">
                <span className="text-xl">🍎</span>
                <span className="hidden sm:inline">Apple</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <p className="font-cairo text-center text-dark-gray">
              ليس لديك حساب؟{" "}
              <Link to="/signup" className="text-invest-teal font-semibold hover:underline">
                تسجيل جديد
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - Illustration */}
        <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-invest-blue to-invest-teal p-12">
          <div className="text-center">
            <div className="mb-8 text-white">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <span className="text-6xl">📈</span>
              </div>
              <h2 className="font-cairo text-3xl font-bold mb-4">
                مرحباً بك مجدداً
              </h2>
              <p className="font-cairo text-lg text-white/90 max-w-sm mx-auto">
                نحن بانتظارك لاستكمال رحلتك الاستثمارية معنا
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4 mt-12">
              <div className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <span>✓</span>
                </div>
                <span className="font-cairo">آمان متقدم</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <span>✓</span>
                </div>
                <span className="font-cairo">تحليلات ذكية</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <span>✓</span>
                </div>
                <span className="font-cairo">نمو مستثمري</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
