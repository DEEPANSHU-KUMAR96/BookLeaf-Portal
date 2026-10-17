import { useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink, Outlet, Link } from "react-router-dom";
import { logout } from "../features/auth/state/authSlice";
import { useAuth } from "../features/auth/hook/useAuth";

const NAV = {
  author: [
    {
      to: "/author/books",
      label: "My Books",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      to: "/author/tickets/new",
      label: "Submit a Query",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      to: "/author/tickets",
      label: "My Tickets",
      end: true,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      ),
    },
  ],
  admin: [
    {
      to: "/admin",
      label: "Ticket Queue",
      end: true,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
  ],
};

const linkClass = ({ isActive }) =>
  `px-3.5 py-2 rounded-lg text-sm transition-all duration-150 flex items-center gap-2 ${isActive
    ? "bg-emerald-50 text-[#064e3b] font-semibold border border-emerald-200/70 shadow-xs"
    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-medium"
  }`;

export default function AppShell() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Compute initials for avatar (e.g. "Priya Sharma" -> "PS")
  const initials = user?.name
    ? user.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : "AU";

  const navItems = NAV[user?.role] || NAV.author;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FBFBFB] text-slate-800 antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-3">
            {/* Logo & Desktop Nav Links */}
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#14532d] to-[#022c22] flex items-center justify-center text-white shadow-md shadow-emerald-950/10 group-hover:scale-105 transition-transform duration-200">
                  <svg className="w-5 h-5 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center">
                    BookLeaf{" "}
                    <span className="ml-1.5 text-xs font-semibold uppercase tracking-wider text-[#14532d] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/70">
                      {user?.role === "admin" ? "Admin" : "Author"}
                    </span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase -mt-0.5">
                    Creator Studio
                  </span>
                </div>
              </Link>

              {/* Primary Navigation Tabs */}
              <nav aria-label="Portal Navigation" className="hidden md:flex items-center space-x-1.5">
                {navItems.map((item) => (
                  <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
                    <span className="text-slate-500">{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Author Profile & Quick Actions */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Notifications"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-600 rounded-full ring-2 ring-white"></span>
                </button>

                {notificationOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-card border border-slate-200 p-3 z-50 text-xs">
                    <div className="font-semibold text-slate-800 pb-2 border-b border-slate-100 flex items-center justify-between">
                      <span>Notifications</span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">1 New</span>
                    </div>
                    <div className="py-2.5 text-slate-600 leading-relaxed">
                      Your royalty disbursement of ₹16,338 has been processed to your bank account.
                    </div>
                  </div>
                )}
              </div>

              <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

              {/* Author User Card */}
              <div className="flex items-center space-x-3 pl-1">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-200 via-rose-200 to-teal-200 p-0.5 ring-1 ring-slate-200 shadow-xs">
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center font-bold text-xs text-[#064e3b]">
                      {initials}
                    </div>
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-sm font-semibold text-slate-900 leading-none">{user?.name}</span>
                  <span className="text-[11px] text-slate-400 mt-1 font-medium">
                    {user?.role === "admin" ? "Editorial Director" : "Verified Author"}
                  </span>
                </div>

                {/* Sleek Log Out Button */}
                <button
                  type="button"
                  onClick={() => dispatch(logout())}
                  className="ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all duration-150 shadow-xs cursor-pointer"
                  title="End author session"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="font-medium hidden sm:inline">Log out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Secondary Nav Bar */}
          <nav className="md:hidden flex gap-2 pb-3 overflow-x-auto border-t border-slate-100 pt-2.5">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
                <span>{item.icon}</span>
                <span className="whitespace-nowrap">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <Outlet />
      </main>

      {/* Main Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white" data-purpose="author-portal-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-serif-title font-semibold text-slate-900 text-sm">BookLeaf Publishing</span>
            <span>•</span>
            <span>Author Central Portal v3.4.1</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-slate-500">
            <a href="#terms" className="hover:text-slate-800 transition-colors">Royalty Terms</a>
            <a href="#channels" className="hover:text-slate-800 transition-colors">Distribution Channels</a>
            <a href="#privacy" className="hover:text-slate-800 transition-colors">Privacy Policy</a>
            <a href="#support" className="hover:text-slate-800 transition-colors">Support Desk</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
