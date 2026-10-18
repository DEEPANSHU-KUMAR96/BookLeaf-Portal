import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/hook/useAuth";

export default function PrivacyPolicyPage() {
    const { user } = useAuth();
    const location = useLocation();
    const isInsideAuthorShell = location.pathname.startsWith("/author");

    const [activeSection, setActiveSection] = useState("all");
    const [copied, setCopied] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);

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
        { id: "all", label: "Complete Policy" },
        { id: "collection", label: "Information We Collect" },
        { id: "manuscripts", label: "Manuscript & IP Protection" },
        { id: "usage", label: "How Data Is Used" },
        { id: "sharing", label: "Third-Party Sharing" },
        { id: "rights", label: "Your Author Rights" },
        { id: "dpo", label: "DPO & Contact" }
    ];

    const privacyFaqs = [
        {
            q: "Does BookLeaf own or claim any rights to my uploaded manuscript?",
            a: "Never. You retain 100% of your copyright, creative ownership, and intellectual property. BookLeaf acts strictly as your authorized publisher, distributor, and print-on-demand partner as defined in your author publishing agreement."
        },
        {
            q: "Are author manuscripts or book contents used to train artificial intelligence (AI) models?",
            a: "No. BookLeaf strictly prohibits the utilization of unreleased author drafts, manuscripts, or creative text for training external generative AI models or machine learning algorithms."
        },
        {
            q: "Who has access to my bank account and tax information (PAN / SSN)?",
            a: "Financial identifiers are stored using bank-grade AES-256 encryption. Only authorized accounts personnel have restricted access solely for quarterly royalty disbursements, statutory TDS withholding, and issuing Form 16A certificates."
        },
        {
            q: "How can I request a complete export or deletion of my author data?",
            a: "Under the Digital Personal Data Protection (DPDP) Act and GDPR, you have the right to request a data portability export or account erasure. Simply open an Author Support Ticket or email our Data Protection Officer at privacy@bookleafpublishing.in."
        }
    ];

    const thirdPartyPartners = [
        {
            entity: "Retail Distribution (Amazon, Flipkart, Ingram)",
            badge: "Global Feeds",
            info: "Book title, author public pen name, blurb, cover preview, ISBN, pricing",
            purpose: "Listing on global eCommerce catalogs",
            safeguard: "Standard ONIX metadata feeds"
        },
        {
            entity: "Print-on-Demand Press Facilities",
            badge: "Print Facilities",
            info: "Print interior PDF, cover wrap file, print quantities",
            purpose: "Physical book manufacturing",
            safeguard: "Non-Disclosure Agreements (NDA)"
        },
        {
            entity: "Banking & Settlement Gateways (Cashfree / Razorpay / Banks)",
            badge: "Direct Settlements",
            info: "Bank account number, IFSC, payout amount, author legal name",
            purpose: "Disbursing quarterly author royalties",
            safeguard: "PCI-DSS & RBI banking encryption"
        },
        {
            entity: "Government Tax Authorities (Income Tax India)",
            badge: "Statutory Tax Cell",
            info: "PAN, annual royalty paid, TDS withheld",
            purpose: "Statutory Section 194J compliance",
            safeguard: "Government TRACES portal"
        }
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
                <span className="text-emerald-700 font-semibold">Privacy Policy</span>
            </nav>

            {/* Hero Header Card */}
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-linear-to-br from-[#063B2B] via-[#0A553D] to-[#0E7052] p-5 sm:p-8 md:p-10 text-white shadow-xl shadow-emerald-950/15">
                <div className="absolute -right-12 -bottom-12 w-60 sm:w-80 h-60 sm:h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-0 right-1/4 w-32 sm:w-40 h-32 sm:h-40 bg-teal-300/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div className="max-w-2xl space-y-2.5 sm:space-y-3">
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 sm:px-3 rounded-full bg-emerald-900/60 border border-emerald-400/30 text-[10px] sm:text-[11px] font-mono tracking-wider uppercase text-emerald-200">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                            <span>Author Charter • Effective 2026</span>
                        </div>
                        <h1 className="text-xl sm:text-3xl md:text-4xl font-serif font-bold tracking-tight text-white leading-tight">
                            Author Privacy &amp; Data Protection Charter
                        </h1>
                        <p className="text-xs sm:text-sm md:text-base text-emerald-100/90 leading-relaxed font-sans">
                            Our solemn commitment to protecting author intellectual property, manuscript confidentiality, tax credentials, and payout information.
                        </p>
                    </div>

                    {/* Quick action buttons */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={handleCopyLink}
                            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white transition-all cursor-pointer backdrop-blur-xs shadow-xs"
                            title="Copy policy link"
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
                            <span>Print Policy</span>
                        </button>
                        {user ? (
                            <Link
                                to="/author/tickets/new"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl bg-emerald-400 text-slate-900 hover:bg-emerald-300 text-xs font-bold transition-all shadow-md shadow-emerald-950/20"
                            >
                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span>Privacy Officer</span>
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

                {/* 4 Guarantees Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-emerald-500/30">
                    <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 sm:p-3 border border-white/10 flex flex-col justify-between">
                        <div className="text-[10px] sm:text-[11px] font-medium text-emerald-200">Copyright Retained</div>
                        <div className="text-lg sm:text-2xl font-bold font-serif text-white my-0.5">100% Author</div>
                        <div className="text-[9px] sm:text-[10px] text-emerald-200/80 leading-tight">Full IP remains with you</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 sm:p-3 border border-white/10 flex flex-col justify-between">
                        <div className="text-[10px] sm:text-[11px] font-medium text-emerald-200">AI Model Training</div>
                        <div className="text-lg sm:text-2xl font-bold font-serif text-white my-0.5">Zero Opt-Out</div>
                        <div className="text-[9px] sm:text-[10px] text-emerald-200/80 leading-tight">Never used for AI models</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 sm:p-3 border border-white/10 flex flex-col justify-between">
                        <div className="text-[10px] sm:text-[11px] font-medium text-emerald-200">Data Encryption</div>
                        <div className="text-lg sm:text-2xl font-bold font-serif text-white my-0.5">AES-256</div>
                        <div className="text-[9px] sm:text-[10px] text-emerald-200/80 leading-tight">Bank-grade vaulting</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 sm:p-3 border border-white/10 flex flex-col justify-between">
                        <div className="text-[10px] sm:text-[11px] font-medium text-emerald-200">Compliance Standard</div>
                        <div className="text-lg sm:text-2xl font-bold font-serif text-white my-0.5">DPDP / GDPR</div>
                        <div className="text-[9px] sm:text-[10px] text-emerald-200/80 leading-tight">Statutory privacy rights</div>
                    </div>
                </div>
            </div>

            {/* Quick Navigation Pills */}
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

            {/* ── Section 1: Categories of Information Collected ───────────── */}
            {(activeSection === "all" || activeSection === "collection") && (
                <section className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 md:p-8 shadow-card space-y-5 sm:space-y-6">
                    <div className="flex items-start sm:items-center gap-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/80 flex items-center justify-center font-bold text-sm sm:text-base shrink-0">
                            01
                        </div>
                        <div>
                            <h2 className="text-base sm:text-xl font-serif font-bold text-slate-900 leading-tight">
                                Categories of Information We Collect
                            </h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Necessary information required to publish your book and disburse author royalties.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 text-xs text-slate-600 leading-relaxed">
                        <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                            <h3 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"></span>
                                Author Identity &amp; Contact Credentials
                            </h3>
                            <p>
                                Legal name, pen name/pseudonym, email address, contact telephone number, postal mailing address for sample book shipments, and author biographical note.
                            </p>
                        </div>

                        <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                            <h3 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"></span>
                                Banking &amp; Statutory Tax Identifiers
                            </h3>
                            <p>
                                Bank account number, IFSC code, account holder name, UPI ID, and Permanent Account Number (PAN) or international tax ID for statutory TDS withholding under the Indian Income Tax Act.
                            </p>
                        </div>

                        <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                            <h3 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"></span>
                                Creative Assets &amp; Manuscript Files
                            </h3>
                            <p>
                                Text manuscripts, cover design illustrations, front-matter acknowledgments, ISBN assignment metadata, and publication catalog attributes.
                            </p>
                        </div>

                        <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                            <h3 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"></span>
                                Sales, Royalties &amp; Ticket Telemetry
                            </h3>
                            <p>
                                Real-time book sales records across channels, historical quarterly royalty statements, support ticket dialogues, and portal activity logs.
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {/* ── Section 2: Manuscript & IP Protection Guarantee ─────────── */}
            {(activeSection === "all" || activeSection === "manuscripts") && (
                <section className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 md:p-8 shadow-card space-y-5 sm:space-y-6">
                    <div className="flex items-start sm:items-center gap-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-50 text-teal-800 border border-teal-200/80 flex items-center justify-center font-bold text-sm sm:text-base shrink-0">
                            02
                        </div>
                        <div>
                            <h2 className="text-base sm:text-xl font-serif font-bold text-slate-900 leading-tight">
                                Absolute Manuscript Confidentiality &amp; IP Protection
                            </h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Your literary creation is sacred. Here is our binding legal guarantee.
                            </p>
                        </div>
                    </div>

                    <div className="p-4 sm:p-6 rounded-2xl bg-linear-to-r from-emerald-50/60 to-teal-50/30 border border-emerald-200/80 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-emerald-700 text-white shrink-0 mt-0.5">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <div className="space-y-1.5 sm:space-y-2">
                                <h3 className="font-bold text-emerald-950 text-sm sm:text-base">
                                    Full Copyright Retained by the Author
                                </h3>
                                <p className="text-xs sm:text-sm">
                                    Under no circumstances does BookLeaf Publishing acquire ownership of your literary work. All copyright, moral rights, derivative adaptation rights, screen adaptation rights, and future reprint privileges remain exclusively with the author.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                            <div className="p-3 sm:p-3.5 rounded-xl bg-white border border-emerald-100 shadow-xs space-y-1">
                                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                                    <span className="text-emerald-600 font-bold">✓</span> No Unauthorized AI Mining
                                </span>
                                <p className="text-slate-600 text-[11px] leading-relaxed">
                                    We do not monetize, scrape, or feed author manuscripts to external large language models (LLMs) or artificial intelligence datasets.
                                </p>
                            </div>
                            <div className="p-3 sm:p-3.5 rounded-xl bg-white border border-emerald-100 shadow-xs space-y-1">
                                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                                    <span className="text-emerald-600 font-bold">✓</span> Strict Pre-Publication Secrecy
                                </span>
                                <p className="text-slate-600 text-[11px] leading-relaxed">
                                    Unpublished drafts are accessible only to your designated editorial manager, formatting typographer, and certified print technician.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ── Section 3: How Your Data Is Used ─────────────────────────── */}
            {(activeSection === "all" || activeSection === "usage") && (
                <section className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 md:p-8 shadow-card space-y-5 sm:space-y-6">
                    <div className="flex items-start sm:items-center gap-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/80 flex items-center justify-center font-bold text-sm sm:text-base shrink-0">
                            03
                        </div>
                        <div>
                            <h2 className="text-base sm:text-xl font-serif font-bold text-slate-900 leading-tight">
                                How Your Data Is Processed
                            </h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Legitimate, transparent purposes supporting publication and author services.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 text-xs text-slate-600">
                        <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-xs sm:text-sm">
                                01
                            </div>
                            <h3 className="font-bold text-slate-900 text-xs sm:text-sm">ISBN Allocation &amp; Cataloging</h3>
                            <p className="leading-relaxed">
                                Transmitting book metadata to official national agencies (Raja Rammohun Roy National Agency / Bowker) to assign legal ISBNs.
                            </p>
                        </div>

                        <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-xs sm:text-sm">
                                02
                            </div>
                            <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Royalty Settlements</h3>
                            <p className="leading-relaxed">
                                Processing automated NEFT/RTGS payments, generating quarterly sales statements, and filing statutory TDS returns with income tax authorities.
                            </p>
                        </div>

                        <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-white space-y-2 sm:col-span-2 lg:col-span-1">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-xs sm:text-sm">
                                03
                            </div>
                            <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Print &amp; Order Fulfillment</h3>
                            <p className="leading-relaxed">
                                Securely transmitting print-ready interior PDFs and cover files to accredited POD press facilities upon customer order placement.
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {/* ── Section 4: Third-Party Data Sharing ─────────────────────── */}
            {(activeSection === "all" || activeSection === "sharing") && (
                <section className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 md:p-8 shadow-card space-y-5 sm:space-y-6">
                    <div className="flex items-start sm:items-center gap-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-50 text-purple-800 border border-purple-200/80 flex items-center justify-center font-bold text-sm sm:text-base shrink-0">
                            04
                        </div>
                        <div>
                            <h2 className="text-base sm:text-xl font-serif font-bold text-slate-900 leading-tight">
                                Controlled Third-Party Sharing Protocols
                            </h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                We never sell author personal data. Data is shared exclusively with critical fulfillment partners.
                            </p>
                        </div>
                    </div>

                    {/* Responsive View: Cards for Mobile (< md), Table for Desktop (>= md) */}
                    <div className="space-y-3">
                        {/* Mobile Cards (< md) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 md:hidden">
                            {thirdPartyPartners.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-xs hover:border-emerald-300 transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                                        <div>
                                            <span className="text-xs font-bold text-slate-900 leading-snug block">
                                                {item.entity}
                                            </span>
                                            <span className="text-[11px] text-emerald-700 font-medium">
                                                {item.purpose}
                                            </span>
                                        </div>
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/80 shrink-0">
                                            {item.badge}
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-xs">
                                        <div>
                                            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                                                Information Shared
                                            </span>
                                            <p className="text-slate-600 mt-0.5 leading-relaxed">
                                                {item.info}
                                            </p>
                                        </div>
                                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
                                            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                                                Safeguard Standard
                                            </span>
                                            <span className="text-emerald-800 font-semibold text-xs mt-0.5 flex items-center gap-1.5">
                                                <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                                {item.safeguard}
                                            </span>
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
                                        <th className="py-3 px-4">Entity / Category</th>
                                        <th className="py-3 px-4">Information Shared</th>
                                        <th className="py-3 px-4">Purpose</th>
                                        <th className="py-3 px-4">Safeguard Standards</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 font-sans text-slate-600">
                                    {thirdPartyPartners.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-3 px-4 font-bold text-slate-900 max-w-[200px]">
                                                {item.entity}
                                            </td>
                                            <td className="py-3 px-4 leading-relaxed">
                                                {item.info}
                                            </td>
                                            <td className="py-3 px-4 leading-relaxed">
                                                {item.purpose}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-emerald-700 font-medium inline-flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                                    {item.safeguard}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            )}

            {/* ── Section 5: Author Rights & Account Portability ──────────── */}
            {(activeSection === "all" || activeSection === "rights") && (
                <section className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 md:p-8 shadow-card space-y-5 sm:space-y-6">
                    <div className="flex items-start sm:items-center gap-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 text-blue-800 border border-blue-200/80 flex items-center justify-center font-bold text-sm sm:text-base shrink-0">
                            05
                        </div>
                        <div>
                            <h2 className="text-base sm:text-xl font-serif font-bold text-slate-900 leading-tight">
                                Your Statutory Rights Under DPDP Act &amp; GDPR
                            </h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                You hold full sovereignty over your personal profile, manuscripts, and account data.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                        <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                            <div className="font-bold text-slate-900 text-xs sm:text-sm">Right to Access</div>
                            <p className="text-slate-600 leading-relaxed">Inspect all stored profile attributes, books, and royalty ledgers anytime.</p>
                        </div>
                        <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                            <div className="font-bold text-slate-900 text-xs sm:text-sm">Right to Rectify</div>
                            <p className="text-slate-600 leading-relaxed">Update payment accounts, pen names, or contact information instantly via portal.</p>
                        </div>
                        <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                            <div className="font-bold text-slate-900 text-xs sm:text-sm">Data Portability</div>
                            <p className="text-slate-600 leading-relaxed">Download formatted sales statements and book catalog metadata as JSON/PDF.</p>
                        </div>
                        <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                            <div className="font-bold text-slate-900 text-xs sm:text-sm">Right to Erasure</div>
                            <p className="text-slate-600 leading-relaxed">Request deletion of personal credentials upon termination of publishing agreement.</p>
                        </div>
                    </div>
                </section>
            )}

            {/* ── Section 6: Frequently Asked Privacy Questions ────────────── */}
            {(activeSection === "all" || activeSection === "dpo") && (
                <section className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 md:p-8 shadow-card space-y-5 sm:space-y-6">
                    <div className="flex items-start sm:items-center gap-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center font-bold text-sm sm:text-base shrink-0">
                            06
                        </div>
                        <div>
                            <h2 className="text-base sm:text-xl font-serif font-bold text-slate-900 leading-tight">
                                Privacy Policy Inquiries &amp; Officer Contact
                            </h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Directly contact our Data Protection and Grievance Officer.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2.5">
                        {privacyFaqs.map((faq, idx) => (
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

                    {/* DPO Officer Contact Card */}
                    <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                        <div className="space-y-1 max-w-xl">
                            <span className="font-bold text-slate-900 text-xs sm:text-sm block">Designated Data Protection Officer (DPO)</span>
                            <p className="text-slate-600">
                                BookLeaf Publishing Legal &amp; Compliance Cell • Grievance Redressal Officer
                            </p>
                            <p className="text-slate-500 break-all sm:break-normal">
                                Email: <a href="mailto:privacy@bookleafpublishing.in" className="text-emerald-700 hover:underline font-semibold">privacy@bookleafpublishing.in</a> • Response window: within 48 business hours
                            </p>
                        </div>
                        {user ? (
                            <Link
                                to="/author/tickets/new"
                                className="w-full sm:w-auto text-center px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 font-semibold hover:border-emerald-600 hover:text-emerald-700 transition-colors shadow-xs shrink-0"
                            >
                                Open Privacy Query
                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                className="w-full sm:w-auto text-center px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 font-semibold hover:border-emerald-600 hover:text-emerald-700 transition-colors shadow-xs shrink-0"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </section>
            )}

            {/* Direct Support Contact Banner */}
            <div className="rounded-2xl border border-emerald-200 bg-linear-to-r from-emerald-50 via-teal-50/40 to-slate-50 p-5 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 shadow-xs">
                <div className="space-y-1.5 text-center md:text-left">
                    <h3 className="text-sm sm:text-base md:text-lg font-serif font-bold text-emerald-950">
                        Need clarification on your author data or privacy settings?
                    </h3>
                    <p className="text-xs text-slate-600 max-w-xl">
                        Our Author Compliance Desk is always here to assist with any intellectual property or account inquiries.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full md:w-auto shrink-0">
                    <Link
                        to="/royalty-terms"
                        className="text-center px-4 py-2.5 rounded-xl border border-emerald-300 bg-white text-emerald-800 text-xs font-semibold hover:bg-emerald-50 shadow-xs transition-all"
                    >
                        View Royalty Terms
                    </Link>
                    {user ? (
                        <Link
                            to="/author/tickets/new"
                            className="text-center px-5 py-2.5 rounded-xl bg-[#0E7052] hover:bg-[#0A553D] text-white text-xs font-semibold shadow-xs transition-all"
                        >
                            Contact Support
                        </Link>
                    ) : (
                        <Link
                            to="/login"
                            className="text-center px-5 py-2.5 rounded-xl bg-[#0E7052] hover:bg-[#0A553D] text-white text-xs font-semibold shadow-xs transition-all"
                        >
                            Sign In
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
                                to="/royalty-terms"
                                className="text-xs font-medium text-slate-600 hover:text-emerald-700 transition-colors px-2 py-1"
                            >
                                Royalty Terms
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
                            <Link to="/royalty-terms" className="hover:text-emerald-700 transition-colors">Royalty Terms</Link>
                            <Link to="/privacy-policy" className="text-emerald-700 font-semibold">Privacy Policy</Link>
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
