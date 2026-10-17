import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import AppShell from "../components/AppShell";
import Spinner from "../components/Spinner";
import LoginPage from "../features/auth/pages/LoginPage";
import { useAuth } from "../features/auth/hook/useAuth";
import MyBooksPage from "../features/books/pages/MyBooksPage";

/** "/" sends everyone to the right place for their role. */
function HomeRedirect() {
    const { user, status } = useAuth();
    if (status === "initializing") return <Spinner fullPage />;
    if (!user) return <Navigate to="/login" replace />;
    return <Navigate to={user.role === "admin" ? "/admin" : "/author"} replace />;
}

// Temporary pages, replaced feature by feature in the next steps
const Placeholder = ({ title }) => <h1 className="text-lg font-medium text-slate-800">{title}</h1>;

export const router = createBrowserRouter([
    {
        path: "/",
        element: <HomeRedirect />
    },
    {
        path: "/login",
        element: <LoginPage />
    },
    {
        element: <ProtectedRoute role="author" />,
        children: [
            {
                element: <AppShell />,
                children: [
                    {
                        path: "/author",
                        element: <Navigate to="/author/books" replace />
                    },
                    {

                        path: "/author/books",
                        element: <MyBooksPage />
                    },
                    {
                        path: "/author/tickets/new",
                        element: <Placeholder title="Submit a query" />
                    },
                    {
                        path: "/author/tickets",
                        element: <Placeholder title="My tickets" />
                    },
                ],
            },
        ],
    },
    {
        element: <ProtectedRoute role="admin" />,
        children: [{
            element: <AppShell />,
            children: [{
                path: "/admin",
                element: <Placeholder title="Admin dashboard" />
            }]
        }],
    },
    {
        path: "*",
        element: <Navigate to="/"
            replace />
    },
]);