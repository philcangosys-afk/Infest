import { RequestHandler } from "express";

type AdvisorRole = "investor" | "entrepreneur";

type AdvisorRequestBody = {
  role?: AdvisorRole;
  service?: string;
  fileName?: string;
  projectSummary?: string;
  question?: string;
  previousAnalysis?: string;
  pdfExtractedText?: string;
  pdfDetectedNumbers?: string[];
  currencyHint?: { code?: string; label?: string };
};

const detectPreferredCurrency = (text: string) => {
  const normalized = text.toLowerCase();

  if (/\b(sdg|sudanese pound|ج\.?\s*س|جنيه\s*سوداني|جنيه سوداني)\b/i.test(normalized)) {
    return { code: "SDG", label: "الجنيه السوداني (ج.س)" };
  }

  if (/\b(usd|us\s*dollar|دولار|\$)\b/i.test(normalized)) {
    return { code: "USD", label: "الدولار الأمريكي (USD)" };
  }

  if (/\b(sar|ريال\s*سعودي|ريال)\b/i.test(normalized)) {
    return { code: "SAR", label: "الريال السعودي (SAR)" };
  }

  if (/\b(aed|درهم\s*إماراتي|درهم)\b/i.test(normalized)) {
    return { code: "AED", label: "الدرهم الإماراتي (AED)" };
  }

  if (/\b(egp|جنيه\s*مصري)\b/i.test(normalized)) {
    return { code: "EGP", label: "الجنيه المصري (EGP)" };
  }

  return { code: "SDG", label: "الجنيه السوداني (ج.س)" };
};

const normalizeResultCurrency = (result: string, currencyCode: string) => {
  if (currencyCode !== "SDG") return result;

  return result
    .replace(/\bUSD\b/gi, "ج.س")
    .replace(/\bUS\s*DOLLAR\b/gi, "ج.س")
    .replace(/\$/g, "ج.س")
    .replace(/دولار\s*أمريكي/g, "ج.س")
    .replace(/دولار/g, "ج.س");
};

const getServiceTitle = (role: AdvisorRole, service: string) => {
  if (role === "investor") {
    if (service === "feasibility") return "تحليل جدوى مشروع";
    if (service === "risk") return "تقييم مخاطر الاستثمار";
    if (service === "returns") return "حساب العائد المتوقع";
    if (service === "business_model") return "نموذج العمل";
  }

  if (role === "entrepreneur") {
    if (service === "pitch") return "تحسين عرض المشروع";
    if (service === "financial") return "خطة مالية أولية";
    if (service === "business_model") return "نموذج العمل";
  }

  return "خدمة مستشار ذكي";
};

const getServiceGuidance = (role: AdvisorRole, service: string) => {
  if (role === "investor" && service === "feasibility") {
    return [
      "المطلوب هو مراجعة شاملة للمشروع من منظور المستثمر وليس إجابة عامة.",
      "قدّم النتيجة بهذه العناوين وبالترتيب:",
      "1) ملخص تنفيذي واضح للمشروع وفكرته وقيمته الاستثمارية.",
      "2) الفائدة المتوقعة للمستثمر (مصادر الربح وفرص النمو).",
      "3) نقاط القوة.",
      "4) نقاط الضعف.",
      "5) البيئة المحيطة (السوق، المنافسة، العوامل التنظيمية/القانونية، التوريد والتشغيل).",
      "6) النواقص في الدراسة الحالية (البيانات أو الافتراضات غير الموجودة).",
      "7) قرار مبدئي: مناسب/بحاجة تحسين/غير مناسب مع سبب مختصر.",
      "إذا كانت البيانات ناقصة، لا تخترع معلومات. اذكر النقص صراحة كقائمة تحقق مطلوبة قبل قرار الاستثمار.",
    ].join("\n");
  }

  if (role === "investor" && service === "risk") {
    return "ركّز على المخاطر التشغيلية والمالية والسوقية والقانونية، مع درجة خطورة لكل بند وخطة تخفيف عملية.";
  }

  if (role === "investor" && service === "returns") {
    return "قدّم تصوراً واضحاً للعائد المتوقع وفق سيناريو متحفظ وسيناريو مرجح، مع توضيح الافتراضات والنواقص المؤثرة على دقة التقدير.";
  }

  if (service === "business_model") {
    return [
      "المطلوب: استخلاص نموذج العمل من دراسة الجدوى بشكل عملي ومتكامل مع أرقام فعلية من النص المرفوع.",
      "ابدأ بتوضيح معنى استخلاص نموذج العمل في سطرين: أي تحويل معلومات الدراسة إلى طريقة واضحة لكيفية خلق القيمة وتحقيق الإيراد واستدامة التشغيل.",
      "قدّم النتيجة بهذه العناوين وبالترتيب:",
      "1) ملخص فكرة المشروع وعرض القيمة (Value Proposition).",
      "2) شرائح العملاء المستهدفة (من هم العملاء الأساسيون والثانويون).",
      "3) قنوات الوصول والتوزيع وخطة الخدمة.",
      "4) هيكل الإيرادات بالأرقام: رسوم المعاملات (نسبة/قيمة)، رسوم الإدارة، رسوم الأداء، الاشتراكات، العمولات، ومجموع الإيراد الشهري/السنوي المتوقع.",
      "5) هيكل التكاليف بالأرقام: التكاليف الثابتة والمتغيرة والتكاليف الرأسمالية، مع إجمالي شهري وسنوي.",
      "6) توقعات مالية: صافي الربح المتوقع، نقطة التعادل، وهامش الربح مع افتراضات واضحة.",
      "7) الأنشطة الرئيسية والموارد الرئيسية والشركاء الرئيسيون.",
      "8) المؤشرات الأساسية (KPIs) الرقمية لمتابعة نجاح نموذج العمل.",
      "9) المخاطر أو الفجوات في نموذج العمل وما المطلوب استكماله.",
      "10) نموذج عمل مقترح نهائي مختصر بصيغة تنفيذية قابلة للعرض على الإدارة أو المستثمر.",
      "11) جدول حسابات واضح بصيغة (المعادلة = الناتج) لثلاثة بنود على الأقل.",
      "اعتمد أولاً على أرقام الدراسة المرفوعة والإشارات المالية المستخرجة. إذا غاب رقم حرج، أنشئ تقديراً محافظاً مع توضيح أنه [افتراض] ثم اكمل الحسابات بأرقام فعلية.",
      "ممنوع الاكتفاء بعبارات: غير متوفر فقط. لازم تقدم أرقام نهائية مع تمييز الأرقام الافتراضية بوضوح.",
      "صيغة العملة إلزامية: اكتب كل المبالغ بنفس العملة المستخرجة من ملف PDF، وإن لم تظهر عملة واضحة استخدم الجنيه السوداني (ج.س).",
    ].join("\n");
  }

  if (role === "entrepreneur" && service === "pitch") {
    return [
      "المطلوب: شرح معنى تحسين عرض المشروع بشكل عملي وليس مجرد إعادة صياغة عامة.",
      "قدّم النتيجة بهذه العناوين:",
      "1) الفكرة الحالية للمشروع بصياغة بسيطة وواضحة.",
      "2) كيف يرتّب رائد الأعمال العرض (المشكلة → الحل → السوق → نموذج الربح → الخطة التنفيذية).",
      "3) النواقص في العرض الحالي (بيانات مفقودة أو نقاط غير مقنعة).",
      "4) نسخة محسّنة مقترحة لفقرة عرض قصيرة يمكن تقديمها للمستثمر.",
      "5) توصيات مباشرة قبل إرسال العرض للمستثمرين.",
      "إذا كانت المعلومات ناقصة اذكرها كقائمة مطلوبة بوضوح.",
    ].join("\n");
  }

  if (role === "entrepreneur" && service === "financial") {
    return [
      "المطلوب: مراجعة الدراسة المالية داخل المشروع وإظهار الملاحظات بوضوح.",
      "قدّم النتيجة بهذه العناوين:",
      "1) تقييم هيكل التكاليف (ثابتة/متغيرة) وما إذا كان كاملًا.",
      "2) تقييم الإيرادات المتوقعة ومنطق الافتراضات.",
      "3) ملاحظات على الربحية ونقطة التعادل والتدفق النقدي.",
      "4) المخاطر المالية (نقص سيولة، تقدير مبيعات مبالغ، مصروفات غير محسوبة...).",
      "5) النواقص في الدراسة المالية (أرقام أو افتراضات أو جداول غير موجودة).",
      "6) تحسينات عملية مباشرة على الدراسة المالية قبل عرضها على المستثمر.",
      "لا تخترع أرقاماً غير موجودة. عند نقص البيانات اذكر ما يجب توفيره تحديداً.",
    ].join("\n");
  }

  return "قدّم إجابة عملية دقيقة ومباشرة.";
};

export const handleAiAdvisor: RequestHandler = async (req, res) => {
  const incomingBody = req.body as unknown;

  let body: AdvisorRequestBody = {};

  try {
    if (Buffer.isBuffer(incomingBody)) {
      body = JSON.parse(incomingBody.toString("utf8")) as AdvisorRequestBody;
    } else if (
      incomingBody &&
      typeof incomingBody === "object" &&
      "type" in incomingBody &&
      "data" in incomingBody &&
      (incomingBody as { type?: string }).type === "Buffer" &&
      Array.isArray((incomingBody as { data?: unknown }).data)
    ) {
      body = JSON.parse(
        Buffer.from((incomingBody as { data: number[] }).data).toString("utf8"),
      ) as AdvisorRequestBody;
    } else if (typeof incomingBody === "string") {
      body = JSON.parse(incomingBody) as AdvisorRequestBody;
    } else if (incomingBody && typeof incomingBody === "object") {
      body = incomingBody as AdvisorRequestBody;
    }
  } catch {
    res.status(400).json({ error: "Invalid JSON body" });
    return;
  }

  const role = body.role;
  const service = body.service;

  if (!role || !service) {
    res.status(400).json({ error: "role and service are required" });
    return;
  }

  const allowedServices: Record<AdvisorRole, string[]> = {
    investor: ["feasibility", "risk", "returns", "business_model"],
    entrepreneur: ["pitch", "financial", "business_model"],
  };

  if (!allowedServices[role].includes(service)) {
    res.status(400).json({ error: "Invalid service for role" });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error: "OPENAI_API_KEY is missing on the server",
    });
    return;
  }

  const serviceTitle = getServiceTitle(role, service);
  const serviceGuidance = getServiceGuidance(role, service);
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  const isFollowup = Boolean(body.question?.trim() && body.previousAnalysis?.trim());

  const systemPrompt = isFollowup
    ? "أنت مستشار ذكي وتجيب فقط على السؤال الإضافي للمستخدم بشكل مباشر ومختصر. ممنوع إعادة التقرير الكامل أو تكرار التحليل السابق."
    : service === "business_model"
      ? "أنت مستشار نماذج أعمال وتمويل احترافي. مهمتك تقديم نموذج عمل رقمي متكامل دائمًا ومهما كانت البيانات. استخدم أولًا الأرقام الموجودة في النص المستخرج أو الملخص. إذا لم تتوفر أرقام صريحة، استنتج تقديرات منطقية بناءً على نوع المشروع والقطاع وحجم الفكرة، مع وضع علامة [افتراض] أمام كل رقم تقديري وشرح موجز لمنطق الحساب. ممنوع منعًا باتًا الاعتذار أو قول (لم أتمكن من الاستخراج) أو إرجاع جدول فارغ. يجب إخراج جداول إيرادات وتكاليف شهرية وسنوية بأرقام نهائية وحسابات صريحة في كل الحالات."
      : role === "investor"
        ? "أنت مستشار استثماري محترف لمنصة عربية. قدم إجابة دقيقة ومباشرة ومنظمة بنقاط واضحة وعناوين قصيرة."
        : "أنت مستشار أعمال وتمويل محترف لرواد الأعمال. قدم خطة عملية قابلة للتنفيذ باللغة العربية وبأسلوب واضح.";

  const extractedDocumentText = body.pdfExtractedText?.trim();
  const detectedFinancialSignals = (body.pdfDetectedNumbers ?? []).slice(0, 80);
  const currencySourceText = `${body.projectSummary ?? ""}\n${extractedDocumentText ?? ""}`;
  const detectedCurrency = detectPreferredCurrency(currencySourceText);
  const hintedCurrencyCode = (body.currencyHint?.code || "").toUpperCase();
  const preferredCurrency = hintedCurrencyCode && ["SDG", "USD", "SAR", "AED", "EGP"].includes(hintedCurrencyCode)
    ? {
        code: hintedCurrencyCode,
        label:
          hintedCurrencyCode === "SDG"
            ? "الجنيه السوداني (ج.س)"
            : hintedCurrencyCode === "USD"
              ? "الدولار الأمريكي (USD)"
              : hintedCurrencyCode === "SAR"
                ? "الريال السعودي (SAR)"
                : hintedCurrencyCode === "AED"
                  ? "الدرهم الإماراتي (AED)"
                  : "الجنيه المصري (EGP)",
      }
    : detectedCurrency;

  const userPrompt = isFollowup
    ? [
        `نوع المستخدم: ${role === "investor" ? "مستثمر" : "رائد أعمال"}`,
        `الخدمة المطلوبة: ${serviceTitle}`,
        `التحليل السابق (مرجع):\n${body.previousAnalysis}`,
        `السؤال الإضافي المطلوب الرد عليه فقط:\n${body.question}`,
        "أجب على السؤال فقط بشكل مباشر (3-6 نقاط كحد أقصى) بدون إعادة التقرير الكامل.",
      ].join("\n\n")
    : [
        `نوع المستخدم: ${role === "investor" ? "مستثمر" : "رائد أعمال"}`,
        `الخدمة المطلوبة: ${serviceTitle}`,
        body.fileName ? `اسم ملف PDF المرفوع: ${body.fileName}` : "لا يوجد ملف مرفوع.",
        body.projectSummary ? `ملخص المشروع:\n${body.projectSummary}` : "لا يوجد ملخص مشروع.",
        extractedDocumentText
          ? `نص مستخرج من دراسة الجدوى (مرجع رئيسي للأرقام):\n${extractedDocumentText.slice(0, 16000)}`
          : "تعذر استخراج نص كافٍ من ملف PDF. اعتمد على اسم الملف ونوع المشروع والملخص لاستنتاج نموذج عمل رقمي كامل بافتراضات محافظة واضحة المعلَّمة بـ [افتراض]، ولا تعتذر ولا ترفض الإجابة.",
        detectedFinancialSignals.length
          ? `إشارات مالية رقمية مستخرجة مباشرة من الدراسة:\n- ${detectedFinancialSignals.join("\n- ")}`
          : "لا توجد إشارات رقمية كافية مستخرجة تلقائياً.",
        body.question ? `سؤال المستخدم:\n${body.question}` : "",
        `العملة المطلوب الالتزام بها في جميع الأرقام: ${preferredCurrency.label}`,
        "قاعدة إلزامية للعملة: استخدم نفس العملة الموجودة في ملف PDF. إذا لم تظهر عملة بوضوح فاعتمد الجنيه السوداني (ج.س). ممنوع خلط العملات داخل نفس الجواب.",
        `تعليمات أسلوب التحليل:\n${serviceGuidance}`,
        service === "business_model"
          ? "في خدمة نموذج العمل: أخرج جداول رقمية نهائية (إيرادات/تكاليف/ربحية) مع مبالغ شهرية وسنوية وحسابات صريحة. ممنوع تمامًا الاكتفاء بالسرد أو إرجاع رسالة اعتذار. إذا غابت الأرقام في النص استنتجها كافتراضات محافظة [افتراض] واملأ الجداول."
          : "اختم بخطوات عملية تالية قابلة للتنفيذ.",
      ]
        .filter(Boolean)
        .join("\n\n");

  try {
    const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.4,
      }),
    });

    if (!openAiResponse.ok) {
      const errorText = await openAiResponse.text();
      res.status(500).json({ error: `OpenAI request failed: ${errorText}` });
      return;
    }

    const data = (await openAiResponse.json()) as {
      choices?: { message?: { content?: string } }[];
    };

    const rawResult = data.choices?.[0]?.message?.content?.trim() || "لم يتمكن المستشار الذكي من إرجاع نتيجة.";
    const result = normalizeResultCurrency(rawResult, preferredCurrency.code);

    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown server error",
    });
  }
};
