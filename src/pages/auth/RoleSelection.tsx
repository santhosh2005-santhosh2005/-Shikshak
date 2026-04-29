import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { User, Users, GraduationCap, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const RoleSelection = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: "student",
      title: "Student",
      description: "Access your personalized learning dashboard and assessments.",
      icon: GraduationCap,
      active: true,
      color: "bg-indigo-50 text-indigo-600",
      hoverColor: "hover:border-indigo-400",
    },
    {
      id: "parent",
      title: "Parent",
      description: "Monitor progress and receive insights about your child's learning.",
      icon: Users,
      active: false,
      color: "bg-slate-50 text-slate-400",
      hoverColor: "",
    },
    {
      id: "teacher",
      title: "Teacher",
      description: "Manage classes and track student performance with AI insights.",
      icon: User,
      active: false,
      color: "bg-slate-50 text-slate-400",
      hoverColor: "",
    },
  ];

  const handleRoleClick = (roleId: string, isActive: boolean) => {
    if (isActive && roleId === "student") {
      navigate("/auth/signup");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-4xl w-full text-center space-y-8"
      >
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1E293B]">
            Welcome to <span className="text-[#6366F1]">Shikshak</span>
          </h1>
          <p className="text-[#64748B] text-lg max-w-lg mx-auto">
            Choose your role to get started with your personalized learning journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          {roles.map((role) => (
            <motion.div
              key={role.id}
              whileHover={role.active ? { y: -8, scale: 1.02 } : {}}
              whileTap={role.active ? { scale: 0.98 } : {}}
              className="relative"
            >
              <Card
                onClick={() => handleRoleClick(role.id, role.active)}
                className={`h-full p-8 border-[#E2E8F0] border-2 transition-all duration-300 flex flex-col items-center text-center space-y-4 shadow-sm hover:shadow-md cursor-pointer ${
                  role.active ? `bg-white ${role.hoverColor}` : "bg-slate-50 opacity-80"
                }`}
              >
                <div className={`p-4 rounded-2xl ${role.color}`}>
                  <role.icon className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-[#1E293B]">{role.title}</h3>
                  <p className="text-[#64748B] text-sm leading-relaxed">
                    {role.description}
                  </p>
                </div>
                {!role.active && (
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-slate-600 mt-4">
                    Coming Soon
                  </div>
                )}
                {role.active && (
                  <div className="pt-4 w-full">
                    <Button
                      variant="ghost"
                      className="w-full text-[#6366F1] hover:text-[#6366F1] hover:bg-indigo-50 group"
                    >
                      Continue as Student
                      <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-sm text-[#64748B] pt-8"
        >
          Shikshak 2.0 - AI-Powered Neuro-Adaptive Learning
        </motion.p>
      </motion.div>
    </div>
  );
};

export default RoleSelection;
