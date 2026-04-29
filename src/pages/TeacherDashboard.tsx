import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { 
  Users, Search, ChevronRight, Brain, Clock, Target, 
  Activity, BookOpen, TrendingUp, Download, LayoutDashboard,
  Settings, LogOut, Filter, BarChart3, PieChart as PieChartIcon,
  LineChart as LineChartIcon, Star, Award, Zap, MessageSquare,
  ChevronDown, ArrowUpRight, GraduationCap
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

// --- Mock Data for Analytics ---
const subjectData = [
  { subject: 'Math', score: 85, fullMark: 100 },
  { subject: 'Reading', score: 62, fullMark: 100 },
  { subject: 'Focus', score: 45, fullMark: 100 },
  { subject: 'Memory', score: 78, fullMark: 100 },
  { subject: 'Attention', score: 55, fullMark: 100 },
];

const activityDistribution = [
  { name: 'AI Learning', value: 40, color: '#6366F1' },
  { name: 'Games', value: 25, color: '#8B5CF6' },
  { name: 'Reading', value: 20, color: '#14B8A6' },
  { name: 'Quizzes', value: 15, color: '#F59E0B' },
];

const progressTrend = [
  { day: 'Mon', score: 60 },
  { day: 'Tue', score: 65 },
  { day: 'Wed', score: 62 },
  { day: 'Thu', score: 78 },
  { day: 'Fri', score: 82 },
  { day: 'Sat', score: 80 },
  { day: 'Sun', score: 88 },
];

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const TeacherDashboard = () => {
  const { user, signOut } = useAuth();
  const [teacherProfile, setTeacherProfile] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [letterFilter, setLetterFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchTeacherData();
  }, [user]);

  const fetchTeacherData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // 1. Get Teacher Profile
      const { data: teacher, error: teacherError } = await supabase
        .from('teachers')
        .select('*')
        .eq('id', user.id)
        .single();

      if (teacherError) throw teacherError;
      setTeacherProfile(teacher);

      // 2. Get Students in the same school and class
      const { data: studentsList, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .eq('school_name', teacher.school_name)
        .eq('class_grade', teacher.class_assigned);

      if (studentsError) throw studentsError;
      setStudents(studentsList || []);
    } catch (error: any) {
      toast.error("Failed to load dashboard data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesSearch = s.full_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLetter = letterFilter ? s.full_name.toUpperCase().startsWith(letterFilter) : true;
      return matchesSearch && matchesLetter;
    });
  }, [students, searchTerm, letterFilter]);

  const handleDownloadReport = () => {
    toast.success(`Generating premium report for ${selectedStudent?.full_name}...`);
    // In a real app, use jspdf or a backend service
  };

  if (loading) return <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center"><Loader /></div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex overflow-hidden">
      {/* Sidebar - Student List */}
      <aside className="w-80 bg-white border-r border-[#E2E8F0] flex flex-col h-screen">
        <div className="p-6 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-[#1E293B]">Shikshak 2.0</h1>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#64748B]" />
              <Input 
                placeholder="Search students..." 
                className="pl-9 rounded-xl border-[#E2E8F0] h-10 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-1">
              {alphabet.map(l => (
                <button
                  key={l}
                  onClick={() => setLetterFilter(letterFilter === l ? null : l)}
                  className={`w-6 h-6 text-[10px] font-bold rounded flex items-center justify-center transition-colors ${
                    letterFilter === l ? "bg-indigo-600 text-white" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            <h2 className="px-2 text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">
              Students ({filteredStudents.length})
            </h2>
            {filteredStudents.map(student => (
              <motion.div
                key={student.id}
                whileHover={{ x: 4 }}
                onClick={() => setSelectedStudent(student)}
                className={`p-3 rounded-2xl cursor-pointer transition-all duration-200 border ${
                  selectedStudent?.id === student.id 
                  ? "bg-indigo-50 border-indigo-100 shadow-sm" 
                  : "bg-white border-transparent hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                    selectedStudent?.id === student.id ? "bg-indigo-600 text-white" : "bg-indigo-50 text-indigo-600"
                  }`}>
                    {student.full_name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-[#1E293B] truncate">{student.full_name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-[#64748B]">{student.class_grade}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span className="text-[10px] text-emerald-600 font-bold">88% Progress</span>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-[#64748B] transition-transform ${selectedStudent?.id === student.id ? "rotate-90 text-indigo-600" : ""}`} />
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-[#E2E8F0] bg-slate-50/50">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs">
              {teacherProfile?.full_name?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#1E293B] truncate">{teacherProfile?.full_name}</p>
              <p className="text-[10px] text-[#64748B] truncate">{teacherProfile?.school_name}</p>
            </div>
            <button onClick={() => signOut()} className="text-[#64748B] hover:text-rose-600 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 h-screen overflow-hidden bg-[#F8FAFC]">
        <ScrollArea className="h-full">
          <div className="p-8 space-y-8 max-w-7xl mx-auto">
            {!selectedStudent ? (
              <div className="h-[80vh] flex flex-col items-center justify-center text-center space-y-4">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#E2E8F0]">
                  <LayoutDashboard className="w-12 h-12 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-[#1E293B]">Select a Student</h2>
                <p className="text-[#64748B] max-w-sm">Choose a student from the sidebar to view their neuro-adaptive learning analytics and AI insights.</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedStudent.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {/* Student Overview Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#6366F1] uppercase tracking-wider">
                        <Users className="w-3 h-3" />
                        Student Profile
                      </div>
                      <h1 className="text-3xl font-black text-[#1E293B]">{selectedStudent.full_name}</h1>
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 rounded-md bg-white border border-[#E2E8F0] text-[10px] font-bold text-[#64748B]">
                          {selectedStudent.class_grade}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 text-[10px] font-bold">
                          {selectedStudent.learning_needs?.join(", ") || "No specific needs"}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        onClick={handleDownloadReport}
                        className="rounded-xl border-[#E2E8F0] bg-white h-11 px-6 font-bold text-[#1E293B] hover:bg-slate-50"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </div>

                  {/* Top Stats Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { label: "Performance Score", value: "82/100", icon: Target, color: "text-indigo-600", bg: "bg-indigo-50" },
                      { label: "Weekly Improvement", value: "+12%", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
                      { label: "Attendance Rate", value: "94%", icon: Activity, color: "text-amber-600", bg: "bg-amber-50" },
                      { label: "Consistency Score", value: "High", icon: Zap, color: "text-purple-600", bg: "bg-purple-50" },
                    ].map((stat, i) => (
                      <Card key={i} className="border-none shadow-sm rounded-3xl overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                              <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-[#64748B] uppercase tracking-wide">{stat.label}</p>
                              <p className="text-2xl font-black text-[#1E293B]">{stat.value}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* AI Insight Box */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden"
                  >
                    <div className="absolute right-0 top-0 p-8 opacity-10">
                      <Brain className="w-32 h-32" />
                    </div>
                    <div className="relative z-10 flex items-start gap-4">
                      <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                        <MessageSquare className="w-5 h-5 text-white" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-bold uppercase tracking-wider opacity-80">AI Educator Insight</h3>
                        <p className="text-lg font-medium leading-relaxed">
                          "{selectedStudent.full_name} shows strong reading improvement but low attention consistency. Recommend short focus-based activities and ruler reading practice to minimize cognitive load during complex tasks."
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Main Charts Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Performance Bar Chart */}
                    <Card className="border-none shadow-sm rounded-3xl p-6 bg-white">
                      <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-lg font-bold flex items-center gap-2 text-[#1E293B]">
                          <BarChart3 className="w-5 h-5 text-indigo-600" /> Subject-wise Performance
                        </CardTitle>
                      </CardHeader>
                      <div className="h-64 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={subjectData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                            <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                            <Tooltip 
                              cursor={{fill: '#F8FAFC'}} 
                              contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} 
                            />
                            <Bar dataKey="score" fill="#6366F1" radius={[6, 6, 0, 0]} barSize={40} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>

                    {/* Activity Distribution Pie Chart */}
                    <Card className="border-none shadow-sm rounded-3xl p-6 bg-white">
                      <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-lg font-bold flex items-center gap-2 text-[#1E293B]">
                          <PieChartIcon className="w-5 h-5 text-purple-600" /> Activity Distribution
                        </CardTitle>
                      </CardHeader>
                      <div className="h-64 mt-4 flex items-center">
                        <div className="flex-1 h-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={activityDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {activityDistribution.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="w-48 space-y-3">
                          {activityDistribution.map((item, i) => (
                            <div key={i} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></div>
                                <span className="text-xs font-bold text-[#64748B]">{item.name}</span>
                              </div>
                              <span className="text-xs font-bold text-[#1E293B]">{item.value}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>

                    {/* Weekly Progress Trend Line Chart */}
                    <Card className="border-none shadow-sm rounded-3xl p-6 bg-white lg:col-span-2">
                      <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-lg font-bold flex items-center gap-2 text-[#1E293B]">
                          <LineChartIcon className="w-5 h-5 text-emerald-600" /> Weekly Learning Progress
                        </CardTitle>
                      </CardHeader>
                      <div className="h-64 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={progressTrend}>
                            <defs>
                              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                            <Tooltip 
                              contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} 
                            />
                            <Area type="monotone" dataKey="score" stroke="#14B8A6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>
                  </div>

                  {/* Learning Game & Progress Hub Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
                    <Card className="border-none shadow-sm rounded-3xl p-6 bg-white">
                      <CardHeader className="px-0 pt-0 flex flex-row items-center justify-between">
                        <div>
                          <CardTitle className="text-lg font-bold text-[#1E293B]">Game Analytics</CardTitle>
                          <CardDescription>Start Learning module tracking</CardDescription>
                        </div>
                        <div className="bg-emerald-50 p-2 rounded-xl">
                          <Zap className="w-5 h-5 text-emerald-600" />
                        </div>
                      </CardHeader>
                      <div className="space-y-4 mt-4">
                        {[
                          { label: "Total Game Sessions", value: "24" },
                          { label: "Most Played", value: "Memory Match" },
                          { label: "Attention Score", value: "88/100" },
                          { label: "Cognitive Progress", value: "+18%" },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                            <span className="text-sm font-bold text-[#64748B]">{item.label}</span>
                            <span className="text-sm font-black text-[#1E293B]">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card className="border-none shadow-sm rounded-3xl p-6 bg-white">
                      <CardHeader className="px-0 pt-0 flex flex-row items-center justify-between">
                        <div>
                          <CardTitle className="text-lg font-bold text-[#1E293B]">Progress Hub</CardTitle>
                          <CardDescription>Milestones & Achievements</CardDescription>
                        </div>
                        <div className="bg-indigo-50 p-2 rounded-xl">
                          <Award className="w-5 h-5 text-indigo-600" />
                        </div>
                      </CardHeader>
                      <div className="space-y-4 mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-[#1E293B]">Goal Completion</span>
                          <span className="text-sm font-black text-indigo-600">75%</span>
                        </div>
                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-600 rounded-full" style={{width: '75%'}}></div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          {[1, 2, 3, 4].map(i => (
                            <div key={i} className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 ${i <= 3 ? "bg-amber-50 border-amber-200 text-amber-600" : "bg-slate-50 border-slate-100 text-slate-300"}`}>
                              <Star className={`w-5 h-5 ${i <= 3 ? "fill-current" : ""}`} />
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-[#64748B] font-medium pt-2">
                          Current Level: <span className="text-[#1E293B] font-bold">Explorer II</span> • Streak: <span className="text-emerald-600 font-bold">5 Days</span>
                        </p>
                      </div>
                    </Card>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
};

const Loader = () => (
  <div className="flex flex-col items-center gap-4">
    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
    <p className="text-sm font-bold text-[#64748B] animate-pulse uppercase tracking-widest">Loading Dashboard...</p>
  </div>
);

import { Loader2 } from "lucide-react";

export default TeacherDashboard;
