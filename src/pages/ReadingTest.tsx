
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { AnimatedHeading } from "@/components/AnimatedHeading";
import { ArrowRight } from "lucide-react";

interface Question {
  text: string;
  options: string[];
  correctAnswer: number;
  difficulty: "easy" | "medium" | "hard";
}

interface TestResult {
  questionIndex: number;
  isCorrect: boolean;
  timeSpent: number;
  difficulty: "easy" | "medium" | "hard";
}

const ReadingTest = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [results, setResults] = useState<TestResult[]>([]);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const questions: Question[] = [
    {
      text: "The cat sat on the mat. The dog barked at the cat. The cat jumped off the mat and ran away. Where did the cat sit?",
      options: ["On the chair", "On the mat", "On the floor", "On the table"],
      correctAnswer: 1,
      difficulty: "easy"
    },
    {
      text: "Sarah went to the grocery store to buy ingredients for dinner. She needed tomatoes, onions, cheese, and bread. At the store, she remembered everything except one item. She forgot to buy cheese. What did Sarah forget?",
      options: ["Tomatoes", "Onions", "Cheese", "Bread"],
      correctAnswer: 2,
      difficulty: "medium"
    },
    {
      text: "The research conducted by Dr. Martinez demonstrated that cognitive flexibility significantly improves when individuals engage in multidisciplinary learning approaches. The study examined participants over a six-month period, analyzing their problem-solving capabilities. What was the main finding of Dr. Martinez's research?",
      options: [
        "Learning approaches don't affect cognitive flexibility",
        "Cognitive flexibility improves with multidisciplinary learning",
        "Problem-solving capabilities decrease over time",
        "Six-month studies are ineffective"
      ],
      correctAnswer: 1,
      difficulty: "hard"
    },
    {
      text: "Tom likes to play soccer every Saturday with his friends at the local park. They usually meet at 2:00 PM and play until 4:00 PM. What sport does Tom play?",
      options: ["Basketball", "Tennis", "Soccer", "Baseball"],
      correctAnswer: 2,
      difficulty: "easy"
    },
    {
      text: "The environmental impact assessment revealed that the proposed construction project would affect three major ecosystems: wetlands, grasslands, and forest areas. The wetlands showed the highest vulnerability to disruption, while the grasslands demonstrated moderate resilience. Which ecosystem was most vulnerable?",
      options: ["Forest areas", "Wetlands", "Grasslands", "All equally vulnerable"],
      correctAnswer: 1,
      difficulty: "hard"
    },
    {
      text: "During the school festival, Maria's class organized a bake sale. They sold cookies, cupcakes, and brownies. The cookies were $2 each, cupcakes were $3 each, and brownies were $4 each. If they sold 10 cookies, 8 cupcakes, and 5 brownies, how much money did they make from cookies?",
      options: ["$15", "$20", "$24", "$44"],
      correctAnswer: 1,
      difficulty: "medium"
    }
  ];

  useEffect(() => {
    setIsLoaded(true);
    setStartTime(new Date());
  }, []);

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const calculateDyslexiaRisk = (results: TestResult[]) => {
    const totalQuestions = results.length;
    const correctAnswers = results.filter(r => r.isCorrect).length;
    const accuracy = (correctAnswers / totalQuestions) * 100;
    
    const averageTime = results.reduce((sum, r) => sum + r.timeSpent, 0) / totalQuestions;
    
    const timeThresholds = {
      easy: 15,
      medium: 25,
      hard: 40
    };
    
    const slowQuestions = results.filter(r => 
      r.timeSpent > timeThresholds[r.difficulty]
    ).length;
    
    const timeScore = ((totalQuestions - slowQuestions) / totalQuestions) * 100;
    
    let riskFactors = [];
    let riskLevel = "Low";
    
    if (accuracy < 60) {
      riskFactors.push("Low reading comprehension accuracy");
    }
    
    if (timeScore < 60) {
      riskFactors.push("Slower than typical reading speed");
    }
    
    if (averageTime > 30) {
      riskFactors.push("Extended processing time per question");
    }
    
    const easyQuestionErrors = results.filter(r => 
      r.difficulty === "easy" && !r.isCorrect
    ).length;
    
    if (easyQuestionErrors >= 2) {
      riskFactors.push("Difficulty with basic reading comprehension");
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

  const handleNextQuestion = () => {
    if (!startTime) return;
    
    const endTime = new Date();
    const timeSpent = (endTime.getTime() - startTime.getTime()) / 1000;
    
    const result: TestResult = {
      questionIndex: currentQuestionIndex,
      isCorrect: selectedOption === questions[currentQuestionIndex].correctAnswer,
      timeSpent,
      difficulty: questions[currentQuestionIndex].difficulty
    };
    
    const newResults = [...results, result];
    setResults(newResults);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setStartTime(new Date());
    } else {
      setIsTestComplete(true);
      
      const analysis = calculateDyslexiaRisk(newResults);
      
      const testResults = {
        test: "Reading Fluency",
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
                  <h2 className="text-lg font-medium">Reading Fluency Test</h2>
                  <div className="text-sm text-muted-foreground">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </div>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
              
              <Card className="glass mb-8">
                <CardContent className="p-6 md:p-8">
                  <AnimatedHeading delay={200} className="text-xl md:text-2xl font-medium mb-8">
                    Read the following text and answer the question:
                  </AnimatedHeading>
                  
                  <div className="space-y-10">
                    <div className="text-lg leading-relaxed bg-card p-6 rounded-lg">
                      {questions[currentQuestionIndex].text}
                    </div>
                    
                    <div className="space-y-3">
                      {questions[currentQuestionIndex].options.map((option, optionIndex) => (
                        <button
                          key={optionIndex}
                          className={`w-full p-4 text-left rounded-lg border transition-all ${
                            selectedOption === optionIndex
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-card hover:border-primary/50"
                          }`}
                          onClick={() => handleOptionSelect(optionIndex)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end">
                <Button
                  onClick={handleNextQuestion}
                  disabled={selectedOption === null}
                  className="gap-2"
                >
                  {currentQuestionIndex < questions.length - 1 ? (
                    <>
                      Next Question
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
                Thank you for completing the Reading Fluency test. Your detailed analysis is ready.
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

export default ReadingTest;
