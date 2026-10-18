const STYLES = {
    Critical: "bg-red-600 text-white ring-red-600",
    High: "bg-orange-50 text-orange-700 ring-orange-200",
    Medium: "bg-amber-50 text-amber-700 ring-amber-200",
    Low: "bg-slate-100 text-slate-600 ring-slate-200",
};

export default function PriorityBadge({ priority }) {
    return (
        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${STYLES[priority] ?? STYLES.Low}`}>
            {priority}
        </span>
    );
}