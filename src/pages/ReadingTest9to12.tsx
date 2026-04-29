
import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Volume2 } from "lucide-react";

const ReadingTest9to12 = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const navigate = useNavigate();

  const questions = [
    {
      id: 1,
      passage: "The brave little mouse lived in a big library. Every night, he would read books to learn new things. His favorite books were about adventures in faraway places.",
      question: "Where did the mouse live?",
      options: ["In a house", "In a library", "In a forest", "In a school"],
      correct: "In a library"
    },
    {
      id: 2,
      passage: "Sarah planted seeds in her garden. She watered them every day and made sure they got plenty of sunlight. After two weeks, small green plants began to grow.",
      question: "How long did it take for the plants to start growing?",
      options: ["One week", "Two weeks", "One month", "Three weeks"],
      correct: "Two weeks"
    },
    {
      id: 3,
      passage: "The soccer team practiced every Tuesday and Thursday. They worked hard on passing, shooting, and teamwork. Their coach was very proud of their improvement.",
      question: "How many days per week did the team practice?",
      options: ["One day", "Two days", "Three days", "Every day"],
      correct: "Two days"
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
        test: "Reading Test (Ages 9–12)",
        accuracy: Math.round((score / questions.length) * 100),
        averageTime: 0,
        timeScore: 0,
        riskFactors: [],
        riskLevel: score >= 4 ? "Low" : score >= 2 ? "Moderate" : "High",
        correctAnswers: score,
        totalQuestions: questions.length,
        detailedResults
      }));
      
      navigate('/results');
    }
  };

  const getRecommendations = (score: number) => {
    if (score >= 3) {
      return "Excellent reading comprehension! You understand stories very well. Keep reading challenging books!";
    } else if (score >= 2) {
      return "Good job! Practice reading short stories and ask yourself questions about what you read.";
    } else {
      return "Let's work on reading together! Try reading shorter passages and discussing them with a teacher or parent.";
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

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
                Reading Skills Test
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
              <div className="bg-accent/30 p-6 rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-semibold text-lg">Read this passage:</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => speakText(questions[currentQuestion].passage)}
                    className="text-primary hover:text-primary/80"
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-lg leading-relaxed">
                  {questions[currentQuestion].passage}
                </p>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-semibold mb-6">
                  {questions[currentQuestion].question}
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {questions[currentQuestion].options.map((option) => (
                  <Button
                    key={option}
                    variant={selectedAnswer === option ? "default" : "outline"}
                    size="lg"
                    onClick={() => handleAnswerSelect(option)}
                    className="p-4 text-left justify-start"
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
                  {currentQuestion === questions.length - 1 ? "Finish Test" : "Next Question"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 p-4 bg-card rounded-lg border">
            <p className="text-sm text-muted-foreground text-center">
              📖 <strong>Tip:</strong> Read the passage carefully and look for key details that answer the question.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingTest9to12;
