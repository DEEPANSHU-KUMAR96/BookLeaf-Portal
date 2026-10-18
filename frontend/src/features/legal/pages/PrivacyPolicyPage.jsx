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
        { id: "security", label: "Security & Retention" },
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

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
            {/* Standalone Public Header Banner if visited without author shell */}
            {!isInsideAuthorShell && (
                <div className="bg-white border-b border-slate-200/80 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 mb-6 flex items-center justify-between shadow-xs">
                    <Link to="/" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#14532d] to-[#022c22] flex items-center justify-center text-white shadow-xs">
                            <svg className="w-4 h-4 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </div>
                        <span className="font-serif-title font-bold text-slate-900 text-lg">BookLeaf Publishing</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link
                            to="/royalty-terms"
                            className="text-xs font-medium text-slate-600 hover:text-emerald-700 transition-colors"
                        >
                            Royalty Terms
                        </Link>
                        <Link
                            to="/login"
                            className="px-3.5 py-1.5 rounded-lg bg-[#0E7052] text-white text-xs font-semibold hover:bg-[#0A553D] transition-colors shadow-xs"
                        >
                            Author Sign In
                        </Link>
                    </div>
                </div>
            )}

            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                <Link to={user ? "/author/books" : "/"} className="hover:text-emerald-700 transition-colors">
                    {user ? "Author Central" : "Home"}
                </Link>
                <span>/</span>
                <span className="text-slate-600">Legal Governance</span>
                <span>/</span>
                <span className="text-emerald-700 font-semibold">Privacy Policy</span>
            </nav>

            {/* Hero Header Card */}
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#063B2B] via-[#0A553D] to-[#0E7052] p-6 sm:p-10 text-white shadow-xl shadow-emerald-950/15">
                <div className="absolute -right-12 -bottom-12 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-0 right-1/4 w-40 h-40 bg-teal-300/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="max-w-2xl space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-400/30 text-[11px] font-mono tracking-wider uppercase text-emerald-200">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            Author Charter • Effective October 2026
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-white leading-tight">
                            Author Privacy &amp; Data Protection Charter
                        </h1>
                        <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-sans">
                            Our solemn commitment to protecting author intellectual property, manuscript confidentiality, tax credentials, and payout information.
                        </p>
                    </div>

                    {/* Quick action buttons */}
                    <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                        <button
                            type="button"
                            onClick={handleCopyLink}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white transition-all cursor-pointer backdrop-blur-xs"
                            title="Copy policy link"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span>{copied ? "Copied!" : "Share Policy"}</span>
                        </button>
                        <button
                            type="button"
                            onClick={handlePrint}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white transition-all cursor-pointer backdrop-blur-xs"
                            title="Print this policy document"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            <span>Print Policy</span>
                        </button>
                        {user && (
                            <Link
                                to="/author/tickets/new"
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-400 text-slate-900 hover:bg-emerald-300 text-xs font-bold transition-all shadow-md shadow-emerald-950/20"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span>Privacy Officer</span>
                            </Link>
                        )}
                    </div>
                </div>

                {/* 4 Guarantees Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 pt-6 border-t border-emerald-500/30">
                    <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
                        <div className="text-[11px] font-medium text-emerald-200">Copyright Retained</div>
                        <div className="text-xl sm:text-2xl font-bold font-serif text-white">100% Author</div>
                        <div className="text-[10px] text-emerald-200/80">Full IP remains with you</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
                        <div className="text-[11px] font-medium text-emerald-200">AI Model Training</div>
                        <div className="text-xl sm:text-2xl font-bold font-serif text-white">Zero Opt-Out</div>
                        <div className="text-[10px] text-emerald-200/80">Never used for AI models</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
                        <div className="text-[11px] font-medium text-emerald-200">Data Encryption</div>
                        <div className="text-xl sm:text-2xl font-bold font-serif text-white">AES-256</div>
                        <div className="text-[10px] text-emerald-200/80">Bank-grade vaulting</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
                        <div className="text-[11px] font-medium text-emerald-200">Compliance Standard</div>
                        <div className="text-xl sm:text-2xl font-bold font-serif text-white">DPDP / GDPR</div>
                        <div className="text-[10px] text-emerald-200/80">Statutory privacy rights</div>
                    </div>
                </div>
            </div>

            {/* Quick Navigation Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
                {sections.map((sec) => (
                    <button
                        key={sec.id}
                        type="button"
                        onClick={() => setActiveSection(sec.id)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
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
                <section className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-card space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/80 flex items-center justify-center font-bold text-base">
                            01
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-serif font-bold text-slate-900">
                                Categories of Information We Collect
                            </h2>
                            <p className="text-xs text-slate-500">
                                Necessary information required to publish your book and disburse author royalties.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 leading-relaxed">
                        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                                Author Identity &amp; Contact Credentials
                            </h3>
                            <p>
                                Legal name, pen name/pseudonym, email address, contact telephone number, postal mailing address for sample book shipments, and author biographical note.
                            </p>
                        </div>

                        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                                Banking &amp; Statutory Tax Identifiers
                            </h3>
                            <p>
                                Bank account number, IFSC code, account holder name, UPI ID, and Permanent Account Number (PAN) or international tax ID for statutory TDS withholding under the Indian Income Tax Act.
                            </p>
                        </div>

                        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                                Creative Assets &amp; Manuscript Files
                            </h3>
                            <p>
                                Text manuscripts, cover design illustrations, front-matter acknowledgments, ISBN assignment metadata, and publication catalog attributes.
                            </p>
                        </div>

                        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
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
                <section className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-card space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 border border-teal-200/80 flex items-center justify-center font-bold text-base">
                            02
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-serif font-bold text-slate-900">
                                Absolute Manuscript Confidentiality &amp; IP Protection
                            </h2>
                            <p className="text-xs text-slate-500">
                                Your literary creation is sacred. Here is our binding legal guarantee.
                            </p>
                        </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-linear-to-r from-emerald-50/60 to-teal-50/30 border border-emerald-200/80 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-emerald-700 text-white shrink-0 mt-0.5">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-bold text-emerald-950 text-sm sm:text-base">
                                    Full Copyright Retained by the Author
                                </h3>
                                <p>
                                    Under no circumstances does BookLeaf Publishing acquire ownership of your literary work. All copyright, moral rights, derivative adaptation rights, screen adaptation rights, and future reprint privileges remain exclusively with the author.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                            <div className="p-3.5 rounded-xl bg-white border border-emerald-100 shadow-xs space-y-1">
                                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                                    <span className="text-emerald-600">✓</span> No Unauthorized AI Mining
                                </span>
                                <p className="text-slate-600 text-[11px]">
                                    We do not monetize, scrape, or feed author manuscripts to external large language models (LLMs) or artificial intelligence datasets.
                                </p>
                            </div>
                            <div className="p-3.5 rounded-xl bg-white border border-emerald-100 shadow-xs space-y-1">
                                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                                    <span className="text-emerald-600">✓</span> Strict Pre-Publication Secrecy
                                </span>
                                <p className="text-slate-600 text-[11px]">
                                    Unpublished drafts are accessible only to your designated editorial manager, formatting typographer, and certified print technician.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ── Section 3: How Your Data Is Used ─────────────────────────── */}
            {(activeSection === "all" || activeSection === "usage") && (
                <section className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-card space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/80 flex items-center justify-center font-bold text-base">
                            03
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-serif font-bold text-slate-900">
                                How Your Data Is Processed
                            </h2>
                            <p className="text-xs text-slate-500">
                                Legitimate, transparent purposes supporting publication and author services.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
                        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
                                01
                            </div>
                            <h3 className="font-bold text-slate-900 text-sm">ISBN Allocation &amp; Cataloging</h3>
                            <p className="leading-relaxed">
                                Transmitting book metadata to official national agencies (Raja Rammohun Roy National Agency / Bowker) to assign legal ISBNs.
                            </p>
                        </div>

                        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
                                02
                            </div>
                            <h3 className="font-bold text-slate-900 text-sm">Royalty Settlements</h3>
                            <p className="leading-relaxed">
                                Processing automated NEFT/RTGS payments, generating quarterly sales statements, and filing statutory TDS returns with income tax authorities.
                            </p>
                        </div>

                        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
                                03
                            </div>
                            <h3 className="font-bold text-slate-900 text-sm">Print &amp; Order Fulfillment</h3>
                            <p className="leading-relaxed">
                                Securely transmitting print-ready interior PDFs and cover files to accredited POD press facilities upon customer order placement.
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {/* ── Section 4: Third-Party Data Sharing ─────────────────────── */}
            {(activeSection === "all" || activeSection === "sharing") && (
                <section className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-card space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-800 border border-purple-200/80 flex items-center justify-center font-bold text-base">
                            04
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-serif font-bold text-slate-900">
                                Controlled Third-Party Sharing Protocols
                            </h2>
                            <p className="text-xs text-slate-500">
                                We never sell author personal data. Data is shared exclusively with critical fulfillment partners.
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[11px] border-b border-slate-200">
                                <tr>
                                    <th className="py-3 px-4">Entity / Category</th>
                                    <th className="py-3 px-4">Information Shared</th>
                                    <th className="py-3 px-4">Purpose</th>
                                    <th className="py-3 px-4">Safeguard Standards</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 font-sans text-slate-600">
                                <tr>
                                    <td className="py-3 px-4 font-bold text-slate-900">Retail Distribution (Amazon, Flipkart, Ingram)</td>
                                    <td className="py-3 px-4">Book title, author public pen name, blurb, cover preview, ISBN, pricing</td>
                                    <td className="py-3 px-4">Listing on global eCommerce catalogs</td>
                                    <td className="py-3 px-4"><span className="text-emerald-700 font-medium">Standard ONIX metadata feeds</span></td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-bold text-slate-900">Print-on-Demand Press Facilities</td>
                                    <td className="py-3 px-4">Print interior PDF, cover wrap file, print quantities</td>
                                    <td className="py-3 px-4">Physical book manufacturing</td>
                                    <td className="py-3 px-4"><span className="text-emerald-700 font-medium">Non-Disclosure Agreements (NDA)</span></td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-bold text-slate-900">Banking &amp; Settlement Gateways (Cashfree / Razorpay / Banks)</td>
                                    <td className="py-3 px-4">Bank account number, IFSC, payout amount, author legal name</td>
                                    <td className="py-3 px-4">Disbursing quarterly author royalties</td>
                                    <td className="py-3 px-4"><span className="text-emerald-700 font-medium">PCI-DSS &amp; RBI banking encryption</span></td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-bold text-slate-900">Government Tax Authorities (Income Tax India)</td>
                                    <td className="py-3 px-4">PAN, annual royalty paid, TDS withheld</td>
                                    <td className="py-3 px-4">Statutory Section 194J compliance</td>
                                    <td className="py-3 px-4"><span className="text-emerald-700 font-medium">Government TRACES portal</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
            )}

            {/* ── Section 5: Author Rights & Account Portability ──────────── */}
            {(activeSection === "all" || activeSection === "rights") && (
                <section className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-card space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 border border-blue-200/80 flex items-center justify-center font-bold text-base">
                            05
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-serif font-bold text-slate-900">
                                Your Statutory Rights Under DPDP Act &amp; GDPR
                            </h2>
                            <p className="text-xs text-slate-500">
                                You hold full sovereignty over your personal profile, manuscripts, and account data.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                            <div className="font-bold text-slate-900 text-sm">Right to Access</div>
                            <p className="text-slate-600">Inspect all stored profile attributes, books, and royalty ledgers anytime.</p>
                        </div>
                        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                            <div className="font-bold text-slate-900 text-sm">Right to Rectify</div>
                            <p className="text-slate-600">Update payment accounts, pen names, or contact information instantly via portal.</p>
                        </div>
                        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                            <div className="font-bold text-slate-900 text-sm">Data Portability</div>
                            <p className="text-slate-600">Download formatted sales statements and book catalog metadata as JSON/PDF.</p>
                        </div>
                        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                            <div className="font-bold text-slate-900 text-sm">Right to Erasure</div>
                            <p className="text-slate-600">Request deletion of personal credentials upon termination of publishing agreement.</p>
                        </div>
                    </div>
                </section>
            )}

            {/* ── Section 6: Frequently Asked Privacy Questions ────────────── */}
            {(activeSection === "all" || activeSection === "dpo") && (
                <section className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-card space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center font-bold text-base">
                            06
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-serif font-bold text-slate-900">
                                Privacy Policy Inquiries &amp; Officer Contact
                            </h2>
                            <p className="text-xs text-slate-500">
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
                                    className="w-full text-left px-4 py-3.5 flex items-center justify-between gap-4 text-xs sm:text-sm font-semibold text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                    <span>{faq.q}</span>
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
                                    <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* DPO Officer Contact Card */}
                    <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                        <div className="space-y-1">
                            <span className="font-bold text-slate-900 text-sm block">Designated Data Protection Officer (DPO)</span>
                            <p className="text-slate-600">
                                BookLeaf Publishing Legal &amp; Compliance Cell • Grievance Redressal Officer
                            </p>
                            <p className="text-slate-500">
                                Email: <a href="mailto:privacy@bookleafpublishing.in" className="text-emerald-700 hover:underline font-semibold">privacy@bookleafpublishing.in</a> • Response window: within 48 business hours
                            </p>
                        </div>
                        {user ? (
                            <Link
                                to="/author/tickets/new"
                                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 font-semibold hover:border-emerald-600 hover:text-emerald-700 transition-colors shadow-xs"
                            >
                                Open Privacy Query
                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 font-semibold hover:border-emerald-600 hover:text-emerald-700 transition-colors shadow-xs"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </section>
            )}

            {/* Direct Support Contact Banner */}
            <div className="rounded-2xl border border-emerald-200 bg-linear-to-r from-emerald-50 via-teal-50/40 to-slate-50 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
                <div className="space-y-1.5 text-center sm:text-left">
                    <h3 className="text-base sm:text-lg font-serif font-bold text-emerald-950">
                        Need clarification on your author data or privacy settings?
                    </h3>
                    <p className="text-xs text-slate-600 max-w-xl">
                        Our Author Compliance Desk is always here to assist with any intellectual property or account inquiries.
                    </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <Link
                        to="/royalty-terms"
                        className="px-4 py-2.5 rounded-xl border border-emerald-300 bg-white text-emerald-800 text-xs font-semibold hover:bg-emerald-50 shadow-xs transition-all"
                    >
                        View Royalty Terms
                    </Link>
                    {user ? (
                        <Link
                            to="/author/tickets/new"
                            className="px-5 py-2.5 rounded-xl bg-[#0E7052] hover:bg-[#0A553D] text-white text-xs font-semibold shadow-xs transition-all"
                        >
                            Contact Support
                        </Link>
                    ) : (
                        <Link
                            to="/login"
                            className="px-5 py-2.5 rounded-xl bg-[#0E7052] hover:bg-[#0A553D] text-white text-xs font-semibold shadow-xs transition-all"
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
