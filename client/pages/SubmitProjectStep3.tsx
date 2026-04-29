import { Link } from "react-router-dom";
import { TrendingUp, Edit2, ArrowLeft, CheckCircle, Send } from "lucide-react";

export default function SubmitProjectStep3() {
  return (
    <div className="min-h-screen bg-light-gray" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-light-gray sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-invest-teal rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="font-cairo font-bold text-xl text-invest-blue hidden sm:inline">
              Nile Invest AI
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-cairo text-4xl font-bold text-invest-blue">مراجعة مشروعك</h1>
            <span className="font-cairo text-sm text-dark-gray">الخطوة 3 من 3: المراجعة والإرسال</span>
          </div>
          <div className="h-2 bg-white rounded-full overflow-hidden">
            <div className="h-full w-full bg-invest-teal rounded-full transition-all duration-300"></div>
          </div>
          <p className="font-cairo text-xs text-dark-gray mt-2 text-center">100%</p>
        </div>

        {/* Success Alert */}
        <div className="bg-invest-teal/10 border border-invest-teal rounded-xl p-4 mb-8">
          <p className="font-cairo text-invest-teal flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            تم استكمال جميع المعلومات بنجاح. يرجى مراجعة تفاصيل مشروعك قبل الإرسال
          </p>
        </div>

        {/* Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Card 1 - Basic Info */}
          <div className="bg-white rounded-xl p-6 border-2 border-light-gray hover:border-invest-teal transition">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-cairo font-bold text-lg text-text-dark">المعلومات الأساسية</h3>
              <button className="p-2 hover:bg-light-gray rounded-lg transition">
                <Edit2 className="w-5 h-5 text-invest-teal" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="font-cairo text-xs text-dark-gray">اسم المشروع</p>
                <p className="font-cairo font-semibold text-text-dark">تطبيق التعليم الذكي</p>
              </div>
              <div>
                <p className="font-cairo text-xs text-dark-gray">القطاع</p>
                <p className="font-cairo font-semibold text-text-dark">التعليم</p>
              </div>
              <div>
                <p className="font-cairo text-xs text-dark-gray">الوصف</p>
                <p className="font-cairo text-sm text-dark-gray">تطبيق تعليمي تفاعلي للطلاب بجميع المراحل التعليمية</p>
              </div>
            </div>
          </div>

          {/* Card 2 - Financial Info */}
          <div className="bg-white rounded-xl p-6 border-2 border-light-gray hover:border-invest-teal transition">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-cairo font-bold text-lg text-text-dark">البيانات المالية</h3>
              <button className="p-2 hover:bg-light-gray rounded-lg transition">
                <Edit2 className="w-5 h-5 text-invest-teal" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="font-cairo text-xs text-dark-gray">المبلغ المطلوب</p>
                <p className="font-cairo font-bold text-xl text-invest-teal">2,600,000</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-cairo text-xs text-dark-gray">المرحلة</p>
                  <p className="font-cairo font-semibold text-text-dark">Startup</p>
                </div>
                <div>
                  <p className="font-cairo text-xs text-dark-gray">العملة</p>
                  <p className="font-cairo font-semibold text-text-dark">ريال سعودي</p>
                </div>
              </div>
              <div>
                <p className="font-cairo text-xs text-dark-gray">العائد المتوقع</p>
                <p className="font-cairo font-semibold text-text-dark">25%</p>
              </div>
            </div>
          </div>

          {/* Card 3 - Team Info */}
          <div className="bg-white rounded-xl p-6 border-2 border-light-gray hover:border-invest-teal transition">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-cairo font-bold text-lg text-text-dark">فريق العمل</h3>
              <button className="p-2 hover:bg-light-gray rounded-lg transition">
                <Edit2 className="w-5 h-5 text-invest-teal" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="font-cairo text-xs text-dark-gray">عدد الأعضاء</p>
                <p className="font-cairo font-semibold text-text-dark">5 أعضاء</p>
              </div>
              <div>
                <p className="font-cairo text-xs text-dark-gray">الأدوار الرئيسية</p>
                <div className="flex gap-2 flex-wrap mt-2">
                  <span className="bg-light-gray px-3 py-1 rounded-lg font-cairo text-sm text-text-dark">
                    المؤسس والمدير التنفيذي
                  </span>
                  <span className="bg-light-gray px-3 py-1 rounded-lg font-cairo text-sm text-text-dark">
                    مهندس البرمجيات
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4 - Market Info */}
          <div className="bg-white rounded-xl p-6 border-2 border-light-gray hover:border-invest-teal transition">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-cairo font-bold text-lg text-text-dark">معلومات السوق</h3>
              <button className="p-2 hover:bg-light-gray rounded-lg transition">
                <Edit2 className="w-5 h-5 text-invest-teal" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="font-cairo text-xs text-dark-gray">السوق المستهدف</p>
                <p className="font-cairo font-semibold text-text-dark">المملكة العربية السعودية والخليج</p>
              </div>
              <div>
                <p className="font-cairo text-xs text-dark-gray">المنافسون الرئيسيون</p>
                <ul className="font-cairo text-sm text-dark-gray list-disc list-inside mt-2">
                  <li>إيران</li>
                  <li>دولار</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button className="flex-1 py-4 bg-invest-green text-white rounded-lg font-cairo font-bold text-lg hover:bg-opacity-90 transition inline-flex items-center justify-center gap-2">
            <Send className="w-5 h-5" />
            إرسال المشروع
          </button>
          <button className="px-8 py-4 border-2 border-light-gray text-text-dark rounded-lg font-cairo font-semibold text-lg hover:bg-light-gray transition inline-flex items-center justify-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            السابق
          </button>
        </div>
      </div>
    </div>
  );
}
