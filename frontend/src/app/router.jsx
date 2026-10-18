import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import AppShell from "../components/AppShell";
import AdminShell from "../components/AdminShell";
import Spinner from "../components/Spinner";
import LoginPage from "../features/auth/pages/LoginPage";
import { useAuth } from "../features/auth/hook/useAuth";
import MyBooksPage from "../features/books/pages/MyBooksPage";
import SubmitTicketPage from "../features/tickets/pages/SubmitTicketPage";
import MyTicketsPage from "../features/tickets/pages/MyTicketsPage";
import TicketQueuePage from "../features/admin/pages/TicketQueuePage";
import TicketDetailPage from "../features/admin/pages/TicketDetailPage";
import RoyaltyTermsPage from "../features/legal/pages/RoyaltyTermsPage";
import PrivacyPolicyPage from "../features/legal/pages/PrivacyPolicyPage";

/** "/" sends everyone to the right place for their role. */
function HomeRedirect() {
    const { user, status } = useAuth();
    if (status === "initializing") return <Spinner fullPage />;
    if (!user) return <Navigate to="/login" replace />;
    return <Navigate to={user.role === "admin" ? "/admin" : "/author"} replace />;
}

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
        path: "/royalty-terms",
        element: <RoyaltyTermsPage />
    },
    {
        path: "/privacy-policy",
        element: <PrivacyPolicyPage />
    },
    {
        element: <ProtectedRoute role="author" />,
        children: [
            {
                element: <AppShell />,
                children: [
                    { path: "/author", element: <Navigate to="/author/books" replace /> },
                    { path: "/author/books", element: <MyBooksPage /> },
                    { path: "/author/tickets/new", element: <SubmitTicketPage /> },
                    { path: "/author/tickets", element: <MyTicketsPage /> },
                    { path: "/author/royalty-terms", element: <RoyaltyTermsPage /> },
                    { path: "/author/privacy-policy", element: <PrivacyPolicyPage /> },
                ],
            },
        ],
    },
    {
        element: <ProtectedRoute role="admin" />,
        children: [{
            element: <AdminShell />,
            children: [
                { path: "/admin", element: <TicketQueuePage /> },
                { path: "/admin/tickets/:id", element: <TicketDetailPage /> },
            ]
        }],
    },
    {
        path: "*",
        element: <Navigate to="/" replace />
    },
]);