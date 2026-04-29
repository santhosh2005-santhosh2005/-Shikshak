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
                  className={`${s.card} ${isNeo ? (selectedStudent?.id === student.id ? "bg-[#86EFAC]" : "bg-white") : (selectedStudent?.id === student.id ? "border-black bg-gray-100" : "bg-white")} cursor-pointer flex items-center justify-between p-4`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 border-4 border-black flex items-center justify-center font-black ${isNeo ? "bg-white" : "bg-gray-200"}`}>
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-black text-lg">{student.name}</h3>
                      <div className="flex gap-2 mt-1">
                         <span className="text-[10px] font-black uppercase bg-black text-white px-1">{student.learningType}</span>
                         <span className={`text-[10px] font-black uppercase px-1 border-2 border-black ${student.riskLevel === 'High' ? 'bg-red-500' : 'bg-green-500'}`}>{student.riskLevel}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={`h-6 w-6 transition-transform ${selectedStudent?.id === student.id ? "rotate-90" : ""}`} />
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
                  <div className={`${s.card} ${isNeo ? "bg-[#FDA4AF]" : "bg-white"} p-8`}>
                    <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                       <div>
                          <h2 className="text-4xl font-black uppercase tracking-tighter">{selectedStudent.name}</h2>
                          <p className="font-bold opacity-70">LEARNING PROFILE ANALYSIS</p>
                       </div>
                       <div className="text-right">
                          <div className="text-xs font-black uppercase mb-1">Risk Status</div>
                          <div className={`inline-block px-4 py-1 border-4 border-black font-black uppercase ${selectedStudent.riskLevel === 'High' ? 'bg-red-500 text-white' : 'bg-green-500'}`}>
                             {selectedStudent.riskLevel}
                          </div>
                       </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div className={`p-6 border-4 border-black bg-white flex flex-col items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                        <Target className="h-8 w-8 mb-2" />
                        <div className="text-3xl font-black">{selectedStudent.accuracy}%</div>
                        <div className="text-xs font-black uppercase">Accuracy</div>
                      </div>
                      <div className={`p-6 border-4 border-black bg-white flex flex-col items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                        <Clock className="h-8 w-8 mb-2 text-blue-500" />
                        <div className="text-3xl font-black">{selectedStudent.avgTime}s</div>
                        <div className="text-xs font-black uppercase">Avg Response</div>
                      </div>
                      <div className={`p-6 border-4 border-black bg-white flex flex-col items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                        <Activity className="h-8 w-8 mb-2 text-purple-500" />
                        <div className="text-xl font-black uppercase">{selectedStudent.learningType}</div>
                        <div className="text-xs font-black uppercase">Profile</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className={`${s.card} ${isNeo ? "bg-[#86EFAC]" : "bg-white"}`}>
                      <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-2">
                        <Brain className="h-6 w-6" /> WEAK AREAS
                      </h3>
                      <div className="space-y-4 mb-8">
                        {selectedStudent.weakAreas.map((wa, i) => (
                          <div key={i} className="flex justify-between items-center bg-white border-4 border-black p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            <span className="font-bold">{wa.area}</span>
                            <span className="font-black uppercase text-xs px-2 bg-black text-white">{wa.level}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-6 border-t-4 border-black">
                        <div className="flex justify-between font-black uppercase mb-2">
                          <span>ATTENTION SPAN</span>
                          <span>{selectedStudent.attentionSpan}%</span>
                        </div>
                        <div className="h-6 w-full border-4 border-black bg-white">
                           <div className="h-full bg-black transition-all" style={{ width: `${selectedStudent.attentionSpan}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className={`${s.card} ${isNeo ? "bg-[#D8B4FE]" : "bg-white"}`}>
                       <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-2">
                        <HelpCircle className="h-6 w-6" /> WHY IT HAPPENS
                      </h3>
                      <div className="bg-white border-4 border-black p-4 mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                         <p className="font-bold text-sm leading-tight">{studentInsights?.whyExplanation || selectedStudent.behaviorInsight}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#86EFAC] border-4 border-black p-2 font-black uppercase text-[10px]">Strength: {studentInsights?.studentStrength || "Persistent"}</div>
                        <div className="bg-[#FDA4AF] border-4 border-black p-2 font-black uppercase text-[10px]">Challenge: {studentInsights?.mainChallenge || "Speed"}</div>
                      </div>
                    </div>
                  </div>

                  <div className={`${s.card} ${isNeo ? "bg-[#FEF08A]" : "bg-white"}`}>
                    <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-2">
                      <Lightbulb className="h-6 w-6" /> RECOMMENDED ACTIONS
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <div className="text-[10px] font-black uppercase mb-2">Approach</div>
                        <p className="text-sm font-bold">{studentInsights?.teachingApproach || "Adaptive methods"}</p>
                      </div>
                      <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <div className="text-[10px] font-black uppercase mb-2">Learning Style</div>
                        <p className="text-sm font-bold uppercase">{studentInsights?.learningStyle || "Individualized"}</p>
                      </div>
                    </div>
                    <ul className="space-y-3">
                      {(studentInsights?.recommendedActions || selectedStudent.recommendations).map((rec, i) => (
                        <li key={i} className="flex gap-4 items-center bg-white border-4 border-black p-3 font-black text-sm uppercase">
                          <div className="h-4 w-4 bg-black flex-shrink-0" />
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
