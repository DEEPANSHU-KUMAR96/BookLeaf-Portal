import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { sendResponse } from "../state/adminSlice";
import { useAiDraft } from "../hook/useAiDraft";

/** Render this with key={ticket._id} so every ticket gets a fresh composer. */
export default function ResponseComposer({ ticket }) {
    const dispatch = useDispatch();
    const [message, setMessage] = useState("");
    const [insertedDraft, setInsertedDraft] = useState(false);
    const [sending, setSending] = useState(false);
    const [sendError, setSendError] = useState(null);
    const autoFilled = useRef(false);

    const classified = ticket.ai?.status !== "pending";
    const draft = useAiDraft(ticket._id, classified, ticket.category);

    // Auto-fill on first draft arrival
    useEffect(() => {
        if (draft.status !== "ready" || autoFilled.current) return;
        autoFilled.current = true;
        if (message === "") {
            setMessage(draft.text);
            setInsertedDraft(true);
        }
    }, [draft.status, draft.text, message]);

    const isEdited = message.trim() !== "" && message !== draft.text;

    const insertDraft = (text) => {
        if (isEdited && !window.confirm("Replace your text with the AI draft?")) return;
        setMessage(text);
        setInsertedDraft(true);
    };

    const onRegenerate = async () => {
        if (isEdited && !window.confirm("Generate a new draft and replace your text?")) return;
        const text = await draft.regenerate();
        if (text) { setMessage(text); setInsertedDraft(true); }
    };

    const send = async () => {
        setSending(true);
        setSendError(null);
        try {
            await dispatch(sendResponse({ id: ticket._id, message: message.trim(), aiAssisted: insertedDraft })).unwrap();
            setMessage("");
            setInsertedDraft(false);
            autoFilled.current = false;
        } catch (err) {
            setSendError(err);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
            {/* Accent stripe */}
            <div className="h-0.5 bg-gradient-to-r from-emerald-800 via-emerald-400 to-transparent"></div>

            <div className="p-5 flex flex-col gap-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                        <h2 className="text-sm font-semibold text-slate-900">Reply to author</h2>
                    </div>

                    {/* AI status ribbon */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {!classified && (
                            <span className="text-xs text-slate-400">Waiting for AI classification...</span>
                        )}
                        {classified && draft.status === "loading" && (
                            <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                                <svg className="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                AI drafting...
                            </span>
                        )}
                        {draft.status === "ready" && (
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200/60">
                                    ✨ AI draft ready. Review and edit before sending.
                                </span>
                                {message !== draft.text && (
                                    <button onClick={() => insertDraft(draft.text)} className="text-xs text-emerald-700 font-semibold hover:underline">
                                        Insert draft
                                    </button>
                                )}
                                <button onClick={onRegenerate} className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-emerald-700 font-medium transition-colors">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Regenerate
                                </button>
                            </div>
                        )}
                        {draft.status === "unavailable" && (
                            <div className="flex items-center gap-1 text-xs text-amber-700">
                                <span>{draft.error}</span>
                                <button onClick={draft.retry} className="underline font-semibold">Retry</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stale draft warning */}
                {draft.stale && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        The category changed after this draft was written.{" "}
                        <button onClick={onRegenerate} className="underline font-semibold">Regenerate draft</button>
                    </div>
                )}


                {/* Textarea */}
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={11}
                    maxLength={5000}
                    placeholder="Write your response to the author..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white resize-y transition-colors placeholder:text-slate-400"
                />

                {sendError && (
                    <div role="alert" className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
                        {sendError}
                    </div>
                )}

                {/* Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="text-xs font-mono text-slate-400">
                        <span className="font-semibold text-slate-600">{message.length}</span>/5000
                        <span className="ml-2 text-amber-600 font-medium">· The author sees this immediately</span>
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition-colors"
                        >
                            Save as Draft
                        </button>
                        <button
                            onClick={send}
                            disabled={sending || !message.trim()}
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-sm"
                        >
                            {sending ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Sending...
                                </>
                            ) : (
                                <>
                                    Send reply
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}