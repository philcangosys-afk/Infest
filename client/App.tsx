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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
