import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { TrendingUp, Eye, EyeOff, Check } from "lucide-react";
import { useRef, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export default function SignUpStep1() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") === "entrepreneur" ? "entrepreneur" : "investor";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAddUserHint, setShowAddUserHint] = useState(false);
  const [showPoliciesModal, setShowPoliciesModal] = useState(false);
  const [hasReachedPolicyEnd, setHasReachedPolicyEnd] = useState(false);
  const policyScrollRef = useRef<HTMLDivElement | null>(null);

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    let strength = 0;
    if (value.length >= 8) strength++;
    if (/[A-Z]/.test(value)) strength++;
    if (/[0-9]/.test(value)) strength++;
    if (/[^A-Za-z0-9]/.test(value)) strength++;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-invest-red";
    if (passwordStrength <= 2) return "bg-invest-orange";
    return "bg-invest-green";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return "ضعيفة";
    if (passwordStrength <= 2) return "متوسطة";
    return "قوية";
  };

  const handlePolicyScroll = () => {
    const container = policyScrollRef.current;
    if (!container) return;

    const reachedEnd = container.scrollTop + container.clientHeight >= container.scrollHeight - 12;
    if (reachedEnd) {
      setHasReachedPolicyEnd(true);
    }
  };

  const acceptPolicies = () => {
    setAgreeTerms(true);
    setShowPoliciesModal(false);
    setErrorMessage("");
  };

  const handleSignUp = async () => {
    setErrorMessage("");
    setShowAddUserHint(false);

    if (!isSupabaseConfigured) {
      setErrorMessage("ربط قاعدة البيانات غير مكتمل حالياً.");
      return;
    }

    if (!fullName || !email || !phone || !city || !address || !password) {
      setErrorMessage("يرجى إكمال جميع الحقول المطلوبة.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("كلمة المرور وتأكيد كلمة المرور غير متطابقين.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("كلمة المرور يجب أن تكون 6 أحرف على الأقل.");
      return;
    }

    if (!agreeTerms) {
      setErrorMessage("يجب الموافقة على الشروط والأحكام.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          full_name: fullName,
          phone,
          city,
          address,
        },
      },
    });

    if (error || !data.user) {
      setLoading(false);

      if (error?.code === "weak_password") {
        setErrorMessage("كلمة المرور ضعيفة. يجب أن تكون 6 أحرف على الأقل.");
        return;
      }

      if (error?.message?.toLowerCase().includes("already registered")) {
        setErrorMessage("هذا البريد الإلكتروني مسجل مسبقاً. جرّب تسجيل الدخول.");
        return;
      }

      if (error?.code === "over_email_send_rate_limit" || error?.message?.toLowerCase().includes("email rate limit exceeded")) {
        setShowAddUserHint(true);
        setErrorMessage(
          "تم تجاوز حد إرسال بريد التحقق في Supabase. الحساب الجديد لم يُنشأ بعد. أنشئ المستخدم من Supabase Authentication → Users → Add user ثم ادخل من صفحة تسجيل الدخول.",
        );
        return;
      }

      setErrorMessage(error?.message ? `تعذر إنشاء الحساب: ${error.message}` : "تعذر إنشاء الحساب. حاول مرة أخرى.");
      return;
    }

    const hasSession = Boolean(data.session);

    if (!hasSession) {
      setLoading(false);
      navigate(`/login?role=${role}`);
      return;
    }

    const { error: profileError } = await supabase.from("profiles").upsert({
      id: data.user.id,
      role,
      full_name: fullName,
      phone,
      city,
      address,
      investor_type: role === "investor" ? "مستثمر فردي" : null,
      main_sector: role === "entrepreneur" ? "غير محدد" : null,
      project_stage: role === "entrepreneur" ? "غير محدد" : null,
      profile_data_complete: true,
      kyc_complete: false,
      national_id_uploaded: false,
      personal_photo_uploaded: false,
    });

    if (profileError) {
      setLoading(false);
      setErrorMessage(profileError.message ? `تم إنشاء الحساب لكن تعذر حفظ الملف الشخصي: ${profileError.message}` : "تم إنشاء الحساب لكن تعذر حفظ الملف الشخصي.");
      return;
    }

    setLoading(false);
    navigate(role === "entrepreneur" ? "/dashboard" : "/investor-dashboard");
  };

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        <div className="flex flex-col justify-center px-8 sm:px-12 py-12">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-invest-teal rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="font-cairo font-bold text-lg text-invest-blue">Nile Invest AI</span>
          </Link>

          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="font-cairo text-sm font-bold text-invest-teal uppercase tracking-widest bg-invest-teal/10 px-4 py-2 rounded-full inline-block mb-4">
                  📝 الخطوة 1 من 3
                </span>
                <h1 className="font-cairo text-4xl sm:text-5xl font-bold text-invest-blue mt-3">إنشاء حساب جديد</h1>
              </div>
            </div>
            <div>
              <div className="h-3 bg-light-gray rounded-full overflow-hidden shadow-sm">
                <div className="h-full w-1/3 bg-gradient-to-r from-invest-teal to-invest-teal/90 rounded-full transition-all duration-300"></div>
              </div>
              <p className="font-cairo text-sm text-dark-gray mt-4 font-semibold">البيانات الأساسية • 25%</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <label className="font-cairo block text-sm font-bold text-text-dark mb-3 uppercase tracking-wide">الاسم الكامل</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="أدخل اسمك الكامل"
                className="w-full px-6 py-4 border-2 border-light-gray rounded-xl focus:border-invest-teal focus:bg-white focus:outline-none font-cairo text-sm transition-all duration-200 shadow-sm"
              />
            </div>

            <div>
              <label className="font-cairo block text-sm font-bold text-text-dark mb-3 uppercase tracking-wide">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full px-6 py-4 border-2 border-light-gray rounded-xl focus:border-invest-teal focus:bg-white focus:outline-none font-cairo text-sm transition-all duration-200 shadow-sm"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="font-cairo block text-sm font-bold text-text-dark mb-3 uppercase tracking-wide">رقم الهاتف</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+249..."
                  className="w-full px-6 py-4 border-2 border-light-gray rounded-xl focus:border-invest-teal focus:bg-white focus:outline-none font-cairo text-sm transition-all duration-200 shadow-sm"
                />
              </div>
              <div>
                <label className="font-cairo block text-sm font-bold text-text-dark mb-3 uppercase tracking-wide">المدينة</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="الخرطوم"
                  className="w-full px-6 py-4 border-2 border-light-gray rounded-xl focus:border-invest-teal focus:bg-white focus:outline-none font-cairo text-sm transition-all duration-200 shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="font-cairo block text-sm font-bold text-text-dark mb-3 uppercase tracking-wide">العنوان</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="أدخل العنوان"
                className="w-full px-6 py-4 border-2 border-light-gray rounded-xl focus:border-invest-teal focus:bg-white focus:outline-none font-cairo text-sm transition-all duration-200 shadow-sm"
              />
            </div>

            <div>
              <label className="font-cairo block text-sm font-bold text-text-dark mb-3 uppercase tracking-wide">كلمة المرور</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="أدخل كلمة المرور"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
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

              {password && (
                <div className="mt-4">
                  <div className="h-2.5 bg-light-gray rounded-full overflow-hidden shadow-sm">
                    <div className={`h-full ${getPasswordStrengthColor()} rounded-full transition-all duration-300`} style={{ width: `${(passwordStrength / 4) * 100}%` }}></div>
                  </div>
                  <p className="font-cairo text-sm text-dark-gray mt-2 font-semibold">
                    قوة كلمة المرور: <span className="text-invest-teal">{getPasswordStrengthText()}</span>
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="font-cairo block text-sm font-bold text-text-dark mb-3 uppercase tracking-wide">تأكيد كلمة المرور</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="أعد إدخال كلمة المرور"
                  className="w-full px-6 py-4 pr-14 border-2 border-light-gray rounded-xl focus:border-invest-teal focus:bg-white focus:outline-none font-cairo text-sm transition-all duration-200 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-gray hover:text-invest-blue transition p-2 hover:bg-light-gray rounded-lg"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="p-5 bg-light-gray rounded-xl border-2 border-light-gray space-y-4">
              <p className="font-cairo text-sm text-dark-gray font-semibold leading-7">
                قبل إكمال التسجيل، يجب قراءة <span className="text-invest-teal font-bold">سياسات الخصوصية والسرية وعدم الإفشاء</span> كاملة ثم الضغط على "تم".
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowPoliciesModal(true);
                    setHasReachedPolicyEnd(false);
                  }}
                  className="px-4 py-2 rounded-lg border border-invest-teal text-invest-teal font-cairo font-bold hover:bg-invest-teal hover:text-white transition"
                >
                  عرض السياسات والخصوصية
                </button>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-cairo font-bold ${
                    agreeTerms ? "bg-invest-green/15 text-invest-green" : "bg-invest-orange/15 text-invest-orange"
                  }`}
                >
                  {agreeTerms ? "تمت الموافقة" : "موافقة مطلوبة"}
                </span>
              </div>
            </div>

            {errorMessage && (
              <div className="rounded-xl border border-invest-red/20 bg-invest-red/10 p-3 font-cairo text-sm text-invest-red">{errorMessage}</div>
            )}

            {showAddUserHint && (
              <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 font-cairo text-sm text-amber-800">
                <p>إذا أنشأت المستخدم يدويًا من Supabase، ادخل الآن من صفحة تسجيل الدخول.</p>
                <button
                  type="button"
                  onClick={() => navigate(`/login?role=${role}`)}
                  className="mt-2 px-4 py-2 rounded-lg border border-amber-500 text-amber-700 font-cairo font-semibold"
                >
                  الذهاب إلى تسجيل الدخول
                </button>
              </div>
            )}

            <button
              onClick={handleSignUp}
              disabled={loading || !agreeTerms}
              className="w-full py-4 bg-gradient-to-r from-invest-blue to-invest-blue/90 text-white rounded-xl font-cairo font-bold text-lg hover:shadow-xl transition-all duration-200 mt-8 shadow-lg hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
            >
              {loading ? "جاري إنشاء الحساب..." : "تسجيل"}
            </button>

            <p className="font-cairo text-center text-dark-gray text-lg">
              هل لديك حساب؟{" "}
              <Link to={`/login?role=${role}`} className="text-invest-teal font-bold hover:underline">
                تسجيل دخول
              </Link>
            </p>
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-invest-blue via-invest-blue to-invest-teal p-12">
          <div className="text-center text-white">
            <div className="relative mb-12">
              <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full"></div>
              <div className="relative">
                <div className="w-40 h-40 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
                  <span className="text-6xl">👤</span>
                </div>
              </div>
            </div>

            <h2 className="font-cairo text-3xl font-bold mb-6">كل فكرة عظيمة تستحق فرصة للنجاح!</h2>

            <div className="space-y-3 mt-8">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 flex-shrink-0" />
                <span className="font-cairo">آمان متقدم للبيانات</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 flex-shrink-0" />
                <span className="font-cairo">وسائل استثمارية حقيقية</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 flex-shrink-0" />
                <span className="font-cairo">نمو وتطور مستثمري</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPoliciesModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-light-gray" dir="rtl">
            <div className="px-6 py-5 border-b border-light-gray">
              <h2 className="font-cairo text-2xl font-bold text-invest-blue">سياسات الخصوصية والسرية وعدم الإفشاء</h2>
              <p className="font-cairo text-sm text-dark-gray mt-2">لإكمال التسجيل، يجب النزول إلى نهاية النص ثم الضغط على "تم".</p>
            </div>

            <div
              ref={policyScrollRef}
              onScroll={handlePolicyScroll}
              className="max-h-[52vh] overflow-y-auto px-6 py-5 space-y-5 font-cairo text-sm leading-8 text-text-dark"
            >
              <section>
                <h3 className="font-bold text-invest-blue mb-2">1) نطاق المنصة</h3>
                <p>
                  منصة Nile Invest AI تربط بين رواد الأعمال والمستثمرين والمستشار الذكي لتقييم فرص الاستثمار بشكل احترافي، مع احترام كامل للخصوصية
                  والالتزامات القانونية والأخلاقية بين جميع الأطراف.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-invest-blue mb-2">2) سرية المعلومات وعدم الإفشاء</h3>
                <p>
                  يلتزم كل طرف بعدم إفشاء أو نشر أو إعادة استخدام أي بيانات أو مستندات أو دراسات أو محادثات أو تحليلات تخص الطرف الآخر خارج المنصة
                  أو خارج غرض التقييم الاستثماري. ويشمل ذلك بيانات الهوية، البيانات المالية، خطة المشروع، والمراسلات.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-invest-blue mb-2">3) التزامات رائد الأعمال</h3>
                <ul className="list-disc pr-6 space-y-1">
                  <li>تقديم معلومات صحيحة ومحدثة وغير مضللة.</li>
                  <li>عدم نشر مستندات يملكها طرف آخر دون إذن رسمي.</li>
                  <li>احترام سرية المستثمرين والمستشار وعدم مشاركة ردودهم خارجيًا دون موافقة.</li>
                </ul>
              </section>

              <section>
                <h3 className="font-bold text-invest-blue mb-2">4) التزامات المستثمر</h3>
                <ul className="list-disc pr-6 space-y-1">
                  <li>استخدام المعلومات لأغراض التقييم والقرار الاستثماري فقط.</li>
                  <li>عدم استغلال بيانات المشاريع أو نسخ الأفكار أو مشاركة الدراسة دون تفويض.</li>
                  <li>الالتزام بالتواصل المهني وعدم طلب بيانات شخصية خارج إطار المنصة إلا بموافقة صريحة.</li>
                </ul>
              </section>

              <section>
                <h3 className="font-bold text-invest-blue mb-2">5) دور المستشار الذكي وحدود استخدامه</h3>
                <p>
                  التحليلات الصادرة من المستشار الذكي هي دعم مهني لاتخاذ القرار وليست ضمانًا نهائيًا للربح أو النجاح. يتحمل كل مستخدم مسؤولية التحقق
                  النهائي من البيانات والقرارات المالية والقانونية قبل التنفيذ.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-invest-blue mb-2">6) حماية الحساب والبيانات</h3>
                <ul className="list-disc pr-6 space-y-1">
                  <li>كل مستخدم مسؤول عن حماية كلمة المرور وعدم مشاركتها.</li>
                  <li>تُحفظ البيانات ضمن بنية آمنة، مع منع الوصول غير المصرح به وفق السياسات الفنية المعتمدة.</li>
                  <li>يجوز تعليق أي حساب يثبت إساءة استخدام البيانات أو محاولة الوصول غير المشروع.</li>
                </ul>
              </section>

              <section>
                <h3 className="font-bold text-invest-blue mb-2">7) فائدة المستخدم من المنصة</h3>
                <p>
                  باستخدام المنصة يحصل المستخدم على مساحة منظمة لعرض المشاريع، تقييم الفرص، إدارة طلبات التواصل، والاستفادة من تحليل ذكي يساعد على
                  رفع جودة القرار الاستثماري وتقليل المخاطر وتحسين جاهزية المشروع.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-invest-blue mb-2">8) الموافقة الملزمة</h3>
                <p>
                  بالضغط على "تم" فإنك تقر بأنك قرأت هذه السياسة كاملة وفهمت الالتزامات الخاصة بالخصوصية والسرية وعدم الإفشاء، وتوافق على الالتزام
                  بها عند استخدام المنصة.
                </p>
              </section>
            </div>

            <div className="px-6 py-4 border-t border-light-gray flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <p className="font-cairo text-xs text-dark-gray">
                {hasReachedPolicyEnd ? "تم الوصول إلى نهاية السياسة. يمكنك الضغط على تم." : "انزل إلى آخر النص لتفعيل زر تم."}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPoliciesModal(false)}
                  className="px-4 py-2 rounded-lg border border-light-gray text-dark-gray font-cairo font-semibold hover:bg-light-gray transition"
                >
                  إغلاق
                </button>
                <button
                  type="button"
                  onClick={acceptPolicies}
                  disabled={!hasReachedPolicyEnd}
                  className="px-5 py-2 rounded-lg bg-invest-teal text-white font-cairo font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  تم
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
