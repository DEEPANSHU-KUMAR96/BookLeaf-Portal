import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilter, resetFilters } from "../state/adminSlice";
import { CATEGORIES, PRIORITIES, STATUSES } from "../constants";

const selectCls = "w-full appearance-none pl-3 pr-8 py-2 rounded-lg bg-slate-100 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors cursor-pointer";
const inputCls  = "w-full pl-9 pr-3 py-2 rounded-lg bg-slate-100 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors placeholder:text-slate-400";

function FieldLabel({ children }) {
    return <span className="text-xs font-semibold text-slate-600 mb-1 block">{children}</span>;
}

function SelectField({ label, value, onChange, allLabel, options }) {
    return (
        <div className="flex flex-col">
            <FieldLabel>{label}</FieldLabel>
            <div className="relative">
                <select value={value} onChange={onChange} className={selectCls}>
                    {allLabel && <option value="">{allLabel}</option>}
                    {options.map((o) => (
                        <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
                    ))}
                </select>
                <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    );
}

export default function QueueFilters() {
    const dispatch = useDispatch();
    const filters = useSelector((s) => s.admin.filters);
    const [search, setSearch] = useState(filters.search);

    // Debounce search
    useEffect(() => {
        if (search.trim() === filters.search) return;
        const t = setTimeout(() => dispatch(setFilter({ key: "search", value: search.trim() })), 400);
        return () => clearTimeout(t);
    }, [search, filters.search, dispatch]);

    const set = (key) => (e) => dispatch(setFilter({ key, value: e.target.value }));

    return (
        <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-card flex flex-col gap-4">
            {/* Search row */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                    <FieldLabel>Search subject</FieldLabel>
                    <span className="text-[10px] font-mono text-slate-400">
                        Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold text-[9px]">ESC</kbd> to clear
                    </span>
                </div>
                <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === "Escape" && (setSearch(""), dispatch(setFilter({ key: "search", value: "" })))}
                        placeholder="e.g. royalty, Whispers of the Ganges, metadata"
                        className={inputCls}
                    />
                </div>
            </div>

            {/* Dropdowns row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <SelectField label="Status" value={filters.status} onChange={set("status")} allLabel="All statuses" options={STATUSES} />
                <SelectField label="Category" value={filters.category} onChange={set("category")} allLabel="All categories" options={CATEGORIES} />
                <SelectField label="Priority" value={filters.priority} onChange={set("priority")} allLabel="All priorities" options={PRIORITIES} />
                <SelectField
                    label="Assignee" value={filters.assignedTo} onChange={set("assignedTo")} allLabel="Anyone"
                    options={[{ value: "me", label: "Assigned to me" }, { value: "unassigned", label: "Unassigned" }]}
                />
            </div>

            {/* Date range + sort + reset row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
                {/* From */}
                <div className="flex flex-col">
                    <FieldLabel>From</FieldLabel>
                    <div className="relative">
                        <input type="date" value={filters.from} max={filters.to || undefined} onChange={set("from")}
                            className="w-full pl-3 pr-9 py-2 rounded-lg bg-slate-100 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors" />
                        <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                </div>

                {/* To */}
                <div className="flex flex-col">
                    <FieldLabel>To</FieldLabel>
                    <div className="relative">
                        <input type="date" value={filters.to} min={filters.from || undefined} onChange={set("to")}
                            className="w-full pl-3 pr-9 py-2 rounded-lg bg-slate-100 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors" />
                        <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                </div>

                {/* Sort */}
                <SelectField
                    label="Sort by" value={filters.sort} onChange={set("sort")}
                    options={[{ value: "urgency", label: "Urgency" }, { value: "oldest", label: "Oldest first" }, { value: "newest", label: "Newest first" }]}
                />

                {/* Reset */}
                <div className="flex items-end">
                    <button
                        onClick={() => { dispatch(resetFilters()); setSearch(""); }}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                    >
                        Reset filters
                    </button>
                </div>
            </div>
        </div>
    );
}