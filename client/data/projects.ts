export type Project = {
  id: number;
  title: string;
  entrepreneur: string;
  category: "التكنولوجيا" | "التعليم" | "الزراعة" | "الصحة" | "أخرى";
  description: string;
  stage: "Startup" | "Prototype" | "Growth";
  amount: string;
  rating: number;
  reviews: number;
  requests: number;
  icon: string;
  gradient: string;
  bgColor: string;
};

export const PROJECTS: Project[] = [
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
    bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
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
    bgColor: "bg-gradient-to-br from-green-50 to-teal-100",
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
    bgColor: "bg-gradient-to-br from-yellow-50 to-orange-100",
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
    bgColor: "bg-gradient-to-br from-red-50 to-pink-100",
  },
];
