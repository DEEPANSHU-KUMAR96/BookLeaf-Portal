import { formatDateTime } from "../../../utils/format";

function Bubble({ isAuthor, name, time, badge, children }) {
    return (
        <div className={`flex ${isAuthor ? "justify-start" : "justify-end"}`}>
            <div className={`flex items-start gap-3 max-w-[90%] ${isAuthor ? "flex-row" : "flex-row-reverse"}`}>
                {/* Avatar */}
                <div className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-mono font-bold shadow-sm
                    ${isAuthor ? "bg-slate-200 text-slate-600" : "bg-emerald-800 text-emerald-100"}`}
                >
                    {name?.slice(0, 2).toUpperCase() ?? "??"}
                </div>

                {/* Bubble */}
                <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed
                    ${isAuthor
                        ? "bg-slate-100 text-slate-800 rounded-tl-sm"
                        : "bg-emerald-50 ring-1 ring-emerald-100 text-slate-800 rounded-tr-sm"
                    }`}
                >
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-xs font-semibold text-slate-600">{name ?? "Unknown"}</span>
                        <span className="text-[10px] font-mono text-slate-400">{time}</span>
                        {badge && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200/60">
                                {badge}
                            </span>
                        )}
                        {isAuthor && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono text-slate-400 bg-white border border-slate-200">
                                Inbound Inquiry
                            </span>
                        )}
                    </div>
                    <p className="whitespace-pre-wrap break-words text-slate-800">{children}</p>
                </div>
            </div>
        </div>
    );
}

export default function Conversation({ ticket }) {
    const responses = ticket.responses ?? [];

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-800">Conversation Thread</h2>
                <span className="text-[10px] font-mono text-slate-400">
                    {responses.length} {responses.length === 1 ? "reply" : "replies"}
                </span>
            </div>

            {/* Thread */}
            <div className="p-5 flex flex-col gap-4">
                {/* Original message */}
                <Bubble isAuthor name={ticket.author?.name} time={`${formatDateTime(ticket.createdAt)} · via Author Web Portal`}>
                    {ticket.description}
                </Bubble>

                {/* Attachments */}
                {ticket.attachments?.length > 0 && (
                    <div className="flex flex-wrap gap-2 ml-12">
                        {ticket.attachments.map((a) => (
                            <span key={a._id ?? a.fileName} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 text-xs text-slate-600 font-mono">
                                📎 {a.fileName}
                            </span>
                        ))}
                    </div>
                )}

                {/* Responses */}
                {responses.map((r) => (
                    <Bubble
                        key={r._id}
                        isAuthor={r.senderRole === "author"}
                        name={r.sender?.name ?? "BookLeaf Team"}
                        time={formatDateTime(r.createdAt)}
                        badge={r.aiAssisted ? "AI-assisted" : null}
                    >
                        {r.message}
                    </Bubble>
                ))}

                {/* No replies */}
                {responses.length === 0 && (
                    <div className="flex items-center gap-2 py-2 text-xs text-amber-600 font-medium">
                        <svg className="w-4 h-4 shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        No reply sent yet. SLA threshold expiring shortly.
                    </div>
                )}
            </div>
        </div>
    );
}