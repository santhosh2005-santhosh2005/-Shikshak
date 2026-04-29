
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
import RoleSelection from "./pages/auth/RoleSelection";
import StudentSignup from "./pages/auth/StudentSignup";
import StudentLogin from "./pages/auth/StudentLogin";
import TeacherAuth from "./pages/auth/TeacherAuth";
import ForgotPassword from "./pages/auth/ForgotPassword";
import { 
  AccessibilityProvider, 
  AccessibilitySettings
} from "./components/AccessibilitySettings";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role?: 'student' | 'teacher' }) => {
  const { user, session } = useAuth();
  if (!session && !user) {
    return <Navigate to="/auth/role-selection" replace />;
  }
  return <>{children}</>;
};

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
            
            {/* Auth Routes */}
            <Route path="/auth/role-selection" element={<RoleSelection />} />
            <Route path="/auth/signup" element={<StudentSignup />} />
            <Route path="/auth/login" element={<StudentLogin />} />
            <Route path="/auth/teacher-login" element={<TeacherAuth />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />

            {/* Protected Student Routes */}
            <Route path="/tests" element={<ProtectedRoute role="student"><Tests /></ProtectedRoute>} />
            <Route path="/reading-test" element={<ProtectedRoute role="student"><ReadingTest /></ProtectedRoute>} />
            <Route path="/phonological-test" element={<ProtectedRoute role="student"><PhonologicalTest /></ProtectedRoute>} />
            <Route path="/memory-test" element={<ProtectedRoute role="student"><MemoryTest /></ProtectedRoute>} />
            <Route path="/sequencing-test" element={<ProtectedRoute role="student"><SequencingTest /></ProtectedRoute>} />
            <Route path="/spelling-test" element={<ProtectedRoute role="student"><SpellingTest /></ProtectedRoute>} />
            <Route path="/reading-test-6-9" element={<ProtectedRoute role="student"><ReadingTest6to9 /></ProtectedRoute>} />
            <Route path="/phonological-test-6-9" element={<ProtectedRoute role="student"><PhonologicalTest6to9 /></ProtectedRoute>} />
            <Route path="/memory-test-6-9" element={<ProtectedRoute role="student"><MemoryTest6to9 /></ProtectedRoute>} />
            <Route path="/sequencing-test-6-9" element={<ProtectedRoute role="student"><SequencingTest6to9 /></ProtectedRoute>} />
            <Route path="/reading-test-9-12" element={<ProtectedRoute role="student"><ReadingTest9to12 /></ProtectedRoute>} />
            <Route path="/phonological-test-9-12" element={<ProtectedRoute role="student"><PhonologicalTest9to12 /></ProtectedRoute>} />
            <Route path="/memory-test-9-12" element={<ProtectedRoute role="student"><MemoryTest9to12 /></ProtectedRoute>} />
            <Route path="/sequencing-test-9-12" element={<ProtectedRoute role="student"><SequencingTest9to12 /></ProtectedRoute>} />
            <Route path="/results" element={<ProtectedRoute role="student"><Results /></ProtectedRoute>} />
            <Route path="/learning-mode" element={<ProtectedRoute role="student"><LearningMode /></ProtectedRoute>} />
            <Route path="/support" element={<ProtectedRoute role="student"><SupportResourcesPage /></ProtectedRoute>} />
            <Route path="/improve" element={<ProtectedRoute role="student"><ImproveDyslexiaPage /></ProtectedRoute>} />
            <Route path="/ai-chat" element={<ProtectedRoute role="student"><AIChatPage /></ProtectedRoute>} />

            {/* Protected Teacher Routes */}
            <Route path="/teacher-dashboard" element={<ProtectedRoute role="teacher"><TeacherDashboard /></ProtectedRoute>} />
            
            <Route path="/parent-digest" element={<ParentDigest />} />
            
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
