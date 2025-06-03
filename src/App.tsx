
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Dashboard from "./pages/Dashboard";
import ToolsManagement from "./pages/ToolsManagement";
import ModelsManagement from "./pages/ModelsManagement";
import TerminationsManagement from "./pages/TerminationsManagement";
import Agents2Management from "./pages/Agents2Management";
import CreateAgent from "./pages/CreateAgent";
import EditAgent from "./pages/EditAgent";
import ChatInterface from "./pages/ChatInterface";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isCreateRoute = location.pathname === "/create";
  const isEditRoute = location.pathname.startsWith("/agent/edit");
  const isChatRoute = location.pathname.startsWith("/chat");

  if (isCreateRoute || isEditRoute || isChatRoute) {
    return (
      <main className="w-full">
        <Routes>
          <Route path="/create" element={<CreateAgent />} />
          <Route path="/agent/edit/:id" element={<EditAgent />} />
          <Route path="/chat/:agentId" element={<ChatInterface />} />
          <Route path="/chat/:agentId/:conversationId" element={<ChatInterface />} />
        </Routes>
      </main>
    );
  }

  return (
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
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
