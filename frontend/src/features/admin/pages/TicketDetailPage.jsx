import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Spinner from "../../../components/Spinner";
import { formatAge, formatDateTime } from "../../../utils/format";
import TicketStatusBadge from "../../tickets/components/TicketStatusBadge";
import { loadDetail } from "../state/adminSlice";
import PriorityBadge from "../components/PriorityBadge";
import Conversation from "../components/Conversation";
import ResponseComposer from "../components/ResponseComposer";
import TicketSidebar from "../components/TicketSidebar";
import InternalNotes from "../components/InternalNotes";

export default function TicketDetailPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { ticket, status, error } = useSelector((s) => s.admin.detail);

    useEffect(() => {
        dispatch(loadDetail(id));
    }, [id, dispatch]);

    if (status === "failed" && !ticket) {
        return (
            <div className="p-4 sm:p-6 flex flex-col gap-4 max-w-[1520px] mx-auto">
                <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm text-emerald-700 hover:underline font-medium">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to queue
                </Link>
                <div role="alert" className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                    {error}{" "}
                    <button onClick={() => dispatch(loadDetail(id))} className="underline font-semibold">Try again</button>
                </div>
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="flex items-center justify-center py-24">
                <Spinner />
            </div>
        );
    }

    const slaHours = ticket.slaDeadline
        ? Math.max(0, Math.round((new Date(ticket.slaDeadline) - Date.now()) / 3600000))
        : null;

    return (
        <div className="flex flex-col gap-5 p-4 sm:p-6 max-w-[1520px] mx-auto">

            {/* ── Breadcrumb bar ───────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap text-sm">
                    <Link
                        to="/admin"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors text-xs font-medium"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to queue
                    </Link>
                    <span className="text-slate-300 text-xs">/</span>
                    <span className="text-xs font-mono text-slate-400">TKT-{ticket._id?.slice(-7).toUpperCase()}</span>
                    {slaHours !== null && slaHours < 48 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            SLA: {slaHours}h left
                        </span>
                    )}
                    {ticket.isOverdue && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-100 text-red-700">
                            ⚠ Overdue
                        </span>
                    )}
                </div>
            </div>

            {/* ── Hero Header ──────────────────────────────────────── */}
            <div className="bg-white rounded-xl p-5 shadow-card border border-slate-100">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight break-words">{ticket.subject}</h1>
                        <PriorityBadge priority={ticket.priority} />
                        <TicketStatusBadge status={ticket.status} />
                    </div>
                    <p className="text-sm text-slate-500 flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="font-semibold text-slate-700">{ticket.author?.name}</span>
                        {ticket.author?.email && (
                            <span className="text-slate-400 text-xs font-mono">({ticket.author.email})</span>
                        )}
                        <span className="text-slate-300">•</span>
                        <span>opened {formatDateTime(ticket.createdAt)}</span>
                        <span className="text-slate-300">•</span>
                        <span className="font-mono text-amber-600 font-semibold">{formatAge(ticket.ageHours)} ago</span>
                    </p>
                </div>

                {/* Book context strip */}
                {ticket.book && (
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 flex-wrap text-sm text-slate-500">
                        <span>📖</span>
                        <span>Book: <em className="font-semibold text-slate-800 not-italic">{ticket.book.title}</em></span>
                        <span className="text-xs font-mono text-slate-400">({ticket.book.bookId})</span>
                        {ticket.book.isbn && (
                            <>
                                <span className="text-slate-300">•</span>
                                <span className="text-xs font-mono">ISBN {ticket.book.isbn}</span>
                            </>
                        )}
                        {ticket.book.status && (
                            <>
                                <span className="text-slate-300">•</span>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    {ticket.book.status}
                                </span>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* ── Main split layout ────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

                {/* LEFT: Conversation + Composer */}
                <div className="lg:col-span-8 flex flex-col gap-5">
                    <Conversation ticket={ticket} />
                    {ticket.status === "Closed" ? (
                        <div className="rounded-xl bg-slate-100 text-sm text-slate-600 px-5 py-4 border border-slate-200">
                            🔒 This ticket is <strong>closed</strong>. Change the status to reopen before replying.
                        </div>
                    ) : (
                        <ResponseComposer key={ticket._id} ticket={ticket} />
                    )}
                </div>

                {/* RIGHT: Sidebar + Notes */}
                <div className="lg:col-span-4 flex flex-col gap-5">
                    <TicketSidebar ticket={ticket} />
                    <InternalNotes ticket={ticket} />
                </div>
            </div>
        </div>
    );
}