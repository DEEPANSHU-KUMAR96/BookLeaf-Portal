import { useState, useRef, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { logout } from "../features/auth/state/authSlice";
import { useAuth } from "../features/auth/hook/useAuth";
import { useRealtime } from "../features/realtime/hook/useRealtime";
import { loadQueue } from "../features/admin/state/adminSlice";
import { formatAge, formatDateTime } from "../utils/format";

const ADMIN_NAV = [
  { to: "/admin", label: "Ticket Queue", icon: "📥", end: true },
];

const STORAGE_KEY = "bookleaf_admin_read_notifs";

export default function AdminShell() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // "all" | "urgent"
  const bellRef = useRef(null);

  const { queue } = useSelector((s) => s.admin);
  const queueCount = queue.pagination?.total ?? queue.items?.length ?? 0;
  const tickets = queue.items ?? [];

  // Make sure queue data is loaded so notifications are available everywhere
  useEffect(() => {
    if (queue.status === "idle") {
      dispatch(loadQueue());
    }
  }, [queue.status, dispatch]);

  useRealtime();

  // Read notification IDs stored in localStorage
  const [readIds, setReadIds] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const markAllRead = () => {
    const allIds = tickets.map((t) => t._id);
    setReadIds(allIds);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allIds));
    } catch {}
  };

  const markSingleRead = (id) => {
    if (!readIds.includes(id)) {
      const updated = [...readIds, id];
      setReadIds(updated);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
    }
  };

  // Derive notifications from tickets needing admin action
  const notifications = useMemo(() => {
    return tickets.map((t) => {
      const isUnread = !readIds.includes(t._id);
      let type = "info";
      let title = t.subject;
      let badge = null;

      if (t.isOverdue) {
        type = "overdue";
        badge = "Overdue SLA";
      } else if (t.priority === "Critical") {
        type = "critical";
        badge = "Critical";
      } else if (t.aiStatus === "done" && t.responseCount === 0) {
        type = "draft";
        badge = "AI Draft Ready";
      } else if (t.status === "Open") {
        type = "new";
        badge = "New Inquiry";
      } else if (t.responseCount > 0) {
        type = "reply";
        badge = `${t.responseCount} ${t.responseCount === 1 ? "reply" : "replies"}`;
      }

      return {
        id: t._id,
        subject: title,
        author: t.author?.name || "Author",
        book: t.book?.title,
        category: t.category,
        priority: t.priority,
        status: t.status,
        age: formatAge(t.ageHours),
        updatedAt: t.updatedAt,
        type,
        badge,
        isUnread,
        isUrgent: t.isOverdue || t.priority === "Critical" || t.status === "Open",
      };
    });
  }, [tickets, readIds]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => n.isUnread).length;
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    if (activeTab === "urgent") {
      return notifications.filter((n) => n.isUrgent);
    }
    return notifications;
  }, [notifications, activeTab]);

  // Close bell on outside click
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

  const navLinkClass = ({ isActive }) =>
    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 ${
      isActive
        ? "bg-emerald-800 text-white font-semibold shadow-sm"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium"
    }`;

  const handleNotificationClick = (id) => {
    markSingleRead(id);
    setNotificationOpen(false);
    navigate(`/admin/tickets/${id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased flex flex-col">
      {/* ── Top Header ─────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-subtle flex items-center">
        <div className="flex items-center justify-between w-full px-3 sm:px-6">
          {/* Logo + mobile hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar navigation"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link to="/admin" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-emerald-800 flex items-center justify-center text-emerald-100 shadow-sm group-hover:scale-105 transition-transform">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-bold text-slate-900 tracking-tight">BookLeaf</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider bg-emerald-100 text-emerald-800 font-bold">Admin</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Right actions: Notifications, User, Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* ── Working Notification Bell ────────────────────────────── */}
            <div className="relative" ref={bellRef}>
              <button
                type="button"
                onClick={() => setNotificationOpen(!notificationOpen)}
                className={`relative p-2.5 rounded-xl transition-all duration-150 cursor-pointer ${
                  notificationOpen
                    ? "bg-emerald-50 text-emerald-800 ring-2 ring-emerald-600/30"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                }`}
                title="Admin Notifications"
                aria-label={`Notifications (${unreadCount} unread)`}
                aria-expanded={notificationOpen}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] bg-emerald-600 text-white text-[10px] font-mono font-bold rounded-full ring-2 ring-white flex items-center justify-center px-1 animate-pulse">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Responsive Notification Dropdown */}
              {notificationOpen && (
                <div
                  className="fixed inset-x-3 top-18 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 sm:w-[390px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden flex flex-col max-h-[82vh] animate-in fade-in zoom-in-95 duration-150"
                  role="dialog"
                  aria-label="Notification center"
                >
                  {/* Dropdown Header */}
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
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

                  {/* Filter tabs */}
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
                      onClick={() => setActiveTab("urgent")}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                        activeTab === "urgent"
                          ? "bg-red-600 text-white"
                          : "text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      <span>Urgent</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        activeTab === "urgent" ? "bg-white/20 text-white" : "bg-red-50 text-red-600 font-bold"
                      }`}>
                        {notifications.filter((n) => n.isUrgent).length}
                      </span>
                    </button>
                  </div>

                  {/* Notification Items List */}
                  <div className="overflow-y-auto flex-1 divide-y divide-slate-100 overscroll-contain">
                    {filteredNotifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl mb-2">
                          ✓
                        </div>
                        <p className="text-sm font-semibold text-slate-800">All caught up!</p>
                        <p className="text-xs text-slate-400 mt-0.5">No pending notifications at this moment.</p>
                      </div>
                    ) : (
                      filteredNotifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => handleNotificationClick(n.id)}
                          className={`p-3.5 flex items-start gap-3 hover:bg-emerald-50/50 transition-colors cursor-pointer group ${
                            n.isUnread ? "bg-emerald-50/20" : "bg-white"
                          }`}
                        >
                          {/* Type icon */}
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm ${
                            n.type === "overdue"
                              ? "bg-red-100 text-red-700"
                              : n.type === "critical"
                              ? "bg-amber-100 text-amber-800"
                              : n.type === "draft"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-100 text-slate-600"
                          }`}>
                            {n.type === "overdue" && "⏱"}
                            {n.type === "critical" && "🚨"}
                            {n.type === "draft" && "✨"}
                            {n.type === "new" && "📥"}
                            {n.type === "reply" && "💬"}
                            {n.type === "info" && "📋"}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1 mb-0.5">
                              <span className="text-xs font-semibold text-slate-900 truncate group-hover:text-emerald-800 transition-colors">
                                {n.subject}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400 shrink-0">
                                {n.age}
                              </span>
                            </div>

                            <p className="text-xs text-slate-500 truncate">
                              <span className="font-medium text-slate-700">{n.author}</span>
                              {n.book && <span className="text-slate-400 italic"> • {n.book}</span>}
                            </p>

                            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                              {n.badge && (
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold ${
                                  n.type === "overdue"
                                    ? "bg-red-50 text-red-700 border border-red-200"
                                    : n.type === "critical"
                                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                                    : n.type === "draft"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : "bg-slate-100 text-slate-600"
                                }`}>
                                  {n.badge}
                                </span>
                              )}
                              {n.category && (
                                <span className="text-[10px] text-slate-400 truncate max-w-[140px]">
                                  {n.category}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Unread dot */}
                          {n.isUnread && (
                            <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 mt-1.5"></span>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Dropdown Footer */}
                  <div className="p-2.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0 text-xs">
                    <span className="text-[11px] font-mono text-slate-500">
                      {tickets.length} total in queue
                    </span>
                    <Link
                      to="/admin"
                      onClick={() => setNotificationOpen(false)}
                      className="font-semibold text-emerald-700 hover:text-emerald-900 transition-colors"
                    >
                      Go to Ticket Queue →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="h-5 w-px bg-slate-200"></div>

            {/* Admin Profile */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                {user?.name?.slice(0, 1).toUpperCase() ?? "A"}
              </div>
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="text-xs font-semibold text-slate-900">{user?.name ?? "Admin"}</span>
                <span className="text-[10px] font-mono text-slate-400">Editorial Staff</span>
              </div>
            </div>

            {/* Log out */}
            <button
              type="button"
              onClick={() => dispatch(logout())}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all duration-150 border border-transparent hover:border-red-200 cursor-pointer"
              title="Log out of admin session"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Responsive Sidebar ──────────────────────────────────────── */}
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-slate-200 z-40 flex flex-col justify-between py-5 transition-transform duration-200 ease-in-out
          ${sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="px-3 flex flex-col gap-4">
          <div className="px-2">
            <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 font-semibold">
              Editorial Operations
            </span>
          </div>
          <nav className="flex flex-col gap-1">
            {ADMIN_NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={navLinkClass}
                onClick={() => setSidebarOpen(false)}
              >
                <div className="flex items-center gap-2.5 text-sm">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.end && queueCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-600 text-white">
                    {queueCount > 99 ? "99+" : queueCount}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Live sync card at bottom of sidebar */}
        <div className="px-3">
          <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-100">
            <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-semibold mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Sync Connected
            </div>
            <p className="text-[11px] text-emerald-700 leading-relaxed">
              New author queries and reply streams synchronize automatically.
            </p>
          </div>
        </div>
      </aside>

      {/* ── Main Content Area (Fluid & Responsive) ───────────────────── */}
      <div className="md:pl-64 pt-16 flex flex-col flex-1 min-h-screen">
        <main className="flex-1 bg-slate-50">
          <Outlet />
        </main>

        {/* Responsive Footer */}
        <footer className="border-t border-slate-200 bg-white py-4 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2 font-mono">
              <span className="font-semibold text-slate-600">BookLeaf Publishing</span>
              <span>•</span>
              <span>Admin Desk</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="text-[11px] font-mono text-emerald-700 font-medium">Operations Active</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
