
import { Navigate, Outlet } from "react-router-dom";
import { useAppContext } from "@/contexts/AppContext";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  REPORTS: "/reports",
  REPORT_DETAIL: "/reports/:id",
  USERS: "/users",
  USER_DETAIL: "/users/:id",
  LOCATIONS: "/locations",
  EXPORT: "/export",
  TECHNICIAN_DASHBOARD: "/technician",
  TECHNICIAN_REPORTS: "/technician/reports",
  TECHNICIAN_PROFILE: "/technician/profile",
  TECHNICIAN_SUBMIT_REPORT: "/technician/submit-report",
};

export const ProtectedRoute = ({ adminOnly = false }: { adminOnly?: boolean }) => {
  const { isAuthenticated, currentUser } = useAppContext();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (adminOnly && currentUser?.role !== "admin") {
    return <Navigate to={currentUser?.role === "technician" ? ROUTES.TECHNICIAN_DASHBOARD : ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
};

export const TechnicianRoute = () => {
  const { isAuthenticated, currentUser } = useAppContext();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (currentUser?.role !== "technician") {
    return <Navigate to={currentUser?.role === "admin" ? ROUTES.DASHBOARD : ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
};

export const PublicRoute = () => {
  const { isAuthenticated, currentUser } = useAppContext();

  if (isAuthenticated) {
    // Force direct navigation instead of relying on child component
    if (currentUser?.role === "admin") {
      return <Navigate to={ROUTES.DASHBOARD} replace />;
    } else {
      return <Navigate to={ROUTES.TECHNICIAN_DASHBOARD} replace />;
    }
  }

  return <Outlet />;
};
