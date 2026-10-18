import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Spinner from "../../../components/Spinner";
import { useBooks } from "../hook/useBooks";
import SummaryCards from "../components/SummaryCards";
import BookCard from "../components/BookCard";

export default function MyBooksPage() {
    const { items, summary, status, error, reload } = useBooks();
    const [sortBy, setSortBy] = useState("recent");
    const [toastMessage, setToastMessage] = useState("");
    const [sortOpen, setSortOpen] = useState(false);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(""), 4000);
    };

    const handleDownloadStatement = () => {
        showToast("Generating official Q3/Q4 Royalty Statement PDF... Download will start shortly.");
    };

    // Dynamic sorting
    const sortedBooks = useMemo(() => {
        if (!items || items.length === 0) return [];
        const list = [...items];

        if (sortBy === "recent") {
            return list.sort((a, b) => new Date(b.publicationDate || 0) - new Date(a.publicationDate || 0));
        }
        if (sortBy === "royalties") {
            return list.sort((a, b) => (b.totalRoyaltyEarned || 0) - (a.totalRoyaltyEarned || 0));
        }
        if (sortBy === "copies") {
            return list.sort((a, b) => (b.totalCopiesSold || 0) - (a.totalCopiesSold || 0));
        }
        if (sortBy === "title") {
            return list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        }
        return list;
    }, [items, sortBy]);

    if (status === "idle" || status === "loading") {
        return (
            <div className="flex flex-col items-center justify-center py-24 space-y-3">
                <Spinner />
                <p className="text-xs text-slate-500 font-medium">Retrieving publishing catalog &amp; royalty ledgers...</p>
            </div>
        );
    }

    if (status === "failed") {
        return (
            <div role="alert" className="rounded-2xl bg-red-50 border border-red-200 p-6 text-sm text-red-700 shadow-xs max-w-xl mx-auto my-12 text-center">
                <p className="font-semibold text-base mb-1">Failed to load author books</p>
                <p className="text-xs text-red-600 mb-4">{error}</p>
                <button
                    onClick={reload}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-xl hover:bg-red-700 transition-colors shadow-xs cursor-pointer"
                >
                    Try again
                </button>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="text-center rounded-2xl bg-white border border-dashed border-slate-300 py-20 px-4 max-w-xl mx-auto shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-4 text-xl">
                    📚
                </div>
                <h2 className="text-lg font-serif-title font-semibold text-slate-800">No books registered yet</h2>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                    Your literary works and contracts will appear here once registered by the acquisitions department.
                </p>
                <div className="mt-6">
                    <Link
                        to="/author/tickets/new"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#064e3b] text-white rounded-xl text-xs font-semibold hover:bg-[#022c22] shadow-sm transition-all"
                    >
                        Submit Inquiry
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 text-white text-xs rounded-xl shadow-lg border border-slate-800 flex items-center gap-2.5 animate-fade-in">
                    <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Page Header */}
            <section className="mb-8" data-purpose="page-header">
                <div className="md:flex md:items-end md:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-3xl sm:text-4xl font-serif-title font-semibold text-slate-900 tracking-tight">
                                My Books
                            </h1>
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                                {items.length} {items.length === 1 ? "book" : "books"} on your account
                            </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-500 max-w-2xl leading-relaxed">
                            Monitor real-time sales distribution, royalty settlement ledgers, and manage your literary catalog in one central hub.
                        </p>
                    </div>

                    {/* Quick Executive Actions */}
                    <div className="mt-5 md:mt-0 flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={handleDownloadStatement}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all duration-150 cursor-pointer"
                        >
                            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download Royalty Statement
                        </button>

                        <Link
                            to="/author/tickets/new"
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#064e3b] hover:bg-[#022c22] text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-950/15 hover:shadow-lg hover:shadow-emerald-950/20 transition-all duration-150 cursor-pointer"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                            </svg>
                            Publish New Title
                        </Link>
                    </div>
                </div>
            </section>

            {/* Top Metrics Overview */}
            <SummaryCards summary={summary} />

            {/* Book Catalog Section */}
            <section className="space-y-6" data-purpose="books-catalog-container">
                <div className="flex flex-wrap items-center justify-between gap-3 px-1">
                    <h2 className="text-xl font-serif-title font-semibold text-slate-900">
                        Published Titles &amp; Projects
                    </h2>

                    {/* Sort By Dropdown */}
                    <div className="relative flex items-center gap-2">
                        <span className="text-xs text-slate-400">Sort by:</span>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setSortOpen(!sortOpen)}
                                className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:border-slate-300 shadow-xs flex items-center gap-1.5 cursor-pointer"
                            >
                                <span>
                                    {sortBy === "recent" && "Recent Activity"}
                                    {sortBy === "royalties" && "Highest Royalties"}
                                    {sortBy === "copies" && "Copies Sold"}
                                    {sortBy === "title" && "Title A–Z"}
                                </span>
                                <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {sortOpen && (
                                <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-card border border-slate-200 p-1 z-30 text-xs">
                                    <button
                                        type="button"
                                        onClick={() => { setSortBy("recent"); setSortOpen(false); }}
                                        className={`w-full text-left px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${sortBy === "recent" ? "bg-emerald-50 text-emerald-800 font-semibold" : "text-slate-600 hover:bg-slate-50"
                                            }`}
                                    >
                                        Recent Activity
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setSortBy("royalties"); setSortOpen(false); }}
                                        className={`w-full text-left px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${sortBy === "royalties" ? "bg-emerald-50 text-emerald-800 font-semibold" : "text-slate-600 hover:bg-slate-50"
                                            }`}
                                    >
                                        Highest Royalties
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setSortBy("copies"); setSortOpen(false); }}
                                        className={`w-full text-left px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${sortBy === "copies" ? "bg-emerald-50 text-emerald-800 font-semibold" : "text-slate-600 hover:bg-slate-50"
                                            }`}
                                    >
                                        Copies Sold
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setSortBy("title"); setSortOpen(false); }}
                                        className={`w-full text-left px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${sortBy === "title" ? "bg-emerald-50 text-emerald-800 font-semibold" : "text-slate-600 hover:bg-slate-50"
                                            }`}
                                    >
                                        Title A–Z
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Book Cards List */}
                <div className="space-y-6">
                    {sortedBooks.map((book) => (
                        <BookCard key={book._id} book={book} />
                    ))}
                </div>
            </section>

            {/* Author Support Banner */}
            <section
                className="mt-8 sm:mt-12 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6 shadow-xs"
                data-purpose="support-callout"
            >
                <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 text-left">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5 sm:mt-0">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">
                            Need guidance on marketing or distribution?
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            Your dedicated publishing liaison is available Monday through Friday for author consulting.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:flex sm:items-center gap-2.5 sm:gap-3 w-full md:w-auto shrink-0">
                    <button
                        type="button"
                        onClick={() => showToast("Opening Author FAQ & Knowledgebase guides.")}
                        className="px-3.5 sm:px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer shadow-xs text-center flex items-center justify-center"
                    >
                        Author FAQ
                    </button>
                    <Link
                        to="/author/tickets/new"
                        className="px-3.5 sm:px-4 py-2.5 text-xs font-semibold text-white bg-[#064e3b] hover:bg-[#022c22] rounded-xl shadow-xs transition-colors cursor-pointer text-center flex items-center justify-center"
                    >
                        Submit Query
                    </Link>
                </div>
            </section>
        </div>
    );
}
