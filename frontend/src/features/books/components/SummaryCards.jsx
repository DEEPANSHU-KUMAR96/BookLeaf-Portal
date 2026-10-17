import { formatCurrency } from "../../../utils/format";

export default function SummaryCards({ summary }) {
    if (!summary) return null;

    const totalCopies = summary.totalCopiesSold ?? 0;
    const totalEarned = summary.totalRoyaltyEarned ?? 0;
    const totalPaid = summary.royaltyPaid ?? 0;
    const totalPending = summary.royaltyPending ?? 0;

    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-10" data-purpose="royalty-metrics-grid">
            {/* Metric Card 1: Copies Sold */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all duration-200 relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-50 rounded-full group-hover:scale-110 transition-transform duration-300 pointer-events-none"></div>
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">Copies Sold</span>
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
                        {totalCopies.toLocaleString("en-IN")}
                    </span>
                    <span className="inline-flex items-center text-xs font-semibold text-emerald-600">
                        <svg className="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        +14.2%
                    </span>
                </div>
                <div className="mt-2 text-xs text-slate-400 font-normal">
                    Lifetime print &amp; digital editions
                </div>
            </div>

            {/* Metric Card 2: Total Royalty Earned (Hero Dark Emerald Card) */}
            <div className="bg-linear-to-br from-[#022c22] via-[#064e3b] to-[#022c22] rounded-2xl p-5 text-white shadow-card shadow-emerald-950/20 hover:shadow-glow-emerald transition-all duration-200 relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
                <div className="flex items-center justify-between relative z-10">
                    <span className="text-xs font-semibold text-emerald-200 tracking-wide uppercase">Total Royalty Earned</span>
                    <div className="w-8 h-8 rounded-lg bg-white/10 text-emerald-300 flex items-center justify-center text-xs backdrop-blur-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
                <div className="mt-3 flex items-baseline gap-1 relative z-10">
                    <span className="text-3xl font-bold tracking-tight tabular-nums text-white">
                        {formatCurrency(totalEarned)}
                    </span>
                </div>
                <div className="mt-2 text-xs text-emerald-200/80 font-normal flex items-center gap-1.5 relative z-10">
                    <svg className="w-3.5 h-3.5 text-emerald-300 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
                    </svg>
                    Accumulated gross royalties
                </div>
            </div>

            {/* Metric Card 3: Royalty Paid */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all duration-200 relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-50 rounded-full group-hover:scale-110 transition-transform duration-300 pointer-events-none"></div>
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">Royalty Paid</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                        </svg>
                    </div>
                </div>
                <div className="mt-3 flex items-baseline">
                    <span className="text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
                        {formatCurrency(totalPaid)}
                    </span>
                </div>
                <div className="mt-2 text-xs text-slate-400 font-normal flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Transferred to bank account
                </div>
            </div>

            {/* Metric Card 4: Royalty Pending */}
            <div className="bg-white rounded-2xl p-5 border border-amber-200/70 shadow-card hover:shadow-card-hover transition-all duration-200 relative overflow-hidden bg-gradient-to-b from-amber-50/20 to-transparent">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-amber-700 tracking-wide uppercase">Royalty Pending</span>
                    <div className="w-8 h-8 rounded-lg bg-amber-100/70 text-amber-700 flex items-center justify-center text-xs">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-3xl font-bold tracking-tight text-amber-600 tabular-nums">
                        {formatCurrency(totalPending)}
                    </span>
                </div>
                <div className="mt-2 text-xs text-amber-800/90 font-medium flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    Scheduled for payout on 5th Nov
                </div>
            </div>
        </section>
    );
}
