
import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const MemoryTest6to9 = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showItems, setShowItems] = useState(true);
  const [timer, setTimer] = useState(3);
  const navigate = useNavigate();

  const questions = [
    {
      id: 1,
      items: ["🍎", "🐱", "🚗"],
      question: "Which items did you see? (Pick all 3)",
      options: ["🍎 Apple", "🐕 Dog", "🐱 Cat", "🚗 Car", "🌟 Star", "🏠 House"],
      correct: ["🍎 Apple", "🐱 Cat", "🚗 Car"]
    },
    {
      id: 2,
      items: ["⭐", "🌙", "🌳"],
      question: "Which items did you see? (Pick all 3)",
      options: ["⭐ Star", "☀️ Sun", "🌙 Moon", "🌳 Tree", "🌸 Flower", "🦋 Butterfly"],
      correct: ["⭐ Star", "🌙 Moon", "🌳 Tree"]
    },
    {
      id: 3,
      items: ["📚", "✏️", "🎒"],
      question: "Which items did you see? (Pick all 3)",
      options: ["📚 Book", "✏️ Pencil", "🖥️ Computer", "🎒 Backpack", "📝 Paper", "🖊️ Pen"],
      correct: ["📚 Book", "✏️ Pencil", "🎒 Backpack"]
    }
  ];

  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);

  useEffect(() => {
    if (showItems && timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else if (timer === 0) {
      setShowItems(false);
    }
  }, [timer, showItems]);

  useEffect(() => {
    // Reset timer when question changes
    setTimer(3);
    setShowItems(true);
    setSelectedAnswers([]);
  }, [currentQuestion]);

  const handleAnswerToggle = (answer: string) => {
    if (selectedAnswers.includes(answer)) {
      setSelectedAnswers(selectedAnswers.filter(a => a !== answer));
    } else if (selectedAnswers.length < 3) {
      setSelectedAnswers([...selectedAnswers, answer]);
    }
  };

  const handleNext = () => {
    const newAnswers = [...answers, selectedAnswers.join(", ")];
    setAnswers(newAnswers);
    setSelectedAnswers([]);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Inside handleNext() where test ends
      const score = newAnswers.reduce((acc, answer, index) => {
        const correctSet = new Set(questions[index].correct);
        const answerSet = new Set(answer.split(", "));
        const correctCount = [...correctSet].filter(item => answerSet.has(item)).length;
        return acc + (correctCount === 3 ? 1 : correctCount * 0.33);
      }, 0);

      // Detailed results
      const detailedResults = questions.map((q, idx) => {
        const userAnsArr = newAnswers[idx] ? newAnswers[idx].split(", ") : [];
        const correctSet = new Set(q.correct);
        const userSet = new Set(userAnsArr);
        const isCorrect = q.correct.every(ans => userSet.has(ans)) && userAnsArr.length === q.correct.length;
        return {
          questionIndex: idx + 1,
          isCorrect,
          timeSpent: 0, // update if you track time
          difficulty: "Normal"
        };
      });

      const percentage = Math.round((score / questions.length) * 100);

      localStorage.setItem("testResults", JSON.stringify({
        test: "Memory Match (Ages 6-9)",
        accuracy: percentage,
        averageTime: 0,
        timeScore: 0,
        riskFactors: [],
        riskLevel: score >= 3 ? "Low" : score >= 2 ? "Moderate" : "High",
        correctAnswers: Math.round(score),
        totalQuestions: questions.length,
        detailedResults
      }));

      navigate("/results");

    }
  };


  const getRecommendations = (score: number) => {
    if (score >= 3) {
      return "Amazing memory! You're great at remembering things. Keep playing memory games!";
    } else if (score >= 2) {
      return "Good job! Practice memory games and try to repeat things you hear to remember them better.";
    } else {
      return "Let's practice! Try memory games with fewer items first, then add more as you get better.";
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
                Memory Match Game
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
              {showItems ? (
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">
                    Remember these items! ({timer} seconds)
                  </h3>
                  <div className="flex justify-center gap-8 mb-6">
                    {questions[currentQuestion].items.map((item, index) => (
                      <div key={index} className="text-6xl animate-pulse">
                        {item}
                      </div>
                    ))}
                  </div>
                  <p className="text-muted-foreground">
                    Look carefully and try to remember all three items!
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-6">
                    {questions[currentQuestion].question}
                  </h3>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {questions[currentQuestion].options.map((option) => (
                      <Button
                        key={option}
                        variant={selectedAnswers.includes(option) ? "default" : "outline"}
                        size="lg"
                        onClick={() => handleAnswerToggle(option)}
                        className="p-4 h-auto text-lg"
                        disabled={!selectedAnswers.includes(option) && selectedAnswers.length >= 3}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>

                  <p className="text-sm text-muted-foreground mb-6">
                    Selected: {selectedAnswers.length}/3
                  </p>

                  <Button
                    onClick={handleNext}
                    disabled={selectedAnswers.length !== 3}
                    size="lg"
                    className="px-8"
                  >
                    {currentQuestion === questions.length - 1 ? "Finish Game!" : "Next Question"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-8 p-4 bg-card rounded-lg border">
            <p className="text-sm text-muted-foreground text-center">
              🧠 <strong>Tip:</strong> Try to make a story with the items to help remember them better!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryTest6to9;
