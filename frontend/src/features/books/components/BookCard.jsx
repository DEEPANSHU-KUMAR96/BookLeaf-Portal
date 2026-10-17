import { useState } from "react";
import { formatCurrency, formatDate } from "../../../utils/format";
import StatusBadge from "./StatusBadge";

export default function BookCard({ book }) {
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const isPublished = book.isPublished ?? (book.status?.toLowerCase().includes("published") ?? false);

  // Settlement percentage
  const totalEarned = book.totalRoyaltyEarned ?? 0;
  const totalPaid = book.royaltyPaid ?? 0;
  const settlementRate = totalEarned > 0 ? Math.min(100, Math.round((totalPaid / totalEarned) * 1000) / 10) : 100;

  if (!isPublished) {
    // In Production Card
    return (
      <article
        className="bg-white rounded-2xl border border-amber-200/80 shadow-card hover:shadow-card-hover transition-all duration-200 p-6 sm:p-7 space-y-6 relative overflow-hidden"
        data-purpose="book-card-item"
      >
        {/* Production banner accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-amber-400 via-orange-400 to-amber-500"></div>

        {/* Action toast if triggered */}
        {toastMsg && (
          <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl text-center font-medium animate-fade-in">
            {toastMsg}
          </div>
        )}

        {/* Title Header & Status */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="space-y-1">
            <h3 className="text-2xl font-serif-title font-semibold text-slate-900 hover:text-[#064e3b] transition-colors cursor-pointer">
              {book.title}
            </h3>
            <p className="text-xs text-slate-500 font-normal">
              {book.genre} · <span className="font-mono">ISBN {book.isbn}</span>
            </p>
          </div>
          <div className="shrink-0">
            <StatusBadge status={book.status} isPublished={false} />
          </div>
        </div>

        {/* Granular Metadata Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-6 gap-x-6">
          <div>
            <div className="text-xs text-slate-500 font-normal">Expected release</div>
            <div className="mt-1.5 text-base sm:text-lg font-semibold text-amber-900">
              {formatDate(book.publicationDate) ?? "Winter 2026"}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 font-normal">Target MRP</div>
            <div className="mt-1.5 text-base sm:text-lg font-semibold text-slate-900 tabular-nums">
              {book.mrp > 0 ? formatCurrency(book.mrp) : "₹399 (Est.)"}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 font-normal">Pre-orders</div>
            <div className="mt-1.5 text-base sm:text-lg font-semibold text-amber-700">Opening Soon</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 font-normal">Draft deadline</div>
            <div className="mt-1.5 text-base sm:text-lg font-semibold text-slate-900">12 Nov 2026</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 font-normal">Current stage</div>
            <div className="mt-1.5 text-base sm:text-lg font-semibold text-amber-800">Stage 2 of 4</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 font-normal">Review items</div>
            <div className="mt-1.5 text-base sm:text-lg font-semibold text-slate-900 tabular-nums">2 Proofs Pending</div>
          </div>
        </div>

        {/* Publishing Pipeline Status Tracker */}
        <div className="bg-amber-50/50 rounded-xl p-4 sm:p-5 border border-amber-200/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-amber-200/50 gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Publishing Pipeline Status
            </span>
            <span className="text-xs font-medium text-amber-800">Next milestone: Cover proof approval</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {/* Step 1 */}
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white/70 border border-amber-200/40">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-800">1. Proofreading &amp; Editorial</span>
                <span className="text-[11px] text-emerald-700 font-medium">Completed</span>
              </div>
            </div>
            {/* Step 2 */}
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-amber-100/70 border border-amber-300/80 shadow-xs">
              <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs shrink-0 ring-4 ring-amber-200">
                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-amber-950">2. Cover Art &amp; Layout</span>
                <span className="text-[11px] text-amber-800 font-bold">In Progress</span>
              </div>
            </div>
            {/* Step 3 */}
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white/40 border border-slate-200/50 opacity-60">
              <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs shrink-0 font-medium">
                3
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-slate-600">3. ISBN &amp; Printing Proof</span>
                <span className="text-[11px] text-slate-400">Queued</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Row */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => showToast("Opening Cover Art proofs #1 and #2 for review.")}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 hover:text-amber-950 bg-amber-100/90 hover:bg-amber-200/90 px-3.5 py-1.5 rounded-lg border border-amber-300/70 transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Review Cover Proofs (2)
            </button>
            <button
              type="button"
              onClick={() => showToast("Connecting to acquisition editor chat session...")}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-3.5 py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Editor Chat
            </button>
            <button
              type="button"
              onClick={() => showToast("Manuscript milestone timeline loaded.")}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-3.5 py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Milestone History
            </button>
          </div>
          <div className="text-[11px] text-amber-900/80 font-medium">
            Production SLA: <span className="font-bold text-amber-950">On Schedule</span>
          </div>
        </div>
      </article>
    );
  }

  // Published & Live Card
  return (
    <article
      className="bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all duration-200 p-6 sm:p-7 space-y-6"
      data-purpose="book-card-item"
    >
      {/* Action toast if triggered */}
      {toastMsg && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl text-center font-medium animate-fade-in">
          {toastMsg}
        </div>
      )}

      {/* Title Header & Status */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="space-y-1">
          <h3 className="text-2xl font-serif-title font-semibold text-slate-900 hover:text-[#064e3b] transition-colors cursor-pointer">
            {book.title}
          </h3>
          <p className="text-xs text-slate-500 font-normal">
            {book.genre} · <span className="font-mono">ISBN {book.isbn}</span>
          </p>
        </div>
        <div className="shrink-0">
          <StatusBadge status={book.status} isPublished={true} />
        </div>
      </div>

      {/* Granular Metric Grid (6 columns) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-6 gap-x-6">
        <div>
          <div className="text-xs text-slate-500 font-normal">Published on</div>
          <div className="mt-1.5 text-base sm:text-lg font-semibold text-slate-900">
            {formatDate(book.publicationDate) ?? "20 Jun 2023"}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500 font-normal">MRP</div>
          <div className="mt-1.5 text-base sm:text-lg font-semibold text-slate-900 tabular-nums">
            {book.mrp > 0 ? formatCurrency(book.mrp) : "To be decided"}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500 font-normal">Copies sold</div>
          <div className="mt-1.5 text-base sm:text-lg font-semibold text-slate-900 tabular-nums">
            {(book.totalCopiesSold ?? 0).toLocaleString("en-IN")}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500 font-normal">Royalty earned</div>
          <div className="mt-1.5 text-base sm:text-lg font-semibold text-slate-900 tabular-nums">
            {formatCurrency(book.totalRoyaltyEarned ?? 0)}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500 font-normal">Royalty paid</div>
          <div className="mt-1.5 text-base sm:text-lg font-semibold text-slate-900 tabular-nums">
            {formatCurrency(book.royaltyPaid ?? 0)}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500 font-normal">Royalty pending</div>
          <div className="mt-1.5 text-base sm:text-lg font-semibold text-amber-600 tabular-nums">
            {formatCurrency(book.royaltyPending ?? 0)}
          </div>
        </div>
      </div>

      {/* Bottom Action Row */}
      <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => showToast(`Detailed analytics loaded for "${book.title}".`)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#064e3b] hover:text-[#022c22] bg-emerald-50 hover:bg-emerald-100/80 px-3.5 py-1.5 rounded-lg border border-emerald-200/60 transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Detailed Analytics
          </button>
          <button
            type="button"
            onClick={() => showToast(`Managing listing settings for "${book.title}".`)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-3.5 py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Manage Listing
          </button>
          <button
            type="button"
            onClick={() => showToast(`Royalty ledger downloaded for "${book.title}".`)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-3.5 py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Royalty Ledger
          </button>
        </div>
        <div className="text-[11px] text-slate-400 font-medium">
          Settlement: <span className="text-emerald-700 font-semibold">{settlementRate}% Disbursed</span>
        </div>
      </div>
    </article>
  );
}
