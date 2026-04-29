import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { 
  Heart, Brain, Clock, Target, Activity, BookOpen, 
  TrendingUp, Download, Settings, LogOut, Award, Zap, 
  MessageSquare, Star, User, GraduationCap, School,
  Calendar, CheckCircle2, ChevronRight, ArrowUpRight
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// --- Simplified Parent Analytics Mock Data ---
const subjectData = [
  { subject: 'Reading', score: 72 },
  { subject: 'Spelling', score: 58 },
  { subject: 'Memory', score: 84 },
  { subject: 'Focus', score: 45 },
  { subject: 'Language', score: 90 },
];

const activityData = [
  { name: 'Games', value: 45, color: '#14B8A6' },
  { name: 'Lessons', value: 30, color: '#6366F1' },
  { name: 'Reading', value: 25, color: '#8B5CF6' },
];

const trendData = [
  { week: 'W1', score: 65 },
  { week: 'W2', score: 68 },
  { week: 'W3', score: 75 },
  { week: 'W4', score: 82 },
];

const ParentDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [parentProfile, setParentProfile] = useState<any>(null);
  const [childData, setChildData] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    // --- Handle Demo Mode Bypass ---
    const isDemoMode = localStorage.getItem("shikshak_demo_mode") === "true";
    if (isDemoMode) {
      const demoParent = JSON.parse(localStorage.getItem("shikshak_demo_parent") || "{}");
      setParentProfile(demoParent);
      setChildData({
        full_name: demoParent.student_name || "Alex Student",
        class_grade: demoParent.student_class || "Class 10",
        school_name: demoParent.school_name || "Shikshak Academy",
        learning_needs: ["Dyslexia", "Focus Support"],
        performance_score: 82,
        weekly_improvement: 12,
        attendance: 94,
        consistency: "High",
        last_active: "2 hours ago"
      });
      setLoading(false);
      return;
    }

    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // 1. Get Parent Profile
      const { data: parent, error: pError } = await supabase
        .from('parents')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (pError) throw pError;
      setParentProfile(parent);

      // 2. Get Child Data (Simplified mock for now, but linked by name/class)
      setChildData({
        full_name: parent.student_name,
        class_grade: parent.student_class,
        school_name: parent.school_name,
        learning_needs: ["Dyslexia", "Focus Support"],
        performance_score: 82,
        weekly_improvement: 12,
        attendance: 94,
        consistency: "High",
        last_active: "2 hours ago"
      });

    } catch (error: any) {
      console.error(error);
      // Fallback for demo/missing profile
      setParentProfile({ full_name: "Parent User", student_name: "Child Student" });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      localStorage.removeItem("shikshak_demo_mode");
      localStorage.removeItem("shikshak_demo_parent");
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      navigate("/auth/role-selection", { replace: true });
    }
  };

  if (loading) return <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center"><Loader /></div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex overflow-hidden">
      {/* Sidebar - Child Summary */}
      <aside className="w-80 bg-white border-r border-[#E2E8F0] flex flex-col h-screen">
        <div className="p-6 border-b border-[#E2E8F0] bg-gradient-to-b from-teal-50/50 to-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-[#14B8A6] p-2 rounded-xl shadow-teal-200 shadow-lg">
              <Heart className="w-6 h-6 text-white fill-current" />
            </div>
            <h1 className="text-xl font-bold text-[#1E293B]">Parent Portal</h1>
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 rounded-3xl bg-teal-100 text-teal-600 flex items-center justify-center font-black text-2xl mx-auto mb-3 border-4 border-white shadow-sm">
                {childData?.full_name.charAt(0)}
              </div>
              <h2 className="text-lg font-black text-[#1E293B]">{childData?.full_name}</h2>
              <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest">{childData?.class_grade}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#64748B]">Last Active</span>
                <span className="text-emerald-600 font-black">{childData?.last_active}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#64748B]">Attendance</span>
                <span className="text-[#1E293B] font-black">{childData?.attendance}%</span>
              </div>
            </div>

            <Button className="w-full rounded-xl bg-[#14B8A6] hover:bg-[#0D9488] text-white font-bold h-11 shadow-md transition-all active:scale-95">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-[10px] font-black text-[#64748B] uppercase tracking-[0.2em] mb-4">Teacher's Latest Note</h3>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-sm italic text-indigo-900 leading-relaxed">
                "Alex is showing wonderful enthusiasm in reading games. Consistency in focus exercises at home will help reinforce these gains."
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-black text-[#64748B] uppercase tracking-[0.2em] mb-4">Quick Summary</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                This week your child improved by <span className="text-emerald-600 font-bold">12% in reading</span> and completed <span className="text-indigo-600 font-bold">5 learning activities</span>.
              </p>
            </div>
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-[#E2E8F0] bg-slate-50/50">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-xs">
              {parentProfile?.full_name?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#1E293B] truncate">{parentProfile?.full_name}</p>
              <p className="text-[10px] text-[#64748B] truncate">{parentProfile?.relationship}</p>
            </div>
            <button onClick={handleSignOut} className="text-[#64748B] hover:text-rose-600 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Analytics Panel */}
      <main className="flex-1 h-screen overflow-hidden bg-[#F8FAFC]">
        <ScrollArea className="h-full">
          <div className="p-8 space-y-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-black text-[#1E293B]">Learning Journey</h1>
                <p className="text-[#64748B] font-medium">Tracking {childData?.full_name}'s neuro-adaptive growth.</p>
              </div>
              <div className="flex gap-2">
                <div className="bg-white px-4 py-2 rounded-xl border border-[#E2E8F0] shadow-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  <span className="text-xs font-bold text-[#1E293B]">April 2026</span>
                </div>
              </div>
            </div>

            {/* Performance Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Overall Score", value: "82", sub: "/ 100", icon: Target, color: "text-teal-600", bg: "bg-teal-50" },
                { label: "Reading Growth", value: "+12%", sub: "this week", icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50" },
                { label: "Focus Streak", value: "5", sub: "days", icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
              ].map((stat, i) => (
                <Card key={i} className="border-none shadow-sm rounded-3xl overflow-hidden">
                  <CardContent className="p-6 flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                      <stat.icon className={`w-7 h-7 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-[#64748B] uppercase tracking-widest">{stat.label}</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-[#1E293B]">{stat.value}</span>
                        <span className="text-xs font-bold text-[#64748B]">{stat.sub}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* AI Parent Insight */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 border-2 border-teal-100 shadow-sm relative overflow-hidden"
            >
              <div className="flex items-start gap-4">
                <div className="bg-teal-500 p-3 rounded-2xl shadow-lg shadow-teal-100">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-black text-teal-600 uppercase tracking-widest">AI Parent Guide</h3>
                  <p className="text-lg font-bold text-[#1E293B] leading-relaxed">
                    "{childData?.full_name} is improving well in reading but needs more focus support. Encourage 15 minutes of ruler reading practice daily."
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Subject Bar Chart */}
              <Card className="border-none shadow-sm rounded-3xl p-8 bg-white">
                <CardTitle className="text-sm font-black text-[#1E293B] uppercase tracking-widest mb-8 flex items-center gap-2">
                  <BarChart className="w-4 h-4 text-teal-600" /> Skill Proficiency
                </CardTitle>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={subjectData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 10, fontWeight: 'bold'}} dy={10} />
                      <YAxis hide />
                      <Tooltip cursor={{fill: '#F8FAFC'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                      <Bar dataKey="score" fill="#14B8A6" radius={[4, 4, 0, 0]} barSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Weekly Trend Area Chart */}
              <Card className="border-none shadow-sm rounded-3xl p-8 bg-white">
                <CardTitle className="text-sm font-black text-[#1E293B] uppercase tracking-widest mb-8 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600" /> Weekly Progress
                </CardTitle>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366F1" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 10, fontWeight: 'bold'}} dy={10} />
                      <YAxis hide />
                      <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                      <Area type="monotone" dataKey="score" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorTrend)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* Support & Tips Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
              <Card className="border-none shadow-sm rounded-3xl p-8 bg-white">
                <CardTitle className="text-sm font-black text-[#1E293B] uppercase tracking-widest mb-6 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-600" /> Home Support Tips
                </CardTitle>
                <div className="space-y-4">
                  {[
                    "Use high-contrast reading strips",
                    "Maintain a consistent 20min study routine",
                    "Celebrate small wins to boost confidence",
                    "Encourage audio-visual learning tools"
                  ].map((tip, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50 border border-amber-100 text-sm font-bold text-amber-900">
                      <CheckCircle2 className="w-4 h-4 text-amber-600" />
                      {tip}
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="border-none shadow-sm rounded-3xl p-8 bg-white">
                <CardTitle className="text-sm font-black text-[#1E293B] uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-600" /> Recent Achievements
                </CardTitle>
                <div className="flex gap-4 mb-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-14 h-14 rounded-2xl bg-purple-50 border-2 border-purple-100 flex items-center justify-center text-purple-600 shadow-sm">
                      <Star className="w-7 h-7 fill-current" />
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-[#1E293B]">Monthly Goal Progress</span>
                    <span className="text-xs font-black text-indigo-600">75%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{width: '75%'}}></div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </ScrollArea>
      </main>
    </div>
  );
};

const Loader = () => (
  <div className="flex flex-col items-center gap-4">
    <Loader2 className="w-10 h-10 text-[#14B8A6] animate-spin" />
    <p className="text-sm font-bold text-[#64748B] animate-pulse uppercase tracking-[0.2em]">Loading Child's Progress...</p>
  </div>
);

export default ParentDashboard;
