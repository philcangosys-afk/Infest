import { Link } from "react-router-dom";
import { TrendingUp, ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function SubmitProjectStep2() {
  const [stage, setStage] = useState("");
  const [fundingAmount, setFundingAmount] = useState("");
  const [currency, setCurrency] = useState("SAR");
  const [usage, setUsage] = useState("");
  const [expectedReturn, setExpectedReturn] = useState("");

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
            <h1 className="font-cairo text-4xl font-bold text-invest-blue">تقديم مشروعك</h1>
            <span className="font-cairo text-sm text-dark-gray">الخطوة 2 من 3: التفاصيل المالية</span>
          </div>
          <div className="h-2 bg-white rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-invest-teal rounded-full transition-all duration-300"></div>
          </div>
          <p className="font-cairo text-xs text-dark-gray mt-2 text-center">50%</p>
        </div>

        {/* Form */}
        <form className="bg-white rounded-2xl p-8 mb-8">
          {/* Project Stage */}
          <div className="mb-8">
            <label className="font-cairo block text-sm font-semibold text-text-dark mb-3">
              مرحلة المشروع الحالية
            </label>
            <div className="space-y-3">
              {[
                { value: "idea", label: "فكرة" },
                { value: "prototype", label: "نموذج أولي" },
                { value: "startup", label: "شركة ناشئة" },
                { value: "growth", label: "نمو" },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 cursor-pointer p-3 border border-light-gray rounded-lg hover:border-invest-teal transition"
                >
                  <input
                    type="radio"
                    name="stage"
                    value={option.value}
                    checked={stage === option.value}
                    onChange={(e) => setStage(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="font-cairo text-sm text-text-dark">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Funding Amount & Currency Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Funding Amount */}
            <div>
              <label className="font-cairo block text-sm font-semibold text-text-dark mb-3">
                المبلغ المطلوب للتمويل
              </label>
              <input
                type="number"
                placeholder="0"
                value={fundingAmount}
                onChange={(e) => setFundingAmount(e.target.value)}
                className="w-full px-4 py-3 border border-light-gray rounded-lg focus:border-invest-teal focus:outline-none font-cairo text-sm transition"
              />
            </div>

            {/* Currency */}
            <div>
              <label className="font-cairo block text-sm font-semibold text-text-dark mb-3">
                العملة
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-3 border border-light-gray rounded-lg focus:border-invest-teal focus:outline-none font-cairo text-sm transition bg-white"
              >
                <option value="SAR">ريال سعودي</option>
                <option value="USD">دولار أمريكي</option>
                <option value="EUR">يورو</option>
                <option value="SDG">جنيه سوداني</option>
              </select>
            </div>
          </div>

          {/* Funding Usage */}
          <div className="mb-8">
            <label className="font-cairo block text-sm font-semibold text-text-dark mb-3">
              كيف سيتم استخدام التمويل؟
            </label>
            <textarea
              placeholder="اشرح الاستخدامات الرئيسية"
              value={usage}
              onChange={(e) => setUsage(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-light-gray rounded-lg focus:border-invest-teal focus:outline-none font-cairo text-sm transition resize-none"
            />
          </div>

          {/* Expected Return */}
          <div className="mb-8">
            <label className="font-cairo block text-sm font-semibold text-text-dark mb-3">
              العائد المتوقع للمستثمرين (%)
            </label>
            <input
              type="number"
              placeholder="0"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(e.target.value)}
              className="w-full px-4 py-3 border border-light-gray rounded-lg focus:border-invest-teal focus:outline-none font-cairo text-sm transition"
            />
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
            <button
              type="button"
              className="px-8 py-3 border-2 border-light-gray text-text-dark rounded-lg font-cairo font-semibold text-lg hover:bg-light-gray transition inline-flex items-center justify-center gap-2"
            >
              السابق
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
