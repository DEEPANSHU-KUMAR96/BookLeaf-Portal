import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { formatDateTime } from "../../../utils/format";
import { markRead } from "../state/ticketsSlice";
import TicketStatusBadge from "./TicketStatusBadge";

// whitespace-pre-wrap keeps the line breaks of multi-paragraph replies
function Bubble({ from, name, time, children }) {
    const mine = from === "author";
    return (
        <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-xl px-4 py-3 text-sm ${mine ? "bg-slate-100 text-slate-800" : "bg-emerald-50 text-slate-800 ring-1 ring-emerald-100"}`}>
                <p className="text-xs font-medium text-slate-500 mb-1">{name} · {time}</p>
                <p className="whitespace-pre-wrap">{children}</p>
            </div>
        </div>
    );
}

export default function TicketCard({ ticket, unread }) {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);

    // Viewing the ticket clears the badge, also when a reply arrives while it is already open
    useEffect(() => {
        if (open && unread) dispatch(markRead(ticket.id));
    }, [open, unread, ticket.id, dispatch]);

    return (
        <article className="rounded-xl bg-white border border-slate-200">
            <button
                onClick={() => setOpen((o) => !o)} aria-expanded={open}
                className="w-full text-left p-4 flex flex-wrap items-start justify-between gap-2"
            >
                <div>
                    <h2 className="font-medium text-slate-900">{ticket.subject}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        {ticket.book ? ticket.book.title : "General / Account Level"} · Updated {formatDateTime(ticket.updatedAt)}
                        {ticket.responses.length > 0 && ` · ${ticket.responses.length} ${ticket.responses.length === 1 ? "reply" : "replies"}`}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {unread && <span className="rounded-full bg-emerald-600 text-white text-xs px-2 py-0.5">New reply</span>}
                    <TicketStatusBadge status={ticket.status} />
                </div>
            </button>

            {open && (
                <div className="border-t border-slate-100 p-4 space-y-3">
                    <Bubble from="author" name="You" time={formatDateTime(ticket.createdAt)}>
                        {ticket.description}
                    </Bubble>

                    {ticket.attachments.length > 0 && (
                        <p className="text-xs text-slate-500 text-right">Attached: {ticket.attachments.map((a) => a.fileName).join(", ")}</p>
                    )}

                    {ticket.responses.length === 0 ? (
                        <p className="text-sm text-slate-500 text-center py-2">
                            No response yet. Replies from our team will appear here automatically.
                        </p>
                    ) : (
                        ticket.responses.map((r) => (
                            <Bubble key={r.id} from="admin" name="BookLeaf Team" time={formatDateTime(r.createdAt)}>
                                {r.message}
                            </Bubble>
                        ))
                    )}
                </div>
            )}
        </article>
    );
}