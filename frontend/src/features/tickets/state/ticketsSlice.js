import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as ticketService from "../services/ticketService";
import { getErrorMessage } from "../../../utils/getErrorMessage";

export const loadTickets = createAsyncThunk("tickets/load", async (_, { rejectWithValue }) => {
    try {
        return await ticketService.fetchTickets();
    } catch (err) {
        return rejectWithValue(getErrorMessage(err));
    }
});

export const submitTicket = createAsyncThunk("tickets/submit", async (payload, { rejectWithValue }) => {
    try {
        return await ticketService.createTicket(payload);
    } catch (err) {
        return rejectWithValue(getErrorMessage(err));
    }
});

/** Called by the realtime hook: refetch ONE ticket through the normal authorized endpoint. */
export const refreshTicket = createAsyncThunk("tickets/refresh", async (id, { rejectWithValue }) => {
    try {
        return await ticketService.fetchTicket(id);
    } catch (err) {
        return rejectWithValue(getErrorMessage(err));
    }
});

const byLatestUpdate = (a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);

function getId(t) {
    return t ? (t.id || t._id) : null;
}

function upsert(state, ticket) {
    if (!ticket) return;
    const tid = getId(ticket);
    const i = state.items.findIndex((t) => getId(t) === tid);
    if (i === -1) state.items.push(ticket);
    else state.items[i] = ticket;
    state.items.sort(byLatestUpdate); // a ticket with a fresh reply moves to the top
}

/** Marks tickets that gained responses since we last saw them. Must run BEFORE state.items is replaced. */
function flagNewReplies(state, incoming) {
    if (!Array.isArray(incoming)) return;
    const before = new Map(state.items.map((t) => [getId(t), (t.responses || []).length]));
    for (const t of incoming) {
        const tid = getId(t);
        const had = before.get(tid);
        const respLen = (t.responses || []).length;
        if (had !== undefined && respLen > had && !state.unreadIds.includes(tid)) {
            state.unreadIds.push(tid);
        }
    }
}

const ticketsSlice = createSlice({
    name: "tickets",
    initialState: { items: [], unreadIds: [], status: "idle", error: null },
    reducers: {
        markRead(state, { payload: id }) {
            state.unreadIds = state.unreadIds.filter((x) => x !== id);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadTickets.pending, (state) => {
                // Silent when data is already on screen (e.g. a resync after reconnect): no spinner flicker
                if (state.status !== "succeeded") state.status = "loading";
                state.error = null;
            })
            .addCase(loadTickets.fulfilled, (state, { payload }) => {
                const list = payload?.tickets || (Array.isArray(payload) ? payload : []);
                flagNewReplies(state, list);
                state.items = list;
                state.status = "succeeded";
            })
            .addCase(loadTickets.rejected, (state, { payload }) => {
                if (state.status !== "succeeded") state.status = "failed"; // keep showing old data if we have it
                state.error = payload;
            })
            .addCase(submitTicket.fulfilled, (state, { payload }) => {
                upsert(state, payload);
            })
            .addCase(refreshTicket.fulfilled, (state, { payload }) => {
                if (payload) {
                    flagNewReplies(state, [payload]);
                    upsert(state, payload);
                }
            });
    },
});

export const { markRead } = ticketsSlice.actions;
export default ticketsSlice.reducer;