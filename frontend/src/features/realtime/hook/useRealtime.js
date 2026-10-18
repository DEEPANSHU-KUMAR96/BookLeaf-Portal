import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { apiBaseURL, getAccessToken, refreshAccessToken } from "../../../services/api";
import { sessionExpired } from "../../auth/state/authSlice";
import { useAuth } from "../../auth/hook/useAuth";
import { loadTickets, refreshTicket } from "../../tickets/state/ticketsSlice";
import { syncDetail, syncQueue } from "../../admin/state/adminSlice";

// Retriable = try again after a short delay. Fatal = give up (the user would need to log in again).
class RetriableError extends Error {}
class FatalError extends Error {}

/**
 * Keeps one SSE connection open while the user is logged in and turns server events
 * into Redux updates. Events only carry ids; the data is refetched via the normal API,
 * so permissions are always enforced by the backend.
 */
export function useRealtime() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const role = user?.role;
  const userId = user?.id;

  useEffect(() => {
    if (!role) return;
    const ctrl = new AbortController();

    // Admin events come in bursts (created, then AI classified). Merge them into one refetch.
    const pendingIds = new Set();
    let timer = null;
    const flushAdmin = () => {
      timer = null;
      const ids = [...pendingIds];
      pendingIds.clear();
      dispatch(syncQueue());
      dispatch(syncDetail(ids));
    };
    const scheduleAdminRefresh = (ticketId) => {
      pendingIds.add(ticketId);
      if (!timer) timer = setTimeout(flushAdmin, 300);
    };

    fetchEventSource(`${apiBaseURL}/events`, {
      signal: ctrl.signal,
      openWhenHidden: true, // keep receiving updates while the tab is in the background

      // Read the token on every (re)connect. It is replaced every ~15 minutes.
      fetch: (input, init) =>
        window.fetch(input, { ...init, headers: { ...init.headers, Authorization: `Bearer ${getAccessToken()}` } }),

      async onopen(res) {
        if (res.ok) return;
        if (res.status === 401) {
          try {
            await refreshAccessToken();
          } catch {
            dispatch(sessionExpired());
            throw new FatalError("Session expired");
          }
          throw new RetriableError();
        }
        if (res.status === 429 || res.status >= 500) throw new RetriableError();
        throw new FatalError(`Stream failed (${res.status})`);
      },

      onmessage(msg) {
        const data = msg.data ? JSON.parse(msg.data) : {};

        // Fires on every (re)connect: resync, because events sent while offline were missed
        if (msg.event === "connected") {
          if (role === "admin") {
            dispatch(syncQueue());
            dispatch(syncDetail());
          } else {
            dispatch(loadTickets());
          }
          return;
        }

        if (role === "admin") {
          if (msg.event === "ticket.created" || msg.event === "ticket.updated") scheduleAdminRefresh(data.ticketId);
        } else if (msg.event === "ticket.response" || msg.event === "ticket.updated") {
          dispatch(refreshTicket(data.ticketId));
        }
      },

      // The server closes the stream when the token expires. Throwing makes the library reconnect.
      onclose() {
        throw new RetriableError();
      },
      onerror(err) {
        if (err instanceof FatalError) throw err; // stop retrying
        return 3000; // retry after 3 seconds
      },
    }).catch(() => {}); // fatal errors end here: the stream simply stays closed

    return () => {
      ctrl.abort();
      clearTimeout(timer);
    };
  }, [dispatch, role, userId]);
}