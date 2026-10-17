import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { logout } from "../features/auth/state/authSlice";
import { useAuth } from "../features/auth/hook/useAuth";

export default function AppShell() {
  const dispatch = useDispatch();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-semibold text-slate-900">
            BookLeaf <span className="text-emerald-600">{user.role === "admin" ? "Admin" : "Author"}</span>
          </span>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-600">{user.name}</span>
            <button onClick={() => dispatch(logout())} className="rounded-md border border-slate-300 px-3 py-1 hover:bg-slate-50">
              Log out
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}