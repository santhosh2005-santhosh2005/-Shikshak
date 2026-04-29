
import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Brain, BookOpen, AudioLines } from "lucide-react";
import { DyslexiaLevel } from "@/types/dyslexia";
import { useAccessibility } from "@/components/AccessibilitySettings";

interface DyslexiaLevelSelectorProps {
  selectedLevel: DyslexiaLevel;
  onSelectLevel: (level: DyslexiaLevel) => void;
}

export const DyslexiaLevelSelector: React.FC<DyslexiaLevelSelectorProps> = ({ 
  selectedLevel, 
  onSelectLevel 
}) => {
  const { settings } = useAccessibility();
  const animationsDisabled = settings.disableAnimations;

  // Animation variants
  const cardVariants = {
    hover: { scale: 1.03, transition: { duration: 0.2 } },
    tap: { scale: 0.97, transition: { duration: 0.1 } },
    selected: { scale: 1, boxShadow: "0 0 0 2px var(--primary)" }
  };
  
  const levelOptions = [
    { 
      id: "mild", 
      title: "Mild", 
      icon: Brain,
      description: "Occasional challenges with reading and spelling",
      color: "bg-green-500/10 text-green-600",
      borderColor: "border-green-500/50"
    },
    { 
      id: "moderate", 
      title: "Moderate", 
      icon: BookOpen,
      description: "Regular difficulties with reading and writing",
      color: "bg-amber-500/10 text-amber-600",
      borderColor: "border-amber-500/50"
    },
    { 
      id: "severe", 
      title: "Severe", 
      icon: AudioLines,
      description: "Significant struggles with reading fluency",
      color: "bg-red-500/10 text-red-600",
      borderColor: "border-red-500/50"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {levelOptions.map((option) => {
        const isSelected = selectedLevel === option.id;
        
        return (
          <motion.div
            key={option.id}
            variants={animationsDisabled ? {} : cardVariants}
            whileHover={animationsDisabled ? {} : "hover"}
            whileTap={animationsDisabled ? {} : "tap"}
            animate={isSelected && !animationsDisabled ? "selected" : {}}
          >
            <Card 
              className={`h-full border cursor-pointer ${isSelected ? `ring-2 ring-primary ${option.borderColor}` : ''}`}
              onClick={() => onSelectLevel(option.id as DyslexiaLevel)}
            >
              <div className="p-6 flex flex-col items-center text-center">
                <div className={`p-3 rounded-full ${option.color} mb-4`}>
                  <option.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{option.title}</h3>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};
