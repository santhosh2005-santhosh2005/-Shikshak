
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { AnimatedHeading } from "@/components/AnimatedHeading";
import { ArrowRight, GripVertical } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";

interface Question {
  text: string;
  options: string[];
  correctOrder: number[];
  difficulty: "easy" | "medium" | "hard";
}

interface TestResult {
  questionIndex: number;
  isCorrect: boolean;
  timeSpent: number;
  difficulty: "easy" | "medium" | "hard";
}

const SequencingTest = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [results, setResults] = useState<TestResult[]>([]);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState<string[]>([]);

  const questions: Question[] = [
    {
      text: "Arrange these numbers in ascending order (smallest to largest):",
      options: ["7", "2", "9", "4", "1"],
      correctOrder: [4, 1, 3, 0, 2],
      difficulty: "easy"
    },
    {
      text: "Arrange these months in calendar order:",
      options: ["June", "January", "October", "March", "August"],
      correctOrder: [1, 3, 0, 4, 2],
      difficulty: "medium"
    },
    {
      text: "Arrange these events in historical order (earliest to latest):",
      options: [
        "World War II", 
        "First Moon Landing", 
        "Declaration of Independence", 
        "Fall of the Berlin Wall",
        "Industrial Revolution"
      ],
      correctOrder: [2, 4, 0, 1, 3],
      difficulty: "hard"
    },
    {
      text: "Arrange these steps for making a sandwich in the correct order:",
      options: [
        "Add toppings", 
        "Cut the sandwich", 
        "Take out bread", 
        "Spread butter or sauce",
        "Place the second slice on top"
      ],
      correctOrder: [2, 3, 0, 4, 1],
      difficulty: "medium"
    }
  ];

  useEffect(() => {
    setIsLoaded(true);
    setStartTime(new Date());
    if (questions[currentQuestionIndex]) {
      setItems([...questions[currentQuestionIndex].options]);
    }
  }, [currentQuestionIndex]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const reordered = Array.from(items);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    
    setItems(reordered);
  };

  const calculateScore = (userOrder: string[], question: Question): boolean => {
    const correctOrder = question.correctOrder.map(idx => question.options[idx]);
    let score = 0;
    
    for (let i = 0; i < userOrder.length; i++) {
      if (userOrder[i] === correctOrder[i]) {
        score++;
      }
    }
    
    return score >= correctOrder.length * 0.6;
  };

  const calculateDyslexiaRisk = (results: TestResult[]) => {
    const totalQuestions = results.length;
    const correctAnswers = results.filter(r => r.isCorrect).length;
    const accuracy = (correctAnswers / totalQuestions) * 100;
    
    const averageTime = results.reduce((sum, r) => sum + r.timeSpent, 0) / totalQuestions;
    
    const timeThresholds = {
      easy: 30,
      medium: 45,
      hard: 60
    };
    
    const slowQuestions = results.filter(r => 
      r.timeSpent > timeThresholds[r.difficulty]
    ).length;
    
    const timeScore = ((totalQuestions - slowQuestions) / totalQuestions) * 100;
    
    let riskFactors = [];
    let riskLevel = "Low";
    
    if (accuracy < 60) {
      riskFactors.push("Difficulty with sequencing tasks");
    }
    
    if (timeScore < 60) {
      riskFactors.push("Slower processing in sequencing tasks");
    }
    
    const easyQuestionErrors = results.filter(r => 
      r.difficulty === "easy" && !r.isCorrect
    ).length;
    
    if (easyQuestionErrors >= 1) {
      riskFactors.push("Difficulty with basic sequencing");
    }
    
    if (riskFactors.length >= 3 || (accuracy < 50 && timeScore < 50)) {
      riskLevel = "High";
    } else if (riskFactors.length >= 2 || accuracy < 65 || timeScore < 65) {
      riskLevel = "Moderate";
    }
    
    return {
      test: "Sequencing",
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
    
    const question = questions[currentQuestionIndex];
    const isCorrect = calculateScore(items, question);
    
    const result: TestResult = {
      questionIndex: currentQuestionIndex,
      isCorrect,
      timeSpent,
      difficulty: question.difficulty
    };
    
    const newResults = [...results, result];
    setResults(newResults);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setStartTime(new Date());
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

  return (
    <div className="min-h-screen bg-background relative">
      <Navbar />
      
      <div className="absolute inset-0 -z-10 bg-grid"></div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
      
      <div className="container mx-auto pt-32 pb-20 px-4 md:pt-36 relative z-0">
        <div className={`max-w-3xl mx-auto transition-all duration-1000 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {!isTestComplete ? (
            <>
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-medium">Sequencing Test</h2>
                  <div className="text-sm text-muted-foreground">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </div>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
              
              <Card className="glass mb-8">
                <CardContent className="p-6 md:p-8">
                  <AnimatedHeading delay={200} className="text-xl md:text-2xl font-medium mb-8">
                    {questions[currentQuestionIndex]?.text}
                  </AnimatedHeading>
                  
                  <div className="space-y-3 mt-6">
                    <div className="text-sm text-muted-foreground mb-4">
                      Drag and drop the items to arrange them in the correct order:
                    </div>
                    
                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="sequencing-items">
                        {(provided, snapshot) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`space-y-2 p-2 rounded-lg transition-colors ${
                              snapshot.isDraggingOver ? 'bg-primary/5' : ''
                            }`}
                          >
                            {items.map((item, index) => (
                              <Draggable key={`${item}-${index}`} draggableId={`${item}-${index}`} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={`bg-card border p-4 rounded-lg flex items-center gap-3 select-none transition-all duration-200 ${
                                      snapshot.isDragging 
                                        ? 'shadow-lg scale-105 bg-primary/10 border-primary z-50' 
                                        : 'hover:shadow-md hover:border-primary/50'
                                    }`}
                                    style={{
                                      ...provided.draggableProps.style,
                                      transform: snapshot.isDragging 
                                        ? provided.draggableProps.style?.transform
                                        : provided.draggableProps.style?.transform
                                    }}
                                  >
                                    <div 
                                      {...provided.dragHandleProps}
                                      className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                                        snapshot.isDragging 
                                          ? 'bg-primary text-primary-foreground' 
                                          : 'bg-muted hover:bg-primary/10'
                                      }`}
                                    >
                                      {snapshot.isDragging ? (
                                        <span className="text-sm font-bold">{index + 1}</span>
                                      ) : (
                                        <GripVertical className="h-4 w-4" />
                                      )}
                                    </div>
                                    <div className="flex-1 text-sm md:text-base font-medium">
                                      {item}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      Position {index + 1}
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                    
                    <div className="text-xs text-muted-foreground mt-4 p-3 bg-muted/50 rounded-lg">
                      <strong>Tip:</strong> Grab the grip handle (⋮⋮) to drag items to their correct positions.
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end">
                <Button
                  onClick={handleCheck}
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
                Thank you for completing the Sequencing test. Your detailed analysis is ready.
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

export default SequencingTest;
