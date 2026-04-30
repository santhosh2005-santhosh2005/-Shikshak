import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { Heart, ArrowLeft, Loader2, Lock, Mail, User, GraduationCap, School } from "lucide-react";

const ParentAuth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    studentName: "",
    schoolName: "",
    studentClass: "",
    relationship: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // --- Demo Bypass for Network Issues ---
    if (formData.email.trim() === "parent@shikshak.com" && formData.password === "password123") {
      toast.success("Entering Parent Demo Mode...");
      localStorage.setItem("shikshak_demo_mode", "true");
      localStorage.setItem("shikshak_demo_parent", JSON.stringify({
        full_name: formData.fullName || "John Doe (Parent)",
        student_name: formData.studentName || "Alex Student",
        school_name: formData.schoolName || "Shikshak Academy",
        student_class: formData.studentClass || "Class 10",
        relationship: formData.relationship || "Guardian",
        email: "parent@shikshak.com"
      }));
      setTimeout(() => {
        navigate("/parent-digest");
        setLoading(false);
      }, 1000);
      return;
    }

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email.trim(),
          password: formData.password,
        });
        if (error) throw error;
        toast.success("Welcome back, Parent!");
        navigate("/parent-digest");
      } else {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email.trim(),
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              role: 'parent'
            }
          }
        });

        if (authError) throw authError;

        if (authData.user) {
          const { error: profileError } = await supabase
            .from('parents')
            .insert([
              {
                id: authData.user.id,
                full_name: formData.fullName,
                email: formData.email.trim(),
                student_name: formData.studentName,
                school_name: formData.schoolName,
                student_class: formData.studentClass,
                relationship: formData.relationship,
                role: 'parent'
              }
            ]);

          if (profileError) console.error("Parent profile error:", profileError);

          if (authData.session) {
            toast.success("Parent account created!");
            navigate("/parent-digest");
          } else {
            toast.success("Signup successful! Please confirm your email.");
            setIsLogin(true);
          }
        }
      }
    } catch (error: any) {
      console.error("Parent auth error:", error);
      
      // Automatic fallback if network error
      if (error.message === "Failed to fetch" || error.status === 0 || error.name === "TypeError") {
        toast.info("Supabase connection issue detected. Entering Demo Mode.");
        localStorage.setItem("shikshak_demo_mode", "true");
        localStorage.setItem("shikshak_demo_parent", JSON.stringify({
          full_name: formData.fullName || "John Doe (Parent)",
          student_name: formData.studentName || "Alex Student",
          school_name: formData.schoolName || "Shikshak Academy",
          student_class: formData.studentClass || "Class 10",
          relationship: formData.relationship || "Guardian",
          email: formData.email || "parent@shikshak.com"
        }));
        setTimeout(() => navigate("/parent-digest"), 1500);
      } else {
        toast.error(error.message || "Authentication failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/parent-digest` }
    });
    if (error) toast.error(error.message);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <Link 
          to="/auth/role-selection" 
          className="inline-flex items-center text-sm text-[#64748B] hover:text-[#6366F1] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Role Selection
        </Link>

        <div className="text-center space-y-2">
          <div className="bg-white p-3 rounded-2xl shadow-sm inline-block mb-4 border border-[#E2E8F0]">
            <Heart className="w-8 h-8 text-[#14B8A6]" />
          </div>
          <h1 className="text-3xl font-bold text-[#1E293B]">
            {isLogin ? "Parent Login" : "Parent Registration"}
          </h1>
          <p className="text-[#64748B]">
            {isLogin ? "Monitor your child's learning journey." : "Join Shikshak to support your child's growth."}
          </p>
        </div>

        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-8 border-[#E2E8F0] shadow-sm bg-white rounded-3xl">
            <form onSubmit={handleAuth} className="space-y-5">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Parent Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-5 h-5 text-[#64748B]" />
                        <Input 
                          id="fullName" 
                          name="fullName"
                          placeholder="John Doe" 
                          required={!isLogin}
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="pl-10 rounded-xl border-[#E2E8F0] h-12"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="studentName">Student Name</Label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-3 w-5 h-5 text-[#64748B]" />
                        <Input 
                          id="studentName" 
                          name="studentName"
                          placeholder="Child's full name" 
                          required={!isLogin}
                          value={formData.studentName}
                          onChange={handleInputChange}
                          className="pl-10 rounded-xl border-[#E2E8F0] h-12"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="schoolName">School Name</Label>
                        <Input 
                          id="schoolName" 
                          name="schoolName"
                          placeholder="School name" 
                          required={!isLogin}
                          value={formData.schoolName}
                          onChange={handleInputChange}
                          className="rounded-xl border-[#E2E8F0] h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="studentClass">Student Class</Label>
                        <Select onValueChange={(v) => handleSelectChange("studentClass", v)} required={!isLogin}>
                          <SelectTrigger className="rounded-xl border-[#E2E8F0] h-12">
                            <SelectValue placeholder="Select Class" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => (
                              <SelectItem key={i + 1} value={`Class ${i + 1}`}>
                                Class {i + 1}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="relationship">Relationship</Label>
                      <Select onValueChange={(v) => handleSelectChange("relationship", v)} required={!isLogin}>
                        <SelectTrigger className="rounded-xl border-[#E2E8F0] h-12">
                          <SelectValue placeholder="Select Relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          {["Mother", "Father", "Guardian", "Elder Brother", "Elder Sister", "Other"].map(r => (
                            <SelectItem key={r} value={r}>{r}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-[#64748B]" />
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    placeholder="parent@home.com" 
                    required 
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 rounded-xl border-[#E2E8F0] h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  {isLogin && (
                    <Link to="/auth/forgot-password" size="sm" className="text-xs text-[#14B8A6] hover:underline font-medium">
                      Forgot Password?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-[#64748B]" />
                  <Input 
                    id="password" 
                    name="password"
                    type="password" 
                    placeholder="••••••••" 
                    required 
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 rounded-xl border-[#E2E8F0] h-12"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-xl bg-[#14B8A6] hover:bg-[#0D9488] text-white font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    isLogin ? "Login to Dashboard" : "Create Parent Account"
                  )}
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-[#E2E8F0]"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-[#64748B]">Or continue with</span>
                  </div>
                </div>

                <Button 
                  type="button"
                  variant="outline" 
                  onClick={handleGoogleLogin}
                  className="w-full h-12 rounded-xl border-[#E2E8F0] hover:bg-slate-50 transition-all duration-200"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5.04c1.94 0 3.51.68 4.75 1.81l3.55-3.55C18.1 1.31 15.3 0 12 0 7.31 0 3.32 2.67 1.34 6.6l4.13 3.21C6.46 6.95 9 5.04 12 5.04z" />
                    <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.89 3.01c2.27-2.11 3.53-5.21 3.53-8.83z" />
                    <path fill="#FBBC05" d="M5.47 14.19c-.27-.79-.42-1.63-.42-2.51s.15-1.72.42-2.51L1.34 6.6C.49 8.24 0 10.07 0 12s.49 3.76 1.34 5.4l4.13-3.21z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.97-1.07 7.96-2.91l-3.89-3.01c-1.1.74-2.5 1.18-4.07 1.18-3 0-5.54-1.91-6.46-4.75L1.34 17.4C3.32 21.33 7.31 24 12 24z" />
                  </svg>
                  Continue with Google
                </Button>
              </div>
            </form>

            <p className="text-center text-sm text-[#64748B] mt-8">
              {isLogin ? "Need a parent account?" : "Already have an account?"}{" "}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-[#14B8A6] font-semibold hover:underline"
              >
                {isLogin ? "Sign up" : "Login"}
              </button>
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ParentAuth;
