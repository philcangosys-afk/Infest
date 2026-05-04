import { RequestHandler } from "express";

type AdvisorRole = "investor" | "entrepreneur";

type AdvisorRequestBody = {
  role?: AdvisorRole;
  service?: string;
  fileName?: string;
  projectSummary?: string;
  question?: string;
  previousAnalysis?: string;
};

const getServiceTitle = (role: AdvisorRole, service: string) => {
  if (role === "investor") {
    if (service === "feasibility") return "تحليل جدوى مشروع";
    if (service === "risk") return "تقييم مخاطر الاستثمار";
    if (service === "returns") return "حساب العائد المتوقع";
  }

  if (role === "entrepreneur") {
    if (service === "pitch") return "تحسين عرض المشروع";
    if (service === "financial") return "خطة مالية أولية";
    if (service === "responses") return "الرد على المستثمرين";
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

  if (role === "entrepreneur" && service === "pitch") {
    return "أعد صياغة عرض المشروع بشكل إقناعي للمستثمرين مع تحسين المشكلة، الحل، السوق، الميزة التنافسية، ونموذج الربح.";
  }

  if (role === "entrepreneur" && service === "financial") {
    return "ابنِ إطار خطة مالية أولية: التكاليف، الإيرادات، نقطة التعادل، التدفق النقدي، والافتراضات الأساسية بشكل عملي.";
  }

  if (role === "entrepreneur" && service === "responses") {
    return "قدّم ردوداً احترافية مختصرة على أسئلة المستثمرين الصعبة مع لغة مقنعة وشفافة.";
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
    : role === "investor"
      ? "أنت مستشار استثماري محترف لمنصة عربية. قدم إجابة دقيقة ومباشرة ومنظمة بنقاط واضحة وعناوين قصيرة."
      : "أنت مستشار أعمال وتمويل محترف لرواد الأعمال. قدم خطة عملية قابلة للتنفيذ باللغة العربية وبأسلوب واضح.";

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
        body.question ? `سؤال المستخدم:\n${body.question}` : "",
        `تعليمات أسلوب التحليل:\n${serviceGuidance}`,
        "اختم بخطوات عملية تالية قابلة للتنفيذ.",
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

    const result = data.choices?.[0]?.message?.content?.trim();

    res.status(200).json({ result: result || "لم يتمكن المستشار الذكي من إرجاع نتيجة." });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown server error",
    });
  }
};
