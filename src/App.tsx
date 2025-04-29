
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { ROUTES, ProtectedRoute, PublicRoute, TechnicianRoute } from "@/utils/routes";

import Login from "./pages/auth/Login";
import AdminLayout from "./components/Layout/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Reports from "./pages/admin/Reports";
import ReportDetail from "./pages/admin/ReportDetail";
import Users from "./pages/admin/Users";
import Locations from "./pages/admin/Locations";
import Export from "./pages/admin/Export";

import TechnicianLayout from "./components/Layout/TechnicianLayout";
import TechnicianDashboard from "./pages/technician/TechnicianDashboard";
import TechnicianReports from "./pages/technician/TechnicianReports";
import TechnicianReportDetail from "./pages/technician/TechnicianReportDetail";
import TechnicianProfile from "./pages/technician/TechnicianProfile";
import SubmitReport from "./pages/technician/SubmitReport";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicRoute />}>
              <Route path={ROUTES.LOGIN} element={<Login />} />
            </Route>
            
            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute adminOnly />}>
              <Route element={<AdminLayout />}>
                <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
                <Route path={ROUTES.REPORTS} element={<Reports />} />
                <Route path={ROUTES.REPORT_DETAIL} element={<ReportDetail />} />
                <Route path={ROUTES.USERS} element={<Users />} />
                <Route path={ROUTES.LOCATIONS} element={<Locations />} />
                <Route path={ROUTES.EXPORT} element={<Export />} />
              </Route>
            </Route>
            
            {/* Protected Technician Routes */}
            <Route element={<TechnicianRoute />}>
              <Route element={<TechnicianLayout />}>
                <Route path={ROUTES.TECHNICIAN_DASHBOARD} element={<TechnicianDashboard />} />
                <Route path={ROUTES.TECHNICIAN_REPORTS} element={<TechnicianReports />} />
                <Route path={`${ROUTES.TECHNICIAN_REPORTS}/:id`} element={<TechnicianReportDetail />} />
                <Route path={ROUTES.TECHNICIAN_PROFILE} element={<TechnicianProfile />} />
                <Route path={ROUTES.TECHNICIAN_SUBMIT_REPORT} element={<SubmitReport />} />
              </Route>
            </Route>

            {/* Redirect Home to Dashboard or Login */}
            <Route path={ROUTES.HOME} element={<Login />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
