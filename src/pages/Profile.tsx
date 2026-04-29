import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  User, Mail, School, BookOpen, GraduationCap, 
  ShieldCheck, Calendar, Languages, Brain, Loader2, Camera,
  LogOut, Settings, Bell, Heart
} from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [role, setRole] = useState<'student' | 'teacher' | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    const isDemoMode = localStorage.getItem("shikshak_demo_mode") === "true";
    setIsDemo(isDemoMode);

    if (isDemoMode) {
      const demoTeacher = JSON.parse(localStorage.getItem("shikshak_demo_teacher") || "{}");
      setProfile({
        ...demoTeacher,
        role: 'teacher',
        created_at: new Date().toISOString()
      });
      setRole('teacher');
      setLoading(false);
      return;
    }

    if (!user) return;
    setLoading(true);

    try {
      // 1. Try fetching from teachers table first
      const { data: teacher, error: teacherError } = await supabase
        .from('teachers')
        .select('id, full_name, email, school_name, class_assigned, role, created_at')
        .eq('id', user.id)
        .single();

      if (teacher && !teacherError) {
        setProfile(teacher);
        setRole('teacher');
      } else {
        // 2. Try fetching from students table
        const { data: student, error: studentError } = await supabase
          .from('students')
          .select('id, full_name, email, class_grade, school_name, parent_contact, learning_needs, preferred_language, role, created_at')
          .eq('id', user.id)
          .single();

        if (student && !studentError) {
          setProfile(student);
          setRole('student');
        } else {
          // 3. Fallback to Auth Metadata if DB record doesn't exist yet
          setProfile({
            full_name: user.user_metadata?.full_name || "New User",
            email: user.email,
            role: 'user',
            created_at: user.created_at
          });
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      localStorage.removeItem("shikshak_demo_mode");
      localStorage.removeItem("shikshak_demo_teacher");
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      navigate("/auth/role-selection", { replace: true });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <ScrollArea className="h-screen pt-20">
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar - Profile Summary */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
                <div className="h-32 bg-gradient-to-br from-indigo-500 to-purple-600 relative">
                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-3xl bg-white p-1 shadow-lg">
                        <div className={`w-full h-full rounded-2xl flex items-center justify-center text-3xl font-black ${
                          role === 'teacher' ? "bg-purple-100 text-purple-600" : "bg-indigo-100 text-indigo-600"
                        }`}>
                          {profile?.full_name?.charAt(0) || "U"}
                        </div>
                      </div>
                      <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-xl shadow-md border border-slate-100 text-slate-500 hover:text-indigo-600 transition-colors">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <CardContent className="pt-16 pb-8 text-center space-y-2">
                  <h2 className="text-2xl font-black text-[#1E293B]">{profile?.full_name}</h2>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600">
                    {role === 'teacher' ? <ShieldCheck className="w-3 h-3 mr-1.5" /> : <GraduationCap className="w-3 h-3 mr-1.5" />}
                    {role}
                  </div>
                  <p className="text-sm text-[#64748B]">{profile?.email}</p>
                  
                  <div className="pt-6 flex flex-col gap-2">
                    <Button variant="outline" className="w-full rounded-xl border-[#E2E8F0] h-11 font-bold">
                      <Settings className="w-4 h-4 mr-2" />
                      Account Settings
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={handleSignOut}
                      className="w-full rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-11 font-bold"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Badges/Achievements (Visual only) */}
              <Card className="border-none shadow-sm rounded-3xl bg-white p-6">
                <CardTitle className="text-sm font-black text-[#1E293B] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500" /> Community Status
                </CardTitle>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-xs font-bold text-[#64748B]">Member Since</span>
                    <span className="text-xs font-black text-[#1E293B]">
                      {new Date(profile?.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-indigo-50 border border-indigo-100">
                    <span className="text-xs font-bold text-indigo-600">Trust Score</span>
                    <span className="text-xs font-black text-indigo-700">98/100</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Panel - Detailed Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
                <CardHeader className="border-b border-slate-50 p-8">
                  <CardTitle className="text-xl font-black text-[#1E293B]">Personal Information</CardTitle>
                  <CardDescription>View and manage your Shikshak identity</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label className="text-xs font-black text-[#64748B] uppercase tracking-widest">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                        <Input disabled value={profile?.full_name} className="pl-6 border-0 border-b border-[#E2E8F0] rounded-none bg-transparent focus-visible:ring-0 font-bold text-[#1E293B]" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black text-[#64748B] uppercase tracking-widest">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                        <Input disabled value={profile?.email} className="pl-6 border-0 border-b border-[#E2E8F0] rounded-none bg-transparent focus-visible:ring-0 font-bold text-[#1E293B]" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black text-[#64748B] uppercase tracking-widest">School / Organization</Label>
                      <div className="relative">
                        <School className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                        <Input disabled value={profile?.school_name} className="pl-6 border-0 border-b border-[#E2E8F0] rounded-none bg-transparent focus-visible:ring-0 font-bold text-[#1E293B]" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black text-[#64748B] uppercase tracking-widest">
                        {role === 'teacher' ? "Assigned Class" : "Current Grade"}
                      </Label>
                      <div className="relative">
                        <BookOpen className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                        <Input disabled value={role === 'teacher' ? profile?.class_assigned : profile?.class_grade} className="pl-6 border-0 border-b border-[#E2E8F0] rounded-none bg-transparent focus-visible:ring-0 font-bold text-[#1E293B]" />
                      </div>
                    </div>
                  </div>

                  {role === 'student' && (
                    <div className="space-y-6 pt-8 border-t border-slate-50">
                      <div className="space-y-4">
                        <Label className="text-xs font-black text-[#64748B] uppercase tracking-widest">Learning Profile</Label>
                        <div className="flex flex-wrap gap-2">
                          {profile?.learning_needs?.map((need: string) => (
                            <div key={need} className="px-4 py-2 rounded-2xl bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center gap-2">
                              <Brain className="w-3 h-3" />
                              {need}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <Label className="text-xs font-black text-[#64748B] uppercase tracking-widest">Parent Contact</Label>
                          <div className="relative">
                            <Bell className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                            <Input disabled value={profile?.parent_contact || "Not provided"} className="pl-6 border-0 border-b border-[#E2E8F0] rounded-none bg-transparent focus-visible:ring-0 font-bold text-[#1E293B]" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-black text-[#64748B] uppercase tracking-widest">Preferred Language</Label>
                          <div className="relative">
                            <Languages className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                            <Input disabled value={profile?.preferred_language} className="pl-6 border-0 border-b border-[#E2E8F0] rounded-none bg-transparent focus-visible:ring-0 font-bold text-[#1E293B]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {isDemo && (
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
                      <Zap className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-xs font-black text-amber-700 uppercase tracking-widest">Demo Mode Active</p>
                        <p className="text-xs text-amber-600 font-medium">You are currently viewing a simulated profile. Changes cannot be saved in demo mode.</p>
                      </div>
                    </div>
                  )}

                  <div className="pt-8 flex justify-end">
                    <Button disabled className="rounded-xl px-8 h-12 bg-[#1E293B] hover:bg-[#0F172A] font-bold text-white shadow-lg transition-all active:scale-95">
                      Update Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

import { Zap } from "lucide-react";

export default Profile;
