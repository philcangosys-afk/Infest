import { Link } from "react-router-dom";
import { TrendingUp, Upload, ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function SubmitProjectStep1() {
  const [projectName, setProjectName] = useState("");
  const [sector, setSector] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-b from-light-gray to-white" dir="rtl">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-light-gray sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-12 h-12 bg-gradient-to-br from-invest-teal to-invest-teal/80 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="font-cairo font-bold text-2xl text-invest-blue hidden sm:inline">
              استثمرك
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="font-cairo text-sm font-bold text-invest-teal mb-2">الخطوة 1 من 3</p>
              <h1 className="font-cairo text-5xl font-bold text-invest-blue">تقديم مشروعك</h1>
            </div>
            <span className="font-cairo text-sm text-dark-gray">المعلومات الأساسية</span>
          </div>
          <div className="h-3 bg-white rounded-full overflow-hidden shadow-inner">
            <div className="h-full w-1/3 bg-gradient-to-r from-invest-teal to-invest-blue rounded-full transition-all duration-300"></div>
          </div>
          <p className="font-cairo text-sm text-dark-gray mt-3 text-center font-semibold">25%</p>
        </div>

        {/* Form */}
        <form className="bg-white rounded-3xl p-10 mb-8 shadow-xl border border-light-gray">
          {/* Project Name */}
          <div className="mb-8">
            <label className="font-cairo block text-sm font-semibold text-text-dark mb-3">
              اسم المشروع
            </label>
            <input
              type="text"
              placeholder="مثال: تطبيق تعليمي ذكي"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-5 py-3.5 border-2 border-light-gray rounded-xl focus:border-invest-teal focus:outline-none font-cairo text-sm transition-all"
            />
          </div>

          {/* Sector */}
          <div className="mb-8">
            <label className="font-cairo block text-sm font-semibold text-text-dark mb-3">
              القطاع
            </label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full px-4 py-3 border border-light-gray rounded-lg focus:border-invest-teal focus:outline-none font-cairo text-sm transition bg-white"
            >
              <option value="">اختر القطاع</option>
              <option value="technology">التكنولوجيا</option>
              <option value="health">الصحة</option>
              <option value="education">التعليم</option>
              <option value="agriculture">الزراعة</option>
              <option value="other">أخرى</option>
            </select>
          </div>

          {/* Short Description */}
          <div className="mb-8">
            <label className="font-cairo block text-sm font-semibold text-text-dark mb-3">
              وصف قصير للمشروع
            </label>
            <textarea
              placeholder="اشرح فكرة مشروعك بإيجاز"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-light-gray rounded-lg focus:border-invest-teal focus:outline-none font-cairo text-sm transition resize-none"
            />
          </div>

          {/* Cover Image Upload */}
          <div className="mb-8">
            <label className="font-cairo block text-sm font-semibold text-text-dark mb-3">
              صورة غلاف المشروع
            </label>
            <div className="border-2 border-dashed border-light-gray rounded-2xl p-10 text-center hover:border-invest-teal transition cursor-pointer group bg-light-gray/40">
              <Upload className="w-14 h-14 text-dark-gray mx-auto mb-4 group-hover:text-invest-teal transition" />
              <p className="font-cairo text-sm text-dark-gray mb-2">
                اسحب الصورة هنا أو انقر للاختيار
              </p>
              <p className="font-cairo text-xs text-dark-gray">
                حجم موصى به: 1200x600px
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              className="flex-1 py-4 bg-gradient-to-r from-invest-blue to-invest-blue/90 text-white rounded-xl font-cairo font-bold text-lg hover:shadow-lg transition-all inline-flex items-center justify-center gap-2"
            >
              التالي
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Link
              to="/dashboard"
              className="px-8 py-4 border-2 border-invest-teal text-invest-teal rounded-xl font-cairo font-bold text-lg hover:bg-light-gray transition inline-flex items-center justify-center gap-2"
            >
              العودة
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
