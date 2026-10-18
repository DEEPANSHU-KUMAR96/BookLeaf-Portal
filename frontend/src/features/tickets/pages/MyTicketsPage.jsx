import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Spinner from "../../../components/Spinner";
import { useTickets } from "../hook/useTickets";
import TicketCard from "../components/TicketCard";

export default function MyTicketsPage() {
    const { items, unreadIds, status, error, reload } = useTickets();
    const location = useLocation();
    const navigate = useNavigate();

    // Read the "just submitted" flag once, then clear it so a page refresh does not show it again
    const [justSubmitted] = useState(Boolean(location.state?.submitted));
    useEffect(() => {
        if (location.state?.submitted) navigate(location.pathname, { replace: true, state: null });
    }, [location, navigate]);

    if (status === "idle" || status === "loading") {
        return <div className="flex justify-center py-16"><Spinner /></div>;
    }

    if (status === "failed") {
        return (
            <div role="alert" className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                {error} <button onClick={reload} className="underline font-medium">Try again</button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold text-slate-900">My Tickets</h1>
                    <p className="text-sm text-slate-500">Replies appear here automatically, no need to refresh</p>
                </div>
                <Link
                    to="/author/tickets/new"
                    className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 text-white text-sm font-medium px-3 py-2 hover:bg-emerald-700 active:scale-95 transition-all duration-150 shadow-sm whitespace-nowrap"
                >
                    {/* "+" icon always visible */}
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    {/* Label hidden on xs, visible sm+ */}
                    <span className="hidden sm:inline">New query</span>
                </Link>
            </div>

            {justSubmitted && (
                <div role="status" className="rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm px-3 py-2">
                    Your query has been submitted. You will see our team's reply here.
                </div>
            )}

            {items.length === 0 ? (
                <div className="text-center rounded-xl bg-white border border-dashed border-slate-300 py-16">
                    <p className="text-slate-700 font-medium">You have not raised any queries yet</p>
                    <p className="text-sm text-slate-500 mt-1">
                        Questions about royalties, ISBN or printing? <Link to="/author/tickets/new" className="text-emerald-700 underline">Submit a query</Link>
                    </p>
                </div>
            ) : (
                items.map((t) => {
                    const tid = t.id || t._id;
                    const isOpen = location.state?.openTicketId === tid;
                    return (
                        <TicketCard
                            key={tid}
                            ticket={t}
                            unread={unreadIds.includes(tid)}
                            defaultOpen={isOpen}
                        />
                    );
                })
            )}
        </div>
    );
}