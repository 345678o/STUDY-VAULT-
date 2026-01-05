import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import AcademicResources from "./pages/AcademicResources";
import ToolsPlatforms from "./pages/ToolsPlatforms";
import MindMap from "./pages/MindMap";
import ResourceManager from "./pages/ResourceManager";
import StudyHelper from "./pages/StudyHelper";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/academic-resources" element={<AcademicResources />} />
          <Route path="/tools-platforms" element={<ToolsPlatforms />} />
          <Route path="/mindmap" element={<MindMap />} />
          <Route path="/resources" element={
            <ProtectedRoute>
              <ResourceManager />
            </ProtectedRoute>
          } />
          <Route path="/study-helper" element={<StudyHelper />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
