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
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  const systemPrompt =
    role === "investor"
      ? "أنت مستشار استثماري محترف لمنصة عربية. قدم إجابة دقيقة ومباشرة ومنظمة بنقاط واضحة وعناوين قصيرة."
      : "أنت مستشار أعمال وتمويل محترف لرواد الأعمال. قدم خطة عملية قابلة للتنفيذ باللغة العربية وبأسلوب واضح.";

  const userPrompt = [
    `نوع المستخدم: ${role === "investor" ? "مستثمر" : "رائد أعمال"}`,
    `الخدمة المطلوبة: ${serviceTitle}`,
    body.fileName ? `اسم ملف PDF المرفوع: ${body.fileName}` : "لا يوجد ملف مرفوع.",
    body.projectSummary ? `ملخص المشروع:\n${body.projectSummary}` : "لا يوجد ملخص مشروع.",
    body.previousAnalysis ? `نتيجة تحليل سابقة:\n${body.previousAnalysis}` : "",
    body.question ? `سؤال المستخدم:\n${body.question}` : "",
    "قدّم إجابة عملية مع توصيات قابلة للتنفيذ وخطوات لاحقة واضحة.",
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
