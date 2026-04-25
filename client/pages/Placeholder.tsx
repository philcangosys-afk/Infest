import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp } from "lucide-react";

interface PlaceholderProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderProps) {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Header */}
      <header className="border-b border-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-invest-teal rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="font-cairo font-bold text-xl text-invest-blue">
              استثمرك
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl">
          <div className="mb-8">
            <div className="w-20 h-20 bg-invest-teal/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-10 h-10 text-invest-teal" />
            </div>
            <h1 className="font-cairo text-4xl sm:text-5xl font-bold text-invest-blue mb-4">
              {title}
            </h1>
            <p className="font-cairo text-lg text-dark-gray mb-8">
              {description}
            </p>
            <p className="font-cairo text-dark-gray mb-8 text-sm">
              هذه الصفحة قيد الإنشاء حالياً. يرجى التواصل معنا أو العودة إلى الصفحة الرئيسية.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="font-cairo font-semibold bg-invest-blue text-white px-8 py-4 rounded-lg hover:bg-blue-800 transition inline-flex items-center justify-center gap-2"
            >
              العودة إلى الرئيسية
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
