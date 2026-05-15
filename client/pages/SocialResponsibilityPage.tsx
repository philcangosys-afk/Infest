import { HandHeart, Building2, Users, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getSafeUser, isSupabaseConfigured, supabase } from "@/lib/supabase";

type SupportType = "individual" | "organization";

type SocialRequest = {
  id: number;
  supporter_name: string;
  supporter_type: SupportType;
  support_area: string;
  support_kind: string;
  amount: string;
  details: string;
  created_at: string;
};

const LOCAL_CSR_KEY = "social_responsibility_requests_local";

const loadLocalRequests = (): SocialRequest[] => {
  const raw = localStorage.getItem(LOCAL_CSR_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as SocialRequest[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveLocalRequests = (items: SocialRequest[]) => {
  localStorage.setItem(LOCAL_CSR_KEY, JSON.stringify(items));
};

export default function SocialResponsibilityPage() {
  const [dashboardLink, setDashboardLink] = useState<{ to: string; label: string }>({
    to: "/investor-dashboard",
    label: "لوحة المستثمر",
  });
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [requests, setRequests] = useState<SocialRequest[]>([]);
  const [form, setForm] = useState({
    supporterName: "",
    supporterType: "individual" as SupportType,
    supportArea: "دعم المشاريع الصغيرة",
    supportKind: "تمويل",
    amount: "",
    details: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const { user } = await getSafeUser();
      if (!user) {
        setLoading(false);
        return;
      }

      if (isSupabaseConfigured) {
        const { data: profile } = await supabase.from("profiles").select("role, full_name").eq("id", user.id).single();

        if (profile?.role === "entrepreneur") {
          setDashboardLink({ to: "/dashboard", label: "لوحة رائد الأعمال" });
        } else {
          setDashboardLink({ to: "/investor-dashboard", label: "لوحة المستثمر" });
        }

        setForm((prev) => ({
          ...prev,
          supporterName: profile?.full_name?.trim() || prev.supporterName,
        }));

        const { data, error } = await supabase
          .from("social_responsibility_requests")
          .select("id, supporter_name, supporter_type, support_area, support_kind, amount, details, created_at")
          .order("created_at", { ascending: false })
          .limit(20);

        if (!error && data) {
          setRequests(data as SocialRequest[]);
          saveLocalRequests(data as SocialRequest[]);
          setLoading(false);
          return;
        }
      }

      const local = loadLocalRequests();
      setRequests(local);
      if (!isSupabaseConfigured) {
        setNotice("الصفحة تعمل بوضع محلي حالياً حتى يكتمل الربط مع قاعدة البيانات.");
      }
      setLoading(false);
    };

    init();
  }, []);

  const stats = useMemo(() => {
    const total = requests.length;
    const organizations = requests.filter((r) => r.supporter_type === "organization").length;
    const projectsSupport = requests.filter((r) => r.support_area.includes("المشاريع") || r.support_area.includes("صغيرة")).length;
    return { total, organizations, projectsSupport };
  }, [requests]);

  const submitRequest = async () => {
    if (!form.supporterName.trim() || !form.supportKind.trim() || !form.details.trim()) {
      setNotice("يرجى إدخال الاسم ونوع الدعم ووصف المبادرة قبل الإرسال.");
      return;
    }

    setSubmitting(true);

    const payload = {
      supporter_name: form.supporterName.trim(),
      supporter_type: form.supporterType,
      support_area: form.supportArea.trim(),
      support_kind: form.supportKind.trim(),
      amount: form.amount.trim() || "غير محدد",
      details: form.details.trim(),
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from("social_responsibility_requests")
        .insert(payload)
        .select("id, supporter_name, supporter_type, support_area, support_kind, amount, details, created_at")
        .single();

      if (!error && data) {
        const next = [data as SocialRequest, ...requests];
        setRequests(next);
        saveLocalRequests(next);
        setNotice("تم تسجيل مبادرة المسئولية المجتمعية بنجاح.");
        setForm((prev) => ({ ...prev, amount: "", details: "" }));
        setSubmitting(false);
        return;
      }
    }

    const localItem: SocialRequest = {
      id: Date.now(),
      supporter_name: payload.supporter_name,
      supporter_type: payload.supporter_type,
      support_area: payload.support_area,
      support_kind: payload.support_kind,
      amount: payload.amount,
      details: payload.details,
      created_at: new Date().toISOString(),
    };

    const next = [localItem, ...requests];
    setRequests(next);
    saveLocalRequests(next);
    setNotice("تم الحفظ بوضع محلي. يمكنك متابعة المبادرات الآن.");
    setForm((prev) => ({ ...prev, amount: "", details: "" }));
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-light-gray" dir="rtl">
      <header className="bg-white border-b border-light-gray">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center">
              <HandHeart className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <h1 className="font-cairo text-2xl font-bold text-invest-blue">المسئولية المجتمعية</h1>
              <p className="font-cairo text-sm text-dark-gray">مساحة لدعم المجتمع وتمويل المشاريع الصغيرة من الأفراد والجهات.</p>
            </div>
          </div>

          <Link
            to={dashboardLink.to}
            className="px-4 py-2 rounded-lg bg-invest-blue text-white font-cairo font-semibold hover:bg-blue-900 transition"
          >
            {dashboardLink.label}
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {!!notice && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 p-3 font-cairo text-sm">{notice}</div>
        )}

        <section className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-light-gray p-5">
            <p className="font-cairo text-sm text-dark-gray">إجمالي المبادرات</p>
            <p className="font-cairo text-3xl font-bold text-invest-blue mt-2">{stats.total}</p>
          </div>
          <div className="bg-white rounded-2xl border border-light-gray p-5">
            <p className="font-cairo text-sm text-dark-gray">مبادرات من جهات</p>
            <p className="font-cairo text-3xl font-bold text-invest-blue mt-2">{stats.organizations}</p>
          </div>
          <div className="bg-white rounded-2xl border border-light-gray p-5">
            <p className="font-cairo text-sm text-dark-gray">دعم المشاريع الصغيرة</p>
            <p className="font-cairo text-3xl font-bold text-invest-blue mt-2">{stats.projectsSupport}</p>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-light-gray p-6 space-y-4">
          <h2 className="font-cairo text-xl font-bold text-text-dark">تسجيل مبادرة جديدة</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            <input
              value={form.supporterName}
              onChange={(e) => setForm((prev) => ({ ...prev, supporterName: e.target.value }))}
              placeholder="اسم الشخص أو الجهة الداعمة"
              className="border border-light-gray rounded-xl px-4 py-2.5 font-cairo text-sm"
            />
            <select
              value={form.supporterType}
              onChange={(e) => setForm((prev) => ({ ...prev, supporterType: e.target.value as SupportType }))}
              className="border border-light-gray rounded-xl px-4 py-2.5 font-cairo text-sm bg-white"
            >
              <option value="individual">فرد</option>
              <option value="organization">جهة / مؤسسة</option>
            </select>
            <input
              value={form.supportArea}
              onChange={(e) => setForm((prev) => ({ ...prev, supportArea: e.target.value }))}
              placeholder="مجال الدعم (مثال: المشاريع الصغيرة)"
              className="border border-light-gray rounded-xl px-4 py-2.5 font-cairo text-sm"
            />
            <input
              value={form.supportKind}
              onChange={(e) => setForm((prev) => ({ ...prev, supportKind: e.target.value }))}
              placeholder="نوع الدعم (تمويل / تدريب / معدات...)"
              className="border border-light-gray rounded-xl px-4 py-2.5 font-cairo text-sm"
            />
            <input
              value={form.amount}
              onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
              placeholder="قيمة الدعم (اختياري)"
              className="border border-light-gray rounded-xl px-4 py-2.5 font-cairo text-sm"
            />
          </div>

          <textarea
            value={form.details}
            onChange={(e) => setForm((prev) => ({ ...prev, details: e.target.value }))}
            placeholder="وصف مبادرة المسئولية المجتمعية وكيف سيتم تنفيذها"
            rows={4}
            className="w-full border border-light-gray rounded-xl px-4 py-3 font-cairo text-sm resize-none"
          />

          <button
            onClick={submitRequest}
            disabled={submitting}
            className="px-5 py-2.5 rounded-xl bg-invest-blue text-white font-cairo font-semibold disabled:opacity-60"
          >
            {submitting ? "جاري التسجيل..." : "تسجيل المبادرة"}
          </button>
        </section>

        <section className="bg-white rounded-2xl border border-light-gray p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-invest-teal" />
            <h2 className="font-cairo text-xl font-bold text-text-dark">آخر المبادرات المسجلة</h2>
          </div>

          {loading ? (
            <p className="font-cairo text-sm text-dark-gray">جاري تحميل البيانات...</p>
          ) : requests.length === 0 ? (
            <p className="font-cairo text-sm text-dark-gray">لا توجد مبادرات بعد. كن أول من يدعم المجتمع.</p>
          ) : (
            <div className="space-y-3">
              {requests.map((item) => (
                <article key={item.id} className="rounded-xl border border-light-gray p-4 bg-light-gray/40">
                  <div className="flex flex-wrap items-center gap-2 justify-between">
                    <p className="font-cairo font-bold text-text-dark">{item.supporter_name}</p>
                    <span className="px-2 py-1 rounded-full text-xs font-cairo font-semibold bg-invest-teal/10 text-invest-teal">
                      {item.supporter_type === "organization" ? "جهة" : "فرد"}
                    </span>
                  </div>
                  <p className="font-cairo text-xs text-dark-gray mt-1 inline-flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" /> {item.support_area} • {item.support_kind}
                  </p>
                  <p className="font-cairo text-sm text-invest-blue mt-1 inline-flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> قيمة الدعم: {item.amount}
                  </p>
                  <p className="font-cairo text-sm text-dark-gray mt-2 leading-7">{item.details}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
