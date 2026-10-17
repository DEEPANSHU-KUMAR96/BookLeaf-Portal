import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer, { sessionExpired } from "../features/auth/state/authSlice";
import { setAuthFailureHandler } from "../services/api";

const appReducer = combineReducers({
  auth: authReducer,
  // books, tickets and admin slices are added in the next steps
});

/**
 * Wipes ALL state on logout or session expiry, so the next person who logs in on the
 * same browser never sees the previous author's tickets or books.
 */
const rootReducer = (state, action) => {
  const isLogout = action.type === "auth/logout/fulfilled" || action.type === sessionExpired.type;
  return appReducer(isLogout ? undefined : state, action);
};

export const store = configureStore({ reducer: rootReducer });

// Lets the axios layer (which cannot import the store directly) report a dead session
setAuthFailureHandler(() => store.dispatch(sessionExpired()));