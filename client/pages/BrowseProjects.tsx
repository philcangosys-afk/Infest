import { Link } from "react-router-dom";
import { Search, TrendingUp, Heart, Filter, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type ProjectCard = {
  id: number;
  title: string;
  entrepreneur: string;
  category: string;
  description: string;
  stage: string;
  amount: string;
};

const fundingOptions = ["أقل من 100K", "100K-1M", "1M-10M", "أكثر من 10M"];
const stageOptions = ["فكرة", "نموذج أولي", "شركة ناشئة", "نمو", "Startup", "Growth", "Scale"];

const amountToNumber = (amount: string) => {
  const cleaned = amount.replace(/[^\d.]/g, "");
  return Number(cleaned || "0");
};

const matchFundingRange = (amount: number, range: string) => {
  if (range === "أقل من 100K") return amount < 100_000;
  if (range === "100K-1M") return amount >= 100_000 && amount <= 1_000_000;
  if (range === "1M-10M") return amount > 1_000_000 && amount <= 10_000_000;
  if (range === "أكثر من 10M") return amount > 10_000_000;
  return true;
};

export default function BrowseProjects() {
  const [showFilters, setShowFilters] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [projects, setProjects] = useState<ProjectCard[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  const [draftSectors, setDraftSectors] = useState<string[]>([]);
  const [draftFunding, setDraftFunding] = useState<string[]>([]);
  const [draftStages, setDraftStages] = useState<string[]>([]);

  const [appliedSectors, setAppliedSectors] = useState<string[]>([]);
  const [appliedFunding, setAppliedFunding] = useState<string[]>([]);
  const [appliedStages, setAppliedStages] = useState<string[]>([]);

  const sectorOptions = useMemo(() => Array.from(new Set(projects.map((project) => project.category))), [projects]);

  const toggleInList = (current: string[], value: string) =>
    current.includes(value) ? current.filter((item) => item !== value) : [...current, value];

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      setErrorMessage("");

      const { data: projectRows, error } = await supabase
        .from("projects")
        .select("id, owner_id, name, sector, description, stage, budget")
        .order("created_at", { ascending: false });

      if (error) {
        setLoading(false);
        setErrorMessage("تعذر تحميل المشاريع من قاعدة البيانات.");
        return;
      }

      const ownerIds = [...new Set((projectRows ?? []).map((row) => row.owner_id))];
      const ownerMap = new Map<string, string>();

      if (ownerIds.length) {
        const { data: owners } = await supabase.from("profiles").select("id, full_name").in("id", ownerIds);
        (owners ?? []).forEach((owner) => ownerMap.set(owner.id, owner.full_name ?? "رائد أعمال"));
      }

      setProjects(
        (projectRows ?? []).map((row) => ({
          id: row.id,
          title: row.name,
          entrepreneur: ownerMap.get(row.owner_id) ?? "رائد أعمال",
          category: row.sector,
          description: row.description,
          stage: row.stage,
          amount: row.budget,
        })),
      );

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: favorites } = await supabase.from("favorites").select("project_id").eq("investor_id", user.id);
        setFavoriteIds((favorites ?? []).map((item) => item.project_id));
      }

      setLoading(false);
    };

    loadProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const query = searchQuery.trim();
      const matchesSearch =
        !query ||
        project.title.includes(query) ||
        project.description.includes(query) ||
        project.entrepreneur.includes(query) ||
        project.category.includes(query);

      const matchesSector = appliedSectors.length === 0 || appliedSectors.includes(project.category);

      const amount = amountToNumber(project.amount);
      const matchesFunding =
        appliedFunding.length === 0 || appliedFunding.some((range) => matchFundingRange(amount, range));

      const matchesStage = appliedStages.length === 0 || appliedStages.includes(project.stage);

      return matchesSearch && matchesSector && matchesFunding && matchesStage;
    });
  }, [searchQuery, projects, appliedSectors, appliedFunding, appliedStages]);

  const applyFilters = () => {
    setAppliedSectors(draftSectors);
    setAppliedFunding(draftFunding);
    setAppliedStages(draftStages);
  };

  const resetFilters = () => {
    setDraftSectors([]);
    setDraftFunding([]);
    setDraftStages([]);
    setAppliedSectors([]);
    setAppliedFunding([]);
    setAppliedStages([]);
  };

  const toggleFavorite = async (projectId: number) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setErrorMessage("سجّل الدخول كمستثمر لحفظ المشاريع في اهتماماتك.");
      return;
    }

    const isFavorite = favoriteIds.includes(projectId);

    if (isFavorite) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("investor_id", user.id)
        .eq("project_id", projectId);

      if (!error) {
        setFavoriteIds((prev) => prev.filter((id) => id !== projectId));
      }
      return;
    }

    const { error } = await supabase.from("favorites").insert({
      investor_id: user.id,
      project_id: projectId,
    });

    if (!error) {
      setFavoriteIds((prev) => [...prev, projectId]);
    }
  };

  return (
    <div className="min-h-screen bg-light-gray" dir="rtl">
      <header className="bg-white border-b border-light-gray shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
          <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div className="w-12 h-12 bg-gradient-to-br from-invest-teal to-invest-teal/80 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <span className="font-cairo font-bold text-2xl text-invest-blue hidden sm:inline group-hover:text-invest-teal transition">Nile Invest AI</span>
          </Link>

          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-gray group-focus-within:text-invest-teal transition" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن مشاريع..."
                className="w-full pr-12 pl-4 py-3 bg-light-gray rounded-xl border-2 border-light-gray focus:border-invest-teal focus:outline-none focus:bg-white font-cairo text-sm transition-all duration-200 shadow-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <button className="w-11 h-11 rounded-xl bg-light-gray hover:bg-invest-teal/10 flex items-center justify-center transition-all duration-200 group relative">
              <Heart className="w-6 h-6 text-dark-gray group-hover:text-invest-teal transition" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-invest-red text-white text-xs rounded-full flex items-center justify-center font-cairo font-bold">
                {favoriteIds.length}
              </span>
            </button>

            <Link
              to="/investor-dashboard"
              className="w-11 h-11 bg-gradient-to-br from-invest-blue to-invest-teal rounded-xl flex items-center justify-center text-white font-cairo font-bold text-lg hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              أ
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {errorMessage && <div className="mb-4 rounded-xl border border-invest-red/20 bg-invest-red/10 p-3 font-cairo text-sm text-invest-red">{errorMessage}</div>}

        <div className="flex gap-8">
          <div className={`${showFilters ? "block" : "hidden"} md:block w-full md:w-72 flex-shrink-0`}>
            <div className="bg-white rounded-2xl p-6 sticky top-24 shadow-lg">
              <div className="flex items-center justify-between mb-8 md:hidden">
                <h2 className="font-cairo font-bold text-lg text-text-dark">الفلاتر</h2>
                <button onClick={() => setShowFilters(false)} className="p-1 hover:bg-light-gray rounded-lg transition">
                  <X className="w-5 h-5 text-dark-gray" />
                </button>
              </div>

              <div className="mb-8">
                <h3 className="font-cairo font-bold text-text-dark mb-4 text-sm uppercase tracking-wide">القطاع</h3>
                <div className="space-y-3">
                  {sectorOptions.map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer p-3 hover:bg-light-gray rounded-lg transition group">
                      <input
                        type="checkbox"
                        checked={draftSectors.includes(cat)}
                        onChange={() => setDraftSectors((prev) => toggleInList(prev, cat))}
                        className="w-5 h-5 rounded border-2 border-light-gray text-invest-teal cursor-pointer accent-invest-teal"
                      />
                      <span className="font-cairo text-sm text-dark-gray group-hover:text-text-dark transition font-medium">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="h-px bg-light-gray mb-8"></div>

              <div className="mb-8">
                <h3 className="font-cairo font-bold text-text-dark mb-4 text-sm uppercase tracking-wide">حجم التمويل</h3>
                <div className="space-y-3">
                  {fundingOptions.map((range) => (
                    <label key={range} className="flex items-center gap-3 cursor-pointer p-3 hover:bg-light-gray rounded-lg transition group">
                      <input
                        type="checkbox"
                        checked={draftFunding.includes(range)}
                        onChange={() => setDraftFunding((prev) => toggleInList(prev, range))}
                        className="w-5 h-5 rounded border-2 border-light-gray text-invest-teal cursor-pointer accent-invest-teal"
                      />
                      <span className="font-cairo text-sm text-dark-gray group-hover:text-text-dark transition font-medium">{range}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="h-px bg-light-gray mb-8"></div>

              <div className="mb-8">
                <h3 className="font-cairo font-bold text-text-dark mb-4 text-sm uppercase tracking-wide">مرحلة المشروع</h3>
                <div className="space-y-3">
                  {stageOptions.map((stage) => (
                    <label key={stage} className="flex items-center gap-3 cursor-pointer p-3 hover:bg-light-gray rounded-lg transition group">
                      <input
                        type="checkbox"
                        checked={draftStages.includes(stage)}
                        onChange={() => setDraftStages((prev) => toggleInList(prev, stage))}
                        className="w-5 h-5 rounded border-2 border-light-gray text-invest-teal cursor-pointer accent-invest-teal"
                      />
                      <span className="font-cairo text-sm text-dark-gray group-hover:text-text-dark transition font-medium">{stage}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="h-px bg-light-gray mb-8"></div>

              <div className="space-y-3">
                <button
                  onClick={resetFilters}
                  className="w-full py-3 border-2 border-light-gray text-text-dark rounded-lg font-cairo font-bold text-sm hover:bg-light-gray hover:border-text-dark transition duration-200"
                >
                  ↺ إعادة تعيين
                </button>
                <button
                  onClick={applyFilters}
                  className="w-full py-3 bg-gradient-to-r from-invest-teal to-invest-teal/90 text-white rounded-lg font-cairo font-bold text-sm hover:shadow-lg transition-all duration-200 shadow-md"
                >
                  ✓ تطبيق الفلاتر
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="font-cairo text-sm text-dark-gray mb-1">المشاريع المتاحة</p>
                <h2 className="font-cairo font-bold text-4xl text-invest-blue">
                  {loading ? "..." : filteredProjects.length} <span className="text-2xl text-dark-gray">مشروع</span>
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

            {loading ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-light-gray font-cairo text-dark-gray">جاري تحميل المشاريع...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => {
                  const isFav = favoriteIds.includes(project.id);
                  return (
                    <div key={project.id} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                      <div className="relative h-40 bg-gradient-to-br from-invest-blue to-invest-teal overflow-hidden">
                        <button
                          onClick={() => toggleFavorite(project.id)}
                          className="absolute top-4 right-4 w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                        >
                          <Heart className={`w-6 h-6 ${isFav ? "fill-invest-red text-invest-red" : "text-dark-gray"}`} />
                        </button>
                        <div className="absolute bottom-4 right-4 px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full font-cairo text-xs font-bold text-text-dark">
                          {project.stage}
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="font-cairo font-bold text-xl text-text-dark mb-1 line-clamp-1">{project.title}</h3>
                        <p className="font-cairo text-sm text-dark-gray mb-4">👤 {project.entrepreneur}</p>

                        <div className="inline-block mb-4">
                          <span className="font-cairo text-xs font-semibold bg-light-gray text-invest-blue px-3 py-1.5 rounded-full">{project.category}</span>
                        </div>

                        <p className="font-cairo text-sm text-dark-gray mb-5 line-clamp-2 leading-relaxed">{project.description}</p>

                        <div className="mb-4">
                          <p className="font-cairo text-xs text-dark-gray mb-1">المبلغ المطلوب</p>
                          <p className="font-cairo font-bold text-2xl text-invest-teal">{project.amount} <span className="text-sm">ج.س</span></p>
                        </div>

                        <Link
                          to={`/project-details/${project.id}`}
                          className="w-full py-3 bg-gradient-to-r from-invest-teal to-invest-teal/90 text-white rounded-lg font-cairo font-bold text-sm hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <span>عرض التفاصيل</span>
                          <span>→</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!loading && filteredProjects.length === 0 && (
              <div className="mt-8 bg-white rounded-2xl p-8 text-center border border-light-gray">
                <p className="font-cairo text-dark-gray">لا توجد مشاريع مطابقة للبحث أو الفلاتر الحالية.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
