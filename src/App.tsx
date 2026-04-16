import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import { AppShell } from "@/components/AppShell";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminPartners from "./pages/admin/Partners";
import AdminPartnerDetail from "./pages/admin/PartnerDetail";
import AdminPartnerNew from "./pages/admin/PartnerNew";
import AdminUsers from "./pages/admin/Users";
import AdminUserDetail from "./pages/admin/UserDetail";
import AdminUserNew from "./pages/admin/UserNew";
import AdminLeads from "./pages/admin/Leads";
import AdminLeadDetail from "./pages/admin/LeadDetail";
import AdminDeals from "./pages/admin/Deals";
import AdminDealDetail from "./pages/admin/DealDetail";
import AdminDocuments from "./pages/admin/Documents";
import AdminDocumentUpload from "./pages/admin/DocumentUpload";
import AdminReporting from "./pages/admin/Reporting";
import AdminConfigure from "./pages/admin/Configure";

// Partner pages
import PartnerDashboard from "./pages/partner/Dashboard";
import PartnerLeads from "./pages/partner/Leads";
import PartnerLeadNew from "./pages/partner/LeadNew";
import PartnerLeadDetail from "./pages/partner/LeadDetail";
import PartnerDeals from "./pages/partner/Deals";
import PartnerDealDetail from "./pages/partner/DealDetail";
import PartnerDocuments from "./pages/partner/Documents";
import PartnerFinance from "./pages/partner/Finance";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Admin routes */}
            <Route path="/app/admin" element={<AppShell />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="partners" element={<AdminPartners />} />
              <Route path="partners/new" element={<AdminPartnerNew />} />
              <Route path="partners/:partnerId" element={<AdminPartnerDetail />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="users/new" element={<AdminUserNew />} />
              <Route path="users/:userId" element={<AdminUserDetail />} />
              <Route path="leads" element={<AdminLeads />} />
              <Route path="leads/:leadId" element={<AdminLeadDetail />} />
              <Route path="deals" element={<AdminDeals />} />
              <Route path="deals/:id" element={<AdminDealDetail />} />
              <Route path="documents" element={<AdminDocuments />} />
              <Route path="documents/upload" element={<AdminDocumentUpload />} />
              <Route path="reporting" element={<AdminReporting />} />
            </Route>

            {/* Partner routes */}
            <Route path="/app/partner" element={<AppShell />}>
              <Route path="dashboard" element={<PartnerDashboard />} />
              <Route path="leads" element={<PartnerLeads />} />
              <Route path="leads/new" element={<PartnerLeadNew />} />
              <Route path="leads/:leadId" element={<PartnerLeadDetail />} />
              <Route path="deals" element={<PartnerDeals />} />
              <Route path="deals/:id" element={<PartnerDealDetail />} />
              <Route path="documents" element={<PartnerDocuments />} />
              <Route path="finance" element={<PartnerFinance />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
