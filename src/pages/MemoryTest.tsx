import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { AnimatedHeading } from "@/components/AnimatedHeading";
import { ArrowRight, Clock, Eye, EyeOff } from "lucide-react";

interface Question {
  type: "sequence" | "recall";
  content: string[];
  recalled?: string[];
  correctAnswer?: string[];
  difficulty: "easy" | "medium" | "hard";
  instructions: string;
  duration: number;
}

interface TestResult {
  questionIndex: number;
  isCorrect: boolean;
  timeSpent: number;
  difficulty: "easy" | "medium" | "hard";
  userAnswers: string[];
  correctAnswers: string[];
  partialScore: number;
  maxScore: number;
}

const MemoryTest = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [phase, setPhase] = useState<"instructions" | "memorize" | "recall">("instructions");
  const [userInputs, setUserInputs] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [results, setResults] = useState<TestResult[]>([]);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const questions: Question[] = [
    {
      type: "sequence",
      instructions: "Memorize these numbers, then recall them in the same order:",
      content: ["3", "7", "2", "9", "4"],
      difficulty: "easy",
      duration: 5
    },
    {
      type: "sequence",
      instructions: "Memorize these letters, then recall them in the same order:",
      content: ["K", "L", "B", "R", "F", "Z"],
      difficulty: "medium",
      duration: 6
    },
    {
      type: "sequence",
      instructions: "Memorize these numbers, then recall them in reverse order:",
      content: ["5", "9", "3", "1", "6"],
      correctAnswer: ["6", "1", "3", "9", "5"],
      difficulty: "medium",
      duration: 6
    },
    {
      type: "recall",
      instructions: "Memorize these words, then recall as many as you can in any order:",
      content: ["house", "tree", "car", "dog", "book", "chair", "pen"],
      difficulty: "hard",
      duration: 8
    },
    {
      type: "sequence",
      instructions: "Memorize these numbers, then recall them in the same order:",
      content: ["8", "2", "5", "1", "9", "3", "7"],
      difficulty: "hard",
      duration: 7
    },
    {
      type: "recall",
      instructions: "Memorize these words, then recall as many as you can in any order:",
      content: ["mountain", "ocean", "forest", "desert", "river", "valley", "lake", "island"],
      difficulty: "hard",
      duration: 10
    }
  ];

  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  useEffect(() => {
    if (phase === "memorize" && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (phase === "memorize" && timeLeft === 0) {
      setPhase("recall");
      setStartTime(new Date());
    }
  }, [phase, timeLeft]);

  const startMemorizingPhase = () => {
    setPhase("memorize");
    setUserInputs([]);
    setTimeLeft(questions[currentQuestionIndex].duration);
  };

  const startInstructionsPhase = () => {
    setPhase("instructions");
    setUserInputs([]);
    setStartTime(null);
  };

  const handleWordInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newInputs = [...userInputs];
    newInputs[index] = e.target.value;
    setUserInputs(newInputs);
  };

  const handleAddAnswer = () => {
    if (userInputs.length === 0 || userInputs[userInputs.length - 1]?.trim()) {
      setUserInputs([...userInputs, ""]);
    }
  };

  const calculateDetailedScore = (question: Question, answers: string[]): { isCorrect: boolean; partialScore: number; maxScore: number; userAnswers: string[]; correctAnswers: string[] } => {
    const cleanAnswers = answers.filter(a => a.trim() !== "").map(a => a.toLowerCase().trim());
    const correctAnswers = question.correctAnswer || question.content;
    const correctAnswersLower = correctAnswers.map(a => a.toLowerCase());
    
    if (question.type === "sequence") {
      let exactMatches = 0;
      let positionalScore = 0;
      const maxScore = correctAnswers.length;
      
      // Calculate exact positional matches
      for (let i = 0; i < Math.min(cleanAnswers.length, correctAnswers.length); i++) {
        if (cleanAnswers[i] === correctAnswersLower[i]) {
          exactMatches++;
          positionalScore++;
        }
      }
      
      // Calculate partial credit for correct items in wrong positions
      const remainingCorrect = correctAnswersLower.filter((item, index) => 
        cleanAnswers[index] !== item
      );
      const remainingUser = cleanAnswers.filter((item, index) => 
        item !== correctAnswersLower[index]
      );
      
      let partialMatches = 0;
      remainingUser.forEach(userItem => {
        const index = remainingCorrect.indexOf(userItem);
        if (index !== -1) {
          partialMatches++;
          remainingCorrect.splice(index, 1);
        }
      });
      
      const finalScore = positionalScore + (partialMatches * 0.5);
      const isCorrect = (finalScore / maxScore) >= 0.7;
      
      return {
        isCorrect,
        partialScore: Math.round(finalScore * 10) / 10,
        maxScore,
        userAnswers: cleanAnswers,
        correctAnswers
      };
    } else if (question.type === "recall") {
      let correctCount = 0;
      const maxScore = question.content.length;
      const contentLower = question.content.map(item => item.toLowerCase());
      
      cleanAnswers.forEach(answer => {
        if (contentLower.includes(answer)) {
          correctCount++;
        }
      });
      
      const isCorrect = (correctCount / maxScore) >= 0.6;
      
      return {
        isCorrect,
        partialScore: correctCount,
        maxScore,
        userAnswers: cleanAnswers,
        correctAnswers: question.content
      };
    }
    
    return {
      isCorrect: false,
      partialScore: 0,
      maxScore: 1,
      userAnswers: cleanAnswers,
      correctAnswers
    };
  };
  
  const calculateDyslexiaRisk = (results: TestResult[]) => {
    const totalQuestions = results.length;
    const correctAnswers = results.filter(r => r.isCorrect).length;
    const accuracy = (correctAnswers / totalQuestions) * 100;
    
    // Calculate partial score percentage
    const totalPartialScore = results.reduce((sum, r) => sum + r.partialScore, 0);
    const totalMaxScore = results.reduce((sum, r) => sum + r.maxScore, 0);
    const partialAccuracy = (totalPartialScore / totalMaxScore) * 100;
    
    const averageTime = results.reduce((sum, r) => sum + r.timeSpent, 0) / totalQuestions;
    
    const timeThresholds = {
      easy: 25,
      medium: 40,
      hard: 60
    };
    
    const slowQuestions = results.filter(r => 
      r.timeSpent > timeThresholds[r.difficulty]
    ).length;
    
    const timeScore = ((totalQuestions - slowQuestions) / totalQuestions) * 100;
    
    let riskFactors = [];
    let riskLevel = "Low";
    let recommendations = [];
    
    // Detailed analysis
    const sequenceTasks = results.filter(r => questions[r.questionIndex].type === "sequence");
    const recallTasks = results.filter(r => questions[r.questionIndex].type === "recall");
    
    const sequenceAccuracy = sequenceTasks.length > 0 ? 
      (sequenceTasks.filter(r => r.isCorrect).length / sequenceTasks.length) * 100 : 100;
    const recallAccuracy = recallTasks.length > 0 ? 
      (recallTasks.filter(r => r.isCorrect).length / recallTasks.length) * 100 : 100;
    
    if (partialAccuracy < 60) {
      riskFactors.push("Significant difficulty with working memory tasks");
      recommendations.push("Consider memory training exercises and chunking strategies");
    }
    
    if (sequenceAccuracy < 50) {
      riskFactors.push("Difficulty maintaining sequence order in memory");
      recommendations.push("Practice with sequential memory games and mnemonics");
    }
    
    if (recallAccuracy < 50) {
      riskFactors.push("Challenges with free recall from working memory");
      recommendations.push("Use visualization techniques and verbal rehearsal strategies");
    }
    
    if (timeScore < 60) {
      riskFactors.push("Slower processing in memory recall tasks");
      recommendations.push("Allow extra time for memory-based tasks");
    }
    
    const easyQuestionErrors = results.filter(r => 
      r.difficulty === "easy" && !r.isCorrect
    ).length;
    
    if (easyQuestionErrors >= 1) {
      riskFactors.push("Difficulty with basic working memory operations");
      recommendations.push("Start with simpler memory exercises and gradually increase complexity");
    }
    
    // Calculate overall risk level
    if (riskFactors.length >= 3 || partialAccuracy < 40) {
      riskLevel = "High";
      recommendations.push("Consider consultation with a learning specialist");
    } else if (riskFactors.length >= 2 || partialAccuracy < 60) {
      riskLevel = "Moderate";
      recommendations.push("Implement memory support strategies in daily activities");
    } else {
      recommendations.push("Continue practicing to maintain strong working memory skills");
    }
    
    return {
      test: "Working Memory",
      accuracy,
      partialAccuracy: Math.round(partialAccuracy * 10) / 10,
      averageTime: Math.round(averageTime * 10) / 10,
      timeScore: Math.round(timeScore * 10) / 10,
      sequenceAccuracy: Math.round(sequenceAccuracy * 10) / 10,
      recallAccuracy: Math.round(recallAccuracy * 10) / 10,
      riskFactors,
      recommendations,
      riskLevel: riskLevel as "Low" | "Moderate" | "High",
      correctAnswers,
      totalQuestions,
      detailedResults: results
    };
  };

  const handleCheck = () => {
    if (!startTime) return;
    
    const endTime = new Date();
    const timeSpent = (endTime.getTime() - startTime.getTime()) / 1000;
    
    const question = questions[currentQuestionIndex];
    const scoreData = calculateDetailedScore(question, userInputs);
    
    const result: TestResult = {
      questionIndex: currentQuestionIndex,
      isCorrect: scoreData.isCorrect,
      timeSpent,
      difficulty: question.difficulty,
      userAnswers: scoreData.userAnswers,
      correctAnswers: scoreData.correctAnswers,
      partialScore: scoreData.partialScore,
      maxScore: scoreData.maxScore
    };
    
    const newResults = [...results, result];
    setResults(newResults);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      startInstructionsPhase();
    } else {
      setIsTestComplete(true);
      
      const analysis = calculateDyslexiaRisk(newResults);
      localStorage.setItem("testResults", JSON.stringify(analysis));
    }
  };

  const handleViewResults = () => {
    navigate("/results");
  };

  const progressPercentage = ((currentQuestionIndex) / questions.length) * 100;
  const currentQuestion = questions[currentQuestionIndex];

  const renderInstructionsPhase = () => (
    <Card className="glass mb-8">
      <CardContent className="p-6 md:p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto flex items-center justify-center mb-4">
            <Eye className="h-8 w-8 text-primary" />
          </div>
        </div>
        
        <AnimatedHeading delay={200} className="text-xl md:text-2xl font-medium mb-6">
          {currentQuestion.instructions}
        </AnimatedHeading>
        
        <p className="text-muted-foreground mb-6">
          You will have {currentQuestion.duration} seconds to memorize the items shown.
          {currentQuestion.correctAnswer && " Remember to recall them in REVERSE order!"}
        </p>
        
        <Button onClick={startMemorizingPhase} className="gap-2">
          <Eye className="h-4 w-4" />
          Start Memorizing
        </Button>
      </CardContent>
    </Card>
  );

  const renderMemorizePhase = () => (
    <Card className="glass mb-8">
      <CardContent className="p-6 md:p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto flex items-center justify-center">
            <Clock className="h-8 w-8 text-primary" />
          </div>
          <div className="mt-4 text-2xl font-bold">{timeLeft}</div>
          <div className="text-sm text-muted-foreground">seconds remaining</div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3 my-8">
          {currentQuestion.content.map((item, i) => (
            <div key={i} className="text-2xl md:text-3xl font-bold bg-card px-6 py-4 rounded-lg border">
              {item}
            </div>
          ))}
        </div>
        
        <p className="text-sm text-muted-foreground">
          {currentQuestion.correctAnswer ? "Remember: You need to recall these in REVERSE order!" : "Memorize these items in the exact order shown."}
        </p>
      </CardContent>
    </Card>
  );

  const renderRecallPhase = () => (
    <Card className="glass mb-8">
      <CardContent className="p-6 md:p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto flex items-center justify-center mb-4">
            <EyeOff className="h-8 w-8 text-primary" />
          </div>
          <AnimatedHeading delay={200} className="text-xl md:text-2xl font-medium">
            Now, recall what you memorized:
          </AnimatedHeading>
          {currentQuestion.correctAnswer && (
            <p className="text-sm text-orange-600 font-medium mt-2">
              Remember: Enter them in REVERSE order!
            </p>
          )}
        </div>
        
        <div className="space-y-4">
          {currentQuestion.type === "sequence" && (
            <div className="flex flex-col">
              <div className="mb-2 text-sm font-medium">Enter the items in the correct sequence:</div>
              <div className="flex flex-wrap gap-2 justify-center">
                {Array.from({ length: currentQuestion.content.length }).map((_, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={5}
                    value={userInputs[i] || ""}
                    onChange={(e) => handleWordInput(e, i)}
                    className="w-16 h-16 text-center text-lg font-medium bg-card border rounded-md"
                    autoFocus={i === 0}
                    placeholder={`${i + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
          
          {currentQuestion.type === "recall" && (
            <div className="flex flex-col">
              <div className="mb-2 text-sm font-medium">Enter as many items as you can remember:</div>
              <div className="space-y-2">
                {userInputs.map((input, i) => (
                  <input
                    key={i}
                    type="text"
                    value={input}
                    onChange={(e) => handleWordInput(e, i)}
                    className="w-full p-2 text-md bg-card border rounded-md"
                    placeholder="Enter a word"
                    autoFocus={i === userInputs.length - 1}
                  />
                ))}
                <Button 
                  variant="outline" 
                  onClick={handleAddAnswer}
                  className="w-full mt-2"
                  disabled={userInputs.length > 0 && !userInputs[userInputs.length - 1]?.trim()}
                >
                  + Add Another Word
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

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
                  <h2 className="text-lg font-medium">Working Memory Test</h2>
                  <div className="text-sm text-muted-foreground">
                    Task {currentQuestionIndex + 1} of {questions.length}
                  </div>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
              
              {phase === "instructions" && renderInstructionsPhase()}
              {phase === "memorize" && renderMemorizePhase()}
              {phase === "recall" && renderRecallPhase()}
              
              <div className="flex justify-end">
                {phase === "recall" && (
                  <Button
                    onClick={handleCheck}
                    disabled={userInputs.length === 0 || (userInputs.length === 1 && !userInputs[0])}
                    className="gap-2"
                  >
                    {currentQuestionIndex < questions.length - 1 ? (
                      <>
                        Next Task
                        <ArrowRight className="h-4 w-4" />
                      </>
                    ) : (
                      "Complete Test"
                    )}
                  </Button>
                )}
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
                Thank you for completing the Working Memory test. Your detailed analysis is ready.
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

export default MemoryTest;
