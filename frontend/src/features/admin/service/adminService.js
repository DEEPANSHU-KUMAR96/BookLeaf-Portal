import api from "../../../services/api";

// An empty string means "no filter", so it is dropped before the request
const clean = (params) =>
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== "" && v != null));

export const fetchQueue = (filters) =>
    api.get("/admin/tickets", { params: clean({ ...filters, limit: 20 }) }).then((r) => r.data);

export const fetchTicket = (id) => api.get(`/admin/tickets/${id}`).then((r) => r.data.ticket);
export const patchTicket = (id, changes) => api.patch(`/admin/tickets/${id}`, changes).then((r) => r.data.ticket);
export const postNote = (id, text) => api.post(`/admin/tickets/${id}/notes`, { text }).then((r) => r.data.ticket);
export const postResponse = (id, payload) => api.post(`/admin/tickets/${id}/responses`, payload).then((r) => r.data.ticket);
export const reclassify = (id) => api.post(`/admin/tickets/${id}/ai-classify`).then((r) => r.data.ticket);

export const fetchDraft = (id, force = false) =>
    api.post(`/admin/tickets/${id}/ai-draft`, null, { params: force ? { force: true } : {} }).then((r) => r.data);