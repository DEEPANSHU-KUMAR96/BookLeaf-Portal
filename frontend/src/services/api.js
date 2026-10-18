import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "/api";

// The access token lives in memory only (not localStorage), so XSS cannot steal it.
// The refresh token is an httpOnly cookie that JavaScript cannot read.
let accessToken = null;
let onAuthFailure = () => { };

export const setAccessToken = (token) => {
    accessToken = token;
};
// Used by the SSE client, which cannot go through axios interceptors
export const getAccessToken = () => accessToken;

export const setAuthFailureHandler = (fn) => {
    onAuthFailure = fn;
};

export const apiBaseURL = baseURL;

const api = axios.create({ baseURL, withCredentials: true });

// Separate client so the refresh call itself never passes through the interceptors below
const refreshClient = axios.create({ baseURL, withCredentials: true });

/**
 * Single-flight refresh. The backend rotates refresh tokens and treats reuse as theft,
 * so two parallel refresh calls would log the user out. All callers share one promise.
 */
let refreshPromise = null;
export function refreshAccessToken() {
    if (!refreshPromise) {
        refreshPromise = refreshClient
            .post("/auth/refresh")
            .then((res) => {
                accessToken = res.data.accessToken;
                return accessToken;
            })
            .finally(() => {
                refreshPromise = null;
            });
    }
    return refreshPromise;
}

api.interceptors.request.use((config) => {
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
});

const AUTH_URLS = ["/auth/login", "/auth/refresh", "/auth/logout"];

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const { config, response } = error;
        const isAuthCall = AUTH_URLS.some((url) => config?.url?.includes(url));

        // Only an expired/missing access token on a normal call is worth a refresh + retry
        if (response?.status !== 401 || !config || config._retry || isAuthCall) throw error;
        config._retry = true;

        try {
            await refreshAccessToken();
            return api(config); // the request interceptor attaches the new token
        } catch {
            accessToken = null;
            onAuthFailure(); // session is dead: send the user to the login page
            throw error;
        }
    }
);

export default api;