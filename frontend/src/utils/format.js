/** Rs amounts in Indian digit grouping, e.g. 11970 -> ₹11,970 */
export const formatCurrency = (n) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(n ?? 0);

/** Returns null for missing dates so callers can show their own placeholder. */
export const formatDate = (iso) =>
    iso
        ? new Date(iso).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            timeZone: "UTC"
        })
        : null;

export const formatDateTime = (iso) => {
    if (!iso) return "—";
    try {
        const d = new Date(iso);
        if (isNaN(d.getTime())) return "—";
        return d.toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            hour: "numeric",
            minute: "2-digit"
        });
    } catch {
        return "—";
    }
};

/** 53 -> "2d 5h", 5 -> "5h", 0 -> "<1h" */
export function formatAge(hours) {
    if (hours < 1) return "<1h";

    if (hours < 24) return `${hours}h`;

    const d = Math.floor(hours / 24);
    const h = hours % 24;
    return h ? `${d}d ${h}h` : `${d}d`;
}