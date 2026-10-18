import { useState } from "react";
import { useDispatch } from "react-redux";
import { formatDateTime } from "../../../utils/format";
import { addNote } from "../state/adminSlice";

export default function InternalNotes({ ticket }) {
    const dispatch = useDispatch();
    const [text, setText] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);

    const submit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        setBusy(true);
        setError(null);
        try {
            await dispatch(addNote({ id: ticket._id, text: text.trim() })).unwrap();
            setText("");
        } catch (err) {
            setError(err);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="bg-amber-50 rounded-xl border border-amber-200 shadow-card overflow-hidden">
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-amber-200/70 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-amber-900">Internal notes</h3>
                <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            </div>

            <div className="p-5 flex flex-col gap-4">
                <p className="text-xs font-medium text-amber-700">
                    Only the team can see these. Authors never do.
                </p>

                {/* Existing notes */}
                {(ticket.internalNotes ?? []).map((n) => (
                    <div key={n._id} className="bg-white/80 rounded-lg px-4 py-3 border border-amber-100 shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-amber-800">{n.admin?.name ?? "Admin"}</span>
                            <span className="text-[10px] font-mono text-amber-500">{formatDateTime(n.createdAt)}</span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap break-words text-slate-700">{n.text}</p>
                    </div>
                ))}

                {(ticket.internalNotes ?? []).length === 0 && (
                    <p className="text-xs text-amber-600/70 italic text-center py-1">No notes yet — be the first to add context.</p>
                )}

                {/* Add note form */}
                <form onSubmit={submit} className="flex flex-col gap-2.5">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={3}
                        maxLength={2000}
                        placeholder="Add a note..."
                        className="w-full rounded-lg border border-amber-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-amber-400/70 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 resize-none transition-colors"
                    />
                    {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
                    <button
                        type="submit"
                        disabled={busy || !text.trim()}
                        className="self-start px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-sm"
                    >
                        {busy ? "Adding..." : "Add note"}
                    </button>
                </form>
            </div>
        </div>
    );
}