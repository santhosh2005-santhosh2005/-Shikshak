import { useState, useMemo, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { useAccessibility } from "@/components/AccessibilitySettings";
import { getStyles, neoColors } from "@/lib/design-system";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Users, Search, ChevronRight, Brain, Clock, Target, 
  AlertTriangle, Lightbulb, ArrowLeft, Activity, 
  BookOpen, TrendingUp, HelpCircle 
} from "lucide-react";
import { generateTeacherInsight, InsightData } from "@/lib/insightGenerator";

// Mock Data
const students = [
  { id: 1, name: "Alex Johnson", learningType: "dyslexia" as const, riskLevel: "High" as const, accuracy: 62, avgTime: 12.5, timeScore: 45, weakAreas: [{ area: "Reading Speed", level: "Low" }, { area: "Phonological Awareness", level: "Weak" }], behaviorInsight: "Child struggles due to slow decoding speed.", attentionSpan: 45, riskFactors: ["Slow decoding", "Letter reversal"], recommendations: ["OpenDyslexic font", "Audio support"] },
  { id: 2, name: "Sam Smith", learningType: "adhd" as const, riskLevel: "Moderate" as const, accuracy: 78, avgTime: 3.2, timeScore: 85, weakAreas: [{ area: "Focus Duration", level: "Low" }], behaviorInsight: "Attention drops after short duration.", attentionSpan: 30, riskFactors: ["Attention variability"], recommendations: ["Shorter lessons"] },
  { id: 3, name: "Maya Patel", learningType: "autism" as const, riskLevel: "Low" as const, accuracy: 92, avgTime: 8.4, timeScore: 78, weakAreas: [{ area: "Social Inference", level: "Moderate" }], behaviorInsight: "Highly accurate in structured tasks.", attentionSpan: 85, riskFactors: ["Difficulty with changes"], recommendations: ["Structured tasks"] }
];

const TeacherDashboard = () => {
  const [selectedStudent, setSelectedStudent] = useState<typeof students[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { settings } = useAccessibility();
  const isNeo = settings.uiTheme === "neo";
  const s = getStyles(settings.uiTheme);

  const filteredStudents = students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const studentInsights = selectedStudent ? useMemo(() => {
    const insightData: InsightData = {
      accuracy: selectedStudent.accuracy,
      averageTime: selectedStudent.avgTime,
      timeScore: selectedStudent.timeScore,
      riskLevel: selectedStudent.riskLevel,
      riskFactors: selectedStudent.riskFactors,
      learningType: selectedStudent.learningType,
      attentionSpan: selectedStudent.attentionSpan,
      weakAreas: selectedStudent.weakAreas
    };
    return generateTeacherInsight(insightData);
  }, [selectedStudent]) : null;

  return (
    <ScrollArea className="h-screen" style={!isNeo ? { backgroundColor: 'var(--app-bg)' } : { backgroundColor: '#ffffff' }}>
      <div className={`min-h-screen ${isNeo ? "font-bold bg-grid" : "font-sans"} text-black`}>
        <Navbar />
        
        <div className="container mx-auto pt-32 pb-20 px-4">
          <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className={s.tag}>ANALYTICS</span>
              <h1 className={`${s.sectionTitle} mt-4`}>TEACHER DASHBOARD.</h1>
              <p className={s.textMuted}>Monitor student progress and gain behavioral insights.</p>
            </div>

            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black" />
              <input 
                type="text" 
                placeholder="SEARCH STUDENTS..." 
                className={s.input}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-10">
            {/* Student List */}
            <div className={`${selectedStudent ? "lg:col-span-4" : "lg:col-span-12"} space-y-4`}>
              {filteredStudents.map((student, i) => (
                <div
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className={`bg-white rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md cursor-pointer flex items-center justify-between p-5 ${selectedStudent?.id === student.id ? "ring-2 ring-blue-500 bg-blue-50/50" : ""}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{student.name}</h3>
                      <div className="flex gap-2 mt-1">
                         <span className="text-xs font-medium text-gray-500 capitalize">{student.learningType}</span>
                         <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${student.riskLevel === 'High' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{student.riskLevel} Risk</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${selectedStudent?.id === student.id ? "rotate-90 text-blue-500" : ""}`} />
                </div>
              ))}
            </div>

            {/* Student Detail View */}
            <AnimatePresence mode="wait">
              {selectedStudent && (
                <motion.div 
                  key={selectedStudent.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="lg:col-span-8 space-y-8"
                >
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                    <div className="flex flex-col md:flex-row justify-between gap-6 mb-10 pb-6 border-b border-gray-100">
                       <div>
                          <h2 className="text-3xl font-bold text-gray-900">{selectedStudent.name}</h2>
                          <p className="text-gray-500 font-medium mt-1">Learning Profile Analysis</p>
                       </div>
                       <div className="text-left md:text-right">
                          <div className="text-sm font-medium text-gray-500 mb-1">Risk Status</div>
                          <div className={`inline-block px-4 py-1.5 rounded-full font-medium ${selectedStudent.riskLevel === 'High' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                             {selectedStudent.riskLevel} Risk
                          </div>
                       </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                      <div className="p-6 rounded-2xl bg-blue-50/50 flex flex-col items-center">
                        <Target className="h-6 w-6 mb-3 text-blue-500" />
                        <div className="text-3xl font-bold text-gray-900">{selectedStudent.accuracy}%</div>
                        <div className="text-sm font-medium text-gray-500 mt-1">Accuracy</div>
                      </div>
                      <div className="p-6 rounded-2xl bg-purple-50/50 flex flex-col items-center">
                        <Clock className="h-6 w-6 mb-3 text-purple-500" />
                        <div className="text-3xl font-bold text-gray-900">{selectedStudent.avgTime}s</div>
                        <div className="text-sm font-medium text-gray-500 mt-1">Avg Response</div>
                      </div>
                      <div className="p-6 rounded-2xl bg-emerald-50/50 flex flex-col items-center">
                        <Activity className="h-6 w-6 mb-3 text-emerald-500" />
                        <div className="text-xl font-bold text-gray-900 capitalize">{selectedStudent.learningType}</div>
                        <div className="text-sm font-medium text-gray-500 mt-1">Profile Focus</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Brain className="h-5 w-5 text-gray-400" /> Weak Areas
                      </h3>
                      <div className="space-y-3 mb-8">
                        {selectedStudent.weakAreas.map((wa, i) => (
                          <div key={i} className="flex justify-between items-center bg-gray-50 rounded-xl p-4">
                            <span className="font-medium text-gray-700">{wa.area}</span>
                            <span className="font-medium text-sm text-amber-600 bg-amber-100 px-3 py-1 rounded-full">{wa.level}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-6 border-t border-gray-100">
                        <div className="flex justify-between text-sm font-medium text-gray-600 mb-3">
                          <span>Attention Span</span>
                          <span>{selectedStudent.attentionSpan}%</span>
                        </div>
                        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${selectedStudent.attentionSpan}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                       <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-gray-400" /> Why this is happening
                      </h3>
                      <div className="bg-blue-50/50 rounded-xl p-5 mb-6 text-gray-700 leading-relaxed">
                         <p>{studentInsights?.whyExplanation || selectedStudent.behaviorInsight}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-emerald-50 rounded-xl p-4">
                          <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">Strength</div>
                          <div className="text-gray-900 font-medium">{studentInsights?.studentStrength || "Persistent"}</div>
                        </div>
                        <div className="bg-rose-50 rounded-xl p-4">
                          <div className="text-xs font-semibold text-rose-600 uppercase tracking-wider mb-1">Challenge</div>
                          <div className="text-gray-900 font-medium">{studentInsights?.mainChallenge || "Speed"}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-gray-400" /> Suggested Actions
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-gray-50 rounded-xl p-5">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Approach</div>
                        <p className="font-medium text-gray-900">{studentInsights?.teachingApproach || "Adaptive methods"}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-5">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Learning Style</div>
                        <p className="font-medium text-gray-900 capitalize">{studentInsights?.learningStyle || "Individualized"}</p>
                      </div>
                    </div>
                    <ul className="space-y-3">
                      {(studentInsights?.recommendedActions || selectedStudent.recommendations).map((rec, i) => (
                        <li key={i} className="flex gap-3 items-center bg-gray-50 rounded-xl p-4 font-medium text-gray-700">
                          <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default TeacherDashboard;
