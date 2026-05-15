import { MessageCircle, Send, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getSafeUser, isSupabaseConfigured, supabase } from "@/lib/supabase";

type ForumMessage = {
  id: number;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
};

type ForumStorageMode = "community_table" | "messages_fallback" | "local_fallback";

const COMMUNITY_PREFIX = "[منتدى] ";
const LOCAL_FORUM_STORAGE_KEY = "community_support_local_messages";

const formatTime = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const loadLocalForumMessages = (): ForumMessage[] => {
  const raw = localStorage.getItem(LOCAL_FORUM_STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as ForumMessage[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveLocalForumMessages = (items: ForumMessage[]) => {
  localStorage.setItem(LOCAL_FORUM_STORAGE_KEY, JSON.stringify(items));
};

const mergeForumMessages = (primary: ForumMessage[], secondary: ForumMessage[]) => {
  const map = new Map<string, ForumMessage>();

  [...secondary, ...primary].forEach((item) => {
    const key = `${item.senderId}|${item.createdAt}|${item.content}`;
    map.set(key, item);
  });

  return Array.from(map.values()).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
};

export default function CommunitySupportPage() {
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState("عضو المنصة");
  const [messages, setMessages] = useState<ForumMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [pageNotice, setPageNotice] = useState("");
  const [storageMode, setStorageMode] = useState<ForumStorageMode>("community_table");
  const [dashboardLink, setDashboardLink] = useState<{ to: string; label: string }>({
    to: "/investor-dashboard",
    label: "لوحة المستثمر",
  });

  const loadForumMessages = async (silent = false) => {
    if (storageMode === "local_fallback" && silent) {
      setMessages(loadLocalForumMessages());
      setLoading(false);
      return;
    }

    if (!isSupabaseConfigured) {
      setStorageMode("local_fallback");
      setMessages(loadLocalForumMessages());
      if (!silent) {
        setPageNotice("المنتدى يعمل حالياً بوضع محلي بسبب عدم اكتمال ربط قاعدة البيانات.");
      }
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("community_support_messages")
      .select("id, sender_id, sender_name, content, created_at")
      .order("created_at", { ascending: true })
      .limit(400);

    if (!error) {
      setStorageMode("community_table");
      const remoteItems: ForumMessage[] = (data ?? []).map((item) => ({
        id: item.id,
        senderId: item.sender_id,
        senderName: item.sender_name || "عضو المنصة",
        content: item.content,
        createdAt: item.created_at,
      }));
      const mergedItems = mergeForumMessages(remoteItems, loadLocalForumMessages());
      setMessages(mergedItems);
      saveLocalForumMessages(mergedItems);
      setLoading(false);
      return;
    }

    if (error.code === "PGRST205") {
      const { data: fallbackRows, error: fallbackError } = await supabase
        .from("messages")
        .select("id, sender_id, content, created_at")
        .like("content", `${COMMUNITY_PREFIX}%`)
        .order("created_at", { ascending: true })
        .limit(400);

      if (fallbackError) {
        setStorageMode("local_fallback");
        const localItems = loadLocalForumMessages();
        setMessages(localItems);
        if (!silent) {
          setPageNotice("تم تشغيل المنتدى بوضع محلي بسبب صلاحيات قاعدة البيانات.");
        }
        setLoading(false);
        return;
      }

      const senderIds = [...new Set((fallbackRows ?? []).map((row) => row.sender_id))];
      const senderNames = new Map<string, string>();

      if (senderIds.length) {
        const { data: profiles } = await supabase.from("profiles").select("id, full_name").in("id", senderIds);
        (profiles ?? []).forEach((profile) => senderNames.set(profile.id, profile.full_name || "عضو المنصة"));
      }

      setStorageMode("messages_fallback");
      if (!silent) {
        setPageNotice("تم تشغيل المنتدى عبر وضع التوافق، والرسائل تعمل الآن بشكل حقيقي.");
      }
      const fallbackItems: ForumMessage[] = (fallbackRows ?? []).map((item) => ({
        id: item.id,
        senderId: item.sender_id,
        senderName: senderNames.get(item.sender_id) || "عضو المنصة",
        content: String(item.content || "").replace(COMMUNITY_PREFIX, ""),
        createdAt: item.created_at,
      }));
      const mergedItems = mergeForumMessages(fallbackItems, loadLocalForumMessages());
      setMessages(mergedItems);
      saveLocalForumMessages(mergedItems);
      setLoading(false);
      return;
    }

    setStorageMode("local_fallback");
    const localItems = loadLocalForumMessages();
    setMessages(localItems);
    if (!silent) {
      setPageNotice("تم تشغيل المنتدى بوضع محلي بسبب صلاحيات قاعدة البيانات.");
    }
    setLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      if (!isSupabaseConfigured) {
        setPageNotice("ربط قاعدة البيانات غير مكتمل حالياً.");
        setLoading(false);
        return;
      }

      const { user } = await getSafeUser();

      if (!user) {
        toast.error("يجب تسجيل الدخول للدخول إلى منتدي الدعم المجتمعي.");
        navigate("/login");
        return;
      }

      setCurrentUserId(user.id);

      const { data: profile } = await supabase.from("profiles").select("full_name, role").eq("id", user.id).single();
      const senderName = profile?.full_name?.trim() || user.email || "عضو المنصة";

      if (profile?.role === "entrepreneur") {
        setDashboardLink({ to: "/dashboard", label: "لوحة رائد الأعمال" });
      } else {
        setDashboardLink({ to: "/investor-dashboard", label: "لوحة المستثمر" });
      }
      setCurrentUserName(senderName);

      await loadForumMessages();
    };

    init();
  }, []);

  useEffect(() => {
    if (!currentUserId) return;

    const intervalId = setInterval(() => {
      loadForumMessages(true);
    }, 4000);

    return () => clearInterval(intervalId);
  }, [currentUserId, storageMode]);

  const canSend = useMemo(() => Boolean(newMessage.trim()) && !sending, [newMessage, sending]);

  const handleSendMessage = async () => {
    if (!currentUserId || !newMessage.trim()) return;
    if (!isSupabaseConfigured) return;

    setSending(true);

    if (storageMode === "community_table") {
      const payload = {
        sender_id: currentUserId,
        sender_name: currentUserName,
        content: newMessage.trim(),
      };

      const { data, error } = await supabase
        .from("community_support_messages")
        .insert(payload)
        .select("id, sender_id, sender_name, content, created_at")
        .single();

      setSending(false);

      if (error || !data) {
        setPageNotice("تعذر إرسال الرسالة. تأكد من وجود جدول community_support_messages وصلاحياته.");
        return;
      }

      setMessages((prev) => {
        const next = [
          ...prev,
          {
            id: data.id,
            senderId: data.sender_id,
            senderName: data.sender_name || currentUserName,
            content: data.content,
            createdAt: data.created_at,
          },
        ];
        saveLocalForumMessages(next);
        return next;
      });
      setNewMessage("");
      return;
    }

    if (storageMode === "messages_fallback") {
      const fallbackPayload = {
        sender_id: currentUserId,
        receiver_id: currentUserId,
        content: `${COMMUNITY_PREFIX}${newMessage.trim()}`,
      };

      const { data: fallbackData, error: fallbackError } = await supabase
        .from("messages")
        .insert(fallbackPayload)
        .select("id, sender_id, content, created_at")
        .single();

      setSending(false);

      if (fallbackError || !fallbackData) {
        const localMessage: ForumMessage = {
          id: Date.now(),
          senderId: currentUserId,
          senderName: currentUserName,
          content: newMessage.trim(),
          createdAt: new Date().toISOString(),
        };
        setStorageMode("local_fallback");
        setPageNotice("تم الإرسال بوضع محلي بسبب صلاحيات جدول messages.");
        setMessages((prev) => {
          const next = [...prev, localMessage];
          saveLocalForumMessages(next);
          return next;
        });
        setNewMessage("");
        return;
      }

      setMessages((prev) => {
        const next = [
          ...prev,
          {
            id: fallbackData.id,
            senderId: fallbackData.sender_id,
            senderName: currentUserName,
            content: String(fallbackData.content || "").replace(COMMUNITY_PREFIX, ""),
            createdAt: fallbackData.created_at,
          },
        ];
        saveLocalForumMessages(next);
        return next;
      });
      setNewMessage("");
      return;
    }

    setSending(false);
    const localMessage: ForumMessage = {
      id: Date.now(),
      senderId: currentUserId,
      senderName: currentUserName,
      content: newMessage.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => {
      const next = [...prev, localMessage];
      saveLocalForumMessages(next);
      return next;
    });
    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-light-gray" dir="rtl">
      <header className="bg-white border-b border-light-gray">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <h1 className="font-cairo text-2xl font-bold text-invest-blue">منتدي الدعم المجتمعي</h1>
              <p className="font-cairo text-sm text-dark-gray">مجموعة مفتوحة لأعضاء المنصة لطرح الأسئلة وتبادل النصائح مجاناً.</p>
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

      <main className="max-w-6xl mx-auto p-6">
        {!!pageNotice && (
          <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 text-amber-800 font-cairo text-sm p-3">{pageNotice}</div>
        )}

        <div className="bg-white rounded-2xl border border-light-gray shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-light-gray flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-emerald-700" />
            <p className="font-cairo text-sm text-dark-gray">الدردشة الجماعية للأعضاء</p>
          </div>

          <div className="h-[58vh] overflow-y-auto p-4 space-y-3 bg-[linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)]">
            {loading ? (
              <p className="font-cairo text-sm text-dark-gray">جاري تحميل الرسائل...</p>
            ) : messages.length ? (
              messages.map((msg) => {
                const mine = msg.senderId === currentUserId;
                return (
                  <div key={msg.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm ${mine ? "bg-emerald-600 text-white" : "bg-white border border-light-gray text-text-dark"}`}>
                      <div className={`font-cairo text-[11px] mb-1 ${mine ? "text-emerald-100" : "text-dark-gray"}`}>
                        {msg.senderName}
                      </div>
                      <p className="font-cairo text-sm leading-7 whitespace-pre-wrap">{msg.content}</p>
                      <p className={`font-cairo text-[10px] mt-1 text-left ${mine ? "text-emerald-100" : "text-dark-gray"}`}>
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="font-cairo text-sm text-dark-gray">لا توجد رسائل بعد. ابدأ بسؤال أو نصيحة لدعم المجتمع.</p>
            )}
          </div>

          <div className="p-4 border-t border-light-gray bg-white">
            <div className="flex gap-2 items-end">
              <textarea
                rows={2}
                value={newMessage}
                onChange={(event) => setNewMessage(event.target.value)}
                placeholder="اكتب سؤالك أو نصيحتك للمجتمع..."
                className="flex-1 border border-light-gray rounded-xl px-4 py-3 font-cairo text-sm resize-none focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!canSend}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 text-white font-cairo font-bold text-sm hover:bg-emerald-700 transition disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                إرسال
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
