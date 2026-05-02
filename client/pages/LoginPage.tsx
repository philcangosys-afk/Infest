import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { TrendingUp, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") === "entrepreneur" ? "entrepreneur" : "investor";

  const demoCredentials =
    role === "entrepreneur"
      ? {
          email: "zain.founder@nileinvest.ai",
          password: "Founder@123",
          redirectTo: "/dashboard",
        }
      : {
          email: "zain.investor@nileinvest.ai",
          password: "Investor@123",
          redirectTo: "/investor-dashboard",
        };

  const [email, setEmail] = useState(demoCredentials.email);
  const [password, setPassword] = useState(demoCredentials.password);

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
              Nile Invest AI
            </span>
          </Link>

          {/* Form Content */}
          <div>
            <h1 className="font-cairo text-4xl sm:text-5xl font-bold text-invest-blue mb-3">
              تسجيل الدخول
            </h1>
            <p className="font-cairo text-lg text-dark-gray mb-3">
              أدخل بيانات حسابك للمتابعة
            </p>
            <div className="mb-8 p-4 bg-light-gray border border-light-gray rounded-xl">
              <p className="font-cairo text-xs text-dark-gray mb-1">بيانات تجريبية جاهزة للدخول:</p>
              <p className="font-cairo text-sm font-semibold text-text-dark">{demoCredentials.email}</p>
              <p className="font-cairo text-sm font-semibold text-text-dark">{demoCredentials.password}</p>
            </div>

            {/* Email Field */}
            <div className="mb-8">
              <label className="font-cairo block text-sm font-bold text-text-dark mb-3 uppercase tracking-wide">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full px-6 py-4 border-2 border-light-gray rounded-xl focus:border-invest-teal focus:bg-white focus:outline-none font-cairo text-sm transition-all duration-200 shadow-sm"
              />
            </div>

            {/* Password Field */}
            <div className="mb-2">
              <label className="font-cairo block text-sm font-bold text-text-dark mb-3 uppercase tracking-wide">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور"
                  className="w-full px-6 py-4 pr-14 border-2 border-light-gray rounded-xl focus:border-invest-teal focus:bg-white focus:outline-none font-cairo text-sm transition-all duration-200 shadow-sm"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-gray hover:text-invest-blue transition p-2 hover:bg-light-gray rounded-lg"
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
            <div className="text-right mb-10">
              <a href="#" className="font-cairo text-sm font-bold text-invest-teal hover:underline">
                هل نسيت كلمة المرور؟
              </a>
            </div>

            {/* Login Button */}
            <button
              onClick={() => navigate(demoCredentials.redirectTo)}
              className="w-full py-4 bg-gradient-to-r from-invest-blue to-invest-blue/90 text-white rounded-xl font-cairo font-bold text-lg hover:shadow-xl transition-all duration-200 mb-8 shadow-lg hover:scale-105"
            >
              دخول
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-light-gray"></div>
              <span className="font-cairo text-sm text-dark-gray font-semibold">أو</span>
              <div className="flex-1 h-px bg-light-gray"></div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              <button className="py-4 border-2 border-light-gray rounded-xl font-cairo font-bold text-sm hover:border-invest-teal hover:bg-light-gray transition-all duration-200 flex items-center justify-center gap-3 group">
                <span className="text-2xl group-hover:scale-110 transition">🔵</span>
                <span className="hidden sm:inline group-hover:text-invest-teal">Google</span>
              </button>
              <button className="py-4 border-2 border-light-gray rounded-xl font-cairo font-bold text-sm hover:border-invest-teal hover:bg-light-gray transition-all duration-200 flex items-center justify-center gap-3 group">
                <span className="text-2xl group-hover:scale-110 transition">🍎</span>
                <span className="hidden sm:inline group-hover:text-invest-teal">Apple</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <p className="font-cairo text-center text-dark-gray text-lg">
              ليس لديك حساب؟{" "}
              <Link to={`/signup?role=${role}`} className="text-invest-teal font-bold hover:underline">
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
