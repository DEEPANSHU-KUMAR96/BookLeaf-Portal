import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useBooks } from "../../books/hook/useBooks";
import { submitTicket } from "../state/ticketsSlice";

const MAX_FILES = 5;
const field = (hasError) =>
    `mt-1 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${hasError ? "border-red-400" : "border-slate-300"}`;

// Mirrors the backend rules so most mistakes are caught before a request is made
function validate({ subject, description }) {
    const errors = {};
    if (subject.trim().length < 5) errors.subject = "Subject must be at least 5 characters";
    if (description.trim().length < 20) errors.description = "Please describe the issue in at least 20 characters";
    return errors;
}

export default function SubmitTicketPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items: books, status: booksStatus } = useBooks();
    const fileInput = useRef(null);

    const [form, setForm] = useState({ bookId: "", subject: "", description: "" });
    const [files, setFiles] = useState([]);
    const [errors, setErrors] = useState({});
    const [fileError, setFileError] = useState(null);
    const [serverError, setServerError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const onChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: undefined });
    };

    const onPickFiles = (e) => {
        const picked = Array.from(e.target.files);
        e.target.value = ""; // lets the user pick the same file again after removing it
        const merged = [...files];
        for (const f of picked) {
            if (!merged.some((m) => m.name === f.name && m.size === f.size)) merged.push(f);
        }
        setFileError(merged.length > MAX_FILES ? `You can attach up to ${MAX_FILES} files` : null);
        setFiles(merged.slice(0, MAX_FILES));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const found = validate(form);
        setErrors(found);
        if (Object.keys(found).length) return;

        setSubmitting(true);
        setServerError(null);
        try {
            await dispatch(
                submitTicket({
                    bookId: form.bookId || null, // empty = General / Account Level
                    subject: form.subject.trim(),
                    description: form.description.trim(),
                    attachments: files.map((f) => ({ fileName: f.name })), // UI only: file contents are not uploaded
                })
            ).unwrap();
            navigate("/author/tickets", { state: { submitted: true } });
        } catch (message) {
            setServerError(message); // unwrap() throws the rejectWithValue message, e.g. a rate-limit notice
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={onSubmit} noValidate className="max-w-2xl space-y-5">
            <div>
                <h1 className="text-lg font-semibold text-slate-900">Submit a Query</h1>
                <p className="text-sm text-slate-500">Tell us what you need help with and our team will get back to you here.</p>
            </div>

            {serverError && (
                <div role="alert" className="rounded-md bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">{serverError}</div>
            )}

            <label className="block text-sm">
                <span className="text-slate-700">Which book is this about?</span>
                <select name="bookId" value={form.bookId} onChange={onChange} disabled={booksStatus === "loading"} className={field(false)}>
                    <option value="">General / Account Level</option>
                    {books.map((b) => (
                        <option key={b._id} value={b._id}>{b.title} ({b.bookId})</option>
                    ))}
                </select>
            </label>

            <label className="block text-sm">
                <span className="text-slate-700">Subject</span>
                <input name="subject" value={form.subject} onChange={onChange} maxLength={200} placeholder="e.g. Royalty not received" className={field(errors.subject)} />
                {errors.subject && <span className="text-xs text-red-600">{errors.subject}</span>}
            </label>

            <label className="block text-sm">
                <span className="text-slate-700">Describe your query</span>
                <textarea name="description" value={form.description} onChange={onChange} maxLength={5000} rows={6} className={field(errors.description)} />
                <div className="flex justify-between text-xs">
                    <span className="text-red-600">{errors.description}</span>
                    <span className="text-slate-400">{form.description.length}/5000</span>
                </div>
            </label>

            <div className="text-sm">
                <span className="text-slate-700">Attachments (optional)</span>
                <div className="mt-1">
                    <input ref={fileInput} type="file" multiple accept="image/*,.pdf" onChange={onPickFiles} className="hidden" />
                    <button type="button" onClick={() => fileInput.current.click()} className="rounded-md border border-slate-300 px-3 py-1.5 hover:bg-slate-50">
                        Choose files
                    </button>
                    <span className="ml-2 text-xs text-slate-400">Up to {MAX_FILES} files. For now only file names are saved with your ticket.</span>
                </div>
                {fileError && <p className="text-xs text-red-600 mt-1">{fileError}</p>}
                {files.length > 0 && (
                    <ul className="mt-2 space-y-1">
                        {files.map((f) => (
                            <li key={`${f.name}-${f.size}`} className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-1.5 text-xs text-slate-700">
                                <span className="truncate">{f.name}</span>
                                <button type="button" onClick={() => setFiles(files.filter((x) => x !== f))} className="text-slate-400 hover:text-red-600" aria-label={`Remove ${f.name}`}>
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <button type="submit" disabled={submitting} className="rounded-md bg-emerald-600 text-white px-4 py-2 text-sm font-medium hover:bg-emerald-700 disabled:opacity-60">
                {submitting ? "Submitting..." : "Submit query"}
            </button>
        </form>
    );
}