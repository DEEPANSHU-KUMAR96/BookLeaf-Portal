import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Spinner from "../../../components/Spinner";
import { useAdminQueue } from "../hook/useAdminQueue";
import { loadQueue, resetFilters, setFilter } from "../state/adminSlice";
import QueueFilters from "../components/QueueFilters";
import TicketTable from "../components/TicketTable";
import Pagination from "../components/Pagination";

function KpiCard({ label, value, sub, subColor, icon, accentClass }) {
    return (
        <div className="flex items-center justify-between p-4 rounded-xl bg-white shadow-card border border-slate-100 hover:shadow-card-hover transition-shadow">
            <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">{label}</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-2xl font-bold text-slate-900 tracking-tight">{value}</span>
                    {sub && <span className={`text-[11px] font-mono font-semibold ${subColor ?? "text-slate-400"}`}>{sub}</span>}
                </div>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${accentClass}`}>{icon}</div>
        </div>
    );
}

export default function TicketQueuePage() {
    const dispatch = useDispatch();
    const { filters, queue } = useAdminQueue();
    const pagination = queue.pagination;

    const filtersActive = Object.entries(filters).some(([k, v]) => !["sort", "page"].includes(k) && v !== "");

    // KPI derivations
    const items = queue.items ?? [];
    const unresolved = items.filter((t) => !["Resolved", "Closed"].includes(t.status)).length;
    const critical = items.filter((t) => t.priority === "Critical").length;
    const overdue = items.filter((t) => t.isOverdue).length;
    const totalInQueue = pagination?.total ?? items.length;
    const openTickets = items.filter((t) => t.status === "Open").length;

    return (
        <div className="flex flex-col gap-5 p-4 sm:p-6 lg:p-7 max-w-[1520px] mx-auto">

            {/* ── Page Header ──────────────────────────────────────── */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
                <div className="flex flex-col gap-2 max-w-2xl">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-mono uppercase tracking-wider font-semibold border border-emerald-200/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Live Sync Active
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">Ticket Queue</h1>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        Sorted by urgency: unresolved first, then priority, then oldest.
                        <span className="text-red-500 font-medium"> Red highlights</span> denote tickets pending beyond 48 hours. New author inquiries synchronize automatically.
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => dispatch(loadQueue())}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-sm transition-all"
                    >
                        <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh Feed
                    </button>
                </div>
            </div>

            {/* ── KPI Cards ────────────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <KpiCard
                    label="Total Unresolved" value={unresolved}
                    sub={openTickets > 0 ? `+${openTickets} open` : null} subColor="text-amber-600"
                    icon="📥" accentClass="bg-slate-100 text-slate-500"
                />
                <KpiCard
                    label="Critical Urgency" value={critical}
                    sub={critical > 0 ? "SLA RISK" : "Clear"} subColor={critical > 0 ? "text-red-600" : "text-emerald-600"}
                    icon="🚨" accentClass="bg-red-50 text-red-500"
                />
                <KpiCard
                    label="Overdue (> 48h)" value={overdue}
                    sub={overdue > 0 ? "Action needed" : "On track"} subColor={overdue > 0 ? "text-red-500" : "text-emerald-600"}
                    icon="⏱" accentClass="bg-amber-50 text-amber-500"
                />
                <KpiCard
                    label="Total in Queue" value={totalInQueue}
                    sub="AI Triaged" subColor="text-emerald-600"
                    icon="✨" accentClass="bg-emerald-50 text-emerald-600"
                />
            </div>

            {/* ── Filters ──────────────────────────────────────────── */}
            <QueueFilters />

            {/* ── Table / States ───────────────────────────────────── */}
            {(queue.status === "idle" || queue.status === "loading") && !queue.items?.length && (
                <div className="flex justify-center py-20"><Spinner /></div>
            )}

            {queue.status === "failed" && (
                <div role="alert" className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                    {queue.error}{" "}
                    <button onClick={() => dispatch(loadQueue())} className="underline font-semibold">Try again</button>
                </div>
            )}

            {queue.status === "succeeded" && (
                queue.items.length === 0 ? (
                    <div className="text-center rounded-xl bg-white border border-dashed border-slate-200 py-20 shadow-card">
                        <div className="text-4xl mb-3">📭</div>
                        <p className="font-semibold text-slate-700">
                            {filtersActive ? "No tickets match these filters" : "No tickets yet"}
                        </p>
                        {filtersActive && (
                            <button
                                onClick={() => dispatch(resetFilters())}
                                className="mt-3 text-sm text-emerald-700 underline font-medium"
                            >
                                Reset filters
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Table header banner */}
                        <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-700">{queue.items.length}</span> items displayed
                                {overdue > 0 && (
                                    <>
                                        <span className="text-slate-300">•</span>
                                        <span className="flex items-center gap-1 text-red-500 font-semibold">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                            {overdue} overdue SLA{overdue > 1 ? "s" : ""} flagged
                                        </span>
                                    </>
                                )}
                            </div>
                            {queue.fetching && (
                                <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Syncing...
                                </span>
                            )}
                        </div>

                        <TicketTable tickets={queue.items} fetching={queue.fetching} />
                        <Pagination
                            pagination={queue.pagination}
                            disabled={queue.fetching}
                            onPage={(page) => dispatch(setFilter({ key: "page", value: page }))}
                        />
                    </>
                )
            )}
        </div>
    );
}