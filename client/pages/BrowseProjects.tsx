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
      image: "bg-gradient-to-br from-blue-400 to-blue-600"
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
      image: "bg-gradient-to-br from-green-400 to-green-600"
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
      image: "bg-gradient-to-br from-yellow-400 to-orange-600"
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
      image: "bg-gradient-to-br from-red-400 to-pink-600"
    }
  ];

  return (
    <div className="min-h-screen bg-light-gray" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-invest-teal rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="font-cairo font-bold text-xl text-invest-blue hidden sm:inline">
              استثمرك
            </span>
          </Link>
          <div className="flex-1 mx-8 max-w-md">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-gray" />
              <input
                type="text"
                placeholder="ابحث عن مشاريع..."
                className="w-full pr-10 pl-4 py-2 bg-light-gray rounded-lg border border-light-gray focus:border-invest-teal focus:outline-none font-cairo text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-light-gray rounded-lg transition">
              <Heart className="w-6 h-6 text-dark-gray" />
            </button>
            <Link to="/" className="w-10 h-10 bg-light-gray rounded-full flex items-center justify-center">
              <span className="font-cairo text-sm font-semibold text-invest-blue">أ</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div
            className={`${
              showFilters ? "block" : "hidden"
            } md:block w-full md:w-64 flex-shrink-0`}
          >
            <div className="bg-white rounded-xl p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6 md:hidden">
                <h2 className="font-cairo font-bold text-lg">الفلاتر</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1 hover:bg-light-gray rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-cairo font-semibold text-text-dark mb-3">القطاع</h3>
                <div className="space-y-2">
                  {["التكنولوجيا", "الصحة", "التعليم", "الزراعة", "أخرى"].map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-invest-teal text-invest-teal"
                      />
                      <span className="font-cairo text-sm text-dark-gray">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Funding Filter */}
              <div className="mb-6">
                <h3 className="font-cairo font-semibold text-text-dark mb-3">حجم التمويل</h3>
                <div className="space-y-2">
                  {["أقل من 100K", "100K-1M", "1M-10M", "أكثر من 10M"].map((range) => (
                    <label key={range} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-invest-teal text-invest-teal"
                      />
                      <span className="font-cairo text-sm text-dark-gray">{range}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Stage Filter */}
              <div className="mb-6">
                <h3 className="font-cairo font-semibold text-text-dark mb-3">مرحلة المشروع</h3>
                <div className="space-y-2">
                  {["فكرة", "نموذج أولي", "شركة ناشئة", "نمو"].map((stage) => (
                    <label key={stage} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-invest-teal text-invest-teal"
                      />
                      <span className="font-cairo text-sm text-dark-gray">{stage}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full py-2 border border-light-gray rounded-lg font-cairo font-semibold text-sm text-text-dark hover:bg-light-gray transition">
                  إعادة تعيين
                </button>
                <button className="w-full py-2 bg-invest-teal text-white rounded-lg font-cairo font-semibold text-sm hover:bg-opacity-90 transition">
                  تطبيق الفلاتر
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header Bar */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-cairo font-bold text-2xl text-text-dark">
                24 مشروع متاح
              </h2>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center gap-2 px-4 py-2 border border-light-gray rounded-lg hover:bg-light-gray transition"
              >
                <Filter className="w-5 h-5" />
                <span className="font-cairo text-sm">الفلاتر</span>
              </button>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group"
                >
                  {/* Image */}
                  <div className={`h-48 ${project.image} relative overflow-hidden`}>
                    <button className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition group-hover:scale-110">
                      <Heart className="w-5 h-5 text-dark-gray" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-cairo font-bold text-lg text-text-dark mb-2 line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="font-cairo text-sm text-dark-gray mb-2">
                      {project.entrepreneur}
                    </p>

                    {/* Category & Stage */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="font-cairo text-xs bg-light-gray text-invest-blue px-2 py-1 rounded">
                        {project.category}
                      </span>
                      <span className="font-cairo text-xs bg-invest-teal/10 text-invest-teal px-2 py-1 rounded">
                        {project.stage}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="font-cairo text-sm text-dark-gray mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Amount & Rating */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-t border-light-gray pt-4">
                      <div>
                        <p className="font-cairo font-bold text-lg text-invest-teal">
                          {project.amount} ج.س
                        </p>
                      </div>
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
                        <span className="font-cairo text-xs text-dark-gray mr-1">
                          ({project.rating})
                        </span>
                      </div>
                    </div>

                    {/* Requests Count */}
                    <div className="flex items-center gap-2 mb-4 pb-4 border-b border-light-gray">
                      <Users className="w-4 h-4 text-dark-gray" />
                      <span className="font-cairo text-sm text-dark-gray">
                        {project.requests} طلبات استثمار
                      </span>
                    </div>

                    {/* CTA Button */}
                    <button className="w-full py-2 bg-invest-teal text-white rounded-lg font-cairo font-semibold text-sm hover:bg-opacity-90 transition">
                      عرض التفاصيل
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-12">
              <button className="px-3 py-2 rounded-lg border border-light-gray text-dark-gray font-cairo hover:bg-light-gray transition">
                السابق
              </button>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  className={`px-3 py-2 rounded-lg font-cairo font-semibold text-sm ${
                    num === 1
                      ? "bg-invest-teal text-white"
                      : "border border-light-gray text-dark-gray hover:bg-light-gray transition"
                  }`}
                >
                  {num}
                </button>
              ))}
              <button className="px-3 py-2 rounded-lg border border-light-gray text-dark-gray font-cairo hover:bg-light-gray transition">
                التالي
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
