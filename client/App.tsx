import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AccountTypeSelection from "./pages/AccountTypeSelection";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import BrowseProjects from "./pages/BrowseProjects";
import IdentityVerification from "./pages/IdentityVerification";
import SubmitProject from "./pages/SubmitProject";
import Dashboard from "./pages/Dashboard";
import InvestorDashboard from "./pages/InvestorDashboard";
import ProjectDetails from "./pages/ProjectDetails";
import AiServicePage from "./pages/AiServicePage";
import PartnershipsPage from "./pages/PartnershipsPage";
import MyAdvisorPage from "./pages/MyAdvisorPage";
import MembershipPage from "./pages/MembershipPage";
import MembershipCheckoutPage from "./pages/MembershipCheckoutPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/account-type" element={<AccountTypeSelection />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/browse-projects" element={<BrowseProjects />} />
          <Route path="/identity-verification" element={<IdentityVerification />} />
          <Route path="/submit-project" element={<SubmitProject />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/investor-dashboard" element={<InvestorDashboard />} />
          <Route path="/project-details/:id" element={<ProjectDetails />} />
          <Route path="/ai-service/:role/:service" element={<AiServicePage />} />
          <Route path="/partnerships" element={<PartnershipsPage />} />
          <Route path="/my-advisor" element={<MyAdvisorPage />} />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/membership/:planId" element={<MembershipCheckoutPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
