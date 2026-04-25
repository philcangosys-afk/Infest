import { Link } from "react-router-dom";
import { TrendingUp, Upload, CheckCircle, AlertCircle } from "lucide-react";

export default function IdentityVerification() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Sidebar */}
      <div className="fixed right-0 top-0 bottom-0 w-64 bg-invest-blue text-white p-6">
        <Link to="/" className="flex items-center gap-2 mb-12">
          <div className="w-10 h-10 bg-invest-teal rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <span className="font-cairo font-bold text-lg">استثمرك</span>
        </Link>

        <nav className="space-y-4">
          <a href="#" className="font-cairo flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-invest-blue/80 transition">
            <span className="text-lg">🏠</span>
            <span>لوحة التحكم</span>
          </a>
          <a href="#" className="font-cairo flex items-center gap-3 px-4 py-3 rounded-lg bg-invest-teal text-invest-blue font-semibold">
            <span className="text-lg">🔍</span>
            <span>التحقق من الهوية</span>
          </a>
          <a href="#" className="font-cairo flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-invest-blue/80 transition">
            <span className="text-lg">⚙️</span>
            <span>الإعدادات</span>
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="pr-64 min-h-screen bg-light-gray">
        {/* Header */}
        <header className="bg-white border-b border-light-gray sticky top-0 z-40">
          <div className="px-8 h-16 flex items-center justify-between">
            <h1 className="font-cairo font-bold text-2xl text-invest-blue">
              التحقق من الهوية
            </h1>
            <div className="text-right">
              <p className="font-cairo text-sm text-dark-gray">
                يرجى رفع الوثائق المطلوبة للتحقق من هويتك
              </p>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* Progress Alert */}
          <div className="bg-invest-teal/10 border border-invest-teal rounded-xl p-4 mb-8">
            <p className="font-cairo text-invest-teal flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              تم استكمال جميع المعلومات بنجاح. يرجى مراجعة تفاصيل مشروعك قبل الإرسال
            </p>
          </div>

          {/* Document Upload Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Card 1 - ID Card */}
            <div className="bg-white rounded-xl p-6 border-2 border-light-gray">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-invest-teal/10 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📋</span>
                </div>
                <div>
                  <h3 className="font-cairo font-bold text-text-dark">صورة الهوية الشخصية</h3>
                  <p className="font-cairo text-sm text-dark-gray">صورة واضحة من الأمام</p>
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
            <button className="flex-1 py-4 bg-invest-blue text-white rounded-lg font-cairo font-semibold text-lg hover:bg-blue-800 transition inline-flex items-center justify-center gap-2">
              <span>إرسال للتحقق</span>
              <span className="text-xl">📤</span>
            </button>
            <button className="px-8 py-4 border-2 border-invest-blue text-invest-blue rounded-lg font-cairo font-semibold text-lg hover:bg-light-gray transition">
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
