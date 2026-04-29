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
        <button onClick={() => isReading ? stopReading() : readText(lessonData.passage)} className={`p-3 border-4 border-black bg-[#FEF08A] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 font-black uppercase hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all`}>
          {isReading ? <><VolumeX className="h-6 w-6 animate-pulse" /> STOP</> : <><Volume2 className="h-6 w-6" /> LISTEN</>}
        </button>
      </div>
      <div className="p-8">
        <div className={`mb-10 p-6 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-2xl md:text-3xl leading-relaxed font-medium`}>
          {lessonData.passage.split(" ").map((word: string, i: number) => (
            <span key={i} className="hover:bg-[#FEF08A] transition-colors cursor-pointer px-1 rounded">{word} </span>
          ))}
        </div>
        <h3 className="text-xl font-black uppercase mb-6">{lessonData.question}</h3>
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {lessonData.options.map((opt: string) => (
            <button key={opt} onClick={() => setSelectedAnswer(opt)} className={`p-4 border-4 border-black font-black uppercase transition-all ${selectedAnswer === opt ? "bg-black text-white translate-x-1 translate-y-1 shadow-none" : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-50"}`}>
              {opt}
            </button>
          ))}
        </div>
        <button className={`${s.btnPrimary} w-full text-xl py-6`} onClick={handleCheckAnswer} disabled={!selectedAnswer}>CHECK ANSWER</button>
        {showFeedback && (
          <div className={`mt-6 p-4 border-4 border-black font-black uppercase text-center text-xl ${isCorrect ? "bg-[#86EFAC]" : "bg-[#FDA4AF]"}`}>
            {isCorrect ? "EXCELLENT! CORRECT. 🌟" : "NOT QUITE, TRY AGAIN!"}
          </div>
        )}
      </div>
    </div>
  );

  const renderADHDMode = () => (
    <div className="space-y-8">
      <div className="flex justify-between gap-4">
        <div className={`${s.card} flex-1 py-6 flex items-center justify-center gap-4 bg-[#FEF08A] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black`}>
          <Timer className="h-10 w-10 animate-pulse" /> <span className="text-4xl font-black">{timer}s</span>
        </div>
        <div className={`${s.card} flex-1 py-6 flex items-center justify-center gap-4 bg-[#86EFAC] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black`}>
          <Trophy className="h-10 w-10 text-yellow-600" /> <span className="text-4xl font-black">{points} PTS</span>
        </div>
      </div>
      <div className={`${s.card} ${isNeo ? "bg-[#FDA4AF]" : "bg-white"} text-center p-10 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`}>
        <h2 className="text-5xl font-black uppercase mb-12 tracking-tighter">{lessonData.question}</h2>
        <div className="grid gap-6">
          {lessonData.options.map((opt: string) => (
            <button key={opt} onClick={() => setSelectedAnswer(opt)} className={`p-8 border-4 border-black font-black text-3xl uppercase transition-all ${selectedAnswer === opt ? "bg-black text-white scale-105" : "bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1"}`}>
              {opt}
            </button>
          ))}
        </div>
        {selectedAnswer && !showFeedback && <button className={`${s.btnPrimary} mt-12 h-24 text-4xl w-full border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none bg-[#86EFAC]`} onClick={handleCheckAnswer}>CHECK IT!</button>}
        {showFeedback && (
          <div className={`mt-12 p-8 border-4 border-black font-black uppercase flex flex-col items-center gap-6 ${isCorrect ? "bg-[#86EFAC]" : "bg-[#FEF08A]"}`}>
            <span className="text-5xl">{isCorrect ? `AMAZING! +${lessonData.reward} ⭐` : "TRY AGAIN!"}</span>
            <button className={`${s.btnSecondary} bg-white text-2xl px-10 py-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none`} onClick={() => { setShowFeedback(false); setSelectedAnswer(""); setTimer(30); }}>NEXT <ArrowRight className="h-8 w-8" /></button>
          </div>
        )}
      </div>
    </div>
  );

  const renderAutismMode = () => (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="font-bold text-xl px-6 py-2 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          Step {Math.min(currentStep, lessonData.steps.length + 1)} of {lessonData.steps.length + 1}
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-6">
          {lessonData.steps.map((step: any) => (
            <div key={step.id} className={`p-6 border-4 border-black transition-all ${currentStep === step.id ? "bg-[#FEF08A] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] scale-105" : "bg-gray-50 opacity-60"}`}>
              <h3 className="font-black uppercase text-xl mb-2">{step.title}</h3>
              <p className="font-bold text-lg">{step.content}</p>
            </div>
          ))}
          {currentStep <= lessonData.steps.length && (
            <button className={`${s.btnPrimary} w-full h-20 text-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none bg-[#86EFAC]`} onClick={() => setCurrentStep(prev => prev + 1)}>
              I FINISHED THIS STEP <CheckCircle2 className="ml-2 h-8 w-8" />
            </button>
          )}
        </div>
        <AnimatePresence>
          {currentStep > lessonData.steps.length && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className={`p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${isNeo ? "bg-[#D8B4FE]" : "bg-white"}`}>
              <h3 className="text-3xl font-black uppercase mb-8 leading-snug">{lessonData.question}</h3>
              <div className="grid gap-4">
                {lessonData.options.map((opt: string) => (
                  <button key={opt} onClick={() => setSelectedAnswer(opt)} className={`p-6 border-4 border-black font-black uppercase text-left text-xl transition-all ${selectedAnswer === opt ? "bg-black text-white" : "bg-white hover:bg-gray-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none"}`}>{opt}</button>
                ))}
              </div>
              <button className={`${s.btnPrimary} w-full mt-10 h-16 text-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`} disabled={!selectedAnswer} onClick={handleCheckAnswer}>CHECK ANSWER</button>
              {showFeedback && <div className={`mt-6 p-6 border-4 border-black font-black text-2xl uppercase text-center ${isCorrect ? "bg-[#86EFAC]" : "bg-[#FDA4AF]"}`}>{isCorrect ? "WELL DONE! 🌟" : "TRY AGAIN."}</div>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
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
