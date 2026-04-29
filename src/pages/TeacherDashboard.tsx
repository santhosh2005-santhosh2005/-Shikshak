import { useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Search, 
  ChevronRight, 
  Brain, 
  Clock, 
  Target, 
  AlertTriangle,
  Lightbulb,
  ArrowLeft,
  Activity,
  BookOpen,
  TrendingUp,
  HelpCircle
} from "lucide-react";
import { generateTeacherInsight, generateInsights, InsightData } from "@/lib/insightGenerator";

// Mock Data
const students = [
  {
    id: 1,
    name: "Alex Johnson",
    learningType: "dyslexia" as const,
    riskLevel: "High" as const,
    accuracy: 62,
    avgTime: 12.5,
    timeScore: 45,
    weakAreas: [
      { area: "Reading Speed", level: "Low" },
      { area: "Phonological Awareness", level: "Weak" },
      { area: "Word Recognition", level: "Low" }
    ],
    behaviorInsight: "Child struggles due to slow decoding speed and frequently confuses similar-looking letters (b/d). Reading fatigue sets in quickly.",
    attentionSpan: 45,
    riskFactors: [
      "Slow phonological decoding speed",
      "Letter reversal patterns (b/d confusion)",
      "Reading fatigue after short durations"
    ],
    recommendations: [
      "Use OpenDyslexic font for all materials",
      "Provide audio support/text-to-speech for longer passages",
      "Break down reading tasks into 10-minute intervals"
    ]
  },
  {
    id: 2,
    name: "Sam Smith",
    learningType: "adhd" as const,
    riskLevel: "Moderate" as const,
    accuracy: 78,
    avgTime: 3.2,
    timeScore: 85,
    weakAreas: [
      { area: "Focus Duration", level: "Low" },
      { area: "Impulse Control", level: "Moderate" },
      { area: "Attention to Detail", level: "Low" }
    ],
    behaviorInsight: "Attention drops after short duration. Fast completion speed suggests impulsive answering rather than lack of understanding.",
    attentionSpan: 30,
    riskFactors: [
      "Attention variability",
      "Impulsive responding patterns",
      "Difficulty with sustained focus"
    ],
    recommendations: [
      "Use shorter lessons with frequent rewards",
      "Incorporate movement-based learning",
      "Use visual timers to help with time management"
    ]
  },
  {
    id: 3,
    name: "Maya Patel",
    learningType: "autism" as const,
    riskLevel: "Low" as const,
    accuracy: 92,
    avgTime: 8.4,
    timeScore: 78,
    weakAreas: [
      { area: "Social Inference", level: "Moderate" },
      { area: "Contextual Flexibility", level: "Low" },
      { area: "Transitioning", level: "Moderate" }
    ],
    behaviorInsight: "Highly accurate in structured tasks but struggles when rules change unexpectedly. Prefers predictable, step-by-step instructions.",
    attentionSpan: 85,
    riskFactors: [
      "Difficulty with unexpected changes",
      "Challenges with social context",
      "Needs explicit instructions"
    ],
    recommendations: [
      "Provide clear, step-by-step structured tasks",
      "Maintain a consistent layout and routine",
      "Use visual schedules for transitions"
    ]
  }
];

const TeacherDashboard = () => {
  const [selectedStudent, setSelectedStudent] = useState<typeof students[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generate intelligent insights for selected student
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

  const getRiskBadge = (level: string) => {
    switch (level) {
      case "High": return <Badge variant="destructive" className="bg-red-500 hover:bg-red-600 uppercase">{level}</Badge>;
      case "Moderate": return <Badge variant="outline" className="border-amber-500 text-amber-600 uppercase font-bold">{level}</Badge>;
      default: return <Badge variant="outline" className="border-green-500 text-green-600 uppercase font-bold">{level}</Badge>;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "adhd": return "text-amber-600 bg-amber-50 border-amber-100";
      case "autism": return "text-blue-600 bg-blue-50 border-blue-100";
      default: return "text-primary bg-primary/5 border-primary/10";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="container mx-auto pt-32 pb-20 px-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" /> Teacher Analytics
            </h1>
            <p className="text-slate-500 mt-1">Monitor student progress and gain behavioral insights</p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search students..." 
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Student List */}
          <div className={`${selectedStudent ? "lg:col-span-4" : "lg:col-span-12"} space-y-4`}>
            {filteredStudents.map((student) => (
              <motion.div
                key={student.id}
                layout
                onClick={() => setSelectedStudent(student)}
              >
                <Card className={`cursor-pointer transition-all hover:shadow-md border-2 ${
                  selectedStudent?.id === student.id ? "border-primary bg-primary/5" : "border-transparent"
                }`}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg ${getTypeColor(student.learningType)}`}>
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{student.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-[10px] uppercase">{student.learningType}</Badge>
                          {getRiskBadge(student.riskLevel)}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`h-5 w-5 text-slate-300 transition-transform ${selectedStudent?.id === student.id ? "rotate-90 text-primary" : ""}`} />
                  </CardContent>
                </Card>
              </motion.div>
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
                className="lg:col-span-8"
              >
                <div className="space-y-6">
                  {/* Top Profile Card */}
                  <Card className="border-2 border-slate-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50">
                      <div>
                        <Button variant="ghost" size="sm" className="mb-2 -ml-2 text-slate-500 md:hidden" onClick={() => setSelectedStudent(null)}>
                          <ArrowLeft className="h-4 w-4 mr-1" /> Back to list
                        </Button>
                        <CardTitle className="text-2xl font-bold">{selectedStudent.name}</CardTitle>
                        <CardDescription>Learning Profile Analysis</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Status</div>
                        {getRiskBadge(selectedStudent.riskLevel)}
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-4 rounded-2xl bg-slate-50 border flex flex-col items-center text-center">
                          <Target className="h-6 w-6 text-primary mb-2" />
                          <div className="text-2xl font-bold">{selectedStudent.accuracy}%</div>
                          <div className="text-xs text-slate-500 uppercase font-bold">Accuracy</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 border flex flex-col items-center text-center">
                          <Clock className="h-6 w-6 text-blue-500 mb-2" />
                          <div className="text-2xl font-bold">{selectedStudent.avgTime}s</div>
                          <div className="text-xs text-slate-500 uppercase font-bold">Avg Response</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 border flex flex-col items-center text-center">
                          <Activity className="h-6 w-6 text-purple-500 mb-2" />
                          <div className="text-2xl font-bold uppercase text-sm">{selectedStudent.learningType}</div>
                          <div className="text-xs text-slate-500 uppercase font-bold">Core Profile</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Weak Areas & Attention */}
                    <div className="space-y-6">
                      <Card className="h-full">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Brain className="h-5 w-5 text-red-500" /> Weak Areas
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {selectedStudent.weakAreas.map((wa, i) => (
                            <div key={i} className="flex justify-between items-center">
                              <span className="text-slate-700">{wa.area}</span>
                              <Badge variant={wa.level === "Weak" || wa.level === "Low" ? "destructive" : "outline"} className="text-[10px]">
                                {wa.level}
                              </Badge>
                            </div>
                          ))}
                          <div className="pt-4 border-t">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-slate-700">Estimated Attention Span</span>
                              <span className="text-sm font-bold text-primary">{selectedStudent.attentionSpan}%</span>
                            </div>
                            <Progress value={selectedStudent.attentionSpan} className="h-2" />
                            <p className="text-[10px] text-slate-400 mt-2 italic">Based on engagement duration and task consistency</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Behavioral Insight & Intelligent Analysis */}
                    <div className="space-y-6">
                      {/* Why This Is Happening */}
                      <Card className="h-full border-2 border-blue-100 bg-blue-50/50">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <HelpCircle className="h-5 w-5 text-blue-600" /> Why This Is Happening
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="p-4 bg-white rounded-xl border border-blue-100">
                            <p className="text-slate-700 leading-relaxed">
                              {studentInsights?.whyExplanation || selectedStudent.behaviorInsight}
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                              <div className="text-xs font-bold text-green-700 uppercase mb-1">Strength</div>
                              <p className="text-sm text-green-800">{studentInsights?.studentStrength || "Persistent effort"}</p>
                            </div>
                            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                              <div className="text-xs font-bold text-amber-700 uppercase mb-1">Challenge</div>
                              <p className="text-sm text-amber-800">{studentInsights?.mainChallenge || "Skill development"}</p>
                            </div>
                          </div>

                          {studentInsights?.confidence && (
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <TrendingUp className="h-3 w-3" />
                              Insight confidence: {studentInsights.confidence}%
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Recommended Actions */}
                      <Card className="border-2 border-primary/20 bg-primary/5">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Lightbulb className="h-5 w-5 text-primary" /> Recommended Actions
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="p-3 bg-white rounded-lg border border-primary/10">
                            <div className="text-xs font-bold text-primary uppercase mb-2">Teaching Approach</div>
                            <p className="text-sm text-slate-700">{studentInsights?.teachingApproach || "Use adaptive methods"}</p>
                          </div>

                          <div className="p-3 bg-white rounded-lg border border-primary/10">
                            <div className="text-xs font-bold text-primary uppercase mb-2">Learning Style</div>
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium text-slate-700">{studentInsights?.learningStyle || "Individualized"}</span>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-xs font-bold text-primary uppercase mb-3 flex items-center gap-1">
                              <Lightbulb className="h-3 w-3" /> Actionable Strategies
                            </h4>
                            <ul className="space-y-2">
                              {(studentInsights?.recommendedActions || selectedStudent.recommendations).map((rec, i) => (
                                <li key={i} className="text-sm text-slate-600 flex gap-2">
                                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {studentInsights?.generalObservations && studentInsights.generalObservations.length > 0 && (
                            <div className="pt-4 border-t border-primary/10">
                              <h4 className="text-xs font-bold text-slate-600 uppercase mb-2">General Observations</h4>
                              <ul className="space-y-1">
                                {studentInsights.generalObservations.map((obs, i) => (
                                  <li key={i} className="text-xs text-slate-500 flex gap-2">
                                    <div className="h-1 w-1 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                                    {obs}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
