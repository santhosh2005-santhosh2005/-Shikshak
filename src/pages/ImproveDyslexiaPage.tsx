import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { motion, AnimatePresence } from "framer-motion";
import { DyslexiaLevel } from "@/types/dyslexia";
import { DyslexiaLevelSelector } from "@/components/dyslexia-improvement/DyslexiaLevelSelector";
import { ImprovementActivities } from "@/components/dyslexia-improvement/ImprovementActivities";
import { LevelInstructionCard } from "@/components/dyslexia-improvement/LevelInstructionCard";
import { 
  Brain, 
  BookOpen, 
  AudioLines, 
  ChevronDown, 
  Sparkles,
  BookMarked,
  Volume2
} from "lucide-react";

const ImproveDyslexiaPage = () => {
  const [selectedLevel, setSelectedLevel] = useState<DyslexiaLevel>("mild");
  const [showInstructions, setShowInstructions] = useState(true);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50">
      <Navbar />
      
      <div className="container mx-auto pt-32 pb-20 px-4 max-w-7xl">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 flex items-center justify-center gap-3">
            Improve Your Reading & Writing
            <button 
              onClick={() => speakText("Improve Your Reading and Writing")}
              className="p-2 rounded-full hover:bg-primary/10 transition-colors"
              aria-label="Read aloud"
            >
              <Volume2 className="h-6 w-6 text-primary" />
            </button>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Personalized exercises and tools designed to help you strengthen your reading and writing skills at your own pace.
          </p>
        </motion.div>

        {/* Instructional Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10"
        >
          <Collapsible open={showInstructions} onOpenChange={setShowInstructions}>
            <Card className="border-2 border-blue-200 bg-blue-50/50 backdrop-blur-sm">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-blue-100/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BookMarked className="h-6 w-6 text-blue-600" />
                      <CardTitle className="text-xl text-blue-900">
                        How to Choose Your Level
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            speakText("How to Choose Your Level");
                          }}
                          className="ml-2 p-1 rounded-full hover:bg-blue-200 transition-colors inline-flex"
                          aria-label="Read aloud"
                        >
                          <Volume2 className="h-4 w-4" />
                        </button>
                      </CardTitle>
                    </div>
                    <ChevronDown className={`h-5 w-5 text-blue-600 transition-transform ${showInstructions ? "rotate-180" : ""}`} />
                  </div>
                  <CardDescription className="text-blue-700">
                    Understanding which level is right for you
                  </CardDescription>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <LevelInstructionCard />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </motion.div>

        {/* Level Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            Select Your Difficulty Level
            <button 
              onClick={() => speakText("Select Your Difficulty Level")}
              className="p-2 rounded-full hover:bg-primary/10 transition-colors"
              aria-label="Read aloud"
            >
              <Volume2 className="h-5 w-5 text-primary" />
            </button>
          </h2>
          <DyslexiaLevelSelector 
            selectedLevel={selectedLevel} 
            onSelectLevel={setSelectedLevel} 
          />
        </motion.div>

        {/* Activities Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              Personalized Activities
              <button 
                onClick={() => speakText("Personalized Activities")}
                className="p-2 rounded-full hover:bg-primary/10 transition-colors"
                aria-label="Read aloud"
              >
                <Volume2 className="h-5 w-5 text-primary" />
              </button>
            </h2>
            <div className="px-4 py-2 bg-primary/10 rounded-full">
              <span className="text-sm font-semibold text-primary capitalize">
                {selectedLevel} Level
              </span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedLevel}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ImprovementActivities level={selectedLevel} />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16"
        >
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
                <AudioLines className="h-6 w-6" />
                Tips for Success
                <button 
                  onClick={() => speakText("Tips for Success")}
                  className="p-2 rounded-full hover:bg-amber-200 transition-colors"
                  aria-label="Read aloud"
                >
                  <Volume2 className="h-5 w-5" />
                </button>
              </h3>
              <ul className="space-y-3">
                {[
                  "Practice consistently - even 10-15 minutes daily makes a difference",
                  "Use text-to-speech tools to support your reading",
                  "Take breaks when you feel tired or overwhelmed",
                  "Celebrate small victories and track your progress",
                  "Don't hesitate to ask for help from teachers or specialists"
                ].map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-amber-800">{tip}</span>
                    <button 
                      onClick={() => speakText(tip)}
                      className="p-1 rounded-full hover:bg-amber-200 transition-colors flex-shrink-0"
                      aria-label="Read aloud"
                    >
                      <Volume2 className="h-4 w-4 text-amber-600" />
                    </button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ImproveDyslexiaPage;
