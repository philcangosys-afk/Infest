import { Link, useParams } from "react-router-dom";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type ProjectDetailsData = {
  id: number;
  name: string;
  description: string;
  sector: string;
  stage: string;
  budget: string;
  entrepreneurName: string;
};

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState<ProjectDetailsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      setLoading(true);
      const numericId = Number(id);
      if (!numericId) {
        setProject(null);
        setLoading(false);
        return;
      }

      const { data: projectRow, error } = await supabase
        .from("projects")
        .select("id, owner_id, name, description, sector, stage, budget")
        .eq("id", numericId)
        .single();

      if (error || !projectRow) {
        setProject(null);
        setLoading(false);
        return;
      }

      const { data: owner } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", projectRow.owner_id)
        .single();

      setProject({
        id: projectRow.id,
        name: projectRow.name,
        description: projectRow.description,
        sector: projectRow.sector,
        stage: projectRow.stage,
        budget: projectRow.budget,
        entrepreneurName: owner?.full_name ?? "رائد أعمال",
      });
      setLoading(false);
    };

    loadProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-light-gray flex items-center justify-center p-6" dir="rtl">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-light-gray text-center max-w-lg w-full font-cairo text-dark-gray">
          جاري تحميل تفاصيل المشروع...
        </div>
      </div>
    );
  }

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
        <div className="rounded-3xl p-8 bg-gradient-to-br from-invest-blue to-invest-teal text-white mb-6">
          <p className="font-cairo text-sm mb-2">{project.sector}</p>
          <h1 className="font-cairo font-bold text-4xl mb-2">{project.name}</h1>
          <p className="font-cairo text-white/90">{project.description}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-light-gray">
            <p className="font-cairo text-xs text-dark-gray">رائد الأعمال</p>
            <p className="font-cairo font-bold text-text-dark">{project.entrepreneurName}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-light-gray">
            <p className="font-cairo text-xs text-dark-gray">المرحلة</p>
            <p className="font-cairo font-bold text-text-dark">{project.stage}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-light-gray">
            <p className="font-cairo text-xs text-dark-gray">المبلغ المطلوب</p>
            <p className="font-cairo font-bold text-invest-teal">{project.budget} ج.س</p>
          </div>
        </div>
      </main>
    </div>
  );
}
