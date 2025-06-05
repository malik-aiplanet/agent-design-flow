
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import ToolsManagement from "./pages/ToolsManagement";
import ModelsManagement from "./pages/ModelsManagement";
import TerminationsManagement from "./pages/TerminationsManagement";
import Agents2Management from "./pages/Agents2Management";
import CreateAgent from "./pages/CreateAgent";
import EditAgent from "./pages/EditAgent";
import ChatInterface from "./pages/ChatInterface";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isAuthRoute = location.pathname === "/login" || location.pathname === "/register";
  const isCreateRoute = location.pathname === "/create";
  const isEditRoute = location.pathname.startsWith("/agent/edit");
  const isChatRoute = location.pathname.startsWith("/chat");

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
  if (isCreateRoute || isEditRoute || isChatRoute) {
    return (
      <ProtectedRoute>
        <main className="w-full">
          <Routes>
            <Route path="/create" element={<CreateAgent />} />
            <Route path="/agent/edit/:id" element={<EditAgent />} />
            <Route path="/chat/:agentId" element={<ChatInterface />} />
            <Route path="/chat/:agentId/:conversationId" element={<ChatInterface />} />
          </Routes>
        </main>
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
              <Route path="/terminations" element={<TerminationsManagement />} />
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
