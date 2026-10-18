import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/hook/useAuth";

export default function RoyaltyTermsPage() {
    const { user } = useAuth();
    const location = useLocation();
    const isInsideAuthorShell = location.pathname.startsWith("/author");

    const [activeSection, setActiveSection] = useState("all");
    const [copied, setCopied] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);

    // Interactive Royalty Calculator State
    const [calcFormat, setCalcFormat] = useState("paperback");
    const [calcChannel, setCalcChannel] = useState("bookleaf");
    const [calcRsp, setCalcRsp] = useState(399);
    const [calcPages, setCalcPages] = useState(160);

    // Estimate print cost based on page count
    const estPrintCost = calcFormat === "ebook" ? 0 : Math.round(50 + calcPages * 0.55);

    // Calculate estimated royalty
    let estRoyalty = 0;
    if (calcFormat === "ebook") {
        estRoyalty = Math.round(calcRsp * 0.70);
    } else if (calcChannel === "bookleaf") {
        estRoyalty = Math.max(0, calcRsp - estPrintCost);
    } else {
        // Amazon / Flipkart (retailer takes ~45% discount of RSP, then minus print cost)
        const netReceipt = calcRsp * 0.55;
        estRoyalty = Math.max(0, Math.round(netReceipt - estPrintCost));
    }

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    const handlePrint = () => {
        window.print();
    };

    const toggleFaq = (idx) => {
        setOpenFaq(openFaq === idx ? null : idx);
    };

    const sections = [
        { id: "all", label: "Overview & Summary" },
        { id: "calculation", label: "Royalty Calculation" },
        { id: "channels", label: "Retail Channels" },
        { id: "schedule", label: "Payout Schedules" },
        { id: "taxes", label: "Tax & TDS" },
        { id: "copies", label: "Author Copies" },
        { id: "faqs", label: "Frequently Asked Questions" }
    ];

    const faqs = [
        {
            q: "How is author royalty calculated at BookLeaf?",
            a: "BookLeaf operates on a 100% net profit royalty model. For sales on the BookLeaf Store, royalty equals the Retail Selling Price (RSP) minus the Print-on-Demand (POD) production cost. For sales via third-party retailers (Amazon, Flipkart, Barnes & Noble), royalty equals the publisher net receipt (RSP minus the standard marketplace retail discount) minus the printing cost."
        },
        {
            q: "When and how are royalty disbursements released?",
            a: "Royalties are disbursed quarterly (Q1 in April, Q2 in July, Q3 in October, Q4 in January). If your accrued earnings reach the minimum threshold of ₹500 (or $25 USD for international accounts), payouts are automatically initiated via direct NEFT/RTGS bank transfer, UPI, or PayPal."
        },
        {
            q: "What happens if my earnings are below the ₹500 threshold?",
            a: "If your quarterly accrued royalties do not meet the minimum threshold, your balance rolls over automatically to the subsequent quarter until the payout threshold is reached. Your funds never expire."
        },
        {
            q: "How does Tax Deducted at Source (TDS) apply to my royalties?",
            a: "Under Section 194J/194F of the Indian Income Tax Act, TDS is deducted at 10% for authors with a verified PAN on record. If no PAN is provided, the statutory rate of 20% applies. Form 16A TDS certificates are generated and downloadable annually from your Author Central dashboard."
        },
        {
            q: "Can I order author copies of my own published book at production cost?",
            a: "Yes! Authors enjoy unlimited access to author copies at subsidized print-on-demand production cost plus shipping, with zero retail markup. Author copies can be ordered directly from your portal dashboard for book launches, workshops, and personal signings."
        },
        {
            q: "How can I dispute or verify my quarterly sales figures?",
            a: "Authors have a 45-day reconciliation window following each statement generation. You may open an Author Support Ticket directly from the portal with the category 'Royalty Inquiry' to request an itemized channel audit."
        }
    ];

    const quarters = [
        {
            quarter: "Q1",
            period: "January 1 – March 31",
            statementDate: "April 10",
            disbursementWindow: "April 15 – April 20",
            status: "Regular Cycle",
            isYearEnd: false,
        },
        {
            quarter: "Q2",
            period: "April 1 – June 30",
            statementDate: "July 10",
            disbursementWindow: "July 15 – July 20",
            status: "Regular Cycle",
            isYearEnd: false,
        },
        {
            quarter: "Q3",
            period: "July 1 – September 30",
            statementDate: "October 10",
            disbursementWindow: "October 15 – October 20",
            status: "Regular Cycle",
            isYearEnd: false,
        },
        {
            quarter: "Q4",
            period: "October 1 – December 31",
            statementDate: "January 10",
            disbursementWindow: "January 15 – January 20",
            status: "Year-End Cycle",
            isYearEnd: true,
        },
    ];

    const pageContent = (
        <div className="w-full space-y-6 sm:space-y-8">
            {/* Breadcrumb Navigation */}
            <nav className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-slate-400 font-medium">
                <Link to={user ? "/author/books" : "/"} className="hover:text-emerald-700 transition-colors">
                    {user ? "Author Central" : "Home"}
                </Link>
                <span>/</span>
                <span className="text-slate-600">Legal Governance</span>
                <span>/</span>
                <span className="text-emerald-700 font-semibold">Royalty Terms</span>
            </nav>

            {/* Hero Header Card */}
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-linear-to-br from-[#063B2B] via-[#0A553D] to-[#0E7052] p-5 sm:p-8 md:p-10 text-white shadow-xl shadow-emerald-950/15">
                <div className="absolute -right-12 -bottom-12 w-60 sm:w-80 h-60 sm:h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-0 right-1/4 w-32 sm:w-40 h-32 sm:h-40 bg-teal-300/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div className="max-w-2xl space-y-2.5 sm:space-y-3">
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 sm:px-3 rounded-full bg-emerald-900/60 border border-emerald-400/30 text-[10px] sm:text-[11px] font-mono tracking-wider uppercase text-emerald-200">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                            <span>Author Agreement Standard • 2026</span>
                        </div>
                        <h1 className="text-xl sm:text-3xl md:text-4xl font-serif font-bold tracking-tight text-white leading-tight">
                            Author Royalty Terms &amp; Disbursement Policy
                        </h1>
                        <p className="text-xs sm:text-sm md:text-base text-emerald-100/90 leading-relaxed font-sans">
                            Complete transparency in book production, retail distribution margins, and quarterly payout disbursements for all BookLeaf published authors.
                        </p>
                    </div>

                    {/* Quick action buttons */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={handleCopyLink}
                            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white transition-all cursor-pointer backdrop-blur-xs shadow-xs"
                            title="Copy link to clipboard"
                        >
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span>{copied ? "Copied!" : "Share Policy"}</span>
                        </button>
                        <button
                            type="button"
                            onClick={handlePrint}
                            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white transition-all cursor-pointer backdrop-blur-xs shadow-xs"
                            title="Print this policy document"
                        >
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            <span>Print Terms</span>
                        </button>
                        {user ? (
                            <Link
                                to="/author/tickets/new"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl bg-emerald-400 text-slate-900 hover:bg-emerald-300 text-xs font-bold transition-all shadow-md shadow-emerald-950/20"
                            >
                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Royalty Helpdesk</span>
                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl bg-emerald-400 text-slate-900 hover:bg-emerald-300 text-xs font-bold transition-all shadow-md shadow-emerald-950/20"
                            >
                                <span>Author Sign In</span>
                            </Link>
                        )}
                    </div>
                </div>

                {/* 4 Key Pillars Metrics Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-emerald-500/30">
                    <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 sm:p-3 border border-white/10 flex flex-col justify-between">
                        <div className="text-[10px] sm:text-[11px] font-medium text-emerald-200">Profit Share</div>
                        <div className="text-lg sm:text-2xl font-bold font-serif text-white my-0.5">100% Net</div>
                        <div className="text-[9px] sm:text-[10px] text-emerald-200/80 leading-tight">On direct portal sales</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 sm:p-3 border border-white/10 flex flex-col justify-between">
                        <div className="text-[10px] sm:text-[11px] font-medium text-emerald-200">Payout Frequency</div>
                        <div className="text-lg sm:text-2xl font-bold font-serif text-white my-0.5">Quarterly</div>
                        <div className="text-[9px] sm:text-[10px] text-emerald-200/80 leading-tight">Every 90 days scheduled</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 sm:p-3 border border-white/10 flex flex-col justify-between">
                        <div className="text-[10px] sm:text-[11px] font-medium text-emerald-200">Minimum Threshold</div>
                        <div className="text-lg sm:text-2xl font-bold font-serif text-white my-0.5">₹500 / $25</div>
                        <div className="text-[9px] sm:text-[10px] text-emerald-200/80 leading-tight">Auto-rollover if below</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 sm:p-3 border border-white/10 flex flex-col justify-between">
                        <div className="text-[10px] sm:text-[11px] font-medium text-emerald-200">Sales Reporting</div>
                        <div className="text-lg sm:text-2xl font-bold font-serif text-white my-0.5">Real-Time</div>
                        <div className="text-[9px] sm:text-[10px] text-emerald-200/80 leading-tight">Live dashboard tracking</div>
                    </div>
                </div>
            </div>

            {/* Quick Filter Navigation Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none border-b border-slate-200 overscroll-x-contain">
                {sections.map((sec) => (
                    <button
                        key={sec.id}
                        type="button"
                        onClick={() => setActiveSection(sec.id)}
                        className={`px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                            activeSection === sec.id
                                ? "bg-emerald-800 text-white shadow-xs"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        }`}
                    >
                        {sec.label}
                    </button>
                ))}
            </div>

            {/* ── Section 1: Royalty Calculation & Interactive Tool ────────── */}
            {(activeSection === "all" || activeSection === "calculation") && (
                <section className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 md:p-8 shadow-card space-y-5 sm:space-y-6">
                    <div className="flex items-start sm:items-center gap-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/80 flex items-center justify-center font-bold text-sm sm:text-base shrink-0">
                            01
                        </div>
                        <div>
                            <h2 className="text-base sm:text-xl font-serif font-bold text-slate-900 leading-tight">
                                Royalty Calculation &amp; Production Formula
                            </h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                How your earnings are determined for every copy sold worldwide.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
                        {/* Formula Explanation */}
                        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                            <p>
                                At BookLeaf Publishing, we believe authors should earn the maximum fruit of their creative dedication. We follow an <strong className="text-slate-900 font-semibold">Author-First Net Profit Royalty model</strong>, ensuring zero hidden royalty deductions.
                            </p>

                            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-emerald-800 font-bold block">
                                    Official Calculation Formula
                                </span>
                                <div className="font-mono text-xs sm:text-sm text-slate-900 font-semibold p-2.5 sm:p-3 bg-white rounded-lg border border-slate-200 break-words sm:break-normal">
                                    Author Royalty = Net Publisher Receipt − Print Production Cost (POD)
                                </div>
                                <p className="text-[11px] text-slate-500 leading-relaxed">
                                    • On BookLeaf Direct Store: Net Receipt = 100% of Retail Selling Price (RSP).<br />
                                    • On Retail Channels (Amazon / Flipkart): Net Receipt = RSP minus retailer commission (typically 40%–50%).
                                </p>
                            </div>

                            <ul className="space-y-2 text-xs text-slate-600">
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-600 font-bold mt-0.5 shrink-0">✓</span>
                                    <span><strong>Print-on-Demand (POD):</strong> Only exact copies printed for confirmed orders incur production cost. No upfront bulk printing debt.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-600 font-bold mt-0.5 shrink-0">✓</span>
                                    <span><strong>eBook Editions:</strong> Enjoy a flat 70% royalty on net receipts across Kindle, Google Play Books, and BookLeaf eBook store.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Interactive Calculator Card */}
                        <div className="p-4 sm:p-5 rounded-2xl bg-linear-to-br from-emerald-50/60 via-slate-50 to-teal-50/30 border border-emerald-100/80 shadow-xs space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                                    Interactive Royalty Estimator
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                                    Simulator
                                </span>
                            </div>

                            {/* Inputs */}
                            <div className="space-y-3.5 text-xs">
                                <div>
                                    <label className="text-slate-600 font-medium mb-1.5 block">Book Format</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setCalcFormat("paperback")}
                                            className={`py-2 px-3 rounded-lg border font-semibold text-xs transition-all cursor-pointer ${
                                                calcFormat === "paperback"
                                                    ? "bg-white border-emerald-600 text-emerald-800 shadow-xs"
                                                    : "bg-slate-100/60 border-slate-200 text-slate-600 hover:bg-white"
                                            }`}
                                        >
                                            Paperback
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setCalcFormat("ebook")}
                                            className={`py-2 px-3 rounded-lg border font-semibold text-xs transition-all cursor-pointer ${
                                                calcFormat === "ebook"
                                                    ? "bg-white border-emerald-600 text-emerald-800 shadow-xs"
                                                    : "bg-slate-100/60 border-slate-200 text-slate-600 hover:bg-white"
                                            }`}
                                        >
                                            Digital eBook
                                        </button>
                                    </div>
                                </div>

                                {calcFormat === "paperback" && (
                                    <>
                                        <div>
                                            <label className="text-slate-600 font-medium mb-1.5 block">Sales Channel</label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setCalcChannel("bookleaf")}
                                                    className={`py-2 px-3 rounded-lg border font-semibold text-xs transition-all cursor-pointer text-left sm:text-center ${
                                                        calcChannel === "bookleaf"
                                                            ? "bg-white border-emerald-600 text-emerald-800 shadow-xs"
                                                            : "bg-slate-100/60 border-slate-200 text-slate-600 hover:bg-white"
                                                    }`}
                                                >
                                                    BookLeaf Direct (100% Net)
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setCalcChannel("retail")}
                                                    className={`py-2 px-3 rounded-lg border font-semibold text-xs transition-all cursor-pointer text-left sm:text-center ${
                                                        calcChannel === "retail"
                                                            ? "bg-white border-emerald-600 text-emerald-800 shadow-xs"
                                                            : "bg-slate-100/60 border-slate-200 text-slate-600 hover:bg-white"
                                                    }`}
                                                >
                                                    Amazon / Flipkart
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-slate-600 font-medium mb-1">
                                                <span>Book Page Count</span>
                                                <span className="font-semibold text-slate-900">{calcPages} pages</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="64"
                                                max="450"
                                                step="10"
                                                value={calcPages}
                                                onChange={(e) => setCalcPages(Number(e.target.value))}
                                                className="w-full accent-emerald-700 cursor-pointer h-2 bg-slate-200 rounded-lg"
                                            />
                                        </div>
                                    </>
                                )}

                                <div>
                                    <div className="flex justify-between text-slate-600 font-medium mb-1">
                                        <span>Retail Selling Price (RSP)</span>
                                        <span className="font-bold text-slate-900">₹{calcRsp}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={calcFormat === "ebook" ? 49 : 199}
                                        max={calcFormat === "ebook" ? 499 : 999}
                                        step="10"
                                        value={calcRsp}
                                        onChange={(e) => setCalcRsp(Number(e.target.value))}
                                        className="w-full accent-emerald-700 cursor-pointer h-2 bg-slate-200 rounded-lg"
                                    />
                                </div>
                            </div>

                            {/* Result Display */}
                            <div className="pt-3 border-t border-emerald-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                                <div>
                                    <div className="text-[10px] text-slate-500 font-medium">Estimated Author Royalty</div>
                                    <div className="text-xl sm:text-2xl font-serif font-bold text-emerald-800">
                                        ₹{estRoyalty} <span className="text-xs font-sans text-slate-500 font-normal">/ copy sold</span>
                                    </div>
                                </div>
                                <div className="text-left sm:text-right text-[11px] text-slate-500">
                                    {calcFormat === "paperback" ? (
                                        <>Est. POD Print: ₹{estPrintCost}</>
                                    ) : (
                                        <>Flat 70% Net Share</>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ── Section 2: Distribution Channels Breakdown ──────────────── */}
            {(activeSection === "all" || activeSection === "channels") && (
                <section className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 md:p-8 shadow-card space-y-5 sm:space-y-6">
                    <div className="flex items-start sm:items-center gap-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-50 text-teal-800 border border-teal-200/80 flex items-center justify-center font-bold text-sm sm:text-base shrink-0">
                            02
                        </div>
                        <div>
                            <h2 className="text-base sm:text-xl font-serif font-bold text-slate-900 leading-tight">
                                Retail &amp; Global Distribution Channels
                            </h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                How each marketplace operates and passes earnings to your author account.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                        <div className="p-4 sm:p-5 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">BookLeaf Store</span>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-700 text-white shrink-0">Highest Margin</span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Direct storefront orders carry <strong>zero retailer commission</strong>. Authors retain 100% of profit after subtracting actual print-on-demand cost.
                            </p>
                            <div className="pt-2 border-t border-emerald-200/60 text-xs font-semibold text-emerald-800">
                                Royalty: 100% Net Profit
                            </div>
                        </div>

                        <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-white space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Amazon &amp; Flipkart</span>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700 shrink-0">National Retail</span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Standard retail marketplaces deduct a 40%–50% commercial discount plus delivery fees. The remaining publisher receipt minus print cost is paid in full to the author.
                            </p>
                            <div className="pt-2 border-t border-slate-200 text-xs font-semibold text-slate-800">
                                Royalty: 100% of Publisher Net Receipt
                            </div>
                        </div>

                        <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-white space-y-3 sm:col-span-2 lg:col-span-1">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Ingram &amp; Global</span>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700 shrink-0">140+ Countries</span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                International orders distributed across Barnes &amp; Noble, Waterstones, and global catalog feeds are settled in USD/INR post cross-border handling fees.
                            </p>
                            <div className="pt-2 border-t border-slate-200 text-xs font-semibold text-slate-800">
                                Royalty: Wholesale Net Proceeds
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ── Section 3: Disbursement Schedule & Minimum Threshold ────── */}
            {(activeSection === "all" || activeSection === "schedule") && (
                <section className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 md:p-8 shadow-card space-y-5 sm:space-y-6">
                    <div className="flex items-start sm:items-center gap-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/80 flex items-center justify-center font-bold text-sm sm:text-base shrink-0">
                            03
                        </div>
                        <div>
                            <h2 className="text-base sm:text-xl font-serif font-bold text-slate-900 leading-tight">
                                Quarterly Disbursement Calendar &amp; Payout Rules
                            </h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Scheduled payout cycles, statement generation timelines, and rollover policies.
                            </p>
                        </div>
                    </div>

                    {/* Responsive View: Cards for Mobile (< md), Table for Desktop (>= md) */}
                    <div className="space-y-3">
                        {/* Mobile Cards (< md) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 md:hidden">
                            {quarters.map((q) => (
                                <div
                                    key={q.quarter}
                                    className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-xs hover:border-emerald-300 transition-colors"
                                >
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                                        <div className="flex items-center gap-2">
                                            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 font-bold font-serif flex items-center justify-center text-sm border border-emerald-200/80">
                                                {q.quarter}
                                            </span>
                                            <span className="text-xs font-bold text-slate-900">
                                                Fiscal Quarter {q.quarter}
                                            </span>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                                            q.isYearEnd
                                                ? "bg-slate-100 text-slate-700 border-slate-200"
                                                : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        }`}>
                                            {q.status}
                                        </span>
                                    </div>

                                    <div className="space-y-1.5 text-xs">
                                        <div className="flex justify-between items-center py-1 border-b border-slate-100 text-slate-600">
                                            <span className="text-slate-400">Sales Period:</span>
                                            <span className="font-semibold text-slate-800 text-right">{q.period}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-1 border-b border-slate-100 text-slate-600">
                                            <span className="text-slate-400">Statement Date:</span>
                                            <span className="font-semibold text-slate-800">{q.statementDate}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-1.5 bg-emerald-50/70 px-2.5 rounded-lg text-emerald-950">
                                            <span className="text-emerald-700 font-medium">Disbursement:</span>
                                            <span className="font-bold text-emerald-800">{q.disbursementWindow}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop & Tablet Table (>= md) */}
                        <div className="hidden md:block overflow-x-auto border border-slate-200 rounded-xl">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[11px] border-b border-slate-200">
                                    <tr>
                                        <th className="py-3 px-4">Fiscal Quarter</th>
                                        <th className="py-3 px-4">Sales Period Covered</th>
                                        <th className="py-3 px-4">Statement Date</th>
                                        <th className="py-3 px-4">Disbursement Window</th>
                                        <th className="py-3 px-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 font-sans text-slate-600">
                                    {quarters.map((q) => (
                                        <tr key={q.quarter} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-3 px-4 font-bold text-slate-900">{q.quarter}</td>
                                            <td className="py-3 px-4">{q.period}</td>
                                            <td className="py-3 px-4">{q.statementDate}</td>
                                            <td className="py-3 px-4 text-emerald-700 font-semibold">{q.disbursementWindow}</td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                                                    q.isYearEnd
                                                        ? "bg-slate-100 text-slate-700 border-slate-200"
                                                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                }`}>
                                                    {q.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="p-3.5 sm:p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs text-amber-900 leading-relaxed flex items-start gap-3">
                        <svg className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <strong className="font-semibold">Minimum Payout Threshold (₹500 / $25):</strong> If total quarterly accrued royalty is below ₹500, the amount is automatically transferred to the next quarter’s cycle and accumulates continuously. You never forfeit accrued earnings.
                        </div>
                    </div>
                </section>
            )}

            {/* ── Section 4: Taxes & Statutory Withholding (TDS) ───────────── */}
            {(activeSection === "all" || activeSection === "taxes") && (
                <section className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 md:p-8 shadow-card space-y-5 sm:space-y-6">
                    <div className="flex items-start sm:items-center gap-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-50 text-purple-800 border border-purple-200/80 flex items-center justify-center font-bold text-sm sm:text-base shrink-0">
                            04
                        </div>
                        <div>
                            <h2 className="text-base sm:text-xl font-serif font-bold text-slate-900 leading-tight">
                                Tax Compliance &amp; TDS Regulations
                            </h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Statutory withholding, PAN validation, and annual tax certificates.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 text-xs text-slate-600 leading-relaxed">
                        <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                            <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Domestic Indian Authors (Section 194J)</h3>
                            <p>
                                Royalty paid for literary publications is governed by Section 194J of the Income Tax Act.
                            </p>
                            <ul className="space-y-1.5 pl-4 list-disc text-slate-600">
                                <li><strong>Verified PAN on Record:</strong> TDS is withheld at the standard statutory rate of <strong>10%</strong>.</li>
                                <li><strong>No PAN / Invalid PAN:</strong> As per Section 206AA, TDS must be deducted at <strong>20%</strong>.</li>
                                <li><strong>Form 16A TDS Certificates:</strong> Issued quarterly/annually and deposited under your PAN on TRACES.</li>
                            </ul>
                        </div>

                        <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                            <h3 className="font-bold text-slate-900 text-xs sm:text-sm">International Authors &amp; Double Taxation</h3>
                            <p>
                                Cross-border royalties are disbursed via PayPal or international wire in USD/EUR/GBP.
                            </p>
                            <ul className="space-y-1.5 pl-4 list-disc text-slate-600">
                                <li>Authors resident in countries with a Double Taxation Avoidance Agreement (DTAA) with India may submit a Tax Residency Certificate (TRC) to claim treaty relief.</li>
                                <li>Foreign exchange conversion rates applied are the wholesale interbank rate at time of batch settlement.</li>
                            </ul>
                        </div>
                    </div>
                </section>
            )}

            {/* ── Section 5: Author Copies ─────────────────────────────────── */}
            {(activeSection === "all" || activeSection === "copies") && (
                <section className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 md:p-8 shadow-card space-y-5 sm:space-y-6">
                    <div className="flex items-start sm:items-center gap-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-50 text-rose-800 border border-rose-200/80 flex items-center justify-center font-bold text-sm sm:text-base shrink-0">
                            05
                        </div>
                        <div>
                            <h2 className="text-base sm:text-xl font-serif font-bold text-slate-900 leading-tight">
                                Subsidized Author Copies &amp; Print Orders
                            </h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Unlimited personal copies at subsidized production cost.
                            </p>
                        </div>
                    </div>

                    <div className="p-4 sm:p-5 rounded-xl bg-linear-to-r from-rose-50/50 to-white border border-rose-100 text-xs text-slate-600 leading-relaxed space-y-3">
                        <p>
                            Authors have the right to order copies of their own published works in any quantity (from 1 copy to 5,000+ copies) strictly at <strong>base Print-on-Demand production cost plus shipping</strong>, without any publisher commission or retail markups.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                            <div className="p-3 rounded-lg bg-white border border-rose-200/70">
                                <div className="font-bold text-slate-900">No Minimum Order</div>
                                <div className="text-[11px] text-slate-500 mt-0.5">Order as few as 1 copy whenever needed.</div>
                            </div>
                            <div className="p-3 rounded-lg bg-white border border-rose-200/70">
                                <div className="font-bold text-slate-900">100% Author Retained</div>
                                <div className="text-[11px] text-slate-500 mt-0.5">Keep 100% of proceeds from direct book sales &amp; signings.</div>
                            </div>
                            <div className="p-3 rounded-lg bg-white border border-rose-200/70">
                                <div className="font-bold text-slate-900">Fast Priority Dispatch</div>
                                <div className="text-[11px] text-slate-500 mt-0.5">Dedicated printer queues for author events.</div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ── Section 6: Frequently Asked Questions ────────────────────── */}
            {(activeSection === "all" || activeSection === "faqs") && (
                <section className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 md:p-8 shadow-card space-y-5 sm:space-y-6">
                    <div className="flex items-start sm:items-center gap-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center font-bold text-sm sm:text-base shrink-0">
                            06
                        </div>
                        <div>
                            <h2 className="text-base sm:text-xl font-serif font-bold text-slate-900 leading-tight">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Clear answers to author questions regarding royalty calculations and disbursements.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2.5">
                        {faqs.map((faq, idx) => (
                            <div
                                key={idx}
                                className="border border-slate-200 rounded-xl overflow-hidden transition-all duration-200 bg-white"
                            >
                                <button
                                    type="button"
                                    onClick={() => toggleFaq(idx)}
                                    className="w-full text-left px-3.5 py-3 sm:px-4 sm:py-3.5 flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                    <span className="leading-snug">{faq.q}</span>
                                    <svg
                                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                                            openFaq === idx ? "rotate-180 text-emerald-700" : ""
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {openFaq === idx && (
                                    <div className="px-3.5 pb-3.5 pt-1 sm:px-4 sm:pb-4 sm:pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Direct Support Contact Banner */}
            <div className="rounded-2xl border border-emerald-200 bg-linear-to-r from-emerald-50 via-teal-50/40 to-slate-50 p-5 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 shadow-xs">
                <div className="space-y-1.5 text-center md:text-left">
                    <h3 className="text-sm sm:text-base md:text-lg font-serif font-bold text-emerald-950">
                        Have questions about an upcoming royalty disbursement?
                    </h3>
                    <p className="text-xs text-slate-600 max-w-xl">
                        Our Author Relations &amp; Accounts Desk is available to answer any questions or provide an itemized sales audit.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full md:w-auto shrink-0">
                    <Link
                        to="/privacy-policy"
                        className="text-center px-4 py-2.5 rounded-xl border border-emerald-300 bg-white text-emerald-800 text-xs font-semibold hover:bg-emerald-50 shadow-xs transition-all"
                    >
                        View Privacy Charter
                    </Link>
                    {user ? (
                        <Link
                            to="/author/tickets/new"
                            className="text-center px-5 py-2.5 rounded-xl bg-[#0E7052] hover:bg-[#0A553D] text-white text-xs font-semibold shadow-xs transition-all"
                        >
                            Submit Royalty Query
                        </Link>
                    ) : (
                        <Link
                            to="/login"
                            className="text-center px-5 py-2.5 rounded-xl bg-[#0E7052] hover:bg-[#0A553D] text-white text-xs font-semibold shadow-xs transition-all"
                        >
                            Sign In to Portal
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );

    // If viewed standalone (outside the author AppShell), wrap in responsive header and footer
    if (!isInsideAuthorShell) {
        return (
            <div className="min-h-screen bg-[#FBFBFB] flex flex-col font-sans text-slate-800 antialiased selection:bg-emerald-100 selection:text-emerald-900">
                {/* Standalone Public Header */}
                <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-subtle">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
                        <Link to="/" className="flex items-center gap-2 sm:gap-2.5 shrink-0 group">
                            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#14532d] to-[#022c22] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                                <svg className="w-4 h-4 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </div>
                            <span className="font-serif-title font-bold text-slate-900 text-base sm:text-lg">
                                BookLeaf <span className="hidden xs:inline">Publishing</span>
                            </span>
                        </Link>
                        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                            <Link
                                to="/privacy-policy"
                                className="text-xs font-medium text-slate-600 hover:text-emerald-700 transition-colors px-2 py-1"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                to={user ? "/author/books" : "/login"}
                                className="px-3 sm:px-3.5 py-1.5 rounded-lg bg-[#0E7052] text-white text-xs font-semibold hover:bg-[#0A553D] transition-colors shadow-xs"
                            >
                                {user ? "Author Central" : "Sign In"}
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
                    {pageContent}
                </main>

                {/* Standalone Public Footer */}
                <footer className="mt-auto border-t border-slate-200 bg-white py-6">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-2 text-center sm:text-left">
                            <span className="font-serif-title font-semibold text-slate-900 text-sm">BookLeaf Publishing</span>
                            <span>•</span>
                            <span>Author Legal Governance</span>
                        </div>
                        <div className="flex items-center gap-5 font-medium">
                            <Link to="/royalty-terms" className="text-emerald-700 font-semibold">Royalty Terms</Link>
                            <Link to="/privacy-policy" className="hover:text-emerald-700 transition-colors">Privacy Policy</Link>
                        </div>
                    </div>
                </footer>
            </div>
        );
    }

    // Inside Author Shell: AppShell provides header, main padding, and footer
    return (
        <div className="w-full max-w-6xl mx-auto pb-8">
            {pageContent}
        </div>
    );
}
