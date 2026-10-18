import { useCallback, useEffect, useRef, useState } from "react";
import * as adminService from "../service/adminService";
import { getErrorMessage } from "../../../utils/getErrorMessage";

/**
 * Loads the AI draft for one ticket. Use it in a component keyed by ticket id,
 * so switching tickets remounts it and starts clean.
 *
 * status: idle -> loading -> ready | unavailable
 * stale:  the category changed after the draft was written
 */
export function useAiDraft(ticketId, enabled, category) {
  const [state, setState] = useState({ status: "idle", text: "", error: null, stale: false });
  const requestId = useRef(0); // ignores responses of superseded requests
  const started = useRef(false); // also protects against the double effect run in React StrictMode
  const lastCategory = useRef(category);

  const load = useCallback(
    async (force = false) => {
      const id = ++requestId.current;
      setState((s) => ({ ...s, status: "loading", error: null }));
      try {
        const { draft } = await adminService.fetchDraft(ticketId, force);
        if (id !== requestId.current) return null;
        setState({ status: "ready", text: draft, error: null, stale: false });
        return draft;
      } catch (err) {
        if (id !== requestId.current) return null;
        // 503 carries the "write it manually" message from the backend
        setState((s) => ({ ...s, status: "unavailable", error: getErrorMessage(err) }));
        return null;
      }
    },
    [ticketId]
  );

  // Start once, as soon as the ticket is ready for drafting (classification finished)
  useEffect(() => {
    if (enabled && !started.current) {
      started.current = true;
      load();
    }
  }, [enabled, load]);

  // A category change after the draft was written means the draft used the wrong policy section
  useEffect(() => {
    if (lastCategory.current === category) return;
    lastCategory.current = category;
    setState((s) => (s.status === "ready" ? { ...s, stale: true } : s));
  }, [category]);

  return { ...state, regenerate: () => load(true), retry: () => load(false) };
}