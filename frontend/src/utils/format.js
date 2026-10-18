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