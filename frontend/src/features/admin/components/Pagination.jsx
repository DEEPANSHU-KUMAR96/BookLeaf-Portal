export default function Pagination({ pagination, onPage, disabled }) {
    if (!pagination || pagination.totalPages <= 1) return null;
    const { page, totalPages, total } = pagination;

    const btn = (active) =>
        `w-8 h-8 rounded-lg text-xs font-mono font-semibold flex items-center justify-center transition-all
        ${active
            ? "bg-emerald-800 text-white shadow-sm"
            : "text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
        }`;

    const arrowBtn = "p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors";

    // Page numbers: show at most 5 around current
    const pages = [];
    const delta = 2;
    for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
        pages.push(i);
    }

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-1">
            {/* Info */}
            <p className="text-xs font-mono text-slate-500">
                Page <span className="font-bold text-slate-700">{page}</span> of{" "}
                <span className="font-bold text-slate-700">{totalPages}</span>
                <span className="text-slate-400"> · {total} tickets total</span>
            </p>

            {/* Controls */}
            <div className="flex items-center gap-1">
                {/* First */}
                <button className={arrowBtn} disabled={disabled || page <= 1} onClick={() => onPage(1)} title="First page">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                </button>
                {/* Prev */}
                <button className={arrowBtn} disabled={disabled || page <= 1} onClick={() => onPage(page - 1)} title="Previous page">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* First ellipsis */}
                {pages[0] > 1 && (
                    <>
                        <button className={btn(false)} disabled={disabled} onClick={() => onPage(1)}>1</button>
                        {pages[0] > 2 && <span className="text-slate-400 text-xs px-1">…</span>}
                    </>
                )}

                {/* Page numbers */}
                {pages.map((p) => (
                    <button key={p} className={btn(p === page)} disabled={disabled} onClick={() => onPage(p)}>{p}</button>
                ))}

                {/* Last ellipsis */}
                {pages[pages.length - 1] < totalPages && (
                    <>
                        {pages[pages.length - 1] < totalPages - 1 && <span className="text-slate-400 text-xs px-1">…</span>}
                        <button className={btn(false)} disabled={disabled} onClick={() => onPage(totalPages)}>{totalPages}</button>
                    </>
                )}

                {/* Next */}
                <button className={arrowBtn} disabled={disabled || page >= totalPages} onClick={() => onPage(page + 1)} title="Next page">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
                {/* Last */}
                <button className={arrowBtn} disabled={disabled || page >= totalPages} onClick={() => onPage(totalPages)} title="Last page">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}