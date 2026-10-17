import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as authService from "../services/authService.js";
import { refreshAccessToken, setAccessToken } from "../../../services/api";
import { getErrorMessage } from "../../../utils/getErrorMessage";

export const login = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const { user, accessToken } = await authService.login(credentials);
    setAccessToken(accessToken);
    return user;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

/** Runs once on page load: the in-memory token is gone after a refresh, so restore the session from the cookie. */
export const bootstrapSession = createAsyncThunk("auth/bootstrap", async (_, { rejectWithValue }) => {
  try {
    await refreshAccessToken();
    return await authService.fetchMe();
  } catch {
    return rejectWithValue(null); // no valid session: not an error, just logged out
  }
});

export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    await authService.logout();
  } finally {
    setAccessToken(null); // always clear locally, even if the request fails
  }
});

const initialState = {
  user: null,
  // initializing -> authenticated | unauthenticated. Route guards wait while initializing.
  status: "initializing",
  loginLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Dispatched by the axios layer when refresh fails
    sessionExpired(state) {
      state.user = null;
      state.status = "unauthenticated";
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loginLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.loginLoading = false;
        state.user = payload;
        state.status = "authenticated";
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.loginLoading = false;
        state.error = payload;
      })
      .addCase(bootstrapSession.fulfilled, (state, { payload }) => {
        state.user = payload;
        state.status = "authenticated";
      })
      .addCase(bootstrapSession.rejected, (state) => {
        state.user = null;
        state.status = "unauthenticated";
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.status = "unauthenticated";
      });
  },
});

export const { sessionExpired, clearError } = authSlice.actions;
export default authSlice.reducer;