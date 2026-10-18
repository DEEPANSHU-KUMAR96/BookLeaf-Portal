import api from "../../../services/api";

// 50 is plenty for one author; pagination can be added if tickets grow
export const fetchTickets = () => api.get("/tickets", {
    params: { limit: 50 }
}).then((r) => r.data);

export const fetchTicket = (id) => api.get(`/tickets/${id}`).then((r) => r.data.ticket);

export const createTicket = (payload) => api.post("/tickets", payload).then((r) => r.data.ticket);

export const updateTicket = (id, updates) =>
    api.patch(`/tickets/${id}`, updates).then((r) => r.data.ticket);

export const submitTicketReply = ({ ticketId, message }) =>
    api.post(`/tickets/${ticketId}/replies`, { message }).then((r) => r.data.reply);

export const getTicketConversation = (ticketId) =>
    api.get(`/tickets/${ticketId}/conversation`).then((r) => r.data.messages || []);