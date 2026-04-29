
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { AnimatedHeading } from "@/components/AnimatedHeading";
import { ArrowRight, Volume2 } from "lucide-react";

interface Question {
  word: string;
  hint: string;
  sentence: string;
  difficulty: "easy" | "medium" | "hard";
}

interface TestResult {
  questionIndex: number;
  isCorrect: boolean;
  timeSpent: number;
  difficulty: "easy" | "medium" | "hard";
}

const SpellingTest = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [results, setResults] = useState<TestResult[]>([]);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const questions: Question[] = [
    {
      word: "because",
      hint: "for the reason that",
      sentence: "I'm wearing a jacket _____ it's cold outside.",
      difficulty: "easy"
    },
    {
      word: "beautiful",
      hint: "pleasing to the senses or mind",
      sentence: "The sunset was _____ this evening.",
      difficulty: "easy"
    },
    {
      word: "definitely",
      hint: "without doubt",
      sentence: "I'm _____ going to the concert tonight.",
      difficulty: "medium"
    },
    {
      word: "necessary",
      hint: "required to be done",
      sentence: "It is _____ to complete all the forms.",
      difficulty: "medium"
    },
    {
      word: "rhythm",
      hint: "a strong, regular pattern of movement or sound",
      sentence: "The drummer kept a steady _____ throughout the song.",
      difficulty: "hard"
    },
    {
      word: "psychologist",
      hint: "a professional who studies mental processes and behavior",
      sentence: "She wanted to become a _____ to help people with anxiety.",
      difficulty: "hard"
    }
  ];

  useEffect(() => {
    setIsLoaded(true);
    setStartTime(new Date());
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const speakWord = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(questions[currentQuestionIndex].word);
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const calculateDyslexiaRisk = (results: TestResult[]) => {
    const totalQuestions = results.length;
    const correctAnswers = results.filter(r => r.isCorrect).length;
    const accuracy = (correctAnswers / totalQuestions) * 100;
    
    const averageTime = results.reduce((sum, r) => sum + r.timeSpent, 0) / totalQuestions;
    
    const timeThresholds = {
      easy: 15,
      medium: 25,
      hard: 35
    };
    
    const slowQuestions = results.filter(r => 
      r.timeSpent > timeThresholds[r.difficulty]
    ).length;
    
    const timeScore = ((totalQuestions - slowQuestions) / totalQuestions) * 100;
    
    let riskFactors = [];
    let riskLevel = "Low";
    
    if (accuracy < 60) {
      riskFactors.push("Difficulty with spelling");
    }
    
    if (timeScore < 60) {
      riskFactors.push("Slower processing in spelling tasks");
    }
    
    const easyQuestionErrors = results.filter(r => 
      r.difficulty === "easy" && !r.isCorrect
    ).length;
    
    if (easyQuestionErrors >= 1) {
      riskFactors.push("Difficulty with basic spelling");
    }
    
    if (riskFactors.length >= 3 || (accuracy < 50 && timeScore < 50)) {
      riskLevel = "High";
    } else if (riskFactors.length >= 2 || accuracy < 65 || timeScore < 65) {
      riskLevel = "Moderate";
    }
    
    return {
      accuracy,
      averageTime,
      timeScore,
      riskFactors,
      riskLevel: riskLevel as "Low" | "Moderate" | "High",
      correctAnswers,
      totalQuestions
    };
  };

  const handleCheck = () => {
    if (!startTime) return;
    
    const endTime = new Date();
    const timeSpent = (endTime.getTime() - startTime.getTime()) / 1000;
    
    const currentWord = questions[currentQuestionIndex].word;
    const isCorrect = userInput.trim().toLowerCase() === currentWord.toLowerCase();
    
    const result: TestResult = {
      questionIndex: currentQuestionIndex,
      isCorrect,
      timeSpent,
      difficulty: questions[currentQuestionIndex].difficulty
    };
    
    const newResults = [...results, result];
    setResults(newResults);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserInput("");
      setStartTime(new Date());
    } else {
      setIsTestComplete(true);
      
      const analysis = calculateDyslexiaRisk(newResults);
      
      const testResults = {
        test: "Spelling & Writing",
        ...analysis,
        detailedResults: newResults
      };
      
      localStorage.setItem("testResults", JSON.stringify(testResults));
    }
  };

  const handleViewResults = () => {
    navigate("/results");
  };

  const progressPercentage = ((currentQuestionIndex) / questions.length) * 100;
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-background relative">
      <Navbar />
      
      <div className="absolute inset-0 -z-10 bg-grid"></div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
      
      <div className="container mx-auto pt-32 pb-20 px-4 md:pt-40 relative z-0">
        <div className={`max-w-3xl mx-auto transition-all duration-1000 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {!isTestComplete ? (
            <>
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-medium">Spelling & Writing Test</h2>
                  <div className="text-sm text-muted-foreground">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </div>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
              
              <Card className="glass mb-8">
                <CardContent className="p-6 md:p-8">
                  <AnimatedHeading delay={200} className="text-xl md:text-2xl font-medium mb-8">
                    Spell the missing word:
                  </AnimatedHeading>
                  
                  <div className="space-y-6">
                    <div className="text-lg">
                      {currentQuestion.sentence}
                    </div>
                    
                    <div className="bg-card p-4 rounded-lg">
                      <div className="text-sm font-medium mb-1">Hint:</div>
                      <div className="text-muted-foreground">{currentQuestion.hint}</div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={speakWord}
                        className="shrink-0"
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={userInput}
                          onChange={handleInputChange}
                          placeholder="Type the word here..."
                          className="w-full p-2 border rounded-md"
                          autoFocus
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end">
                <Button
                  onClick={handleCheck}
                  disabled={!userInput.trim()}
                  className="gap-2"
                >
                  {currentQuestionIndex < questions.length - 1 ? (
                    <>
                      Next Word
                      <ArrowRight className="h-4 w-4" />
                    </>
                  ) : (
                    "Complete Test"
                  )}
                </Button>
              </div>
            </>
          ) : (
            <Card className="p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold mb-2">Test Completed!</h2>
              <p className="text-muted-foreground mb-6">
                Thank you for completing the Spelling & Writing test. Your detailed analysis is ready.
              </p>
              
              <Button onClick={handleViewResults} className="gap-2">
                View Your Results
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpellingTest;
