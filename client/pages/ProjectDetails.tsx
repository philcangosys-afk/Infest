import { Link, useParams } from "react-router-dom";
import { ArrowLeft, TrendingUp, Star, Users } from "lucide-react";
import { PROJECTS } from "../data/projects";

export default function ProjectDetails() {
  const { id } = useParams();
  const project = PROJECTS.find((item) => item.id === Number(id));

  if (!project) {
    return (
      <div className="min-h-screen bg-light-gray flex items-center justify-center p-6" dir="rtl">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-light-gray text-center max-w-lg w-full">
          <h1 className="font-cairo font-bold text-2xl text-invest-blue mb-2">المشروع غير موجود</h1>
          <p className="font-cairo text-dark-gray mb-5">لم نتمكن من العثور على تفاصيل هذا المشروع.</p>
          <Link to="/browse-projects" className="inline-flex px-5 py-3 rounded-lg bg-invest-blue text-white font-cairo font-semibold">
            العودة لصفحة المشاريع
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-gray" dir="rtl">
      <header className="bg-white border-b border-light-gray sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-invest-teal rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="font-cairo font-bold text-lg text-invest-blue">Nile Invest AI</span>
          </Link>

          <Link
            to="/browse-projects"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-light-gray font-cairo text-sm hover:bg-light-gray"
          >
            <ArrowLeft className="w-4 h-4" />
            رجوع للمشاريع
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className={`rounded-3xl p-8 bg-gradient-to-br ${project.gradient} text-white mb-6`}>
          <p className="font-cairo text-sm mb-2">{project.category}</p>
          <h1 className="font-cairo font-bold text-4xl mb-2">{project.title}</h1>
          <p className="font-cairo text-white/90">{project.description}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-light-gray">
            <p className="font-cairo text-xs text-dark-gray">رائد الأعمال</p>
            <p className="font-cairo font-bold text-text-dark">{project.entrepreneur}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-light-gray">
            <p className="font-cairo text-xs text-dark-gray">المرحلة</p>
            <p className="font-cairo font-bold text-text-dark">{project.stage}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-light-gray">
            <p className="font-cairo text-xs text-dark-gray">المبلغ المطلوب</p>
            <p className="font-cairo font-bold text-invest-teal">{project.amount} ج.س</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-light-gray">
          <h2 className="font-cairo font-bold text-xl mb-4">مؤشرات المشروع</h2>
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-cairo text-sm">التقييم: {project.rating} / 5</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-invest-blue" />
              <span className="font-cairo text-sm">عدد المستثمرين المهتمين: {project.requests}</span>
            </div>
            <div className="font-cairo text-sm text-dark-gray">عدد المراجعات: {project.reviews}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
