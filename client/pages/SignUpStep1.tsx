import { Link } from "react-router-dom";
import { TrendingUp, Eye, EyeOff, Check } from "lucide-react";
import { useState } from "react";

export default function SignUpStep1() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [password, setPassword] = useState("");

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    // Calculate password strength
    let strength = 0;
    if (value.length >= 8) strength++;
    if (/[A-Z]/.test(value)) strength++;
    if (/[0-9]/.test(value)) strength++;
    if (/[^A-Za-z0-9]/.test(value)) strength++;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-invest-red";
    if (passwordStrength <= 2) return "bg-invest-orange";
    return "bg-invest-green";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return "ضعيفة";
    if (passwordStrength <= 2) return "متوسطة";
    return "قوية";
  };

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left Side - Form */}
        <div className="flex flex-col justify-center px-8 sm:px-12 py-12">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-invest-teal rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="font-cairo font-bold text-lg text-invest-blue">
              استثمرك
            </span>
          </Link>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="font-cairo text-3xl sm:text-4xl font-bold text-invest-blue">
                إنشاء حساب جديد
              </h1>
              <span className="font-cairo text-sm text-dark-gray">الخطوة 1 من 3: البيانات الأساسية</span>
            </div>
            <div className="h-2 bg-light-gray rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-invest-teal rounded-full transition-all duration-300"></div>
            </div>
            <p className="font-cairo text-xs text-dark-gray mt-2 text-center">25%</p>
          </div>

          {/* Form Content */}
          <div className="space-y-6">
            {/* Full Name Field */}
            <div>
              <label className="font-cairo block text-sm font-semibold text-text-dark mb-2">
                الاسم الكامل
              </label>
              <input
                type="text"
                placeholder="أدخل اسمك الكامل"
                className="w-full px-4 py-3 border border-light-gray rounded-lg focus:border-invest-teal focus:outline-none font-cairo text-sm transition"
              />
            </div>

            {/* Email Field */}
            <div>
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
            <div>
              <label className="font-cairo block text-sm font-semibold text-text-dark mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="أدخل كلمة المرور"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
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

              {/* Password Strength Indicator */}
              {password && (
                <>
                  <div className="mt-2 h-2 bg-light-gray rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getPasswordStrengthColor()} rounded-full transition-all duration-300`}
                      style={{ width: `${(passwordStrength / 4) * 100}%` }}
                    ></div>
                  </div>
                  <p className="font-cairo text-xs text-dark-gray mt-1">
                    قوة كلمة المرور: <span className="font-semibold">{getPasswordStrengthText()}</span>
                  </p>
                </>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="font-cairo block text-sm font-semibold text-text-dark mb-2">
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="أعد إدخال كلمة المرور"
                  className="w-full px-4 py-3 pr-12 border border-light-gray rounded-lg focus:border-invest-teal focus:outline-none font-cairo text-sm transition"
                />
                <button
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-gray hover:text-invest-blue transition"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                className="w-5 h-5 mt-1 rounded border-invest-teal text-invest-teal focus:ring-0 cursor-pointer"
              />
              <label htmlFor="terms" className="font-cairo text-sm text-dark-gray cursor-pointer">
                أوافق على{" "}
                <a href="#" className="text-invest-teal font-semibold hover:underline">
                  الشروط والأحكام
                </a>
              </label>
            </div>

            {/* Next Button */}
            <button className="w-full py-3 bg-invest-blue text-white rounded-lg font-cairo font-semibold text-lg hover:bg-blue-800 transition">
              التالي
            </button>

            {/* Login Link */}
            <p className="font-cairo text-center text-dark-gray">
              هل لديك حساب؟{" "}
              <Link to="/login" className="text-invest-teal font-semibold hover:underline">
                تسجيل دخول
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - Illustration */}
        <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-invest-blue via-invest-blue to-invest-teal p-12">
          <div className="text-center text-white">
            <div className="relative mb-12">
              <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full"></div>
              <div className="relative">
                <div className="w-40 h-40 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
                  <span className="text-6xl">👤</span>
                </div>
              </div>
            </div>

            <h2 className="font-cairo text-3xl font-bold mb-6">
              كل فكرة عظيمة تستحق فرصة للنجاح!
            </h2>

            {/* Benefits */}
            <div className="space-y-3 mt-8">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 flex-shrink-0" />
                <span className="font-cairo">آمان متقدم للبيانات</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 flex-shrink-0" />
                <span className="font-cairo">وسائل استثمارية حقيقية</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 flex-shrink-0" />
                <span className="font-cairo">نمو وتطور مستثمري</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
