import { Link, useNavigate } from "react-router-dom";
import { formatAge } from "../../../utils/format";
import TicketStatusBadge from "../../tickets/components/TicketStatusBadge";
import PriorityBadge from "./PriorityBadge";

const th = "py-2.5 px-4 text-left text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400";

export default function TicketTable({ tickets, fetching }) {
    const navigate = useNavigate();

    return (
        <div className={`rounded-xl bg-white border border-slate-200 overflow-hidden shadow-card transition-opacity duration-200 ${fetching ? "opacity-60 pointer-events-none" : ""}`}>

            {/* ── Mobile Card View (< 640px) ────────────────────────── */}
            <div className="sm:hidden divide-y divide-slate-100">
                {tickets.map((t) => (
                    <div
                        key={t._id}
                        onClick={() => navigate(`/admin/tickets/${t._id}`)}
                        className={`p-4 flex flex-col gap-2.5 cursor-pointer active:bg-emerald-50/60 transition-colors ${
                            t.isOverdue ? "bg-red-50/40 border-l-4 border-l-red-500" : "bg-white"
                        }`}
                    >
                        {/* Header: Priority, Status, Age */}
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <PriorityBadge priority={t.priority} />
                                <TicketStatusBadge status={t.status} />
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className={`text-xs font-mono font-semibold ${t.isOverdue ? "text-red-600" : "text-slate-500"}`}>
                                    {formatAge(t.ageHours)}
                                </span>
                                {t.isOverdue && (
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-red-100 text-red-700">OVR</span>
                                )}
                            </div>
                        </div>

                        {/* Subject */}
                        <div>
                            <Link
                                to={`/admin/tickets/${t._id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="text-sm font-semibold text-slate-900 hover:text-emerald-700 transition-colors line-clamp-2"
                            >
                                {t.subject}
                            </Link>
                            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                                <span className="font-medium text-slate-700">{t.author?.name}</span>
                                <span className="text-slate-300">•</span>
                                <span className="italic">{t.book ? t.book.title : "General query"}</span>
                            </p>
                        </div>

                        {/* Badges / Category / Assignee */}
                        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-50 text-xs">
                            <div className="flex items-center gap-1.5 flex-wrap">
                                {t.category ? (
                                    <span className="text-xs font-medium text-slate-600">{t.category}</span>
                                ) : t.aiStatus === "failed" ? (
                                    <span className="text-xs text-amber-700">AI classification failed</span>
                                ) : (
                                    <span className="text-xs text-slate-400 italic">Not classified</span>
                                )}

                                {t.responseCount > 0 && (
                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-500 bg-slate-100">
                                        💬 {t.responseCount}
                                    </span>
                                )}

                                {t.aiStatus === "done" && t.responseCount === 0 && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-emerald-700 bg-emerald-50">
                                        ✨ Draft
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-1 text-slate-500 shrink-0">
                                {t.assignedTo ? (
                                    <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-[9px] font-mono font-bold flex items-center justify-center">
                                        {t.assignedTo.name?.slice(0, 2).toUpperCase()}
                                    </span>
                                ) : (
                                    <span className="text-[11px] text-slate-400">Unassigned</span>
                                )}
                                <span className="text-slate-300 ml-1">›</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Desktop & Tablet Table (>= 640px) ────────────────── */}
            <div className="hidden sm:block w-full overflow-x-auto">
                <table className="min-w-full text-left border-collapse" style={{ minWidth: "760px" }}>
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className={`${th} w-28`} scope="col">Priority</th>
                            <th className={`${th} min-w-[240px]`} scope="col">Ticket & Creator</th>
                            <th className={`${th} w-44`} scope="col">Category</th>
                            <th className={`${th} w-32`} scope="col">Status</th>
                            <th className={`${th} w-40`} scope="col">Assigned</th>
                            <th className={`${th} w-24 text-right`} scope="col">Age</th>
                            <th className={`${th} w-10 text-center`} scope="col">
                                <span className="sr-only">Open</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map((t, i) => {
                            const isEven = i % 2 === 1;
                            return (
                                <tr
                                    key={t._id}
                                    onClick={() => navigate(`/admin/tickets/${t._id}`)}
                                    className={`cursor-pointer group transition-colors hover:bg-emerald-50/40 border-b border-slate-100 last:border-0
                                        ${t.isOverdue ? "bg-red-50/50" : isEven ? "bg-slate-50/40" : "bg-white"}`}
                                >
                                    {/* Priority */}
                                    <td className={`py-3.5 px-4 align-middle border-l-3 ${t.isOverdue ? "border-l-red-500" : "border-l-transparent"}`}>
                                        <PriorityBadge priority={t.priority} />
                                    </td>

                                    {/* Ticket info */}
                                    <td className="py-3.5 px-4 align-middle">
                                        <div className="flex flex-col gap-0.5">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <Link
                                                    to={`/admin/tickets/${t._id}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="text-sm font-semibold text-slate-900 hover:text-emerald-700 transition-colors truncate max-w-[220px]"
                                                    title={t.subject}
                                                >
                                                    {t.subject}
                                                </Link>
                                                {t.responseCount > 0 && (
                                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-500 bg-slate-100">
                                                        💬 {t.responseCount} {t.responseCount === 1 ? "reply" : "replies"}
                                                    </span>
                                                )}
                                                {t.aiStatus === "pending" && (
                                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono text-amber-600 bg-amber-50">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping inline-block"></span>
                                                        Classifying...
                                                    </span>
                                                )}
                                                {t.aiStatus === "failed" && !t.category && t.responseCount === 0 && (
                                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-red-700 bg-red-50 font-semibold">
                                                        AI failed
                                                    </span>
                                                )}
                                                {t.aiStatus === "done" && t.responseCount === 0 && (
                                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-emerald-700 bg-emerald-50">
                                                        ✨ AI draft ready
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-400 flex items-center gap-1.5 flex-wrap">
                                                <span className="font-medium text-slate-600">{t.author?.name}</span>
                                                <span className="text-slate-300">•</span>
                                                <span className="italic">{t.book ? t.book.title : "General"}</span>
                                            </p>
                                        </div>
                                    </td>

                                    {/* Category */}
                                    <td className="py-3.5 px-4 align-middle">
                                        {t.category ? (
                                            <span className="text-sm text-slate-700 font-medium">{t.category}</span>
                                        ) : t.aiStatus === "failed" ? (
                                            <span className="text-xs text-amber-700">AI classification failed</span>
                                        ) : (
                                            <span className="text-xs text-slate-400 italic">Not classified</span>
                                        )}
                                    </td>

                                    {/* Status */}
                                    <td className="py-3.5 px-4 align-middle">
                                        <TicketStatusBadge status={t.status} />
                                    </td>

                                    {/* Assigned */}
                                    <td className="py-3.5 px-4 align-middle">
                                        {t.assignedTo ? (
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-[9px] font-mono font-bold flex items-center justify-center shrink-0">
                                                    {t.assignedTo.name?.slice(0, 2).toUpperCase()}
                                                </span>
                                                <span className="text-xs font-medium text-slate-700 truncate">{t.assignedTo.name}</span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-slate-400 flex items-center gap-1 group-hover:text-emerald-700 transition-colors">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                                </svg>
                                                Unassigned
                                            </span>
                                        )}
                                    </td>

                                    {/* Age */}
                                    <td className="py-3.5 px-4 align-middle text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <span className={`text-xs font-mono font-semibold ${t.isOverdue ? "text-red-600" : "text-slate-600"}`}>
                                                {formatAge(t.ageHours)}
                                            </span>
                                            {t.isOverdue && (
                                                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-red-100 text-red-700">OVR</span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Arrow */}
                                    <td className="py-3.5 px-4 align-middle text-center">
                                        <span className="text-slate-300 group-hover:text-emerald-600 transition-colors text-lg">›</span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}