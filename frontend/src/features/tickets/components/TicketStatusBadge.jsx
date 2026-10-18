const STYLES = {
    Open: "bg-sky-50 text-sky-700 ring-sky-200",
    "In Progress": "bg-amber-50 text-amber-700 ring-amber-200",
    Resolved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Closed: "bg-slate-100 text-slate-600 ring-slate-200",
};

export default function TicketStatusBadge({ status }) {
    return (
        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${STYLES[status] ?? STYLES.Closed}`}>
            {status}
        </span>
    );
}