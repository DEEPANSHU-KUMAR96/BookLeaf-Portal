export default function Spinner({
    fullPage = false
}) {
    const ring =
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />;
    return fullPage ? <div className="min-h-screen flex items-center justify-center">{ring}</div> : ring;
}