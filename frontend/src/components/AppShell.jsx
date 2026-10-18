import { useState, useRef, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { logout } from "../features/auth/state/authSlice";
import { useAuth } from "../features/auth/hook/useAuth";
import { useRealtime } from "../features/realtime/hook/useRealtime";
import { loadTickets, markRead } from "../features/tickets/state/ticketsSlice";
import { formatDateTime, formatAge } from "../utils/format";

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
      label: "Submit Query",
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

const STORAGE_KEY = "bookleaf_author_read_notifs";

const linkClass = ({ isActive }) =>
  `px-3.5 py-2 rounded-lg text-sm transition-all duration-150 flex items-center gap-2 ${isActive
    ? "bg-emerald-50 text-[#064e3b] font-semibold border border-emerald-200/70 shadow-xs"
    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-medium"
  }`;

export default function AppShell() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // "all" | "unread"
  const bellRef = useRef(null);

  // Tickets from Redux
  const { items: tickets, unreadIds, status: ticketsStatus } = useSelector((s) => s.tickets);

  // Load tickets on mount so notifications are always available
  useEffect(() => {
    if (ticketsStatus === "idle") {
      dispatch(loadTickets());
    }
  }, [ticketsStatus, dispatch]);

  // Maintain live SSE connection
  useRealtime();

  // Read notification keys stored in localStorage
  const [readKeys, setReadKeys] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Notifications computed from tickets with editorial replies or status updates
  const notifications = useMemo(() => {
    return tickets.map((t) => {
      const tid = t.id || t._id;
      const responses = t.responses || [];
      const hasReplies = responses.length > 0;
      const lastReply = hasReplies ? responses[responses.length - 1] : null;

      // Unique version key: if responses count or status changes, becomes unread again
      const notifKey = `${tid}-${responses.length}-${t.status}`;
      const isUnread = !readKeys.includes(notifKey) || unreadIds.includes(tid);

      let type = "ticket";
      let summary = "Query raised";
      if (hasReplies) {
        type = "reply";
        summary = lastReply?.message
          ? `${lastReply.message.slice(0, 90)}${lastReply.message.length > 90 ? "..." : ""}`
          : "New reply from the editorial team";
      } else if (t.status === "Resolved") {
        type = "resolved";
        summary = "Your ticket has been marked as resolved";
      } else if (t.status === "In Progress") {
        type = "progress";
        summary = "Editorial team is reviewing your query";
      }

      return {
        id: tid,
        notifKey,
        subject: t.subject || "Publishing Inquiry",
        bookTitle: t.book?.title,
        status: t.status,
        category: t.category,
        summary,
        replyCount: responses.length,
        time: lastReply?.createdAt || t.updatedAt || t.createdAt,
        isUnread,
        hasReplies,
      };
    });
  }, [tickets, readKeys, unreadIds]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => n.isUnread && (n.hasReplies || n.status === "Resolved")).length;
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    if (activeTab === "unread") {
      return notifications.filter((n) => n.isUnread);
    }
    return notifications;
  }, [notifications, activeTab]);

  const markAllRead = () => {
    const allKeys = notifications.map((n) => n.notifKey);
    setReadKeys(allKeys);
    unreadIds.forEach((id) => dispatch(markRead(id)));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allKeys));
    } catch {}
  };

  const handleNotificationClick = (n) => {
    if (!readKeys.includes(n.notifKey)) {
      const updated = [...readKeys, n.notifKey];
      setReadKeys(updated);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
    }
    dispatch(markRead(n.id));
    setNotificationOpen(false);
    navigate("/author/tickets", { state: { openTicketId: n.id } });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!notificationOpen) return;
    const handler = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setNotificationOpen(false);
      }
    };
    const escHandler = (e) => {
      if (e.key === "Escape") setNotificationOpen(false);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", escHandler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", escHandler);
    };
  }, [notificationOpen]);

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
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 py-2 sm:py-3">
            {/* Logo & Desktop Nav Links */}
            <div className="flex items-center space-x-3 sm:space-x-8 min-w-0">
              <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-linear-to-br from-[#14532d] to-[#022c22] flex items-center justify-center text-white shadow-md shadow-emerald-950/10 group-hover:scale-105 transition-transform duration-200">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-base sm:text-xl font-bold tracking-tight text-slate-900 flex items-center">
                    BookLeaf
                    <span className="ml-1 sm:ml-1.5 text-[9px] sm:text-xs font-semibold uppercase tracking-wider text-[#14532d] bg-emerald-50 px-1.5 sm:px-2 py-0.5 rounded-full border border-emerald-200/70">
                      {user?.role === "admin" ? "Admin" : "Author"}
                    </span>
                  </span>
                  <span className="hidden sm:block text-[10px] text-slate-400 font-medium tracking-wider uppercase -mt-0.5">
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
            <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
              {/* ── Working Author Notification Bell ────────────────────── */}
              <div className="relative" ref={bellRef}>
                <button
                  type="button"
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className={`relative p-2.5 rounded-xl transition-all duration-150 cursor-pointer ${
                    notificationOpen
                      ? "bg-emerald-50 text-emerald-800 ring-2 ring-emerald-600/30"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                  }`}
                  title="Author Notifications"
                  aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-emerald-600 text-white text-[10px] font-mono font-bold rounded-full ring-2 ring-white flex items-center justify-center px-1 animate-pulse">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* Responsive Notification Dropdown */}
                {notificationOpen && (
                  <div className="fixed inset-x-3 top-18 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 sm:w-[380px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden flex flex-col max-h-[82vh] animate-in fade-in zoom-in-95 duration-150">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="text-[10px] text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full font-bold">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={markAllRead}
                          className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 transition-colors cursor-pointer"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    {/* Filter Tabs */}
                    <div className="px-4 pt-2 pb-1.5 border-b border-slate-100 flex items-center gap-2 shrink-0 bg-white">
                      <button
                        type="button"
                        onClick={() => setActiveTab("all")}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          activeTab === "all"
                            ? "bg-slate-900 text-white"
                            : "text-slate-500 hover:bg-slate-100"
                        }`}
                      >
                        All ({notifications.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("unread")}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                          activeTab === "unread"
                            ? "bg-emerald-700 text-white"
                            : "text-slate-500 hover:bg-slate-100"
                        }`}
                      >
                        <span>New Replies</span>
                        {unreadCount > 0 && (
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                            activeTab === "unread" ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-800 font-bold"
                          }`}>
                            {unreadCount}
                          </span>
                        )}
                      </button>
                    </div>

                    {/* Notification List */}
                    <div className="overflow-y-auto flex-1 divide-y divide-slate-100 overscroll-contain">
                      {filteredNotifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl mb-2">
                            ✓
                          </div>
                          <p className="text-sm font-semibold text-slate-800">You're all caught up!</p>
                          <p className="text-xs text-slate-400 mt-0.5">No new replies or status updates.</p>
                        </div>
                      ) : (
                        filteredNotifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => handleNotificationClick(n)}
                            className={`p-3.5 flex items-start gap-3 hover:bg-emerald-50/50 transition-colors cursor-pointer group ${
                              n.isUnread ? "bg-emerald-50/20" : "bg-white"
                            }`}
                          >
                            {/* Icon */}
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm ${
                              n.hasReplies
                                ? "bg-emerald-100 text-emerald-800"
                                : n.status === "Resolved"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-slate-100 text-slate-600"
                            }`}>
                              {n.hasReplies ? "💬" : n.status === "Resolved" ? "✓" : "📋"}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1 mb-0.5">
                                <span className="text-xs font-semibold text-slate-900 truncate group-hover:text-emerald-800 transition-colors">
                                  {n.subject}
                                </span>
                                {n.time && (
                                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                                    {formatDateTime(n.time)}
                                  </span>
                                )}
                              </div>

                              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                {n.summary}
                              </p>

                              <div className="flex items-center gap-2 mt-1.5 flex-wrap text-[10px]">
                                {n.status && (
                                  <span className={`px-1.5 py-0.5 rounded font-mono font-medium ${
                                    n.status === "Resolved"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : n.status === "In Progress"
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-slate-100 text-slate-600"
                                  }`}>
                                    {n.status}
                                  </span>
                                )}
                                {n.replyCount > 0 && (
                                  <span className="font-mono text-slate-400">
                                    {n.replyCount} {n.replyCount === 1 ? "reply" : "replies"}
                                  </span>
                                )}
                                {n.bookTitle && (
                                  <span className="text-slate-400 italic truncate max-w-[120px]">
                                    {n.bookTitle}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Unread indicator */}
                            {n.isUnread && (
                              <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 mt-1.5 animate-pulse"></span>
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    {/* Footer */}
                    <div className="p-2.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0 text-xs">
                      <span className="text-[11px] font-mono text-slate-500">
                        {tickets.length} total {tickets.length === 1 ? "ticket" : "tickets"}
                      </span>
                      <Link
                        to="/author/tickets"
                        onClick={() => setNotificationOpen(false)}
                        className="font-semibold text-emerald-700 hover:text-emerald-900 transition-colors"
                      >
                        View all in My Tickets →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <div className="h-5 w-px bg-slate-200 hidden sm:block"></div>

              {/* Author User Card & Logout */}
              <div className="flex items-center gap-1.5 sm:gap-3">
                <div className="relative">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-linear-to-tr from-amber-200 via-rose-200 to-teal-200 p-0.5 ring-1 ring-slate-200 shadow-xs">
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center font-bold text-xs text-[#064e3b]">
                      {initials}
                    </div>
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
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
                  className="p-2 sm:px-3 sm:py-1.5 inline-flex items-center gap-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all duration-150 shadow-xs cursor-pointer shrink-0"
                  title="Log out"
                >
                  <svg className="w-4 h-4 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="font-medium hidden sm:inline">Log out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Secondary Nav Bar */}
          <nav className="md:hidden grid grid-cols-3 gap-1.5 pb-2.5 pt-2 border-t border-slate-100">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `px-1.5 py-2 rounded-xl text-xs transition-all duration-150 flex items-center justify-center gap-1.5 min-w-0 ${
                    isActive
                      ? "bg-emerald-50 text-[#064e3b] font-bold border border-emerald-200/80 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-medium"
                  }`
                }
              >
                <span className="shrink-0">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
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
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-slate-500 font-medium">
            <Link to="/author/royalty-terms" className="hover:text-emerald-700 transition-colors">Royalty Terms</Link>
            <Link to="/author/privacy-policy" className="hover:text-emerald-700 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
