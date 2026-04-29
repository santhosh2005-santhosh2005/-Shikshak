import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { GraduationCap, ArrowLeft, Loader2, Mail, Send } from "lucide-react";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) throw error;

      setSubmitted(true);
      toast.success("Password reset link sent to your email!");
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <Link 
          to="/auth/login" 
          className="inline-flex items-center text-sm text-[#64748B] hover:text-[#6366F1] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Link>

        <div className="text-center space-y-2">
          <div className="bg-white p-3 rounded-2xl shadow-sm inline-block mb-4 border border-[#E2E8F0]">
            <GraduationCap className="w-8 h-8 text-[#6366F1]" />
          </div>
          <h1 className="text-3xl font-bold text-[#1E293B]">Reset Password</h1>
          <p className="text-[#64748B]">
            {submitted 
              ? "Check your email for the reset link." 
              : "Enter your email to receive a password reset link."}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-8 border-[#E2E8F0] shadow-sm bg-white rounded-3xl">
            {!submitted ? (
              <form onSubmit={handleResetPassword} className="space-y-6">
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

                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <span className="flex items-center">
                      Send Reset Link
                      <Send className="w-4 h-4 ml-2" />
                    </span>
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-6 py-4">
                <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                  <p className="text-green-700 text-sm font-medium">
                    We've sent a recovery email to <strong>{email}</strong>. Please follow the instructions in the email to reset your password.
                  </p>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => setSubmitted(false)}
                  className="w-full h-12 rounded-xl border-[#E2E8F0]"
                >
                  Try another email
                </Button>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
