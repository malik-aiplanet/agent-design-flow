import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import ToolsManagement from "./pages/ToolsManagement";
import ModelsManagement from "./pages/ModelsManagement";
import TerminationsManagement from "./pages/TerminationsManagement";
import Agents2Management from "./pages/Agents2Management";
import CreateTeam from "./pages/CreateTeam";
import EditTeam from "./pages/EditTeam";
import ChatInterface from "./pages/ChatInterface";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

import DeployedAppLayout from "@/components/app/pages/home.tsx";
import DeployedAppInterface from "@/components/app/pages/interface.tsx";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isAuthRoute =
    location.pathname === "/login" || location.pathname === "/register";
  const isCreateRoute = location.pathname === "/create";
  const isEditRoute =
    location.pathname.startsWith("/agent/edit") ||
    location.pathname.startsWith("/team/edit");
  const isChatRoute = location.pathname.startsWith("/chat");
  const isApp = location.pathname.startsWith("/app");

  // Public routes (auth pages)
  if (isAuthRoute) {
    return (
      <main className="w-full">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    );
  }

  // Protected full-screen routes (create, edit, chat)
  if (isCreateRoute || isEditRoute) {
    return (
      <ProtectedRoute>
        <main className="w-full">
          <Routes>
            <Route path="/create" element={<CreateTeam />} />
            <Route path="/agent/edit/:id" element={<EditTeam />} />
            <Route path="/team/edit/:id" element={<EditTeam />} />
          </Routes>
        </main>
      </ProtectedRoute>
    );
  }

  if (isChatRoute) {
    return (
      <ProtectedRoute>
        <Routes>
          <Route path="/chat" element={<DeployedAppLayout />}>
            <Route path=":teamId" element={<DeployedAppInterface />}>
              <Route
                path=":conversationId"
                element={<DeployedAppInterface />}
              />
            </Route>
          </Route>
        </Routes>
      </ProtectedRoute>
    );
  }

  // Protected sidebar layout routes
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/agents-2" element={<Agents2Management />} />
              <Route path="/tools" element={<ToolsManagement />} />
              <Route path="/models" element={<ModelsManagement />} />
              <Route
                path="/terminations"
                element={<TerminationsManagement />}
              />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
