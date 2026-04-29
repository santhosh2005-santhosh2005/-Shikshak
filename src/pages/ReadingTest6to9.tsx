
import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Volume2 } from "lucide-react";

const ReadingTest6to9 = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const navigate = useNavigate();

  const questions = [
    {
      id: 1,
      image: "🐱",
      question: "What animal is this?",
      options: ["Dog", "Cat", "Bird", "Fish"],
      correct: "Cat"
    },
    {
      id: 2,
      image: "🍎",
      question: "What fruit is this?",
      options: ["Orange", "Banana", "Apple", "Grape"],
      correct: "Apple"
    },
    {
      id: 3,
      image: "🚗",
      question: "What is this?",
      options: ["Bike", "Plane", "Car", "Train"],
      correct: "Car"
    },
    {
      id: 4,
      image: "🏠",
      question: "What building is this?",
      options: ["School", "Store", "House", "Hospital"],
      correct: "House"
    },
    {
      id: 5,
      image: "☀️",
      question: "What do you see in the sky during the day?",
      options: ["Moon", "Stars", "Sun", "Clouds"],
      correct: "Sun"
    }
  ];

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    setSelectedAnswer("");
  
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const score = newAnswers.reduce((acc, answer, index) => {
        return acc + (answer === questions[index].correct ? 1 : 0);
      }, 0);
  
      const detailedResults = questions.map((q, idx) => ({
        questionIndex: idx + 1,
        isCorrect: newAnswers[idx] === q.correct,
        timeSpent: 0,
        difficulty: "Easy"
      }));
  
      localStorage.setItem("testResults", JSON.stringify({
        test: "Reading Test (Ages 6–9)",
        accuracy: Math.round((score / questions.length) * 100),
        averageTime: 0,
        timeScore: 0,
        riskFactors: [],
        riskLevel: score >= 4 ? "Low" : score >= 2 ? "Moderate" : "High",
        correctAnswers: score,
        totalQuestions: questions.length,
        detailedResults
      }));
  
      navigate("/results");
    }
  };
  

  const getRecommendations = (score: number) => {
    if (score >= 4) {
      return "Great job! Your reading recognition skills are developing well. Keep practicing with picture books!";
    } else if (score >= 2) {
      return "Good effort! Consider practicing with more picture-word matching games to strengthen reading skills.";
    } else {
      return "Let's work together! Try reading simple picture books daily and consider discussing with a teacher or specialist.";
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    // Auto-read the question when it changes
    const currentQ = questions[currentQuestion];
    if (currentQ) {
      setTimeout(() => {
        speakText(currentQ.question);
      }, 500);
    }
  }, [currentQuestion]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/tests')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tests
            </Button>
          </div>

          <Card className="border-2 border-primary/20">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-primary">
                Picture Reading Game
              </CardTitle>
              <p className="text-muted-foreground">
                Question {currentQuestion + 1} of {questions.length}
              </p>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </CardHeader>

            <CardContent className="space-y-8">
              <div className="text-center">
                <div className="text-8xl mb-6">
                  {questions[currentQuestion].image}
                </div>
                
                <div className="flex items-center justify-center gap-2 mb-6">
                  <h3 className="text-xl font-semibold">
                    {questions[currentQuestion].question}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => speakText(questions[currentQuestion].question)}
                    className="text-primary hover:text-primary/80"
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {questions[currentQuestion].options.map((option) => (
                  <Button
                    key={option}
                    variant={selectedAnswer === option ? "default" : "outline"}
                    size="lg"
                    onClick={() => handleAnswerSelect(option)}
                    className="p-6 text-lg h-auto"
                  >
                    {option}
                  </Button>
                ))}
              </div>

              <div className="text-center">
                <Button
                  onClick={handleNext}
                  disabled={!selectedAnswer}
                  size="lg"
                  className="px-8"
                >
                  {currentQuestion === questions.length - 1 ? "Finish Game!" : "Next Question"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 p-4 bg-card rounded-lg border">
            <p className="text-sm text-muted-foreground text-center">
              🎵 <strong>Tip for Parents:</strong> Encourage your child and celebrate their effort! 
              Click the speaker icon to hear questions read aloud.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingTest6to9;
