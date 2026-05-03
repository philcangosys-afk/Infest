import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { TrendingUp, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") === "entrepreneur" ? "entrepreneur" : "investor";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      if (!isSupabaseConfigured) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      if (!profile?.role) return;

      if (profile.role !== role) {
        await supabase.auth.signOut();
        setErrorMessage(
          role === "entrepreneur"
            ? "أنت مسجل حالياً كمستثمر. تم تسجيل الخروج، أدخل الآن بحساب رائد أعمال."
            : "أنت مسجل حالياً كرائد أعمال. تم تسجيل الخروج، أدخل الآن بحساب مستثمر.",
        );
        return;
      }

      navigate(profile.role === "entrepreneur" ? "/dashboard" : "/investor-dashboard");
    };

    checkSession();
  }, [navigate, role]);

  const handleLogin = async () => {
    setErrorMessage("");

    if (!isSupabaseConfigured) {
      setErrorMessage("ربط قاعدة البيانات غير مكتمل حالياً.");
      return;
    }

    if (!email || !password) {
      setErrorMessage("يرجى إدخال البريد الإلكتروني وكلمة المرور.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      setLoading(false);
      setErrorMessage("فشل تسجيل الدخول. تأكد من البيانات أو قم بإنشاء حساب جديد.");
      return;
    }

    const user = data.user;
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      setLoading(false);
      setErrorMessage("تم تسجيل الدخول لكن تعذر تحميل ملفك الشخصي.");
      return;
    }

    if (!profile) {
      const fullName = (user.user_metadata.full_name as string | undefined) ?? "مستخدم جديد";
      const metadataRole =
        (user.user_metadata.role as string | undefined) === "entrepreneur" ? "entrepreneur" : "investor";
      const { data: newProfile, error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          role: metadataRole,
          full_name: fullName,
          phone: (user.user_metadata.phone as string | undefined) ?? null,
          city: (user.user_metadata.city as string | undefined) ?? null,
          address: (user.user_metadata.address as string | undefined) ?? null,
        })
        .select("role")
        .single();

      if (insertError || !newProfile) {
        setLoading(false);
        setErrorMessage("تعذر إكمال ملف المستخدم في قاعدة البيانات.");
        return;
      }

      if (newProfile.role !== role) {
        await supabase.auth.signOut();
        setLoading(false);
        setErrorMessage(
          newProfile.role === "entrepreneur"
            ? "هذا الحساب مسجل كرائد أعمال. استخدم صفحة دخول رواد الأعمال."
            : "هذا الحساب مسجل كمستثمر. استخدم صفحة دخول المستثمرين.",
        );
        return;
      }

      setLoading(false);
      navigate(newProfile.role === "entrepreneur" ? "/dashboard" : "/investor-dashboard");
      return;
    }

    if (profile.role !== role) {
      await supabase.auth.signOut();
      setLoading(false);
      setErrorMessage(
        profile.role === "entrepreneur"
          ? "هذا الحساب مسجل كرائد أعمال. استخدم صفحة دخول رواد الأعمال."
          : "هذا الحساب مسجل كمستثمر. استخدم صفحة دخول المستثمرين.",
      );
      return;
    }

    setLoading(false);
    navigate(profile.role === "entrepreneur" ? "/dashboard" : "/investor-dashboard");
  };

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        <div className="flex flex-col justify-center px-8 sm:px-12 py-12">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 bg-invest-teal rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="font-cairo font-bold text-lg text-invest-blue">Nile Invest AI</span>
          </Link>

          <div>
            <h1 className="font-cairo text-4xl sm:text-5xl font-bold text-invest-blue mb-3">تسجيل الدخول</h1>
            <p className="font-cairo text-lg text-dark-gray mb-8">أدخل بيانات حسابك للمتابعة</p>

            <div className="mb-8">
              <label className="font-cairo block text-sm font-bold text-text-dark mb-3 uppercase tracking-wide">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full px-6 py-4 border-2 border-light-gray rounded-xl focus:border-invest-teal focus:bg-white focus:outline-none font-cairo text-sm transition-all duration-200 shadow-sm"
              />
            </div>

            <div className="mb-2">
              <label className="font-cairo block text-sm font-bold text-text-dark mb-3 uppercase tracking-wide">كلمة المرور</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور"
                  className="w-full px-6 py-4 pr-14 border-2 border-light-gray rounded-xl focus:border-invest-teal focus:bg-white focus:outline-none font-cairo text-sm transition-all duration-200 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-gray hover:text-invest-blue transition p-2 hover:bg-light-gray rounded-lg"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="mb-6 mt-4 rounded-xl border border-invest-red/20 bg-invest-red/10 p-3 font-cairo text-sm text-invest-red">
                {errorMessage}
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-invest-blue to-invest-blue/90 text-white rounded-xl font-cairo font-bold text-lg hover:shadow-xl transition-all duration-200 mb-8 shadow-lg hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
            >
              {loading ? "جاري تسجيل الدخول..." : "دخول"}
            </button>

            <p className="font-cairo text-center text-dark-gray text-lg">
              ليس لديك حساب؟{" "}
              <Link to={`/signup?role=${role}`} className="text-invest-teal font-bold hover:underline">
                تسجيل جديد
              </Link>
            </p>
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-invest-blue to-invest-teal p-12">
          <div className="text-center">
            <div className="mb-8 text-white">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <span className="text-6xl">📈</span>
              </div>
              <h2 className="font-cairo text-3xl font-bold mb-4">مرحباً بك مجدداً</h2>
              <p className="font-cairo text-lg text-white/90 max-w-sm mx-auto">نحن بانتظارك لاستكمال رحلتك الاستثمارية معنا</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
