import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { bootstrapSession } from "../features/auth/state/authSlice";

export default function App() {
  const dispatch = useDispatch();

  // Restore the session from the refresh cookie on every full page load
  useEffect(() => {
    dispatch(bootstrapSession());
  }, [dispatch]);

  return <RouterProvider router={router} />;
}