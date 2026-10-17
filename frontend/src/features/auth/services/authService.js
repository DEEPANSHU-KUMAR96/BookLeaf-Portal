import api from "../../../services/api";

export const login = (credentials) => api.post("/auth/login", credentials).then((r) => r.data);

export const logout = () => api.post("/auth/logout");

export const fetchMe = () => api.get("/auth/me").then((r) => r.data.user);