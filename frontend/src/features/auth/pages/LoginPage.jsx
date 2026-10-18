import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { Navigate, Link } from "react-router-dom";
import { login, clearError } from "../state/authSlice";
import { useAuth } from "../hook/useAuth";

// Working demo accounts mapped to roles
const DEMO_ACCOUNTS = {
    author: {
        label: "Demo Author",
        email: "priya.sharma@email.com",
        password: "Author@123",
    },
    admin: {
        label: "Demo Admin",
        email: "admin@bookleaf.com",
        password: "Admin@123",
    },
};

export default function LoginPage() {
    const dispatch = useDispatch();
    const { user, loginLoading, error } = useAuth();

    const [activeRole, setActiveRole] = useState("author");
    const [form, setForm] = useState({
        email: DEMO_ACCOUNTS.author.email,
        password: DEMO_ACCOUNTS.author.password,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [trustDevice, setTrustDevice] = useState(true);
    const [infoMessage, setInfoMessage] = useState("");

    const emailInputRef = useRef(null);

    useEffect(() => {
        return () => dispatch(clearError());
    }, [dispatch]);

    if (user) return <Navigate to="/" replace />;

    const onChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRoleSelect = (roleKey) => {
        setActiveRole(roleKey);
        dispatch(clearError());
        setForm({
            email: DEMO_ACCOUNTS[roleKey].email,
            password: DEMO_ACCOUNTS[roleKey].password,
        });
    };

    const clearEmail = () => {
        setForm((prev) => ({ ...prev, email: "" }));
        if (emailInputRef.current) {
            emailInputRef.current.focus();
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(login(form));
    };

    const showHelpNotification = (msg) => {
        setInfoMessage(msg);
        setTimeout(() => setInfoMessage(""), 4000);
    };

    return (
        <div className="min-h-screen bg-[#FAF5F6] text-stone-800 font-sans antialiased selection:bg-[#0E7052] selection:text-white flex flex-col justify-between relative overflow-x-hidden">
            {/* Ambient background glow orbs */}
            <div
                aria-hidden="true"
                className="fixed top-0 left-1/4 -translate-x-1/2 w-130 h-130 bg-rose-200/35 rounded-full blur-3xl pointer-events-none -z-10"
            />
            <div
                aria-hidden="true"
                className="fixed bottom-0 right-1/4 translate-x-1/2 w-120 h-120 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none -z-10"
            />

            {/* Top Professional Navigation Header (Desktop) */}
            <header className="hidden lg:flex w-full px-8 py-4 items-center justify-between border-b border-rose-100/70 bg-white/60 backdrop-blur-md sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    {/* Logo Emblem */}
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-950 via-[#0A553D] to-[#1FB26C] border border-leaf/30 p-2 shadow-sm flex items-center justify-center">
                        <svg className="w-5 h-5 text-emerald-100" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                            <path
                                d="M24 13V38M24 13C21 10 14 9.5 8 11.5V36.5C14 34.5 21 35 24 38M24 13C27 10 34 9.5 40 11.5V36.5C34 34.5 27 35 24 38"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2.8"
                            />
                            <path
                                d="M24 7C24 7 28 3 33 5C38 7 35 13 32 14C28 15 24 12 24 7Z"
                                fill="currentColor"
                                fillOpacity="0.35"
                                strokeLinejoin="round"
                                strokeWidth="2"
                            />
                        </svg>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-serif font-bold tracking-tight text-stone-900">BookLeaf</span>
                            <span className="text-emerald-800 font-sans text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full border border-emerald-700/20 bg-emerald-50 font-bold">
                                PORTAL
                            </span>
                        </div>
                        <p className="hidden sm:block text-[10px] text-stone-500 font-medium uppercase tracking-wider">
                            Author Support &amp; Communication
                        </p>
                    </div>
                </div>

                {/* Live Support Indicator */}
                <div className="flex items-center gap-2 text-xs text-stone-600 bg-white/80 px-3.5 py-1.5 rounded-full border border-rose-200/70 shadow-xs">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                    </span>
                    <span className="text-[11px] font-medium text-stone-700">Editorial Support Online</span>
                    <button
                        type="button"
                        onClick={() => showHelpNotification("Editorial Desk: desk@bookleafpublishing.org • Live 9am–6pm IST")}
                        className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 ml-1 transition-colors"
                    >
                        Desk →
                    </button>
                </div>
            </header>

            {/* Main Responsive Body Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex items-center justify-center">
                <div className="w-full grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
                    {/* Left Column: Literary Branding & Highlights (visible on large screens) */}
                    <section className="hidden lg:flex lg:col-span-7 flex-col justify-center space-y-8 pr-4">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-700/20 bg-emerald-50/80 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-4">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                Official Author Portal
                            </div>
                            <h1 className="text-4xl xl:text-5xl font-serif font-bold text-stone-900 tracking-tight leading-tight">
                                Where stories find their voice and authors shape their craft.
                            </h1>
                            <p className="mt-4 text-sm text-stone-600 leading-relaxed max-w-xl">
                                A private, dedicated terminal for BookLeaf writers to collaborate with acquisitions editors,
                                monitor manuscript typesetting, review design drafts, and track publication updates.
                            </p>
                        </div>

                        {/* Feature Highlights Grid */}
                        <div className="grid sm:grid-cols-2 gap-4 max-w-xl">
                            <div className="bg-white/70 backdrop-blur-sm border border-rose-100 rounded-2xl p-4 shadow-xs hover:border-emerald-200 transition-colors">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-sm mb-2.5">
                                    ✍️
                                </div>
                                <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wide">Direct Editorial Desk</h2>
                                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                                    Direct correspondence with senior acquisition editors and assigned proofreaders.
                                </p>
                            </div>

                            <div className="bg-white/70 backdrop-blur-sm border border-rose-100 rounded-2xl p-4 shadow-xs hover:border-emerald-200 transition-colors">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-sm mb-2.5">
                                    📖
                                </div>
                                <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wide">Manuscript Tracking</h2>
                                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                                    Stage-by-stage visibility into developmental editing, formatting, and proofs.
                                </p>
                            </div>

                            <div className="bg-white/70 backdrop-blur-sm border border-rose-100 rounded-2xl p-4 shadow-xs hover:border-emerald-200 transition-colors">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-sm mb-2.5">
                                    📈
                                </div>
                                <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wide">Royalties &amp; Reach</h2>
                                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                                    Transparent statements and distribution updates across international markets.
                                </p>
                            </div>

                            <div className="bg-white/70 backdrop-blur-sm border border-rose-100 rounded-2xl p-4 shadow-xs hover:border-emerald-200 transition-colors">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-sm mb-2.5">
                                    🛡️
                                </div>
                                <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wide">Secure Publishing Vault</h2>
                                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                                    Bank-grade encryption protecting your unreleased manuscripts and intellectual property.
                                </p>
                            </div>
                        </div>

                        {/* Literary Quote */}
                        <blockquote className="border-l-2 border-emerald-700/40 pl-4 py-1 italic text-xs text-stone-600 max-w-lg">
                            “A word after a word after a word is power. Welcome to your publishing workspace.”
                        </blockquote>
                    </section>

                    {/* Right Column / Center on Mobile: The Sign-In Card */}
                    <section className="lg:col-span-5 w-full max-w-md mx-auto">
                        {/* Mobile Header Branding (visible only on mobile/tablet) */}
                        <div className="lg:hidden text-center mb-6">
                            <div className="mx-auto w-14 h-14 mb-3 rounded-2xl bg-gradient-to-tr from-emerald-950 via-[#0A553D] to-[#1FB26C] border border-[#0E7052]/30 p-2.5 shadow-lg shadow-emerald-900/15 flex items-center justify-center">
                                <svg className="w-8 h-8 text-emerald-100" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                                    <path
                                        d="M24 13V38M24 13C21 10 14 9.5 8 11.5V36.5C14 34.5 21 35 24 38M24 13C27 10 34 9.5 40 11.5V36.5C34 34.5 27 35 24 38"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2.6"
                                    />
                                    <path
                                        d="M24 7C24 7 28 3 33 5C38 7 35 13 32 14C28 15 24 12 24 7Z"
                                        fill="currentColor"
                                        fillOpacity="0.35"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-serif font-bold text-stone-900 flex items-center justify-center gap-1.5">
                                BookLeaf{" "}
                                <span className="text-emerald-800 font-sans text-xs uppercase tracking-widest px-2 py-0.5 rounded-full border border-emerald-700/20 bg-emerald-50 font-semibold align-middle">
                                    PORTAL
                                </span>
                            </h2>
                            <p className="text-stone-500 text-xs font-semibold tracking-wider mt-1 uppercase">
                                Author Support &amp; Communication
                            </p>
                        </div>

                        {/* Notification Toast */}
                        {infoMessage && (
                            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl text-center shadow-xs animate-fade-in font-medium">
                                {infoMessage}
                            </div>
                        )}

                        {/* Card Container */}
                        <div className="bg-white/95 backdrop-blur-md border border-rose-100/90 rounded-3xl p-5 sm:p-8 shadow-card relative">
                            {/* Card Title & Subtitle */}
                            <div className="mb-5">
                                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest block mb-1">
                                    Welcome back, storyteller
                                </span>
                                <p className="text-xs text-stone-600 font-normal leading-relaxed">
                                    Sign in to access manuscript reviews, royal updates, and direct editor correspondence.
                                </p>
                            </div>

                            {/* Role Quick-Preset Switcher */}
                            <div
                                className="mb-5 bg-[#F9F3F5] p-1 rounded-xl border border-rose-100 flex items-center justify-between gap-1"
                                data-purpose="role-demo-switcher"
                            >
                                <button
                                    type="button"
                                    id="btn-demo-author"
                                    onClick={() => handleRoleSelect("author")}
                                    className={`flex-1 py-2 px-3 rounded-lg text-xs transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${activeRole === "author"
                                            ? "bg-white text-emerald-900 font-semibold shadow-sm border border-rose-200/70"
                                            : "text-stone-500 font-medium hover:text-stone-800 hover:bg-white/60"
                                        }`}
                                >
                                    <svg
                                        className={`w-3.5 h-3.5 ${activeRole === "author" ? "text-emerald-700" : "text-stone-400"}`}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <span>Demo Author</span>
                                </button>

                                <button
                                    type="button"
                                    id="btn-demo-admin"
                                    onClick={() => handleRoleSelect("admin")}
                                    className={`flex-1 py-2 px-3 rounded-lg text-xs transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${activeRole === "admin"
                                            ? "bg-white text-emerald-900 font-semibold shadow-sm border border-rose-200/70"
                                            : "text-stone-500 font-medium hover:text-stone-800 hover:bg-white/60"
                                        }`}
                                >
                                    <svg
                                        className={`w-3.5 h-3.5 ${activeRole === "admin" ? "text-emerald-700" : "text-stone-400"}`}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                        />
                                    </svg>
                                    <span>Demo Admin</span>
                                </button>
                            </div>

                            {/* Error Alert */}
                            {error && (
                                <div
                                    role="alert"
                                    className="mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs px-3.5 py-2.5 flex items-start gap-2 shadow-xs"
                                >
                                    <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                        />
                                    </svg>
                                    <span className="font-medium">{error}</span>
                                </div>
                            )}

                            {/* Sign-In Form */}
                            <form className="space-y-4" data-purpose="credentials-form" id="loginForm" onSubmit={onSubmit}>
                                {/* Author ID or Email */}
                                <div>
                                    <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center justify-between" htmlFor="authorEmail">
                                        <span>Author ID or Email</span>
                                        <span className="text-[10px] text-emerald-700 font-semibold">Registered ID</span>
                                    </label>
                                    <div className="relative rounded-xl shadow-xs">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.8"
                                                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206"
                                                />
                                            </svg>
                                        </div>
                                        <input
                                            ref={emailInputRef}
                                            id="authorEmail"
                                            name="email"
                                            type="email"
                                            required
                                            autoComplete="email"
                                            placeholder="name@publisher.com"
                                            value={form.email}
                                            onChange={onChange}
                                            className="block w-full pl-10 pr-9 py-2.5 text-xs bg-[#FAF7F8] text-stone-900 rounded-xl border border-rose-200/80 placeholder-stone-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                                        />
                                        {form.email && (
                                            <button
                                                type="button"
                                                id="clearEmailBtn"
                                                onClick={clearEmail}
                                                title="Clear field"
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="block text-xs font-semibold text-stone-700" htmlFor="authorPassword">
                                            Password
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => showHelpNotification("Contact your editorial administrator to reset your access key.")}
                                            className="text-xs text-emerald-800 hover:text-emerald-700 font-semibold transition-colors cursor-pointer"
                                        >
                                            Forgot key?
                                        </button>
                                    </div>
                                    <div className="relative rounded-xl shadow-xs">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.8"
                                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                                />
                                            </svg>
                                        </div>
                                        <input
                                            id="authorPassword"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            autoComplete="current-password"
                                            placeholder="Enter password"
                                            value={form.password}
                                            onChange={onChange}
                                            className="block w-full pl-10 pr-10 py-2.5 text-xs bg-[#FAF7F8] text-stone-900 rounded-xl border border-rose-200/80 placeholder-stone-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                                        />
                                        <button
                                            type="button"
                                            id="togglePasswordVisibility"
                                            aria-label="Toggle password visibility"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-emerald-700 focus:outline-none transition-colors cursor-pointer"
                                        >
                                            {showPassword ? (
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="1.8"
                                                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="1.8"
                                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                    />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Remember Device & Security */}
                                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                                    <label className="flex items-center space-x-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={trustDevice}
                                            onChange={(e) => setTrustDevice(e.target.checked)}
                                            className="w-3.5 h-3.5 text-[#0E7052] rounded bg-white border-rose-200 focus:ring-emerald-500 focus:ring-offset-white cursor-pointer accent-[#0E7052]"
                                        />
                                        <span className="text-[11px] text-stone-600 group-hover:text-stone-900 transition-colors font-medium">
                                            Trust this device
                                        </span>
                                    </label>
                                    <span className="text-[11px] text-emerald-800 font-medium flex items-center gap-1 select-none whitespace-nowrap">
                                        <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
                                        </svg>
                                        Face ID ready
                                    </span>
                                </div>

                                {/* Submit Button */}
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        id="submitBtn"
                                        disabled={loginLoading}
                                        className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-[#0A553D] via-[#0E7052] to-[#14835A] hover:from-[#0E7052] hover:to-emerald-600 active:scale-[0.98] transition-all duration-200 py-3.5 px-4 text-white text-xs font-semibold tracking-wide shadow-btn flex items-center justify-center gap-2 border border-emerald-500/30 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        <span className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:left-[100%] transition-all duration-700 pointer-events-none"></span>

                                        {loginLoading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                                </svg>
                                                <span className="relative z-10 uppercase tracking-wider text-[11px] font-bold">Signing In...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="relative z-10 uppercase tracking-wider text-[11px] font-bold">
                                                    Sign In to Portal
                                                </span>
                                                <svg
                                                    className="w-4 h-4 text-emerald-100 group-hover:translate-x-1 transition-transform relative z-10"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Editorial Assistance Banner (visible on mobile/tablet) */}
                        <div className="lg:hidden mt-4">
                            <div className="flex items-center justify-between text-xs text-stone-600 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2.5 border border-rose-200/70 shadow-xs">
                                <div className="flex items-center space-x-2">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                                    </span>
                                    <span className="text-[11px] text-stone-700 font-medium">Editorial Support Online</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => showHelpNotification("Editorial Desk: desk@bookleafpublishing.org • Live 9am–6pm IST")}
                                    className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 transition-colors cursor-pointer"
                                >
                                    Contact Desk →
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {/* Professional Footer */}
            <footer className="w-full border-t border-rose-100/70 bg-white/40 backdrop-blur-sm py-4 px-4 sm:px-8">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-[11px] text-stone-500">
                    <p>© 2026 BookLeaf Publishing Collective Inc. All Rights Reserved.</p>
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/privacy-policy"
                            className="hover:text-stone-800 transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <span>•</span>
                        <Link
                            to="/royalty-terms"
                            className="hover:text-stone-800 transition-colors"
                        >
                            Royalty Terms
                        </Link>
                        <span>•</span>
                        <button
                            type="button"
                            onClick={() => showHelpNotification("Author Help: Visit help.bookleaf.org for guides and FAQs.")}
                            className="hover:text-stone-800 transition-colors cursor-pointer"
                        >
                            Author Help
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
}
