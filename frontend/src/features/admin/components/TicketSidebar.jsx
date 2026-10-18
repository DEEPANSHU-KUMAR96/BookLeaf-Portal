import { useState } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "../../auth/hook/useAuth";
import { reclassifyTicket, updateTicket } from "../state/adminSlice";
import { CATEGORIES, PRIORITIES, STATUSES } from "../constants";

const selectCls = "mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors disabled:opacity-60 appearance-none pr-8";
const SOURCE = { ai: "Suggested by AI", admin: "Set by an admin" };
const sourceHint = (src) => SOURCE[src] ?? "Not set yet";

function FieldRow({ label, hint, children }) {
    return (
        <div className="flex flex-col gap-0.5">
            <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">{label}</label>
                {hint && (
                    <span className="text-[10px] font-mono text-emerald-600 flex items-center gap-0.5">
                        ‹ {hint}
                    </span>
                )}
            </div>
            <div className="relative">
                {children}
                <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    );
}

export default function TicketSidebar({ ticket }) {
    const dispatch = useDispatch();
    const { user } = useAuth();
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);

    const run = async (action) => {
        setBusy(true);
        setError(null);
        try {
            await dispatch(action).unwrap();
        } catch (err) {
            setError(err);
        } finally {
            setBusy(false);
        }
    };
    const change = (changes) => run(updateTicket({ id: ticket._id, changes }));

    const assignee = ticket.assignedTo;
    const mine = assignee && String(assignee._id) === String(user?.id);
    const ai = ticket.ai ?? {};

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">Manage ticket</h2>
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
            </div>

            <div className="p-5 flex flex-col gap-4">
                {error && (
                    <div role="alert" className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2">{error}</div>
                )}

                {/* Status */}
                <FieldRow label="Status">
                    <select value={ticket.status} disabled={busy} onChange={(e) => change({ status: e.target.value })} className={selectCls}>
                        {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                </FieldRow>

                {/* Assigned to */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-700">Assigned to</label>
                    <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                                {assignee ? (
                                    <span className="text-xs font-mono font-bold text-emerald-700">
                                        {assignee.name?.slice(0, 2).toUpperCase()}
                                    </span>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                )}
                            </div>
                            <span className={`text-sm font-medium ${mine ? "text-emerald-700" : "text-slate-700"}`}>
                                {mine ? "You" : assignee?.name ?? "Nobody yet"}
                            </span>
                        </div>
                        <div className="flex gap-1.5">
                            {!mine && (
                                <button
                                    disabled={busy}
                                    onClick={() => change({ assignedTo: "me" })}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 disabled:opacity-60 transition-all"
                                >
                                    {assignee ? "Take over" : "Assign to me"}
                                </button>
                            )}
                            {assignee && (
                                <button
                                    disabled={busy}
                                    onClick={() => change({ assignedTo: null })}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 disabled:opacity-60 transition-all"
                                >
                                    Unassign
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Category */}
                <FieldRow label="Category" hint={sourceHint(ticket.categorySource)}>
                    <select value={ticket.category ?? ""} disabled={busy} onChange={(e) => change({ category: e.target.value })} className={selectCls}>
                        {!ticket.category && <option value="" disabled>Not classified yet</option>}
                        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                </FieldRow>

                {/* Priority */}
                <FieldRow label="Priority" hint={sourceHint(ticket.prioritySource)}>
                    <select value={ticket.priority} disabled={busy} onChange={(e) => change({ priority: e.target.value })} className={selectCls}>
                        {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
                    </select>
                </FieldRow>

                {/* AI reasoning */}
                {ai.reason && (
                    <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                            🧠 AI reasoning:
                        </div>
                        <p className="text-xs italic text-slate-500">"{ai.reason}"</p>
                    </div>
                )}

                {/* AI states */}
                {ai.status === "pending" && (
                    <p className="text-xs text-slate-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                        AI is classifying this ticket...
                    </p>
                )}
                {ai.status === "failed" && !ticket.category && (ticket.responses?.length ?? 0) === 0 && (
                    <div className="rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-2">
                        AI classification failed. Set manually, or{" "}
                        <button disabled={busy} onClick={() => run(reclassifyTicket(ticket._id))} className="underline font-semibold">retry</button>.
                    </div>
                )}

                {/* Quick meta */}
                <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                    {[
                        ["Ticket Channel", "Author Portal Direct"],
                        ["Author Account ID", ticket.author?._id?.slice(-8).toUpperCase() ?? "—"],
                    ].map(([k, v]) => (
                        <div key={k} className="flex items-center justify-between text-xs">
                            <span className="font-mono text-slate-400">{k}</span>
                            <span className="font-semibold text-slate-700">{v}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}