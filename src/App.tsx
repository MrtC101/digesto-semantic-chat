import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import { ChatProvider } from "@/contexts/chat_context";
import { AuthProvider } from "@/contexts/auth_context";
import ProtectedRoute from "@/components/auth/ProtectRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
      <ChatProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                  <Route path="/login" element={<Login />} />
                  <Route path="*" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
                </Routes>
              </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </ChatProvider>
  </QueryClientProvider>
);

export default App;
