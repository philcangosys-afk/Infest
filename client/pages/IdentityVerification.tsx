import { Link } from "react-router-dom";
import { TrendingUp, Upload, CheckCircle, AlertCircle } from "lucide-react";

export default function IdentityVerification() {
  return (
    <div className="min-h-screen bg-light-gray" dir="rtl">
      {/* Sidebar */}
      <div className="fixed right-0 top-0 bottom-0 w-72 bg-gradient-to-b from-invest-blue to-invest-blue/95 text-white p-8 overflow-y-auto shadow-xl">
        <Link to="/" className="flex items-center gap-3 mb-16">
          <div className="w-12 h-12 bg-gradient-to-br from-invest-teal to-invest-teal/80 rounded-xl flex items-center justify-center shadow-lg">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
          <span className="font-cairo font-bold text-xl">استثمرك</span>
        </Link>

        <nav className="space-y-2">
          {[
            { icon: "🏠", label: "لوحة التحكم", active: false },
            { icon: "🔍", label: "التحقق من الهوية", active: true },
            { icon: "📁", label: "مشاريعي", active: false },
            { icon: "⚙️", label: "الإعدادات", active: false }
          ].map((item) => (
            <a
              key={item.label}
              href="#"
              className={`font-cairo flex items-center gap-4 px-6 py-4 rounded-xl font-bold transition-all duration-200 ${
                item.active
                  ? "bg-invest-teal text-invest-blue shadow-lg scale-105"
                  : "text-white hover:bg-invest-blue/50"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="pr-72 min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-light-gray sticky top-0 z-40 shadow-sm">
          <div className="px-12 h-24 flex items-center justify-between">
            <div>
              <h1 className="font-cairo font-bold text-4xl text-invest-blue mb-2">
                التحقق من الهوية
              </h1>
              <p className="font-cairo text-dark-gray font-semibold">
                يرجى رفع الوثائق المطلوبة للتحقق من هويتك
              </p>
            </div>
            <div className="text-left">
              <span className="font-cairo text-sm font-bold text-invest-green bg-invest-green/10 px-4 py-2 rounded-full">
                ✓ الخطوة 2 من 3
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-12">
          {/* Progress Alert */}
          <div className="bg-gradient-to-r from-invest-teal/20 to-invest-teal/10 border-2 border-invest-teal rounded-2xl p-6 mb-12 shadow-lg">
            <p className="font-cairo text-invest-teal flex items-center gap-3 text-lg font-semibold">
              <CheckCircle className="w-7 h-7 flex-shrink-0" />
              <span>تم استكمال جميع المعلومات بنجاح. يرجى رفع الوثائق المطلوبة</span>
            </p>
          </div>

          {/* Document Upload Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Card 1 - ID Card */}
            <div className="bg-white rounded-2xl p-8 border-2 border-light-gray hover:border-invest-teal hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">📋</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-cairo font-bold text-xl text-text-dark">صورة الهوية</h3>
                  <p className="font-cairo text-sm text-dark-gray font-semibold">صورة واضحة من الأمام</p>
                </div>
              </div>

              {/* Upload Area */}
              <div className="border-2 border-dashed border-light-gray rounded-lg p-6 text-center mb-4 hover:border-invest-teal transition cursor-pointer">
                <Upload className="w-8 h-8 text-dark-gray mx-auto mb-2" />
                <p className="font-cairo text-sm text-dark-gray">
                  اسحب الملف هنا أو انقر للاختيار
                </p>
                <p className="font-cairo text-xs text-dark-gray mt-2">
                  PDF, JPG, PNG • حتى 10MB
                </p>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-invest-green" />
                <span className="font-cairo text-sm text-invest-green font-semibold">جاري</span>
                <span className="font-cairo text-xs text-dark-gray">15-10-2024</span>
              </div>
            </div>

            {/* Card 2 - Selfie */}
            <div className="bg-white rounded-xl p-6 border-2 border-light-gray">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-invest-teal/10 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📸</span>
                </div>
                <div>
                  <h3 className="font-cairo font-bold text-text-dark">صورة شخصية (Selfie)</h3>
                  <p className="font-cairo text-sm text-dark-gray">صورة واضحة لوجهك</p>
                </div>
              </div>

              {/* Upload Area */}
              <div className="border-2 border-dashed border-light-gray rounded-lg p-6 text-center mb-4 hover:border-invest-teal transition cursor-pointer">
                <Upload className="w-8 h-8 text-dark-gray mx-auto mb-2" />
                <p className="font-cairo text-sm text-dark-gray">
                  اسحب الملف هنا أو انقر للاختيار
                </p>
                <p className="font-cairo text-xs text-dark-gray mt-2">
                  PDF, JPG, PNG • حتى 10MB
                </p>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-invest-green" />
                <span className="font-cairo text-sm text-invest-green font-semibold">مكتمل</span>
                <span className="font-cairo text-xs text-dark-gray">15-10-2024</span>
              </div>
            </div>

            {/* Card 3 - Additional Docs */}
            <div className="bg-white rounded-xl p-6 border-2 border-light-gray">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-invest-orange/10 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📄</span>
                </div>
                <div>
                  <h3 className="font-cairo font-bold text-text-dark">وثائق إضافية</h3>
                  <p className="font-cairo text-sm text-dark-gray">شهادات أو وثائق ذات صلة</p>
                </div>
              </div>

              {/* Upload Area */}
              <div className="border-2 border-dashed border-light-gray rounded-lg p-6 text-center mb-4 hover:border-invest-teal transition cursor-pointer">
                <Upload className="w-8 h-8 text-dark-gray mx-auto mb-2" />
                <p className="font-cairo text-sm text-dark-gray">
                  اسحب الملف هنا أو انقر للاختيار
                </p>
                <p className="font-cairo text-xs text-dark-gray mt-2">
                  PDF, JPG, PNG • حتى 10MB
                </p>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-invest-orange" />
                <span className="font-cairo text-sm text-invest-orange font-semibold">معلق</span>
                <span className="font-cairo text-xs text-dark-gray">قيد المراجعة</span>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-light-gray rounded-xl p-6 mb-8">
            <p className="font-cairo text-sm text-dark-gray text-center">
              <span className="text-green-600 font-semibold">🔒</span> جميع بيانات
              تم تشفيرها بنسبة 100% وكن آمنة تماماً على أيدينا
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button className="flex-1 py-4 bg-gradient-to-r from-invest-blue to-invest-blue/90 text-white rounded-xl font-cairo font-bold text-lg hover:shadow-xl transition-all duration-200 inline-flex items-center justify-center gap-2 shadow-lg hover:scale-105">
              <span>✓ إرسال للتحقق</span>
            </button>
            <button className="px-8 py-4 border-2 border-invest-teal text-invest-teal rounded-xl font-cairo font-bold text-lg hover:bg-light-gray transition-all duration-200">
              ✕ إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
