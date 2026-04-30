import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { GraduationCap, ArrowLeft, Loader2, Lock, Mail } from "lucide-react";

const StudentLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // demo mode check — handle BEFORE setLoading to avoid finally block interference
    if (email.trim() === "demo@shikshak.com" && password === "demo123") {
      toast.success("Logged in as Demo Student");
      localStorage.setItem("shikshak_demo_mode", "true");
      setLoading(true);
      setTimeout(() => navigate("/home"), 1000);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          toast.error("Please confirm your email address before logging in. Check your inbox for the link.");
          setLoading(false);
          return;
        }
        throw error;
      }

      toast.success("Welcome back to Shikshak!");
      navigate("/home");
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Automatic fallback if network error
      if (error.message === "Failed to fetch" || error.status === 0 || error.name === "TypeError") {
        toast.info("Supabase connection issue detected. Entering Demo Mode.");
        localStorage.setItem("shikshak_demo_mode", "true");
        setTimeout(() => navigate("/home"), 1500);
      } else {
        toast.error(error.message || "Invalid login credentials");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/tests`
      }
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
            <GraduationCap className="w-8 h-8 text-[#6366F1]" />
          </div>
          <h1 className="text-3xl font-bold text-[#1E293B]">Welcome Back</h1>
          <p className="text-[#64748B]">Login to continue your learning journey.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-8 border-[#E2E8F0] shadow-sm bg-white rounded-3xl">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-[#64748B]" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="name@school.com" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 rounded-xl border-[#E2E8F0] h-12"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link 
                      to="/auth/forgot-password" 
                      className="text-xs text-[#6366F1] hover:underline font-medium"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-[#64748B]" />
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 rounded-xl border-[#E2E8F0] h-12"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Login to Dashboard"
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
                  onClick={() => {
                    setEmail("demo@shikshak.com");
                    setPassword("demo123");
                    toast.info("Demo credentials auto-filled. Click Login.");
                  }}
                  className="w-full h-12 rounded-xl border-dashed border-2 border-[#6366F1] text-[#6366F1] hover:bg-indigo-50 transition-all duration-200"
                >
                  Login as Guest (Demo Mode)
                </Button>
              </div>
            </form>

            <p className="text-center text-sm text-[#64748B] mt-8">
              Don't have an account?{" "}
              <Link to="/auth/signup" className="text-[#6366F1] font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentLogin;
