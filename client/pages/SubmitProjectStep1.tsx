import { Link } from "react-router-dom";
import { TrendingUp, Upload, ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function SubmitProjectStep1() {
  const [projectName, setProjectName] = useState("");
  const [sector, setSector] = useState("");
  const [description, setDescription] = useState("");

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
              استثمرك
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-cairo text-4xl font-bold text-invest-blue">تقديم مشروعك</h1>
            <span className="font-cairo text-sm text-dark-gray">الخطوة 1 من 3: المعلومات الأساسية</span>
          </div>
          <div className="h-2 bg-white rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-invest-teal rounded-full transition-all duration-300"></div>
          </div>
          <p className="font-cairo text-xs text-dark-gray mt-2 text-center">25%</p>
        </div>

        {/* Form */}
        <form className="bg-white rounded-2xl p-8 mb-8">
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
              className="w-full px-4 py-3 border border-light-gray rounded-lg focus:border-invest-teal focus:outline-none font-cairo text-sm transition"
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
            <div className="border-2 border-dashed border-light-gray rounded-lg p-8 text-center hover:border-invest-teal transition cursor-pointer group">
              <Upload className="w-12 h-12 text-dark-gray mx-auto mb-4 group-hover:text-invest-teal transition" />
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
              className="flex-1 py-3 bg-invest-blue text-white rounded-lg font-cairo font-semibold text-lg hover:bg-blue-800 transition inline-flex items-center justify-center gap-2"
            >
              التالي
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Link
              to="/dashboard"
              className="px-8 py-3 border-2 border-invest-teal text-invest-teal rounded-lg font-cairo font-semibold text-lg hover:bg-light-gray transition inline-flex items-center justify-center gap-2"
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
