import { useState, useEffect, useRef } from "react";
import { createConversation, getMessages, sendMessage } from "../services/mentorService";

function MessageBubble({ role, content }) {
  const isUser = role === "USER";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed whitespace-pre-line ${
          isUser
            ? "bg-white text-black"
            : "bg-[#1a1a1a] text-gray-200 border border-gray-800"
        }`}
      >
        {content}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg px-3 py-2 flex gap-1 items-center">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" />
      </div>
    </div>
  );
}

// Floating, persistent across all tabs — mentorship should be reachable
// while actively designing, not buried in a tab. One conversation per
// user+problem (backend get-or-creates on open).
function AiMentorButton({ problemId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [draft, setDraft] = useState("");

  const scrollRef = useRef(null);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (!isOpen || hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    const init = async () => {
      setIsLoadingHistory(true);
      setError(null);
      try {
        const conversation = await createConversation(problemId);
        setConversationId(conversation._id);
        const history = await getMessages(problemId, conversation._id);
        setMessages(history);
      } catch (err) {
        setError(err?.response?.data?.message || "Couldn't start a mentor session.");
      } finally {
        setIsLoadingHistory(false);
      }
    };

    init();
  }, [isOpen, problemId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isSending]);

  const handleSend = async (e) => {
    e.preventDefault();
    const content = draft.trim();
    if (!content || isSending || !conversationId) return;

    setDraft("");
    setError(null);
    // Optimistic: show the user's message immediately, before the AI reply
    // comes back.
    setMessages((prev) => [
      ...prev,
      { _id: `temp-${Date.now()}`, role: "USER", content },
    ]);
    setIsSending(true);

    try {
      const { aiMessage } = await sendMessage(problemId, conversationId, content);
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setError(err?.response?.data?.message || "The mentor didn't respond — try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="absolute bottom-4 right-4 z-20 font-mono text-xs uppercase tracking-wider text-black bg-white rounded-full px-4 py-3 shadow-lg hover:bg-gray-200 transition-colors"
      >
        Ask AI Mentor
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-4 z-30 w-96 h-[480px] bg-[#111111] border border-gray-800 rounded-lg flex flex-col shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3 shrink-0">
            <span className="font-mono text-xs uppercase tracking-wider text-gray-300">
              AI Mentor
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-white font-mono text-sm"
            >
              ✕
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {isLoadingHistory && (
              <p className="font-mono text-xs text-gray-500 uppercase tracking-wider">
                Starting session…
              </p>
            )}

            {!isLoadingHistory && messages.length === 0 && !error && (
              <p className="text-xs text-gray-500 text-center mt-8">
                Ask a question about this problem to get started — the
                mentor will guide you with hints.
              </p>
            )}

            {!isLoadingHistory &&
              messages.map((m) => (
                <MessageBubble key={m._id} role={m.role} content={m.content} />
              ))}

            {isSending && <TypingIndicator />}
          </div>

          {error && (
            <p className="text-xs text-red-400 px-4 pb-2 shrink-0">{error}</p>
          )}

          <form onSubmit={handleSend} className="border-t border-gray-800 p-3 flex gap-2 shrink-0">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask for a hint…"
              disabled={isLoadingHistory}
              className="flex-1 bg-[#0a0a0a] border border-gray-800 rounded-md px-3 py-2 text-sm text-gray-200 placeholder:text-gray-600 outline-none focus:border-gray-600 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!draft.trim() || isSending || isLoadingHistory}
              className="font-mono text-xs uppercase tracking-wider text-black bg-white rounded-md px-3 py-2 hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default AiMentorButton;