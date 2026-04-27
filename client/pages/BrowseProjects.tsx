import { Link } from "react-router-dom";
import { Search, TrendingUp, Heart, Star, Users, Filter, X } from "lucide-react";
import { useState } from "react";

export default function BrowseProjects() {
  const [showFilters, setShowFilters] = useState(true);

  const projects = [
    {
      id: 1,
      title: "ذكاء المستثمر",
      entrepreneur: "أحمد العبدالله",
      category: "التكنولوجيا",
      description: "منصة ذكية لتحليل فرص الاستثمار باستخدام الذكاء الاصطناعي",
      stage: "Startup",
      amount: "500,000",
      rating: 4.8,
      reviews: 24,
      requests: 5,
      icon: "🤖",
      gradient: "from-blue-500 via-blue-600 to-blue-700",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100"
    },
    {
      id: 2,
      title: "تطبيق التعليم الذكي",
      entrepreneur: "فاطمة محمد",
      category: "التعليم",
      description: "تطبيق تعليمي تفاعلي للطلاب بجميع المراحل التعليمية",
      stage: "Prototype",
      amount: "800,000",
      rating: 4.5,
      reviews: 18,
      requests: 8,
      icon: "📚",
      gradient: "from-green-500 via-green-600 to-teal-700",
      bgColor: "bg-gradient-to-br from-green-50 to-teal-100"
    },
    {
      id: 3,
      title: "منصة الزراعة الذكية",
      entrepreneur: "محمود إبراهيم",
      category: "الزراعة",
      description: "حل متكامل لإدارة المشاريع الزراعية بتقنيات حديثة",
      stage: "Growth",
      amount: "1,200,000",
      rating: 4.6,
      reviews: 32,
      requests: 12,
      icon: "🌾",
      gradient: "from-yellow-500 via-amber-600 to-orange-700",
      bgColor: "bg-gradient-to-br from-yellow-50 to-orange-100"
    },
    {
      id: 4,
      title: "تطبيق الصحة الرقمية",
      entrepreneur: "نور خليل",
      category: "الصحة",
      description: "منصة صحية شاملة للاستشارات الطبية عن بعد",
      stage: "Startup",
      amount: "600,000",
      rating: 4.7,
      reviews: 28,
      requests: 10,
      icon: "🏥",
      gradient: "from-red-500 via-red-600 to-pink-700",
      bgColor: "bg-gradient-to-br from-red-50 to-pink-100"
    }
  ];

  return (
    <div className="min-h-screen bg-light-gray" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-light-gray shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div className="w-12 h-12 bg-gradient-to-br from-invest-teal to-invest-teal/80 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <span className="font-cairo font-bold text-2xl text-invest-blue hidden sm:inline group-hover:text-invest-teal transition">
              استثمرك
            </span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-gray group-focus-within:text-invest-teal transition" />
              <input
                type="text"
                placeholder="ابحث عن مشاريع..."
                className="w-full pr-12 pl-4 py-3 bg-light-gray rounded-xl border-2 border-light-gray focus:border-invest-teal focus:outline-none focus:bg-white font-cairo text-sm transition-all duration-200 shadow-sm"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Favorites Button */}
            <button className="w-11 h-11 rounded-xl bg-light-gray hover:bg-invest-teal/10 flex items-center justify-center transition-all duration-200 group relative">
              <Heart className="w-6 h-6 text-dark-gray group-hover:text-invest-teal transition" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-invest-red text-white text-xs rounded-full flex items-center justify-center font-cairo font-bold">
                8
              </span>
            </button>

            {/* Profile */}
            <button className="w-11 h-11 bg-gradient-to-br from-invest-blue to-invest-teal rounded-xl flex items-center justify-center text-white font-cairo font-bold text-lg hover:shadow-lg transition-all duration-200 hover:scale-105">
              أ
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div
            className={`${
              showFilters ? "block" : "hidden"
            } md:block w-full md:w-72 flex-shrink-0`}
          >
            <div className="bg-white rounded-2xl p-6 sticky top-24 shadow-lg">
              <div className="flex items-center justify-between mb-8 md:hidden">
                <h2 className="font-cairo font-bold text-lg text-text-dark">الفلاتر</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1 hover:bg-light-gray rounded-lg transition"
                >
                  <X className="w-5 h-5 text-dark-gray" />
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-8">
                <h3 className="font-cairo font-bold text-text-dark mb-4 text-sm uppercase tracking-wide">
                  القطاع
                </h3>
                <div className="space-y-3">
                  {["التكنولوجيا", "الصحة", "التعليم", "الزراعة", "أخرى"].map((cat) => (
                    <label
                      key={cat}
                      className="flex items-center gap-3 cursor-pointer p-3 hover:bg-light-gray rounded-lg transition group"
                    >
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded border-2 border-light-gray text-invest-teal cursor-pointer accent-invest-teal"
                      />
                      <span className="font-cairo text-sm text-dark-gray group-hover:text-text-dark transition font-medium">
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-light-gray mb-8"></div>

              {/* Funding Filter */}
              <div className="mb-8">
                <h3 className="font-cairo font-bold text-text-dark mb-4 text-sm uppercase tracking-wide">
                  حجم التمويل
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "أقل من 100K", color: "from-blue-400 to-blue-600" },
                    { label: "100K-1M", color: "from-green-400 to-green-600" },
                    { label: "1M-10M", color: "from-orange-400 to-orange-600" },
                    { label: "أكثر من 10M", color: "from-purple-400 to-purple-600" }
                  ].map((range) => (
                    <label
                      key={range.label}
                      className="flex items-center gap-3 cursor-pointer p-3 hover:bg-light-gray rounded-lg transition group"
                    >
                      <div className={`w-5 h-5 rounded bg-gradient-to-r ${range.color}`}></div>
                      <span className="font-cairo text-sm text-dark-gray group-hover:text-text-dark transition font-medium flex-1">
                        {range.label}
                      </span>
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded border-2 border-light-gray text-invest-teal cursor-pointer accent-invest-teal"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-light-gray mb-8"></div>

              {/* Stage Filter */}
              <div className="mb-8">
                <h3 className="font-cairo font-bold text-text-dark mb-4 text-sm uppercase tracking-wide">
                  مرحلة المشروع
                </h3>
                <div className="space-y-3">
                  {["فكرة", "نموذج أولي", "شركة ناشئة", "نمو"].map((stage) => (
                    <label
                      key={stage}
                      className="flex items-center gap-3 cursor-pointer p-3 hover:bg-light-gray rounded-lg transition group"
                    >
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded border-2 border-light-gray text-invest-teal cursor-pointer accent-invest-teal"
                      />
                      <span className="font-cairo text-sm text-dark-gray group-hover:text-text-dark transition font-medium">
                        {stage}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-light-gray mb-8"></div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full py-3 border-2 border-light-gray text-text-dark rounded-lg font-cairo font-bold text-sm hover:bg-light-gray hover:border-text-dark transition duration-200">
                  ↺ إعادة تعيين
                </button>
                <button className="w-full py-3 bg-gradient-to-r from-invest-teal to-invest-teal/90 text-white rounded-lg font-cairo font-bold text-sm hover:shadow-lg transition-all duration-200 shadow-md">
                  ✓ تطبيق الفلاتر
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header Bar */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="font-cairo text-sm text-dark-gray mb-1">المشاريع المتاحة</p>
                <h2 className="font-cairo font-bold text-4xl text-invest-blue">
                  24 <span className="text-2xl text-dark-gray">مشروع</span>
                </h2>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center gap-2 px-6 py-3 border-2 border-light-gray text-text-dark rounded-xl hover:bg-light-gray hover:border-invest-teal transition font-cairo font-bold text-sm shadow-md"
              >
                <Filter className="w-5 h-5" />
                <span>الفلاتر</span>
              </button>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Image Header with Gradient */}
                  <div className={`relative h-56 bg-gradient-to-br ${project.gradient} overflow-hidden`}>
                    {/* Decorative Elements */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl"></div>
                      <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                    </div>

                    {/* Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-7xl opacity-30 group-hover:scale-110 transition-transform duration-300">
                        {project.icon}
                      </span>
                    </div>

                    {/* Save Button */}
                    <button className="absolute top-4 right-4 w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 group-hover:bg-invest-teal group-hover:text-white">
                      <Heart className="w-6 h-6" />
                    </button>

                    {/* Stage Badge */}
                    <div className="absolute bottom-4 right-4 px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full font-cairo text-xs font-bold text-text-dark">
                      {project.stage}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Title & Entrepreneur */}
                    <h3 className="font-cairo font-bold text-xl text-text-dark mb-1 line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="font-cairo text-sm text-dark-gray mb-4 flex items-center gap-1">
                      <span>👤</span>
                      {project.entrepreneur}
                    </p>

                    {/* Category Badge */}
                    <div className="inline-block mb-4">
                      <span className="font-cairo text-xs font-semibold bg-light-gray text-invest-blue px-3 py-1.5 rounded-full">
                        {project.category}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="font-cairo text-sm text-dark-gray mb-5 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-light-gray to-transparent mb-5"></div>

                    {/* Amount */}
                    <div className="mb-4">
                      <p className="font-cairo text-xs text-dark-gray mb-1">المبلغ المطلوب</p>
                      <p className="font-cairo font-bold text-2xl text-invest-teal">
                        {project.amount} <span className="text-sm">ج.س</span>
                      </p>
                    </div>

                    {/* Rating & Requests Row */}
                    <div className="flex items-center justify-between mb-5 pb-5 border-b border-light-gray">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(project.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-light-gray"
                            }`}
                          />
                        ))}
                        <span className="font-cairo text-xs text-dark-gray ml-1 font-semibold">
                          ({project.rating})
                        </span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-light-gray rounded-full">
                        <Users className="w-4 h-4 text-dark-gray" />
                        <span className="font-cairo text-xs font-semibold text-dark-gray">
                          {project.requests}
                        </span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button className="w-full py-3 bg-gradient-to-r from-invest-teal to-invest-teal/90 text-white rounded-lg font-cairo font-bold text-sm hover:shadow-lg transition-all duration-200 group-hover:shadow-invest-teal/50 flex items-center justify-center gap-2">
                      <span>عرض التفاصيل</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-3 mt-16 py-8">
              <button className="px-5 py-3 rounded-xl border-2 border-light-gray text-dark-gray font-cairo font-bold hover:border-invest-teal hover:text-invest-teal transition-all duration-200">
                ← السابق
              </button>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  className={`px-4 py-3 rounded-xl font-cairo font-bold text-sm transition-all duration-200 ${
                    num === 1
                      ? "bg-gradient-to-r from-invest-teal to-invest-teal/90 text-white shadow-lg hover:shadow-xl"
                      : "border-2 border-light-gray text-dark-gray hover:border-invest-teal hover:text-invest-teal"
                  }`}
                >
                  {num}
                </button>
              ))}
              <button className="px-5 py-3 rounded-xl border-2 border-light-gray text-dark-gray font-cairo font-bold hover:border-invest-teal hover:text-invest-teal transition-all duration-200">
                التالي →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
