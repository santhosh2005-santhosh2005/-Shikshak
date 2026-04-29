import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAccessibility } from "@/components/AccessibilitySettings";
import { Volume2, VolumeX, ArrowLeft, CheckCircle2, Timer, Trophy, ArrowRight, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

type LearningType = "dyslexia" | "adhd" | "autism";

const LearningMode = () => {
  const { updateSettings, readText, stopReading, isReading } = useAccessibility();
  const [learningType, setLearningType] = useState<LearningType>("dyslexia");
  const [lessonData, setLessonData] = useState<any>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timer, setTimer] = useState(30);
  const [points, setPoints] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    // Determine lesson type based on results
    const storedResults = localStorage.getItem("testResults");
    let type: LearningType = "autism"; // Default
    
    if (storedResults) {
      try {
        const results = JSON.parse(storedResults);
        
        // STEP 1: DEFINE USER TYPE (SIMULATED LOGIC)
        if (results.accuracy < 70 || results.riskLevel === "High") {
          type = "dyslexia";
        } else if (results.averageTime < 5 || results.accuracy < 50) {
          // Fast completion or very low accuracy (random clicking)
          type = "adhd";
        } else {
          type = "autism";
        }
      } catch (e) {
        console.error("Failed to parse results", e);
      }
    }

    setLearningType(type);

    // Mock lesson content based on type
    const getMockContent = (type: LearningType) => {
      switch (type) {
        case "adhd":
          return {
            title: "Quick Challenge: Focus Fun!",
            question: "Find the animal that lives in the ocean:",
            options: ["Lion", "Elephant", "Dolphin", "Giraffe"],
            correctAnswer: "Dolphin",
            reward: 10
          };
        case "autism":
          return {
            title: "Structured Learning: Daily Routines",
            steps: [
              { id: 1, title: "Step 1: Morning", content: "First, we wake up and brush our teeth." },
              { id: 2, title: "Step 2: Getting Ready", content: "Next, we put on our favorite clothes." },
              { id: 3, title: "Step 3: Breakfast", content: "Then, we eat a healthy breakfast." }
            ],
            question: "What do we do after waking up?",
            options: ["Go to sleep", "Brush teeth", "Watch TV", "Go outside"],
            correctAnswer: "Brush teeth"
          };
        case "dyslexia":
        default:
          return {
            title: "Phonological Awareness: 'b' vs 'd'",
            passage: "The dog was big and brave. He saw a bird in the tree. The bird had blue wings and a bright beak.",
            question: "What color were the bird's wings?",
            options: ["Red", "Blue", "Green", "Yellow"],
            correctAnswer: "Blue"
          };
      }
    };
    
    setLessonData(getMockContent(type));

    // Dyslexia Mode Specifics
    if (type === "dyslexia") {
      updateSettings({ dyslexicFont: "opendyslexic" });
    }

    return () => {
      stopReading();
    };
  }, []);

  // ADHD Timer Logic
  useEffect(() => {
    if (learningType === "adhd" && timer > 0 && !showFeedback) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [learningType, timer, showFeedback]);

  const handleCheckAnswer = () => {
    const correct = selectedAnswer === lessonData.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct && learningType === "adhd") {
      setPoints(prev => prev + lessonData.reward);
    }
  };

  const renderDyslexiaMode = () => (
    <Card className="border-2 border-primary/20 shadow-xl overflow-hidden">
      <CardHeader className="bg-primary/5 border-b border-primary/10">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold text-primary">
            {lessonData.title}
          </CardTitle>
          <Button
            variant="outline"
            size="icon"
            onClick={() => isReading ? stopReading() : readText(lessonData.passage)}
            className={isReading ? "text-primary border-primary animate-pulse" : ""}
          >
            {isReading ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-8">
        <div className="mb-10 p-6 bg-muted/30 rounded-2xl border border-dashed border-primary/20 leading-relaxed text-xl">
          <div className="flex flex-wrap gap-x-2 gap-y-1">
            {lessonData.passage?.split(" ").map((word: string, i: number) => (
              <span 
                key={i}
                className="transition-all duration-200 hover:text-primary hover:scale-110 cursor-default rounded px-1 hover:bg-primary/10"
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold mb-4">{lessonData.question}</h3>
          
          <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lessonData.options.map((option: string) => (
              <div key={option} className="relative">
                <RadioGroupItem value={option} id={option} className="peer sr-only" />
                <Label
                  htmlFor={option}
                  className="flex items-center justify-between p-4 rounded-xl border-2 border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                >
                  <span className="font-medium">{option}</span>
                  {selectedAnswer === option && <CheckCircle2 className="h-5 w-5 text-primary" />}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="flex flex-col items-center gap-4 mt-8">
            <Button size="lg" className="w-full md:w-auto px-12" disabled={!selectedAnswer} onClick={handleCheckAnswer}>
              Check Answer
            </Button>
            {showFeedback && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={`w-full p-4 rounded-xl text-center font-bold ${isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {isCorrect ? "Excellent! That's correct." : "Not quite, try again!"}
              </motion.div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderADHDMode = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border">
        <div className="flex items-center gap-2 text-amber-600 font-bold">
          <Timer className="h-6 w-6" />
          <span className="text-2xl">{timer}s</span>
        </div>
        <div className="flex items-center gap-2 text-primary font-bold">
          <Trophy className="h-6 w-6" />
          <span className="text-2xl">{points} Points</span>
        </div>
      </div>

      <Card className="border-4 border-primary/30 shadow-2xl overflow-hidden bg-white">
        <CardContent className="p-10 text-center">
          <motion.h2 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-3xl font-black text-primary mb-8"
          >
            {lessonData.question}
          </motion.h2>

          <div className="grid grid-cols-1 gap-4">
            {lessonData.options.map((option: string) => (
              <Button
                key={option}
                variant={selectedAnswer === option ? "default" : "outline"}
                className={`h-20 text-2xl font-bold rounded-2xl border-4 transition-all transform active:scale-95 ${
                  selectedAnswer === option ? "border-primary scale-105 shadow-lg" : "hover:border-primary/50"
                }`}
                onClick={() => setSelectedAnswer(option)}
              >
                {option}
              </Button>
            ))}
          </div>

          <AnimatePresence>
            {selectedAnswer && !showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-10"
              >
                <Button size="lg" className="h-16 px-12 text-xl font-black rounded-full shadow-xl" onClick={handleCheckAnswer}>
                  BOOM! CHECK IT!
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {showFeedback && (
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              className={`mt-10 p-8 rounded-3xl border-4 flex flex-col items-center gap-4 ${
                isCorrect ? "bg-green-100 border-green-400 text-green-700" : "bg-red-100 border-red-400 text-red-700"
              }`}
            >
              <span className="text-4xl font-black uppercase tracking-widest">
                {isCorrect ? "AMAZING!" : "TRY AGAIN!"}
              </span>
              {isCorrect && (
                <div className="flex items-center gap-2 bg-white px-6 py-2 rounded-full shadow-sm">
                  <Star className="fill-yellow-400 text-yellow-400" />
                  <span className="text-xl font-bold text-amber-600">You earned +{lessonData.reward} points!</span>
                </div>
              )}
              <Button 
                variant="outline" 
                className="mt-4 bg-white border-2 font-bold"
                onClick={() => {
                  setShowFeedback(false);
                  setSelectedAnswer("");
                  setTimer(30);
                }}
              >
                Next Challenge <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderAutismMode = () => (
    <div className="space-y-8">
      {/* Calm Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-medium text-slate-700">Let's follow the steps together</h2>
        <div className="flex justify-center gap-2">
          {lessonData.steps.map((step: any) => (
            <div 
              key={step.id}
              className={`h-3 w-16 rounded-full transition-all duration-500 ${
                currentStep >= step.id ? "bg-blue-400" : "bg-slate-200"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Step List */}
        <div className="space-y-4">
          {lessonData.steps.map((step: any) => (
            <motion.div
              key={step.id}
              animate={{ 
                opacity: currentStep >= step.id ? 1 : 0.5,
                scale: currentStep === step.id ? 1.02 : 1
              }}
              className={`p-6 rounded-2xl border-2 transition-colors ${
                currentStep === step.id ? "border-blue-400 bg-blue-50/50 shadow-sm" : "border-slate-100 bg-white"
              }`}
            >
              <h3 className="font-bold text-blue-600 mb-1">{step.title}</h3>
              <p className="text-slate-600">{step.content}</p>
            </motion.div>
          ))}
          {currentStep < 3 && (
            <Button 
              className="w-full h-14 rounded-2xl bg-blue-500 hover:bg-blue-600 text-lg"
              onClick={() => setCurrentStep(prev => prev + 1)}
            >
              I finished this step
            </Button>
          )}
        </div>

        {/* Question (Only shown after steps) */}
        <AnimatePresence>
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="border-2 border-slate-200 shadow-sm h-full">
                <CardContent className="p-8">
                  <h3 className="text-xl font-medium text-slate-800 mb-6">{lessonData.question}</h3>
                  <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="space-y-3">
                    {lessonData.options.map((option: string) => (
                      <div key={option}>
                        <RadioGroupItem value={option} id={option} className="peer sr-only" />
                        <Label
                          htmlFor={option}
                          className="flex items-center p-4 rounded-xl border-2 border-slate-100 bg-slate-50 hover:bg-slate-100 peer-data-[state=checked]:border-blue-400 peer-data-[state=checked]:bg-blue-50 cursor-pointer transition-all"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  
                  <Button 
                    className="w-full mt-8 h-14 rounded-2xl bg-slate-800 hover:bg-slate-900"
                    disabled={!selectedAnswer}
                    onClick={handleCheckAnswer}
                  >
                    Check my answer
                  </Button>

                  {showFeedback && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`mt-6 p-4 rounded-xl text-center font-medium ${
                        isCorrect ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
                      }`}
                    >
                      {isCorrect ? "Well done. You followed the steps." : "Let's try one more time."}
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  if (!lessonData) return null;

  return (
    <div className={`min-h-screen relative transition-colors duration-1000 ${
      learningType === "autism" ? "bg-slate-50" : 
      learningType === "adhd" ? "bg-amber-50/30" : "bg-background"
    }`}>
      <Navbar />
      
      {learningType !== "autism" && <div className="absolute inset-0 -z-10 bg-grid opacity-20"></div>}
      
      <div className="container mx-auto pt-32 pb-20 px-4 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <Button variant="ghost" className="gap-2" onClick={() => navigate("/results")}>
              <ArrowLeft className="h-4 w-4" /> Back to Results
            </Button>
            
            {/* Requirement 7: Learning Mode Label */}
            <div className={`px-4 py-1.5 rounded-full text-sm font-bold border-2 uppercase tracking-wider ${
              learningType === "adhd" ? "bg-amber-100 text-amber-700 border-amber-200" :
              learningType === "autism" ? "bg-blue-100 text-blue-700 border-blue-200" :
              "bg-primary/10 text-primary border-primary/20"
            }`}>
              Learning Mode: {learningType}
            </div>
          </div>

          {learningType === "dyslexia" && renderDyslexiaMode()}
          {learningType === "adhd" && renderADHDMode()}
          {learningType === "autism" && renderAutismMode()}
        </motion.div>
      </div>
    </div>
  );
};

export default LearningMode;

