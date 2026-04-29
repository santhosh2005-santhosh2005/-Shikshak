import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useAccessibility } from "@/components/AccessibilitySettings";
import { Volume2, VolumeX, ArrowLeft, CheckCircle2, Timer, Trophy, ArrowRight, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { getStyles, neoColors } from "@/lib/design-system";
import { ScrollArea } from "@/components/ui/scroll-area";

type LearningType = "dyslexia" | "adhd" | "autism";

const LearningMode = () => {
  const { updateSettings, readText, stopReading, isReading, settings } = useAccessibility();
  const [learningType, setLearningType] = useState<LearningType>("dyslexia");
  const [lessonData, setLessonData] = useState<any>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timer, setTimer] = useState(30);
  const [points, setPoints] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const isNeo = settings.uiTheme === "neo";
  const s = getStyles(settings.uiTheme);

  useEffect(() => {
    const storedResults = localStorage.getItem("testResults");
    let type: LearningType = "dyslexia"; 
    
    if (storedResults) {
      try {
        const results = JSON.parse(storedResults);
        if (results.accuracy < 70 || results.riskLevel === "High") type = "dyslexia";
        else if (results.averageTime < 5) type = "adhd";
        else type = "autism";
      } catch (e) { console.error(e); }
    }

    setLearningType(type);

    const content = {
      adhd: { title: "Focus Challenge", question: "Find the ocean animal:", options: ["Lion", "Elephant", "Dolphin", "Giraffe"], correctAnswer: "Dolphin", reward: 10 },
      autism: { title: "Daily Routines", steps: [{ id: 1, title: "Step 1", content: "Wake up and brush teeth." }, { id: 2, title: "Step 2", content: "Get dressed." }, { id: 3, title: "Step 3", content: "Eat breakfast." }], question: "What's step 1?", options: ["Sleep", "Brush teeth", "TV", "Play"], correctAnswer: "Brush teeth" },
      dyslexia: { title: "Sound Awareness", passage: "The dog was big and brave. He saw a bird. The bird had blue wings.", question: "What color wings?", options: ["Red", "Blue", "Green", "Yellow"], correctAnswer: "Blue" }
    };
    
    setLessonData(content[type]);
    if (type === "dyslexia") updateSettings({ dyslexicFont: "opendyslexic" });

    return () => stopReading();
  }, []);

  useEffect(() => {
    if (learningType === "adhd" && timer > 0 && !showFeedback) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [learningType, timer, showFeedback]);

  const handleCheckAnswer = () => {
    const correct = selectedAnswer === lessonData.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    if (correct && learningType === "adhd") setPoints(p => p + lessonData.reward);
  };

  const renderDyslexiaMode = () => (
    <div className={`${s.card} ${isNeo ? "bg-[#D8B4FE]" : "bg-white"} p-0 overflow-hidden`}>
      <div className={`p-6 border-b-4 border-black flex justify-between items-center ${isNeo ? "bg-white" : "bg-gray-100"}`}>
        <h2 className="text-2xl font-black uppercase tracking-tighter">{lessonData.title}</h2>
        <button onClick={() => isReading ? stopReading() : readText(lessonData.passage)} className={`p-2 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
          {isReading ? <VolumeX className="h-6 w-6 animate-pulse" /> : <Volume2 className="h-6 w-6" />}
        </button>
      </div>
      <div className="p-8">
        <div className={`mb-10 p-6 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-2xl leading-relaxed`}>
          {lessonData.passage}
        </div>
        <h3 className="text-xl font-black uppercase mb-6">{lessonData.question}</h3>
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {lessonData.options.map((opt: string) => (
            <button key={opt} onClick={() => setSelectedAnswer(opt)} className={`p-4 border-4 border-black font-black uppercase transition-all ${selectedAnswer === opt ? "bg-black text-white translate-x-1 translate-y-1 shadow-none" : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"}`}>
              {opt}
            </button>
          ))}
        </div>
        <button className={`${s.btnPrimary} w-full`} onClick={handleCheckAnswer} disabled={!selectedAnswer}>CHECK ANSWER</button>
        {showFeedback && (
          <div className={`mt-6 p-4 border-4 border-black font-black uppercase text-center ${isCorrect ? "bg-[#86EFAC]" : "bg-red-400"}`}>
            {isCorrect ? "EXCELLENT! CORRECT." : "NOT QUITE, TRY AGAIN!"}
          </div>
        )}
      </div>
    </div>
  );

  const renderADHDMode = () => (
    <div className="space-y-8">
      <div className="flex justify-between gap-4">
        <div className={`${s.card} flex-1 py-4 flex items-center justify-center gap-4 bg-[#FEF08A]`}>
          <Timer className="h-8 w-8" /> <span className="text-3xl font-black">{timer}s</span>
        </div>
        <div className={`${s.card} flex-1 py-4 flex items-center justify-center gap-4 bg-[#86EFAC]`}>
          <Trophy className="h-8 w-8" /> <span className="text-3xl font-black">{points} PTS</span>
        </div>
      </div>
      <div className={`${s.card} ${isNeo ? "bg-[#FDA4AF]" : "bg-white"} text-center p-10`}>
        <h2 className="text-4xl font-black uppercase mb-10 tracking-tighter">{lessonData.question}</h2>
        <div className="grid gap-4">
          {lessonData.options.map((opt: string) => (
            <button key={opt} onClick={() => setSelectedAnswer(opt)} className={`p-6 border-4 border-black font-black text-2xl uppercase transition-all ${selectedAnswer === opt ? "bg-black text-white scale-105" : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"}`}>
              {opt}
            </button>
          ))}
        </div>
        {selectedAnswer && !showFeedback && <button className={`${s.btnPrimary} mt-10 h-20 text-3xl w-full`} onClick={handleCheckAnswer}>CHECK IT!</button>}
        {showFeedback && (
          <div className={`mt-10 p-8 border-4 border-black font-black uppercase flex flex-col items-center gap-4 ${isCorrect ? "bg-[#86EFAC]" : "bg-red-400"}`}>
            <span className="text-4xl">{isCorrect ? "AMAZING!" : "TRY AGAIN!"}</span>
            <button className={`${s.btnSecondary} bg-white`} onClick={() => { setShowFeedback(false); setSelectedAnswer(""); setTimer(30); }}>NEXT <ArrowRight /></button>
          </div>
        )}
      </div>
    </div>
  );

  const renderAutismMode = () => (
    <div className="grid md:grid-cols-2 gap-10">
      <div className="space-y-4">
        {lessonData.steps.map((step: any) => (
          <div key={step.id} className={`${s.card} ${currentStep === step.id ? "bg-[#86EFAC]" : "bg-white opacity-50"} transition-all`}>
            <h3 className="font-black uppercase text-blue-800">{step.title}</h3>
            <p className="font-bold">{step.content}</p>
          </div>
        ))}
        {currentStep < 3 && <button className={`${s.btnPrimary} w-full h-16`} onClick={() => setCurrentStep(prev => prev + 1)}>I FINISHED THIS STEP</button>}
      </div>
      <AnimatePresence>
        {currentStep === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className={`${s.card} ${isNeo ? "bg-[#D8B4FE]" : "bg-white"}`}>
            <h3 className="text-2xl font-black uppercase mb-8">{lessonData.question}</h3>
            <div className="grid gap-4">
              {lessonData.options.map((opt: string) => (
                <button key={opt} onClick={() => setSelectedAnswer(opt)} className={`p-4 border-4 border-black font-black uppercase text-left ${selectedAnswer === opt ? "bg-black text-white" : "bg-white"}`}>{opt}</button>
              ))}
            </div>
            <button className={`${s.btnPrimary} w-full mt-10`} disabled={!selectedAnswer} onClick={handleCheckAnswer}>CHECK ANSWER</button>
            {showFeedback && <div className={`mt-6 p-4 border-4 border-black font-black text-center ${isCorrect ? "bg-[#86EFAC]" : "bg-red-400"}`}>{isCorrect ? "WELL DONE!" : "TRY AGAIN."}</div>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (!lessonData) return null;

  return (
    <ScrollArea className="h-screen" style={!isNeo ? { backgroundColor: 'var(--app-bg)' } : { backgroundColor: '#ffffff' }}>
      <div className={`min-h-screen ${isNeo ? "font-bold bg-grid" : "font-sans"} text-black`}>
        <Navbar />
        <div className="container mx-auto pt-32 pb-20 px-4 max-w-4xl">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
            <button className={s.btnSecondary} onClick={() => navigate("/results")}><ArrowLeft /> RESULTS</button>
            <span className={s.tag}>{learningType} MODE</span>
          </div>
          {learningType === "dyslexia" && renderDyslexiaMode()}
          {learningType === "adhd" && renderADHDMode()}
          {learningType === "autism" && renderAutismMode()}
        </div>
      </div>
    </ScrollArea>
  );
};

export default LearningMode;
