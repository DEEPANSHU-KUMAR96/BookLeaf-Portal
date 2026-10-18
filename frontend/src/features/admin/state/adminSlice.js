import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as adminService from "../service/adminService";
import { getErrorMessage } from "../../../utils/getErrorMessage";

/** Thunk factory: every failure becomes a readable message in the rejected payload. */
const makeThunk = (type, fn) =>
  createAsyncThunk(type, async (arg, api) => {
    try {
      return await fn(arg, api);
    } catch (err) {
      return api.rejectWithValue(getErrorMessage(err));
    }
  });

const initialFilters = {
  status: "", category: "", priority: "", assignedTo: "",
  search: "", from: "", to: "", sort: "urgency", page: 1,
};

export const loadQueue = makeThunk("admin/loadQueue", (_, { getState }) =>
  adminService.fetchQueue(getState().admin.filters)
);
export const loadDetail = makeThunk("admin/loadDetail", (id) => adminService.fetchTicket(id));
export const refreshDetail = makeThunk("admin/refreshDetail", (id) => adminService.fetchTicket(id));

// Mutations: components call .unwrap() to show the error message inline
export const updateTicket = makeThunk("admin/update", ({ id, changes }) => adminService.patchTicket(id, changes));
export const addNote = makeThunk("admin/addNote", ({ id, text }) => adminService.postNote(id, text));
export const sendResponse = makeThunk("admin/send", ({ id, message, aiAssisted }) =>
  adminService.postResponse(id, { message, aiAssisted })
);
export const reclassifyTicket = makeThunk("admin/reclassify", (id) => adminService.reclassify(id));

// Used by the realtime hook. Plain thunks that skip work nobody is looking at.
export const syncQueue = () => (dispatch, getState) => {
  if (getState().admin.queue.status !== "idle") dispatch(loadQueue());
};
export const syncDetail = (ids) => (dispatch, getState) => {
  const current = getState().admin.detail.ticket;
  if (current && (!ids || ids.includes(current._id))) dispatch(refreshDetail(current._id));
};

// Only touch the detail if it is still the ticket the response belongs to
const applyTicket = (state, ticket) => {
  if (state.detail.ticket?._id === ticket._id) state.detail.ticket = ticket;
};

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    filters: { ...initialFilters },
    queue: { items: [], pagination: null, status: "idle", fetching: false, error: null, lastRequestId: null },
    detail: { ticket: null, status: "idle", error: null, lastRequestId: null },
  },
  reducers: {
    setFilter(state, { payload: { key, value } }) {
      state.filters[key] = value;
      if (key !== "page") state.filters.page = 1; // any new filter starts from page 1
    },
    resetFilters(state) {
      state.filters = { ...initialFilters };
    },
  },
  extraReducers: (builder) => {
    builder
      // ---- queue ----
      .addCase(loadQueue.pending, (state, { meta }) => {
        state.queue.fetching = true;
        state.queue.lastRequestId = meta.requestId;
        state.queue.error = null;
        if (state.queue.status !== "succeeded") state.queue.status = "loading";
      })
      .addCase(loadQueue.fulfilled, (state, { payload, meta }) => {
        if (meta.requestId !== state.queue.lastRequestId) return; // a newer request is in flight
        state.queue.items = payload.tickets;
        state.queue.pagination = payload.pagination;
        state.queue.status = "succeeded";
        state.queue.fetching = false;
      })
      .addCase(loadQueue.rejected, (state, { payload, meta }) => {
        if (meta.requestId !== state.queue.lastRequestId) return;
        state.queue.fetching = false;
        state.queue.error = payload;
        if (state.queue.status !== "succeeded") state.queue.status = "failed";
      })
      // ---- detail ----
      .addCase(loadDetail.pending, (state, { meta }) => {
        state.detail.lastRequestId = meta.requestId;
        state.detail.status = "loading";
        state.detail.error = null;
        // Never show the previous ticket while a different one loads
        if (state.detail.ticket?._id !== meta.arg) state.detail.ticket = null;
      })
      .addCase(loadDetail.fulfilled, (state, { payload, meta }) => {
        if (meta.requestId !== state.detail.lastRequestId) return;
        state.detail.ticket = payload;
        state.detail.status = "succeeded";
      })
      .addCase(loadDetail.rejected, (state, { payload, meta }) => {
        if (meta.requestId !== state.detail.lastRequestId) return;
        state.detail.status = "failed";
        state.detail.error = payload;
      })
      .addCase(refreshDetail.fulfilled, (state, { payload }) => applyTicket(state, payload))
      .addCase(updateTicket.fulfilled, (state, { payload }) => applyTicket(state, payload))
      .addCase(addNote.fulfilled, (state, { payload }) => applyTicket(state, payload))
      .addCase(sendResponse.fulfilled, (state, { payload }) => applyTicket(state, payload))
      .addCase(reclassifyTicket.fulfilled, (state, { payload }) => applyTicket(state, payload));
  },
});

export const { setFilter, resetFilters } = adminSlice.actions;
export default adminSlice.reducer;