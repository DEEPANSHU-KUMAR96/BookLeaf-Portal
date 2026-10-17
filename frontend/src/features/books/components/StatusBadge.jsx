export default function StatusBadge({ status, isPublished }) {
  if (isPublished) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        {status || "Published & Live"}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-300/80">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
      {status ? (status.toLowerCase().includes("production") ? status : `In Production - ${status}`) : "In Production - Cover Design"}
    </span>
  );
}