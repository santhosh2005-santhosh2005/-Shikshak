import React, { useState } from "react";
import { motion } from "framer-motion";
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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { GraduationCap, ArrowLeft, Loader2 } from "lucide-react";

const StudentSignup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    classGrade: "",
    schoolName: "",
    parentContact: "",
    learningNeeds: [] as string[],
    preferredLanguage: "English",
    acceptTerms: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClassChange = (value: string) => {
    setFormData(prev => ({ ...prev, classGrade: value }));
  };

  const handleLanguageChange = (value: string) => {
    setFormData(prev => ({ ...prev, preferredLanguage: value }));
  };

  const handleLearningNeedsChange = (need: string) => {
    setFormData(prev => {
      const current = prev.learningNeeds;
      if (current.includes(need)) {
        return { ...prev, learningNeeds: current.filter(n => n !== need) };
      } else {
        return { ...prev, learningNeeds: [...current, need] };
      }
    });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!formData.acceptTerms) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    setLoading(true);

    try {
      const email = formData.email.trim();
      const password = formData.password;

      // 1. Supabase Auth Signup
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: formData.fullName,
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Insert into students table
        const { error: profileError } = await supabase
          .from('students')
          .insert([
            {
              id: authData.user.id,
              full_name: formData.fullName,
              email: email,
              class_grade: formData.classGrade,
              school_name: formData.schoolName,
              parent_contact: formData.parentContact,
              learning_needs: formData.learningNeeds,
              preferred_language: formData.preferredLanguage,
              role: 'student'
            }
          ]);

        if (profileError) {
          console.error("Profile creation error:", profileError);
        }

        if (authData.session) {
          toast.success("Account created successfully!");
          navigate("/home");
        } else {
          toast.success("Signup successful! Please check your email for a confirmation link.");
          navigate("/auth/login");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/home`
      }
    });
    if (error) toast.error(error.message);
  };

  const learningNeedsOptions = [
    "Dyslexia", "ADHD", "Autism", "Slow Learning", "Reading Difficulty", "Attention Difficulty", "Other"
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <Link 
          to="/auth/role-selection" 
          className="inline-flex items-center text-sm text-[#64748B] hover:text-[#6366F1] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Role Selection
        </Link>

        <div className="text-center space-y-2">
          <div className="bg-white p-3 rounded-2xl shadow-sm inline-block mb-4 border border-[#E2E8F0]">
            <GraduationCap className="w-8 h-8 text-[#6366F1]" />
          </div>
          <h1 className="text-3xl font-bold text-[#1E293B]">Create Student Account</h1>
          <p className="text-[#64748B]">Join Shikshak 2.0 and start your adaptive learning journey.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-8 border-[#E2E8F0] shadow-sm bg-white rounded-3xl">
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input 
                    id="fullName" 
                    name="fullName" 
                    placeholder="Enter your full name" 
                    required 
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="rounded-xl border-[#E2E8F0] focus:ring-[#6366F1]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="name@school.com" 
                    required 
                    value={formData.email}
                    onChange={handleInputChange}
                    className="rounded-xl border-[#E2E8F0]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    name="password" 
                    type="password" 
                    placeholder="••••••••" 
                    required 
                    value={formData.password}
                    onChange={handleInputChange}
                    className="rounded-xl border-[#E2E8F0]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    type="password" 
                    placeholder="••••••••" 
                    required 
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="rounded-xl border-[#E2E8F0]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="classGrade">Class / Grade</Label>
                  <Select onValueChange={handleClassChange} required>
                    <SelectTrigger className="rounded-xl border-[#E2E8F0]">
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
                <div className="space-y-2">
                  <Label htmlFor="schoolName">School Name</Label>
                  <Input 
                    id="schoolName" 
                    name="schoolName" 
                    placeholder="Enter school name" 
                    required 
                    value={formData.schoolName}
                    onChange={handleInputChange}
                    className="rounded-xl border-[#E2E8F0]"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#E2E8F0]">
                <h3 className="text-sm font-semibold text-[#1E293B]">Additional Information (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="parentContact">Parent Contact Number</Label>
                    <Input 
                      id="parentContact" 
                      name="parentContact" 
                      placeholder="+91 XXXXX XXXXX" 
                      value={formData.parentContact}
                      onChange={handleInputChange}
                      className="rounded-xl border-[#E2E8F0]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Preferred Learning Language</Label>
                    <Select onValueChange={handleLanguageChange} defaultValue="English">
                      <SelectTrigger className="rounded-xl border-[#E2E8F0]">
                        <SelectValue placeholder="Select Language" />
                      </SelectTrigger>
                      <SelectContent>
                        {["English", "Hindi", "Kannada", "Tamil", "Telugu"].map(lang => (
                          <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Special Learning Needs</Label>
                  <div className="flex flex-wrap gap-2">
                    {learningNeedsOptions.map(need => (
                      <button
                        key={need}
                        type="button"
                        onClick={() => handleLearningNeedsChange(need)}
                        className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 border ${
                          formData.learningNeeds.includes(need)
                            ? "bg-[#6366F1] text-white border-[#6366F1]"
                            : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#6366F1]"
                        }`}
                      >
                        {need}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-4">
                <Checkbox 
                  id="terms" 
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, acceptTerms: !!checked }))}
                />
                <label 
                  htmlFor="terms" 
                  className="text-xs text-[#64748B] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I accept the <span className="text-[#6366F1] cursor-pointer">Terms of Service</span> and <span className="text-[#6366F1] cursor-pointer">Privacy Policy</span>
                </label>
              </div>

              <div className="space-y-4 pt-4">
                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Create Student Account"
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
              Already have an account?{" "}
              <Link to="/auth/login" className="text-[#6366F1] font-semibold hover:underline">
                Login
              </Link>
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentSignup;
