import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { apiBaseURL, getAccessToken, refreshAccessToken } from "../../../services/api";
import { sessionExpired } from "../../auth/state/authSlice";
import { useAuth } from "../../auth/hook/useAuth";
import { loadTickets, refreshTicket } from "../../tickets/state/ticketsSlice";

// Retriable = try again after a short delay. Fatal = give up (the user would need to log in again).
class RetriableError extends Error { }
class FatalError extends Error { }

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
        if (role !== "author") return; // the admin stream is wired up with the admin portal
        const ctrl = new AbortController();

        fetchEventSource(`${apiBaseURL}/events`, {
            signal: ctrl.signal,
            openWhenHidden: true, // keep receiving updates while the tab is in the background

            // Read the token on every (re)connect. It is replaced every ~15 minutes.
            fetch: (input, init) =>
                window.fetch(input, { ...init, headers: { ...init.headers, Authorization: `Bearer ${getAccessToken()}` } }),

            async onopen(res) {
                if (res.ok) return;
                if (res.status === 401) {
                    // Access token expired: renew it, then reconnect
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
                switch (msg.event) {
                    case "connected":
                        // Fires on every (re)connect: resync, because events sent while offline were missed
                        dispatch(loadTickets());
                        break;
                    case "ticket.response":
                    case "ticket.updated":
                        dispatch(refreshTicket(data.ticketId));
                        break;
                }
            },

            // The server closes the stream when the token expires. Throwing here makes the library reconnect.
            onclose() {
                throw new RetriableError();
            },
            onerror(err) {
                if (err instanceof FatalError) throw err; // stop retrying
                return 3000; // retry after 3 seconds
            },
        }).catch(() => { }); // fatal errors end here: the stream simply stays closed

        return () => ctrl.abort();
    }, [dispatch, role, userId]);
}