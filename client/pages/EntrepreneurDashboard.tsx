import { Link } from "react-router-dom";
import { TrendingUp, Bell, LogOut, Briefcase, Users, MessageCircle, Heart, Edit2, Trash2, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

export default function EntrepreneurDashboard() {
  const [projects] = useState([
    {
      id: 1,
      name: "تطبيق التعليم الذكي",
      status: "نشط",
      statusColor: "bg-invest-green",
      requests: 3,
      date: "2024/06/15",
      image: "bg-gradient-to-br from-blue-400 to-blue-600"
    },
    {
      id: 2,
      name: "منصة الزراعة الذكية",
      status: "معلق",
      statusColor: "bg-invest-orange",
      requests: 2,
      date: "2024/05/10",
      image: "bg-gradient-to-br from-green-400 to-green-600"
    },
    {
      id: 3,
      name: "حلول الصحة الرقمية",
      status: "مراجعة",
      statusColor: "bg-invest-blue",
      requests: 5,
      date: "2024/04/20",
      image: "bg-gradient-to-br from-red-400 to-red-600"
    }
  ]);

  const [requests] = useState([
    {
      id: 1,
      investorName: "أحمد العبدالله",
      badge: "مستثمر معتمد",
      projectName: "تطبيق التعليم الذكي",
      message: "يريد الاستثمار في مشروع 'منصة التعليم الذكي'",
      date: "2024/06/20",
      time: "10:30"
    },
    {
      id: 2,
      investorName: "سارة الفقحاني",
      badge: "مستثمر معتمد",
      projectName: "منصة الزراعة الذكية",
      message: "اهتمام في الاستثمار للمشروع",
      date: "2024/06/19",
      time: "09:15"
    },
    {
      id: 3,
      investorName: "محمد القرني",
      badge: "مستثمر جديد",
      projectName: "حلول الصحة الرقمية",
      message: "يود معرفة المزيد عن المشروع",
      date: "2024/06/18",
      time: "14:45"
    }
  ]);

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
          {[
            { icon: "📊", label: "لوحة التحكم", active: true },
            { icon: "📁", label: "مشاريعي" },
            { icon: "📬", label: "الطلبات الواردة" },
            { icon: "💬", label: "الرسائل" },
            { icon: "👤", label: "الملف الشخصي" },
            { icon: "⚙️", label: "الإعدادات" }
          ].map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-cairo font-semibold transition ${
                item.active
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
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-invest-teal/20 text-invest-teal rounded-lg font-cairo font-semibold hover:bg-invest-teal/30 transition">
            <span>🚀</span>
            <span>استكشف المستثمرين</span>
          </button>
        </div>

        <button className="w-full flex items-center gap-2 px-4 py-3 text-white hover:bg-invest-blue/80 rounded-lg font-cairo font-semibold transition mt-6">
          <LogOut className="w-5 h-5" />
          <span>تسجيل الخروج</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="mr-64 min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-light-gray sticky top-0 z-40">
          <div className="px-8 h-20 flex items-center justify-between">
            <h1 className="font-cairo font-bold text-2xl text-invest-blue">
              مرحباً بك، أحمد! 👋
            </h1>
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

        {/* Page Content */}
        <div className="p-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Briefcase, label: "عدد مشاريعي", value: "3", color: "from-blue-100 to-blue-200", iconColor: "text-invest-blue", bgColor: "bg-blue-500" },
              { icon: Users, label: "طلبات جديدة", value: "2", color: "from-green-100 to-green-200", iconColor: "text-invest-green", bgColor: "bg-green-500" },
              { icon: MessageCircle, label: "رسائل جديدة", value: "5", color: "from-purple-100 to-purple-200", iconColor: "text-purple-600", bgColor: "bg-purple-500" },
              { icon: Heart, label: "نسبة التحقق", value: "85%", color: "from-orange-100 to-orange-200", iconColor: "text-invest-orange", bgColor: "bg-orange-500" }
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-7 h-7 ${stat.iconColor}`} />
                    </div>
                  </div>
                  <p className="font-cairo text-sm text-dark-gray font-semibold mb-2">{stat.label}</p>
                  <p className="font-cairo font-bold text-5xl text-text-dark">
                    {stat.value}
                  </p>
                  <div className="mt-4 pt-4 border-t border-light-gray">
                    <p className="font-cairo text-xs text-invest-teal font-bold">↑ 12% من الشهر الماضي</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Projects Section */}
          <div className="bg-white rounded-2xl p-8 mb-12 shadow-lg">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-cairo font-bold text-3xl text-text-dark">
                  مشاريعي النشطة
                </h2>
                <p className="font-cairo text-dark-gray mt-2">إدارة وتتبع مشاريعك الحالية</p>
              </div>
              <button className="px-6 py-3 bg-invest-teal text-white rounded-xl font-cairo font-bold text-sm hover:shadow-lg transition-all duration-200">
                ➕ مشروع جديد
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-light-gray">
                    <th className="text-right py-3 px-4 font-cairo font-semibold text-text-dark">
                      المشروع
                    </th>
                    <th className="text-right py-3 px-4 font-cairo font-semibold text-text-dark">
                      الحالة
                    </th>
                    <th className="text-right py-3 px-4 font-cairo font-semibold text-text-dark">
                      الطلبات
                    </th>
                    <th className="text-right py-3 px-4 font-cairo font-semibold text-text-dark">
                      التاريخ
                    </th>
                    <th className="text-right py-3 px-4 font-cairo font-semibold text-text-dark">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr
                      key={project.id}
                      className="border-b border-light-gray hover:bg-light-gray transition"
                    >
                      <td className="py-4 px-4 font-cairo text-text-dark flex items-center gap-3">
                        <div className={`w-10 h-10 ${project.image} rounded-lg`}></div>
                        {project.name}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-lg font-cairo text-sm text-white ${project.statusColor}`}
                        >
                          {project.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-cairo text-text-dark">
                        {project.requests}
                      </td>
                      <td className="py-4 px-4 font-cairo text-dark-gray text-sm">
                        {project.date}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-white rounded-lg transition text-invest-blue">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-white rounded-lg transition text-invest-red">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Incoming Requests Section */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="mb-8">
              <h2 className="font-cairo font-bold text-3xl text-text-dark">
                الطلبات الواردة من المستثمرين
              </h2>
              <p className="font-cairo text-dark-gray mt-2">تفاعل مع طلبات الاستثمار الجديدة</p>
            </div>
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="border border-light-gray rounded-lg p-4 hover:border-invest-teal transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-invest-blue to-invest-teal rounded-full flex items-center justify-center text-white font-cairo font-bold">
                        {request.investorName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-cairo font-semibold text-text-dark">
                            {request.investorName}
                          </p>
                          <span className="px-2 py-1 bg-invest-green/10 text-invest-green text-xs font-cairo rounded">
                            {request.badge}
                          </span>
                        </div>
                        <p className="font-cairo text-sm text-dark-gray">
                          {request.projectName}
                        </p>
                      </div>
                    </div>
                    <p className="font-cairo text-xs text-dark-gray whitespace-nowrap">
                      {request.date} {request.time}
                    </p>
                  </div>

                  <p className="font-cairo text-sm text-dark-gray mb-4">
                    {request.message}
                  </p>

                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-invest-green text-white rounded-lg font-cairo font-semibold text-sm hover:bg-opacity-90 transition inline-flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      قبول
                    </button>
                    <button className="flex-1 py-2 bg-invest-red text-white rounded-lg font-cairo font-semibold text-sm hover:bg-opacity-90 transition inline-flex items-center justify-center gap-2">
                      <XCircle className="w-4 h-4" />
                      رفض
                    </button>
                    <button className="flex-1 py-2 border-2 border-invest-teal text-invest-teal rounded-lg font-cairo font-semibold text-sm hover:bg-light-gray transition">
                      رسالة
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
