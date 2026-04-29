
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Tests from "./pages/Tests";
import ReadingTest from "./pages/ReadingTest";
import PhonologicalTest from "./pages/PhonologicalTest";
import MemoryTest from "./pages/MemoryTest";
import SequencingTest from "./pages/SequencingTest";
import SpellingTest from "./pages/SpellingTest";
import ReadingTest6to9 from "./pages/ReadingTest6to9";
import PhonologicalTest6to9 from "./pages/PhonologicalTest6to9";
import MemoryTest6to9 from "./pages/MemoryTest6to9";
import SequencingTest6to9 from "./pages/SequencingTest6to9";
import ReadingTest9to12 from "./pages/ReadingTest9to12";
import PhonologicalTest9to12 from "./pages/PhonologicalTest9to12";
import MemoryTest9to12 from "./pages/MemoryTest9to12";
import SequencingTest9to12 from "./pages/SequencingTest9to12";
import Results from "./pages/Results";
import LearningMode from "./pages/LearningMode";
import TeacherDashboard from "./pages/TeacherDashboard";
import ParentDigest from "./pages/ParentDigest";
import NotFound from "./pages/NotFound";
import SupportResourcesPage from "./pages/SupportResourcesPage";
import ImproveDyslexiaPage from "./pages/ImproveDyslexiaPage";
import AIChatPage from "./pages/AIChatPage";
import { 
  AccessibilityProvider, 
  AccessibilitySettings
} from "./components/AccessibilitySettings";
import { AuthProvider } from "./context/AuthContext";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AccessibilityProvider>
      <AuthProvider>
        <TooltipProvider>

        <Toaster />
        <Sonner />
        <AccessibilitySettings />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/tests" element={<Tests />} />
            <Route path="/reading-test" element={<ReadingTest />} />
            <Route path="/phonological-test" element={<PhonologicalTest />} />
            <Route path="/memory-test" element={<MemoryTest />} />
            <Route path="/sequencing-test" element={<SequencingTest />} />
            <Route path="/spelling-test" element={<SpellingTest />} />
            <Route path="/reading-test-6-9" element={<ReadingTest6to9 />} />
            <Route path="/phonological-test-6-9" element={<PhonologicalTest6to9 />} />
            <Route path="/memory-test-6-9" element={<MemoryTest6to9 />} />
            <Route path="/sequencing-test-6-9" element={<SequencingTest6to9 />} />
            <Route path="/reading-test-9-12" element={<ReadingTest9to12 />} />
            <Route path="/phonological-test-9-12" element={<PhonologicalTest9to12 />} />
            <Route path="/memory-test-9-12" element={<MemoryTest9to12 />} />
            <Route path="/sequencing-test-9-12" element={<SequencingTest9to12 />} />
            <Route path="/results" element={<Results />} />
            <Route path="/learning-mode" element={<LearningMode />} />
            <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
            <Route path="/parent-digest" element={<ParentDigest />} />
            <Route path="/support" element={<SupportResourcesPage />} />
            <Route path="/improve" element={<ImproveDyslexiaPage />} />
            <Route path="/ai-chat" element={<AIChatPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </AccessibilityProvider>
  </QueryClientProvider>
);

export default App;
