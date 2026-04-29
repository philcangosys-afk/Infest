import { Link } from "react-router-dom";
import {
  TrendingUp,
  Bell,
  LogOut,
  Briefcase,
  Users,
  MessageCircle,
  Heart,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Settings,
  User,
  FolderOpen,
} from "lucide-react";
import { useMemo, useState } from "react";

type SectionKey =
  | "dashboard"
  | "projects"
  | "requests"
  | "messages"
  | "profile"
  | "settings"
  | "investors";

export default function EntrepreneurDashboard() {
  const [activeSection, setActiveSection] = useState<SectionKey>("dashboard");

  const projects = [
    {
      id: 1,
      name: "تطبيق التعليم الذكي",
      status: "نشط",
      statusColor: "bg-invest-green",
      requests: 3,
      date: "2024/06/15",
      image: "bg-gradient-to-br from-blue-400 to-blue-600",
    },
    {
      id: 2,
      name: "منصة الزراعة الذكية",
      status: "معلق",
      statusColor: "bg-invest-orange",
      requests: 2,
      date: "2024/05/10",
      image: "bg-gradient-to-br from-green-400 to-green-600",
    },
    {
      id: 3,
      name: "حلول الصحة الرقمية",
      status: "مراجعة",
      statusColor: "bg-invest-blue",
      requests: 5,
      date: "2024/04/20",
      image: "bg-gradient-to-br from-red-400 to-red-600",
    },
  ];

  const requests = [
    {
      id: 1,
      investorName: "أحمد العبدالله",
      badge: "مستثمر معتمد",
      projectName: "تطبيق التعليم الذكي",
      message: "يريد الاستثمار في مشروع 'منصة التعليم الذكي'",
      date: "2024/06/20",
      time: "10:30",
    },
    {
      id: 2,
      investorName: "سارة الفقحاني",
      badge: "مستثمر معتمد",
      projectName: "منصة الزراعة الذكية",
      message: "اهتمام في الاستثمار للمشروع",
      date: "2024/06/19",
      time: "09:15",
    },
    {
      id: 3,
      investorName: "محمد القرني",
      badge: "مستثمر جديد",
      projectName: "حلول الصحة الرقمية",
      message: "يود معرفة المزيد عن المشروع",
      date: "2024/06/18",
      time: "14:45",
    },
  ];

  const messages = [
    { id: 1, name: "محمد صلاح", text: "أحتاج مزيد من التفاصيل المالية", time: "10:24" },
    { id: 2, name: "نجلاء حسن", text: "أرسلت عرض الاستثمار", time: "09:10" },
    { id: 3, name: "عبدالرحمن آدم", text: "متى يمكننا الاجتماع؟", time: "أمس" },
  ];

  const sidebarItems = useMemo(
    () => [
      { key: "dashboard" as const, icon: "📊", label: "لوحة التحكم" },
      { key: "projects" as const, icon: "📁", label: "مشاريعي" },
      { key: "requests" as const, icon: "📬", label: "الطلبات الواردة" },
      { key: "messages" as const, icon: "💬", label: "الرسائل" },
      { key: "profile" as const, icon: "👤", label: "الملف الشخصي" },
      { key: "settings" as const, icon: "⚙️", label: "الإعدادات" },
    ],
    [],
  );

  const sectionTitle: Record<SectionKey, string> = {
    dashboard: "لوحة التحكم",
    projects: "مشاريعي",
    requests: "الطلبات الواردة",
    messages: "الرسائل",
    profile: "الملف الشخصي",
    settings: "الإعدادات",
    investors: "استكشف المستثمرين",
  };

  return (
    <div className="min-h-screen bg-light-gray" dir="rtl">
      {/* Sidebar */}
      <div className="fixed right-0 top-0 bottom-0 w-64 bg-invest-blue text-white p-6 overflow-y-auto">
        <Link to="/" className="flex items-center gap-2 mb-12">
          <div className="w-10 h-10 bg-invest-teal rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <span className="font-cairo font-bold text-lg">استثمرك</span>
        </Link>

        <nav className="space-y-3 mb-12">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveSection(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-cairo font-semibold transition ${
                activeSection === item.key
                  ? "bg-invest-teal text-invest-blue"
                  : "text-white hover:bg-invest-blue/80"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-invest-blue/30">
          <button
            onClick={() => setActiveSection("investors")}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-cairo font-semibold transition ${
              activeSection === "investors"
                ? "bg-invest-teal text-invest-blue"
                : "bg-invest-teal/20 text-invest-teal hover:bg-invest-teal/30"
            }`}
          >
            <span>🚀</span>
            <span>استكشف المستثمرين</span>
          </button>
        </div>

        <Link
          to="/"
          className="w-full flex items-center gap-2 px-4 py-3 text-white hover:bg-invest-blue/80 rounded-lg font-cairo font-semibold transition mt-6"
        >
          <LogOut className="w-5 h-5" />
          <span>تسجيل الخروج</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="mr-64 min-h-screen">
        <header className="bg-white border-b border-light-gray sticky top-0 z-40">
          <div className="px-8 h-20 flex items-center justify-between">
            <div>
              <h1 className="font-cairo font-bold text-2xl text-invest-blue">مرحباً بك، أحمد! 👋</h1>
              <p className="font-cairo text-sm text-dark-gray">{sectionTitle[activeSection]}</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-light-gray rounded-lg transition relative">
                <Bell className="w-6 h-6 text-dark-gray" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-invest-red rounded-full"></span>
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-invest-blue to-invest-teal rounded-full flex items-center justify-center text-white font-cairo font-bold">
                أ
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Dashboard */}
          {activeSection === "dashboard" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: Briefcase, label: "عدد مشاريعي", value: "3" },
                  { icon: Users, label: "طلبات جديدة", value: "2" },
                  { icon: MessageCircle, label: "رسائل جديدة", value: "5" },
                  { icon: Heart, label: "نسبة التحقق", value: "85%" },
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg">
                      <Icon className="w-8 h-8 text-invest-teal mb-3" />
                      <p className="font-cairo text-sm text-dark-gray">{stat.label}</p>
                      <p className="font-cairo font-bold text-4xl text-text-dark">{stat.value}</p>
                    </div>
                  );
                })}
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="font-cairo font-bold text-2xl mb-4">ملخص سريع</h2>
                <p className="font-cairo text-dark-gray">لديك 2 طلبات استثمار جديدة و 5 رسائل غير مقروءة.</p>
              </div>
            </>
          )}

          {/* Projects */}
          {activeSection === "projects" && (
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="font-cairo font-bold text-2xl mb-6">قائمة المشاريع</h2>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="p-4 border border-light-gray rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${project.image}`}></div>
                      <div>
                        <p className="font-cairo font-semibold">{project.name}</p>
                        <p className="font-cairo text-xs text-dark-gray">{project.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-white text-xs rounded ${project.statusColor}`}>{project.status}</span>
                      <button className="p-2 text-invest-blue"><Edit2 className="w-4 h-4" /></button>
                      <button className="p-2 text-invest-red"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Requests */}
          {activeSection === "requests" && (
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="font-cairo font-bold text-2xl mb-6">طلبات المستثمرين</h2>
              <div className="space-y-4">
                {requests.map((request) => (
                  <div key={request.id} className="border border-light-gray rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-cairo font-semibold">{request.investorName}</p>
                      <p className="font-cairo text-xs text-dark-gray">{request.date} - {request.time}</p>
                    </div>
                    <p className="font-cairo text-sm text-dark-gray mb-3">{request.message}</p>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-invest-green text-white rounded-lg font-cairo text-sm inline-flex items-center gap-1"><CheckCircle className="w-4 h-4" /> قبول</button>
                      <button className="px-4 py-2 bg-invest-red text-white rounded-lg font-cairo text-sm inline-flex items-center gap-1"><XCircle className="w-4 h-4" /> رفض</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {activeSection === "messages" && (
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="font-cairo font-bold text-2xl mb-6">الرسائل</h2>
              <div className="space-y-3">
                {messages.map((msg) => (
                  <button key={msg.id} className="w-full text-right p-4 border border-light-gray rounded-xl hover:bg-light-gray transition">
                    <div className="flex items-center justify-between">
                      <p className="font-cairo font-semibold">{msg.name}</p>
                      <p className="font-cairo text-xs text-dark-gray">{msg.time}</p>
                    </div>
                    <p className="font-cairo text-sm text-dark-gray mt-1">{msg.text}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Profile */}
          {activeSection === "profile" && (
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="font-cairo font-bold text-2xl mb-6">الملف الشخصي</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-xl border-light-gray">
                  <p className="font-cairo text-sm text-dark-gray">الاسم</p>
                  <p className="font-cairo font-bold">أحمد محمد زين</p>
                </div>
                <div className="p-4 border rounded-xl border-light-gray">
                  <p className="font-cairo text-sm text-dark-gray">المدينة</p>
                  <p className="font-cairo font-bold">الخرطوم - السودان</p>
                </div>
              </div>
            </div>
          )}

          {/* Settings */}
          {activeSection === "settings" && (
            <div className="bg-white rounded-2xl p-8 shadow-lg space-y-4">
              <h2 className="font-cairo font-bold text-2xl">الإعدادات</h2>
              <div className="p-4 border border-light-gray rounded-xl flex items-center justify-between">
                <p className="font-cairo">تفعيل إشعارات المشاريع الجديدة</p>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-invest-teal" />
              </div>
              <div className="p-4 border border-light-gray rounded-xl flex items-center justify-between">
                <p className="font-cairo">إظهار الملف للمستثمرين</p>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-invest-teal" />
              </div>
            </div>
          )}

          {/* Explore investors */}
          {activeSection === "investors" && (
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="font-cairo font-bold text-2xl mb-6">مستثمرون مقترحون</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {["د. منى عبدالله", "عثمان الفكي", "علاء الدين صديق"].map((name) => (
                  <div key={name} className="p-4 border border-light-gray rounded-xl">
                    <div className="w-12 h-12 rounded-full bg-invest-blue text-white flex items-center justify-center font-cairo mb-3">
                      {name.charAt(0)}
                    </div>
                    <p className="font-cairo font-bold">{name}</p>
                    <p className="font-cairo text-xs text-dark-gray">اهتمامات: التقنية، التعليم</p>
                    <button className="mt-3 px-4 py-2 bg-invest-teal text-white rounded-lg font-cairo text-sm">إرسال دعوة</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
